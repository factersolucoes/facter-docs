import {useCallback, useEffect, useRef, useState, type RefObject} from 'react';
import type {Rect} from './layout';

export interface View {
  x: number;
  y: number;
  scale: number;
}

export const MIN_SCALE = 0.02;
export const MAX_SCALE = 4;

const clampScale = (scale: number) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale));

export function fitRect(rect: Rect, size: {width: number; height: number}, padding: number, maxScale: number): View {
  const availableWidth = Math.max(1, size.width - padding * 2);
  const availableHeight = Math.max(1, size.height - padding * 2);
  const scale = clampScale(Math.min(maxScale, availableWidth / rect.width, availableHeight / rect.height));
  return {
    scale,
    x: (size.width - rect.width * scale) / 2 - rect.x * scale,
    y: (size.height - rect.height * scale) / 2 - rect.y * scale,
  };
}

interface Options {
  onTap: (frameSlug: string | null) => void;
  onDoubleTap: (frameSlug: string) => void;
}

export function useCanvasView(stageRef: RefObject<HTMLDivElement | null>, {onTap, onDoubleTap}: Options) {
  const [view, setViewState] = useState<View>({x: 0, y: 0, scale: 0.1});
  const [size, setSize] = useState({width: 0, height: 0});
  const [panning, setPanning] = useState(false);
  const viewRef = useRef(view);
  const animation = useRef<number | null>(null);
  const onTapRef = useRef(onTap);
  onTapRef.current = onTap;
  const onDoubleTapRef = useRef(onDoubleTap);
  onDoubleTapRef.current = onDoubleTap;

  const setView = useCallback((next: View) => {
    viewRef.current = next;
    setViewState(next);
  }, []);

  const stopAnimation = useCallback(() => {
    if (animation.current !== null) cancelAnimationFrame(animation.current);
    animation.current = null;
  }, []);

  const animateTo = useCallback(
    (target: View) => {
      stopAnimation();
      const from = viewRef.current;
      const started = performance.now();
      const duration = 280;
      const step = (now: number) => {
        const t = Math.min(1, (now - started) / duration);
        const eased = 1 - (1 - t) ** 3;
        const logScale = Math.log(from.scale) + (Math.log(target.scale) - Math.log(from.scale)) * eased;
        const scale = Math.exp(logScale);
        const progress = from.scale === target.scale ? eased : (scale - from.scale) / (target.scale - from.scale);
        setView({
          scale,
          x: from.x + (target.x - from.x) * progress,
          y: from.y + (target.y - from.y) * progress,
        });
        animation.current = t < 1 ? requestAnimationFrame(step) : null;
      };
      animation.current = requestAnimationFrame(step);
    },
    [setView, stopAnimation],
  );

  const zoomAt = useCallback(
    (factor: number, point: {x: number; y: number}, animated = false) => {
      const current = viewRef.current;
      const scale = clampScale(current.scale * factor);
      const ratio = scale / current.scale;
      const next = {scale, x: point.x - (point.x - current.x) * ratio, y: point.y - (point.y - current.y) * ratio};
      if (animated) animateTo(next);
      else setView(next);
    },
    [animateTo, setView],
  );

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new ResizeObserver(([entry]) => {
      setSize({width: entry.contentRect.width, height: entry.contentRect.height});
    });
    observer.observe(stage);
    return () => observer.disconnect();
  }, [stageRef]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      stopAnimation();
      const box = stage.getBoundingClientRect();
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? box.height : 1;
      if (event.ctrlKey || event.metaKey) {
        zoomAt(Math.exp(-event.deltaY * unit * 0.01), {x: event.clientX - box.left, y: event.clientY - box.top});
        return;
      }
      const current = viewRef.current;
      const dx = event.shiftKey && event.deltaX === 0 ? event.deltaY : event.deltaX;
      const dy = event.shiftKey && event.deltaX === 0 ? 0 : event.deltaY;
      setView({...current, x: current.x - dx * unit, y: current.y - dy * unit});
    };

    const pointers = new Map<number, {x: number; y: number}>();
    let tapSlug: string | null = null;
    let moved = false;
    let pinchDistance = 0;
    let lastTap = {slug: '', at: 0};

    const local = (event: PointerEvent) => {
      const box = stage.getBoundingClientRect();
      return {x: event.clientX - box.left, y: event.clientY - box.top};
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0 && event.pointerType === 'mouse') return;
      if (event.target instanceof Element && event.target.closest('[data-canvas-ui]')) return;
      stopAnimation();
      stage.setPointerCapture(event.pointerId);
      pointers.set(event.pointerId, local(event));
      moved = pointers.size > 1;
      const frameElement = event.target instanceof Element ? event.target.closest('[data-frame]') : null;
      tapSlug = frameElement?.getAttribute('data-frame') ?? null;
      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        pinchDistance = Math.hypot(a.x - b.x, a.y - b.y);
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      const previous = pointers.get(event.pointerId);
      if (!previous) return;
      const point = local(event);
      if (pointers.size === 1) {
        if (!moved && Math.hypot(point.x - previous.x, point.y - previous.y) < 4) return;
        if (!moved) setPanning(true);
        moved = true;
        const current = viewRef.current;
        setView({...current, x: current.x + point.x - previous.x, y: current.y + point.y - previous.y});
        pointers.set(event.pointerId, point);
        return;
      }
      pointers.set(event.pointerId, point);
      const [a, b] = [...pointers.values()];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      if (pinchDistance > 0) zoomAt(distance / pinchDistance, {x: (a.x + b.x) / 2, y: (a.y + b.y) / 2});
      pinchDistance = distance;
    };

    const onPointerUp = (event: PointerEvent) => {
      if (!pointers.has(event.pointerId)) return;
      pointers.delete(event.pointerId);
      if (pointers.size === 0) {
        setPanning(false);
        if (!moved) {
          const now = performance.now();
          if (tapSlug && lastTap.slug === tapSlug && now - lastTap.at < 400) {
            lastTap = {slug: '', at: 0};
            onDoubleTapRef.current(tapSlug);
          } else {
            lastTap = {slug: tapSlug ?? '', at: now};
            onTapRef.current(tapSlug);
          }
        }
      }
      pinchDistance = 0;
    };

    stage.addEventListener('wheel', onWheel, {passive: false});
    stage.addEventListener('pointerdown', onPointerDown);
    stage.addEventListener('pointermove', onPointerMove);
    stage.addEventListener('pointerup', onPointerUp);
    stage.addEventListener('pointercancel', onPointerUp);
    return () => {
      stage.removeEventListener('wheel', onWheel);
      stage.removeEventListener('pointerdown', onPointerDown);
      stage.removeEventListener('pointermove', onPointerMove);
      stage.removeEventListener('pointerup', onPointerUp);
      stage.removeEventListener('pointercancel', onPointerUp);
    };
  }, [stageRef, setView, stopAnimation, zoomAt]);

  useEffect(() => stopAnimation, [stopAnimation]);

  return {view, size, panning, setView, animateTo, zoomAt};
}
