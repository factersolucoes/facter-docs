import Link from '@docusaurus/Link';
import {useHistory} from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {usePluginData} from '@docusaurus/useGlobalData';
import clsx from 'clsx';
import {useCallback, useEffect, useMemo, useRef, useState, type CSSProperties} from 'react';
import type {MockupFrame, MockupProduct, MockupsCatalog, MockupStatus} from '@site/plugins/mockups-catalog';
import InlineMarkdown from './InlineMarkdown';
import {FRAME_WIDTH, layoutFrames, type PlacedFrame, type Rect} from './layout';
import {fitRect, useCanvasView} from './useCanvasView';
import styles from './styles.module.css';

const STATUS_LABEL: Record<MockupStatus, string> = {
  approved: 'Aprovado',
  review: 'Em revisão',
  draft: 'Rascunho',
};

const STATUS_FILTERS: {value: MockupStatus | 'all'; label: string}[] = [
  {value: 'all', label: 'Todos'},
  {value: 'approved', label: 'Aprovados'},
  {value: 'review', label: 'Em revisão'},
  {value: 'draft', label: 'Rascunhos'},
];

const LIVE_PREVIEW_MIN_WIDTH = 220;
const FRAME_LABEL_MIN_WIDTH = 110;
const NARROW_WIDTH = 900;

const STANDARD_STATUS = /^(aprovado|em revisão|em discussão|rascunho)( em| desde)?( ·)? ?\(?\d{2}\/\d{2}\/\d{4}\)?$/i;

type WorldStyle = CSSProperties & {'--inverse': number};

function isCatalog(value: unknown): value is MockupsCatalog {
  return typeof value === 'object' && value !== null && 'products' in value && Array.isArray(value.products);
}

function normalize(text: string): string {
  return text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
}

function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  const [year, month, day] = iso.split('-');
  return `${day}/${month}/${year}`;
}

function intersects(a: Rect, b: Rect): boolean {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

function scrollIntoViewIfNeeded(element: HTMLElement | null) {
  element?.scrollIntoView({block: 'nearest'});
}

function readQuery(): {product: string | null; frame: string | null} {
  const params = new URLSearchParams(window.location.search);
  return {product: params.get('p'), frame: params.get('f')};
}

function writeQuery(product: string, frame: string | null) {
  const params = new URLSearchParams();
  params.set('p', product);
  if (frame) params.set('f', frame);
  window.history.replaceState(window.history.state, '', `${window.location.pathname}?${params.toString()}`);
}

function StatusBadge({status, className}: {status: MockupStatus; className?: string}) {
  return <span className={clsx(styles.badge, styles[`tone_${status}`], className)}>{STATUS_LABEL[status]}</span>;
}

function FramePreview({placed, visible, scale}: {placed: PlacedFrame; visible: boolean; scale: number}) {
  const {frame} = placed;
  const desktop = useBaseUrl(frame.desktop?.src ?? '');
  const file = useBaseUrl(frame.file);
  if (!visible) return null;
  if (frame.desktop) {
    return <img className={styles.frameImage} src={desktop} alt="" draggable={false} decoding="async" />;
  }
  if (placed.width * scale >= LIVE_PREVIEW_MIN_WIDTH) {
    return (
      <iframe
        className={styles.frameLive}
        src={file}
        title={frame.title}
        loading="lazy"
        tabIndex={-1}
        style={{height: placed.height}}
      />
    );
  }
  return <div className={styles.framePlaceholder}>{frame.title}</div>;
}

function Inspector({
  frame,
  product,
  counts,
  onClose,
}: {
  frame: MockupFrame | null;
  product: MockupProduct;
  counts: Record<MockupStatus, number>;
  onClose: () => void;
}) {
  const phone = useBaseUrl(frame?.phone?.src ?? '');
  const file = useBaseUrl(frame?.file ?? '');

  if (!frame) {
    return (
      <div className={styles.inspectorBody}>
        <p className={styles.eyebrow}>{product.label}</p>
        <h2 className={styles.inspectorTitle}>{product.frames.length} mockups</h2>
        <dl className={styles.summary}>
          {(['approved', 'review', 'draft'] as const).map((status) => (
            <div key={status} className={styles.summaryRow}>
              <dt>
                <StatusBadge status={status} />
              </dt>
              <dd>{counts[status]}</dd>
            </div>
          ))}
        </dl>
        <p className={styles.muted}>Clique num frame para ver os detalhes. Dois cliques abrem o protótipo.</p>
        <Link className={styles.textLink} to={product.galleryDoc}>
          Galeria em texto
        </Link>
      </div>
    );
  }

  const date = formatDate(frame.date);
  return (
    <div className={styles.inspectorBody}>
      <div className={styles.inspectorHead}>
        <p className={styles.eyebrow}>{frame.section}</p>
        <button type="button" className={styles.iconButton} onClick={onClose} aria-label="Fechar detalhes">
          ×
        </button>
      </div>
      <h2 className={styles.inspectorTitle}>{frame.title}</h2>
      <div className={styles.statusLine}>
        <StatusBadge status={frame.status} />
        {date && <span className={styles.muted}>{date}</span>}
      </div>
      {frame.statusLabel && !STANDARD_STATUS.test(frame.statusLabel) && (
        <p className={styles.statusDetail}>{frame.statusLabel}</p>
      )}
      <div className={styles.actions}>
        <Link className={clsx(styles.button, styles.buttonPrimary)} to={frame.route}>
          Abrir protótipo
        </Link>
        <a className={styles.button} href={file} target="_blank" rel="noreferrer">
          Abrir em outra aba
        </a>
      </div>
      {frame.phone && (
        <figure className={styles.phone}>
          <img src={phone} alt={`${frame.title} no celular`} />
          <figcaption>Celular</figcaption>
        </figure>
      )}
      {frame.description && (
        <div className={styles.description}>
          <InlineMarkdown source={frame.description} />
        </div>
      )}
    </div>
  );
}

export default function MockupCanvas() {
  const data = usePluginData('mockups-catalog');
  const products = isCatalog(data) ? data.products.filter((p) => p.frames.length > 0) : [];
  const history = useHistory();

  const [productId, setProductId] = useState(products[0]?.id ?? 'truck');
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<MockupStatus | 'all'>('all');
  const [listOpen, setListOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const pendingFocus = useRef<string | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const product = products.find((p) => p.id === productId) ?? products[0];

  const visibleFrames = useMemo(() => {
    if (!product) return [];
    const needle = normalize(query.trim());
    return product.frames.filter(
      (frame) =>
        (statusFilter === 'all' || frame.status === statusFilter) &&
        (!needle || normalize(`${frame.title} ${frame.section} ${frame.description}`).includes(needle)),
    );
  }, [product, query, statusFilter]);

  const layout = useMemo(() => layoutFrames(visibleFrames), [visibleFrames]);
  const placedBySlug = useMemo(
    () => new Map(layout.sections.flatMap((s) => s.frames).map((f) => [f.frame.slug, f])),
    [layout],
  );
  const counts = useMemo(() => {
    const result: Record<MockupStatus, number> = {approved: 0, review: 0, draft: 0};
    for (const frame of product?.frames ?? []) result[frame.status] += 1;
    return result;
  }, [product]);

  const selected = product?.frames.find((f) => f.slug === selectedSlug) ?? null;

  const select = useCallback(
    (slug: string | null) => {
      setSelectedSlug(slug);
      if (product) writeQuery(product.id, slug);
    },
    [product],
  );

  const {view, size, panning, setView, animateTo, zoomAt} = useCanvasView(stageRef, {
    onTap: select,
    onDoubleTap: (slug) => {
      const frame = product?.frames.find((f) => f.slug === slug);
      if (frame) history.push(frame.route);
    },
  });

  const fitAll = useCallback(
    (animated: boolean) => {
      if (size.width === 0 || layout.bounds.width === 0) return;
      const target = fitRect(layout.bounds, size, 48, 1);
      if (animated) animateTo(target);
      else setView(target);
    },
    [animateTo, layout.bounds, setView, size],
  );

  const focusFrame = useCallback(
    (slug: string, animated: boolean) => {
      const placed = placedBySlug.get(slug);
      if (!placed || size.width === 0) return;
      const sheetCovers = size.width < NARROW_WIDTH;
      const target = fitRect(placed, sheetCovers ? {...size, height: size.height * 0.4} : size, sheetCovers ? 16 : 72, 1);
      if (animated) animateTo(target);
      else setView(target);
    },
    [animateTo, placedBySlug, setView, size],
  );

  useEffect(() => {
    const initial = readQuery();
    if (initial.product && products.some((p) => p.id === initial.product)) setProductId(initial.product);
    if (initial.frame) {
      setSelectedSlug(initial.frame);
      pendingFocus.current = initial.frame;
    }
    // Only the URL at mount matters; later changes are written by this component.
  }, []);

  useEffect(() => {
    if (size.width === 0 || ready) return;
    if (pendingFocus.current && placedBySlug.has(pendingFocus.current)) focusFrame(pendingFocus.current, false);
    else fitAll(false);
    pendingFocus.current = null;
    setReady(true);
  }, [fitAll, focusFrame, placedBySlug, ready, size.width]);

  useEffect(() => {
    if (ready) fitAll(true);
    // Refit only when the set of frames changes, never on resize or view changes.
  }, [layout]);

  const openSelected = useCallback(() => {
    if (selected) history.push(selected.route);
  }, [history, selected]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target;
      if (target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) return;
      const center = {x: size.width / 2, y: size.height / 2};
      if (event.shiftKey && event.code === 'Digit1') fitAll(true);
      else if (event.shiftKey && event.code === 'Digit2' && selectedSlug) focusFrame(selectedSlug, true);
      else if (event.shiftKey && event.code === 'Digit0') zoomAt(1 / view.scale, center, true);
      else if (event.key === '+' || event.key === '=') zoomAt(1.5, center, true);
      else if (event.key === '-' || event.key === '_') zoomAt(1 / 1.5, center, true);
      else if (event.key === 'Escape') select(null);
      else if (event.key === 'Enter') openSelected();
      else return;
      event.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [fitAll, focusFrame, openSelected, select, selectedSlug, size, view.scale, zoomAt]);

  if (!product) {
    return <div className={styles.emptyState}>Nenhum mockup publicado ainda.</div>;
  }

  const switchProduct = (id: string) => {
    setProductId(id);
    setSelectedSlug(null);
    writeQuery(id, null);
  };

  const viewport: Rect = {
    x: -view.x / view.scale - size.width / view.scale / 2,
    y: -view.y / view.scale - size.height / view.scale / 2,
    width: (size.width / view.scale) * 2,
    height: (size.height / view.scale) * 2,
  };

  let gridSize = 24 * view.scale;
  while (gridSize < 12) gridSize *= 4;
  const worldStyle: WorldStyle = {
    transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})`,
    '--inverse': 1 / view.scale,
    visibility: ready ? 'visible' : 'hidden',
  };

  return (
    <div className={styles.root}>
      <aside className={clsx(styles.layers, listOpen && styles.layersOpen)}>
        <nav className={styles.tabs} aria-label="Produtos">
          {products.map((p) => (
            <button
              key={p.id}
              type="button"
              className={clsx(styles.tab, p.id === product.id && styles.tabActive)}
              onClick={() => switchProduct(p.id)}
            >
              {p.label}
            </button>
          ))}
        </nav>
        <div className={styles.filters}>
          <input
            className={styles.search}
            type="search"
            placeholder="Buscar mockup"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <div className={styles.chips} role="group" aria-label="Status">
            {STATUS_FILTERS.map((filter) => (
              <button
                key={filter.value}
                type="button"
                className={clsx(styles.chip, statusFilter === filter.value && styles.chipActive)}
                aria-pressed={statusFilter === filter.value}
                onClick={() => setStatusFilter(filter.value)}
              >
                {filter.label}
                <span className={styles.chipCount}>
                  {filter.value === 'all' ? product.frames.length : counts[filter.value]}
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className={styles.layerList}>
          {layout.sections.length === 0 && <p className={styles.listEmpty}>Nenhum mockup com esse filtro.</p>}
          {layout.sections.map((section) => (
            <div key={section.title} className={styles.layerGroup}>
              <p className={styles.layerGroupTitle} title={section.title}>
                {section.title}
              </p>
              {section.frames.map(({frame}) => (
                <button
                  key={frame.slug}
                  type="button"
                  className={clsx(styles.layer, frame.slug === selectedSlug && styles.layerActive)}
                  title={frame.title}
                  ref={frame.slug === selectedSlug ? scrollIntoViewIfNeeded : undefined}
                  onClick={() => {
                    select(frame.slug);
                    focusFrame(frame.slug, true);
                    setListOpen(false);
                  }}
                  onDoubleClick={() => history.push(frame.route)}
                >
                  <span className={clsx(styles.dot, styles[`tone_${frame.status}`])} />
                  <span className={styles.layerName}>{frame.title}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      </aside>

      <div
        ref={stageRef}
        className={clsx(styles.stage, panning && styles.stagePanning)}
        style={{
          backgroundSize: `${gridSize}px ${gridSize}px`,
          backgroundPosition: `${view.x}px ${view.y}px`,
        }}
      >
        <div
          className={clsx(styles.world, view.scale * FRAME_WIDTH < FRAME_LABEL_MIN_WIDTH && styles.worldCompact)}
          style={worldStyle}
        >
          {layout.sections.map((section) => (
            <section
              key={section.title}
              className={styles.section}
              style={{left: section.x, top: section.y, width: section.width, height: section.height}}
            >
              <span className={styles.sectionLabel}>{section.title}</span>
            </section>
          ))}
          {layout.sections.flatMap((section) =>
            section.frames.map((placed) => (
              <div
                key={placed.frame.slug}
                data-frame={placed.frame.slug}
                className={clsx(styles.frame, placed.frame.slug === selectedSlug && styles.frameSelected)}
                style={{left: placed.x, top: placed.y, width: placed.width, height: placed.height}}
              >
                <span className={styles.frameLabel}>
                  <span className={clsx(styles.dot, styles[`tone_${placed.frame.status}`])} />
                  {placed.frame.title}
                </span>
                <FramePreview placed={placed} scale={view.scale} visible={intersects(viewport, placed)} />
              </div>
            )),
          )}
        </div>

        {layout.sections.length === 0 && <p className={styles.canvasEmpty}>Nenhum mockup com esse filtro.</p>}

        <button
          type="button"
          data-canvas-ui
          className={clsx(styles.floating, styles.listToggle)}
          onClick={() => setListOpen((open) => !open)}
        >
          {listOpen ? 'Fechar lista' : `Mockups · ${visibleFrames.length}`}
        </button>

        <div className={clsx(styles.floating, styles.zoomBar)} data-canvas-ui>
          <button type="button" onClick={() => zoomAt(1 / 1.5, {x: size.width / 2, y: size.height / 2}, true)} aria-label="Diminuir zoom">
            −
          </button>
          <button
            type="button"
            className={styles.zoomValue}
            onClick={() => zoomAt(1 / view.scale, {x: size.width / 2, y: size.height / 2}, true)}
            title="Zoom em 100% (Shift+0)"
          >
            {Math.round(view.scale * 100)}%
          </button>
          <button type="button" onClick={() => zoomAt(1.5, {x: size.width / 2, y: size.height / 2}, true)} aria-label="Aumentar zoom">
            +
          </button>
          <button type="button" className={styles.zoomFit} onClick={() => fitAll(true)} title="Ver tudo (Shift+1)">
            Ver tudo
          </button>
        </div>
      </div>

      <aside className={clsx(styles.inspector, selected && styles.inspectorOpen)}>
        <Inspector frame={selected} product={product} counts={counts} onClose={() => select(null)} />
      </aside>
    </div>
  );
}
