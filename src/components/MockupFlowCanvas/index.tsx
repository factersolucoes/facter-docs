import Link from '@docusaurus/Link';
import {useLocation} from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';
import clsx from 'clsx';
import {useCallback, useEffect, useMemo, useRef, useState, type CSSProperties} from 'react';
import type {Rect} from '../MockupCanvas/layout';
import {fitRect, useCanvasView, type View} from '../MockupCanvas/useCanvasView';
import {
  isFlowManifest,
  layoutFlow,
  readSizes,
  routeArrows,
  type FlowFrame,
  type FlowManifest,
  type PlacedFlowFrame,
  type Size,
} from './layout';
import styles from './styles.module.css';

/* Live pages are heavy (a 1440 frame is a whole app): only the few biggest frames on screen go live. */
const LIVE_MIN_SCALE = 0.42;
const MAX_LIVE_FRAMES = 6;
const LANE_GUTTER = 200;
const FIT_PADDING = 56;
const LABEL_MIN_SCREEN_WIDTH = 64;
const ARROW_LABEL_MIN_SCALE = 0.1;

type WorldStyle = CSSProperties & {'--inverse': number};

interface FrameMessage {
  type: 'fx-frame';
  width: number;
  height: number;
}

function isFrameMessage(value: unknown): value is FrameMessage {
  return (
    typeof value === 'object' &&
    value !== null &&
    'type' in value &&
    value.type === 'fx-frame' &&
    'width' in value &&
    typeof value.width === 'number' &&
    'height' in value &&
    typeof value.height === 'number'
  );
}

function frameUrl(page: string, frame: FlowFrame): string {
  const params = new URLSearchParams({frame: frame.frame});
  if (frame.state) params.set('state', frame.state);
  if (frame.theme) params.set('theme', frame.theme);
  return `${page}?${params.toString()}`;
}

function intersects(a: Rect, b: Rect): boolean {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

function fitWithGutter(rect: Rect, size: Size): View {
  const inner = {width: Math.max(1, size.width - LANE_GUTTER), height: size.height};
  const view = fitRect(rect, inner, FIT_PADDING, 1);
  return {...view, x: view.x + LANE_GUTTER};
}

function readFocus(): string | null {
  return new URLSearchParams(window.location.search).get('f');
}

function writeFocus(id: string | null) {
  const params = new URLSearchParams(window.location.search);
  if (id) params.set('f', id);
  else params.delete('f');
  const query = params.toString();
  window.history.replaceState(window.history.state, '', `${window.location.pathname}${query ? `?${query}` : ''}`);
}

/* A live page inside a frame; it reports its real size when the frame is drawn. */
function LiveFrame({
  src,
  title,
  interactive,
  onReady,
}: {
  src: string;
  title: string;
  interactive: boolean;
  onReady: (size: Size) => void;
}) {
  const ref = useRef<HTMLIFrameElement>(null);
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.source !== ref.current?.contentWindow || !isFrameMessage(event.data)) return;
      onReadyRef.current({width: event.data.width, height: event.data.height});
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);
  return (
    <iframe
      ref={ref}
      className={clsx(styles.live, interactive && styles.liveInteractive)}
      src={src}
      title={title}
      tabIndex={interactive ? 0 : -1}
    />
  );
}

function CanvasFrame({
  placed,
  page,
  thumb,
  live,
  scale,
  onMeasured,
}: {
  placed: PlacedFlowFrame;
  page: string;
  thumb: string | null;
  live: boolean;
  scale: number;
  onMeasured: (id: string, size: Size) => void;
}) {
  const {frame} = placed;
  const [liveReady, setLiveReady] = useState(false);
  useEffect(() => {
    if (!live) setLiveReady(false);
  }, [live]);
  return (
    <div
      data-frame={frame.id}
      className={styles.frame}
      style={{left: placed.x, top: placed.y, width: placed.width, height: placed.height}}
    >
      {placed.width * scale >= LABEL_MIN_SCREEN_WIDTH && (
        <span className={styles.frameLabel} title={frame.hint ?? frame.label}>
          {frame.label}
        </span>
      )}
      <div className={styles.frameBody}>
        {thumb && !liveReady && <img className={styles.thumb} src={thumb} alt="" draggable={false} decoding="async" />}
        {!thumb && !liveReady && <div className={styles.placeholder}>{frame.label}</div>}
        {live && (
          <div className={clsx(styles.liveWrap, liveReady && styles.liveWrapReady)}>
            <LiveFrame
              src={frameUrl(page, frame)}
              title={frame.label}
              interactive={false}
              onReady={(size) => {
                setLiveReady(true);
                onMeasured(frame.id, size);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function FocusView({
  frame,
  page,
  laneTitle,
  position,
  total,
  size,
  documentRoute,
  onPrevious,
  onNext,
  onClose,
}: {
  frame: FlowFrame;
  page: string;
  laneTitle: string;
  position: number;
  total: number;
  size: Size;
  documentRoute: string;
  onPrevious: () => void;
  onNext: () => void;
  onClose: () => void;
}) {
  const areaRef = useRef<HTMLDivElement>(null);
  const [area, setArea] = useState<Size>({width: 0, height: 0});
  const [actualSize, setActualSize] = useState(false);
  const [measured, setMeasured] = useState<Size | null>(null);
  useEffect(() => {
    const element = areaRef.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) =>
      setArea({width: entry.contentRect.width, height: entry.contentRect.height}),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  useEffect(() => setMeasured(null), [frame.id]);
  const natural = measured ?? size;
  const fit = Math.min(1, (area.width - 48) / natural.width, (area.height - 48) / natural.height);
  const scale = actualSize ? 1 : Math.max(0.1, fit);
  return (
    <div className={styles.focus} data-canvas-ui role="dialog" aria-label={frame.label}>
      <header className={styles.focusBar}>
        <button type="button" className={styles.barButton} onClick={onClose} title="Voltar ao canvas (Esc)">
          ← Canvas
        </button>
        <div className={styles.focusTitle}>
          <span className={styles.focusLane}>{laneTitle}</span>
          <strong>{frame.label}</strong>
          {frame.hint && <span className={styles.focusHint}>{frame.hint}</span>}
        </div>
        <div className={styles.focusActions}>
          <button
            type="button"
            className={clsx(styles.barButton, actualSize && styles.barButtonOn)}
            aria-pressed={actualSize}
            onClick={() => setActualSize((on) => !on)}
          >
            {actualSize ? 'Ajustar à tela' : 'Tamanho real'}
          </button>
          <Link className={styles.barButton} to={documentRoute}>
            Ver no documento
          </Link>
          <span className={styles.counter}>
            {position} de {total}
          </span>
          <button
            type="button"
            className={styles.barButton}
            onClick={onPrevious}
            aria-label="Anterior"
            title="Anterior (←)"
          >
            ‹
          </button>
          <button type="button" className={styles.barButton} onClick={onNext} aria-label="Próximo" title="Próximo (→)">
            ›
          </button>
        </div>
      </header>
      <div ref={areaRef} className={clsx(styles.focusArea, actualSize && styles.focusAreaScroll)}>
        <div className={styles.focusSlot} style={{width: natural.width * scale, height: natural.height * scale}}>
          <div
            className={styles.focusFrame}
            style={{width: natural.width, height: natural.height, transform: `scale(${scale})`}}
          >
            <LiveFrame
              key={frame.id}
              src={frameUrl(page, frame)}
              title={frame.label}
              interactive
              onReady={setMeasured}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function MockupModeToggle({canvas, document}: {canvas: string; document: string}) {
  const {pathname} = useLocation();
  const onCanvas = pathname.replace(/\/$/, '').endsWith('/canvas');
  return (
    <span className={styles.toggle} role="group" aria-label="Modo de ver o mockup">
      <Link
        className={clsx(styles.toggleItem, onCanvas && styles.toggleItemOn)}
        to={canvas}
        aria-current={onCanvas ? 'page' : undefined}
      >
        Canvas
      </Link>
      <Link
        className={clsx(styles.toggleItem, !onCanvas && styles.toggleItemOn)}
        to={document}
        aria-current={onCanvas ? undefined : 'page'}
      >
        Documento
      </Link>
    </span>
  );
}

interface MockupFlowCanvasProps {
  /** Path of the flow manifest under static, e.g. /mockups/truck/preventiva-agenda/flow.json */
  flow: string;
  status?: string;
}

export default function MockupFlowCanvas({flow, status}: MockupFlowCanvasProps) {
  const flowUrl = useBaseUrl(flow);
  const folder = flowUrl.replace(/\/[^/]*$/, '');
  const {pathname} = useLocation();
  const documentRoute = pathname.replace(/\/canvas\/?$/, '');
  const [, product = 'truck', slug = ''] = /^\/telas\/([^/]+)\/([^/]+)/.exec(pathname) ?? [];

  const [manifest, setManifest] = useState<FlowManifest | null>(null);
  const [failed, setFailed] = useState(false);
  const [thumbSizes, setThumbSizes] = useState<Record<string, Size>>({});
  const [measured, setMeasured] = useState<Record<string, Size>>({});
  const [focusId, setFocusId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const response = await fetch(flowUrl);
        const data: unknown = await response.json();
        if (!isFlowManifest(data)) throw new Error('INVALID_FLOW');
        const thumbs = await fetch(`${folder}/flow/thumbs.json`)
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null);
        if (cancelled) return;
        setThumbSizes(readSizes(thumbs));
        setManifest(data);
      } catch (error) {
        console.error(error);
        if (!cancelled) setFailed(true);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [flowUrl, folder]);

  const sizes = useMemo(() => ({...thumbSizes, ...measured}), [thumbSizes, measured]);
  const layout = useMemo(() => (manifest ? layoutFlow(manifest, sizes) : null), [manifest, sizes]);
  const arrows = useMemo(() => (layout && manifest ? routeArrows(layout, manifest.arrows) : []), [layout, manifest]);
  const order = useMemo(
    () => (layout ? [...layout.frames].sort((a, b) => a.lane - b.lane || a.x - b.x) : []),
    [layout],
  );
  const page = manifest ? `${folder}/${manifest.mockup ?? 'index.html'}` : '';

  const openFrame = useCallback((id: string | null) => {
    setFocusId(id);
    writeFocus(id);
  }, []);

  const {view, size, panning, setView, animateTo, zoomAt} = useCanvasView(stageRef, {
    onTap: (id) => {
      if (id) openFrame(id);
    },
    onDoubleTap: (id) => openFrame(id),
  });

  const fitAll = useCallback(
    (animated: boolean) => {
      if (!layout || size.width === 0) return;
      const target = fitWithGutter(layout.bounds, size);
      if (animated) animateTo(target);
      else setView(target);
    },
    [animateTo, layout, setView, size],
  );

  useEffect(() => {
    if (ready || !layout || size.width === 0) return;
    fitAll(false);
    const initial = readFocus();
    if (initial && layout.frames.some((f) => f.frame.id === initial)) setFocusId(initial);
    setReady(true);
  }, [fitAll, layout, ready, size.width]);

  const step = useCallback(
    (delta: number) => {
      if (!focusId || order.length === 0) return;
      const index = order.findIndex((f) => f.frame.id === focusId);
      const next = order[(index + delta + order.length) % order.length];
      openFrame(next.frame.id);
      if (size.width > 0) setView(fitRect(next, size, 120, 1));
    },
    [focusId, openFrame, order, setView, size],
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))
      )
        return;
      const center = {x: size.width / 2, y: size.height / 2};
      if (focusId) {
        if (event.key === 'Escape') openFrame(null);
        else if (event.key === 'ArrowRight') step(1);
        else if (event.key === 'ArrowLeft') step(-1);
        else return;
      } else if (event.shiftKey && event.code === 'Digit1') fitAll(true);
      else if (event.shiftKey && event.code === 'Digit0') zoomAt(1 / view.scale, center, true);
      else if (event.key === '+' || event.key === '=') zoomAt(1.5, center, true);
      else if (event.key === '-' || event.key === '_') zoomAt(1 / 1.5, center, true);
      else return;
      event.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [fitAll, focusId, openFrame, size, step, view.scale, zoomAt]);

  const onMeasured = useCallback((id: string, next: Size) => {
    setMeasured((current) => {
      const previous = current[id];
      if (previous && previous.width === next.width && previous.height === next.height) return current;
      return {...current, [id]: next};
    });
  }, []);

  const viewport: Rect = {
    x: -view.x / view.scale,
    y: -view.y / view.scale,
    width: size.width / view.scale,
    height: size.height / view.scale,
  };

  const liveIds = useMemo(() => {
    if (!layout) return new Set<string>();
    const center = {x: viewport.x + viewport.width / 2, y: viewport.y + viewport.height / 2};
    const candidates = layout.frames.filter(
      (f) => intersects(viewport, f) && (view.scale >= LIVE_MIN_SCALE || !(f.frame.id in thumbSizes)),
    );
    candidates.sort(
      (a, b) =>
        Math.hypot(a.x + a.width / 2 - center.x, a.y + a.height / 2 - center.y) -
        Math.hypot(b.x + b.width / 2 - center.x, b.y + b.height / 2 - center.y),
    );
    return new Set(candidates.slice(0, MAX_LIVE_FRAMES).map((f) => f.frame.id));
  }, [layout, thumbSizes, view.scale, viewport.x, viewport.y, viewport.width, viewport.height]);

  const thumbBase = `${folder}/flow/`;
  const focused = focusId && layout ? layout.frames.find((f) => f.frame.id === focusId) : undefined;

  let gridSize = 24 * view.scale;
  while (gridSize < 12) gridSize *= 4;
  const worldStyle: WorldStyle = {
    transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})`,
    '--inverse': 1 / view.scale,
    visibility: ready ? 'visible' : 'hidden',
  };
  const center = {x: size.width / 2, y: size.height / 2};

  return (
    <div className={styles.root}>
      <header className={styles.topBar}>
        <Link to={`/mockups?p=${product}&f=${slug}`}>Mockups</Link>
        <span className={styles.crumbSep}>/</span>
        <strong className={styles.topTitle}>{manifest?.title ?? ''}</strong>
        {status && <span className={styles.status}>{status}</span>}
        <span className={styles.topSpacer} />
        <span className={styles.topHint}>Clique num quadro para abrir</span>
        <MockupModeToggle canvas={pathname} document={documentRoute} />
      </header>

      <div className={styles.main}>
        <div
          ref={stageRef}
          className={clsx(styles.stage, panning && styles.stagePanning)}
          style={{backgroundSize: `${gridSize}px ${gridSize}px`, backgroundPosition: `${view.x}px ${view.y}px`}}
        >
          {failed && <p className={styles.message}>Não deu para abrir o fluxo deste mockup. Veja no documento.</p>}
          {!failed && !layout && <p className={styles.message}>Carregando o canvas…</p>}

          {layout && manifest && (
            <div className={styles.world} style={worldStyle}>
              {layout.lanes.map((lane) => (
                <div
                  key={lane.lane.id}
                  className={styles.lane}
                  style={{left: lane.x - 80, top: lane.y - 80, width: lane.width + 160, height: lane.height + 160}}
                />
              ))}
              <svg className={styles.arrows} width="1" height="1" aria-hidden="true">
                {arrows.map((a) => (
                  <g key={`${a.arrow.from}-${a.arrow.to}`}>
                    <path className={styles.arrowHalo} d={a.path} />
                    <path className={styles.arrow} d={a.path} />
                    <path
                      className={styles.arrowHead}
                      d="M0,0 L-11,-5.5 L-11,5.5 Z"
                      transform={`translate(${a.head.x} ${a.head.y}) rotate(${(a.head.angle * 180) / Math.PI}) scale(${1 / view.scale})`}
                    />
                  </g>
                ))}
              </svg>
              {layout.frames.map((placed) => (
                <CanvasFrame
                  key={placed.frame.id}
                  placed={placed}
                  page={page}
                  scale={view.scale}
                  thumb={placed.frame.id in thumbSizes ? `${thumbBase}${placed.frame.id}.png` : null}
                  live={liveIds.has(placed.frame.id) && !focusId}
                  onMeasured={onMeasured}
                />
              ))}
              {view.scale >= ARROW_LABEL_MIN_SCALE &&
                arrows
                  .filter((a) => a.arrow.label)
                  .map((a) => (
                    <span
                      key={`label-${a.arrow.from}-${a.arrow.to}`}
                      className={styles.arrowLabel}
                      style={{left: a.middle.x, top: a.middle.y}}
                    >
                      {a.arrow.label}
                    </span>
                  ))}
              {layout.notes.map((note) => (
                <div
                  key={`note-${note.note.attach}`}
                  className={styles.note}
                  style={{left: note.x, top: note.y, width: note.width}}
                >
                  {note.note.text}
                </div>
              ))}
            </div>
          )}

          {layout && ready && (
            <div className={styles.laneTitles} aria-hidden="true">
              {layout.lanes.map((lane) => {
                const top = lane.y * view.scale + view.y;
                const height = lane.height * view.scale;
                const right = lane.x * view.scale + view.x - 20;
                if (top + height < 0 || top > size.height) return null;
                return (
                  <span
                    key={lane.lane.id}
                    className={styles.laneTitle}
                    style={{
                      top: Math.max(8, Math.min(top + height / 2, size.height - 24)),
                      left: Math.max(12, right),
                      transform: right > 12 ? 'translate(-100%, -50%)' : 'translateY(-50%)',
                    }}
                  >
                    {lane.lane.title}
                  </span>
                );
              })}
            </div>
          )}

          <div className={styles.zoomBar} data-canvas-ui>
            <button
              type="button"
              onClick={() => zoomAt(1 / 1.5, center, true)}
              aria-label="Diminuir zoom"
              title="Diminuir zoom (−)"
            >
              −
            </button>
            <button
              type="button"
              className={styles.zoomValue}
              onClick={() => zoomAt(1 / view.scale, center, true)}
              title="Zoom em 100% (Shift+0)"
            >
              {Math.round(view.scale * 100)}%
            </button>
            <button
              type="button"
              onClick={() => zoomAt(1.5, center, true)}
              aria-label="Aumentar zoom"
              title="Aumentar zoom (+)"
            >
              +
            </button>
            <button
              type="button"
              className={styles.zoomFit}
              onClick={() => fitAll(true)}
              title="Ajustar à tela (Shift+1)"
            >
              Ajustar à tela
            </button>
          </div>
        </div>
        {focused && manifest && (
          <FocusView
            frame={focused.frame}
            page={page}
            laneTitle={manifest.lanes[focused.lane]?.title ?? ''}
            position={order.findIndex((f) => f.frame.id === focused.frame.id) + 1}
            total={order.length}
            size={{width: focused.width, height: focused.height}}
            documentRoute={documentRoute}
            onPrevious={() => step(-1)}
            onNext={() => step(1)}
            onClose={() => openFrame(null)}
          />
        )}
      </div>
    </div>
  );
}
