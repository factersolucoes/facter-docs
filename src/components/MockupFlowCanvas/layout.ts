import type {Rect} from '../MockupCanvas/layout';

export interface FlowLane {
  id: string;
  title: string;
}

export interface FlowFrame {
  id: string;
  lane: string;
  label: string;
  frame: string;
  state?: string;
  theme?: 'light' | 'dark';
  hint?: string;
  x?: number;
  y?: number;
}

export interface FlowArrow {
  from: string;
  to: string;
  label?: string;
}

export interface FlowNote {
  attach: string;
  text: string;
}

export interface FlowManifest {
  title: string;
  mockup?: string;
  lanes: FlowLane[];
  frames: FlowFrame[];
  arrows: FlowArrow[];
  notes: FlowNote[];
}

export interface Size {
  width: number;
  height: number;
}

export interface PlacedFlowFrame extends Rect {
  frame: FlowFrame;
  lane: number;
}

export interface PlacedLane extends Rect {
  lane: FlowLane;
}

export interface PlacedNote extends Rect {
  note: FlowNote;
}

export interface PlacedArrow {
  arrow: FlowArrow;
  path: string;
  head: {x: number; y: number; angle: number};
  middle: {x: number; y: number};
}

export interface FlowLayout {
  frames: PlacedFlowFrame[];
  lanes: PlacedLane[];
  notes: PlacedNote[];
  bounds: Rect;
}

const DEFAULT_SIZE: Size = {width: 1440, height: 900};
const GAP_X = 280;
const LANE_GAP = 560;
const NOTE_WIDTH = 640;
const NOTE_HEIGHT = 220;
const NOTE_OFFSET = 56;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

const isString = (value: unknown): value is string => typeof value === 'string';

function isFrame(value: unknown): value is FlowFrame {
  return (
    isRecord(value) && isString(value.id) && isString(value.lane) && isString(value.label) && isString(value.frame)
  );
}

export function isFlowManifest(value: unknown): value is FlowManifest {
  return (
    isRecord(value) &&
    isString(value.title) &&
    Array.isArray(value.lanes) &&
    value.lanes.every((lane) => isRecord(lane) && isString(lane.id) && isString(lane.title)) &&
    Array.isArray(value.frames) &&
    value.frames.every(isFrame) &&
    Array.isArray(value.arrows) &&
    value.arrows.every((arrow) => isRecord(arrow) && isString(arrow.from) && isString(arrow.to)) &&
    Array.isArray(value.notes) &&
    value.notes.every((note) => isRecord(note) && isString(note.attach) && isString(note.text))
  );
}

export function readSizes(value: unknown): Record<string, Size> {
  if (!isRecord(value) || !isRecord(value.frames)) return {};
  const sizes: Record<string, Size> = {};
  for (const [id, size] of Object.entries(value.frames)) {
    if (isRecord(size) && typeof size.width === 'number' && typeof size.height === 'number') {
      sizes[id] = {width: size.width, height: size.height};
    }
  }
  return sizes;
}

/* Lanes stack top to bottom in manifest order; frames run left to right inside a lane.
   A frame that branches from an earlier lane starts under the frame it comes from. */
export function layoutFlow(manifest: FlowManifest, sizes: Record<string, Size>): FlowLayout {
  const placed = new Map<string, PlacedFlowFrame>();
  const lanes: PlacedLane[] = [];
  const incoming = new Map<string, string>();
  for (const arrow of manifest.arrows) if (!incoming.has(arrow.to)) incoming.set(arrow.to, arrow.from);
  const notedFrames = new Set(manifest.notes.map((note) => note.attach));

  let laneTop = 0;
  manifest.lanes.forEach((lane, laneIndex) => {
    const frames = manifest.frames.filter((frame) => frame.lane === lane.id);
    if (frames.length === 0) return;
    let cursor = 0;
    let height = 0;
    let hasNote = false;
    for (const frame of frames) {
      const size = sizes[frame.id] ?? DEFAULT_SIZE;
      const source = placed.get(incoming.get(frame.id) ?? '');
      const branchX = source && source.lane < laneIndex ? source.x : 0;
      const x = frame.x ?? Math.max(cursor, branchX);
      const y = frame.y ?? laneTop;
      placed.set(frame.id, {frame, lane: laneIndex, x, y, ...size});
      cursor = x + size.width + GAP_X;
      height = Math.max(height, y - laneTop + size.height);
      hasNote ||= notedFrames.has(frame.id);
    }
    const laneFrames = frames.map((frame) => placed.get(frame.id)).filter((f): f is PlacedFlowFrame => f !== undefined);
    const right = Math.max(...laneFrames.map((f) => f.x + f.width));
    lanes.push({lane, x: 0, y: laneTop, width: right, height});
    laneTop += height + (hasNote ? NOTE_OFFSET + NOTE_HEIGHT : 0) + LANE_GAP;
  });

  const frames = manifest.frames
    .map((frame) => placed.get(frame.id))
    .filter((f): f is PlacedFlowFrame => f !== undefined);
  const notes = manifest.notes.flatMap((note): PlacedNote[] => {
    const target = placed.get(note.attach);
    if (!target) return [];
    return [
      {
        note,
        x: target.x,
        y: target.y + target.height + NOTE_OFFSET,
        width: NOTE_WIDTH,
        height: NOTE_HEIGHT,
      },
    ];
  });

  const rects: Rect[] = [...frames, ...notes];
  const minX = Math.min(...rects.map((r) => r.x));
  const minY = Math.min(...rects.map((r) => r.y));
  const maxX = Math.max(...rects.map((r) => r.x + r.width));
  const maxY = Math.max(...rects.map((r) => r.y + r.height));
  const bounds = rects.length
    ? {x: minX, y: minY, width: maxX - minX, height: maxY - minY}
    : {x: 0, y: 0, width: 1, height: 1};
  return {frames, lanes, notes, bounds};
}

function cubicPoint(p: number[], t: number): {x: number; y: number} {
  const [x0, y0, x1, y1, x2, y2, x3, y3] = p;
  const u = 1 - t;
  return {
    x: u * u * u * x0 + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x3,
    y: u * u * u * y0 + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y3,
  };
}

/* Next step in the same lane: from the right edge to the left edge. Branch to another lane: from the bottom
   (or top) edge to the top (or bottom) centre, starts spread along the right half so they do not overlap. */
export function routeArrows(layout: FlowLayout, arrows: FlowArrow[]): PlacedArrow[] {
  const byId = new Map(layout.frames.map((f) => [f.frame.id, f]));
  const crossCount = new Map<string, number>();
  const crossIndex = new Map<FlowArrow, number>();
  for (const arrow of arrows) {
    const from = byId.get(arrow.from);
    const to = byId.get(arrow.to);
    if (!from || !to || (from.lane === to.lane && to.x > from.x)) continue;
    const n = crossCount.get(arrow.from) ?? 0;
    crossIndex.set(arrow, n);
    crossCount.set(arrow.from, n + 1);
  }

  return arrows.flatMap((arrow): PlacedArrow[] => {
    const from = byId.get(arrow.from);
    const to = byId.get(arrow.to);
    if (!from || !to) return [];
    let points: number[];
    if (from.lane === to.lane && to.x > from.x) {
      const sx = from.x + from.width;
      const sy = from.y + from.height / 2;
      const tx = to.x;
      const ty = to.y + to.height / 2;
      const bend = Math.max(60, (tx - sx) / 2);
      points = [sx, sy, sx + bend, sy, tx - bend, ty, tx, ty];
    } else {
      const down = to.y > from.y;
      const count = crossCount.get(arrow.from) ?? 1;
      const index = crossIndex.get(arrow) ?? 0;
      const sx = from.x + from.width * (0.5 + (0.45 * (index + 1)) / (count + 1));
      const sy = down ? from.y + from.height : from.y;
      const tx = to.x + to.width / 2;
      const ty = down ? to.y : to.y + to.height;
      const bend = Math.max(120, Math.abs(ty - sy) / 2) * (down ? 1 : -1);
      points = [sx, sy, sx, sy + bend, tx, ty - bend, tx, ty];
    }
    const [x0, y0, x1, y1, x2, y2, x3, y3] = points;
    const before = cubicPoint(points, 0.97);
    return [
      {
        arrow,
        path: `M${x0},${y0} C${x1},${y1} ${x2},${y2} ${x3},${y3}`,
        head: {x: x3, y: y3, angle: Math.atan2(y3 - before.y, x3 - before.x)},
        middle: cubicPoint(points, 0.5),
      },
    ];
  });
}
