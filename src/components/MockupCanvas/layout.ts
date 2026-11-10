import type {MockupFrame} from '@site/plugins/mockups-catalog';

export const FRAME_WIDTH = 1440;
const DEFAULT_HEIGHT = 900;
const MIN_HEIGHT = 640;
const MAX_HEIGHT = 1100;
const GAP_X = 160;
const GAP_Y = 220;
const SECTION_PADDING = 160;
const SECTION_GAP = 360;

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PlacedFrame extends Rect {
  frame: MockupFrame;
}

export interface PlacedSection extends Rect {
  title: string;
  frames: PlacedFrame[];
}

export interface CanvasLayout {
  sections: PlacedSection[];
  bounds: Rect;
}

function frameHeight(frame: MockupFrame): number {
  if (!frame.desktop) return DEFAULT_HEIGHT;
  const natural = (frame.desktop.height / frame.desktop.width) * FRAME_WIDTH;
  return Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, Math.round(natural)));
}

export function layoutFrames(frames: MockupFrame[]): CanvasLayout {
  const groups = new Map<string, MockupFrame[]>();
  for (const frame of frames) {
    const list = groups.get(frame.section) ?? [];
    list.push(frame);
    groups.set(frame.section, list);
  }

  const sections: PlacedSection[] = [];
  let left = 0;
  let maxHeight = 0;

  for (const [title, list] of groups) {
    const columns = Math.max(1, Math.min(list.length, Math.ceil(Math.sqrt(list.length * 1.4))));
    const placed: PlacedFrame[] = [];
    let rowTop = SECTION_PADDING;

    for (let start = 0; start < list.length; start += columns) {
      const row = list.slice(start, start + columns);
      const rowHeight = Math.max(...row.map(frameHeight));
      row.forEach((frame, index) => {
        placed.push({
          frame,
          x: left + SECTION_PADDING + index * (FRAME_WIDTH + GAP_X),
          y: rowTop,
          width: FRAME_WIDTH,
          height: frameHeight(frame),
        });
      });
      rowTop += rowHeight + GAP_Y;
    }

    const width = SECTION_PADDING * 2 + columns * FRAME_WIDTH + (columns - 1) * GAP_X;
    const height = rowTop - GAP_Y + SECTION_PADDING;
    sections.push({title, x: left, y: 0, width, height, frames: placed});
    maxHeight = Math.max(maxHeight, height);
    left += width + SECTION_GAP;
  }

  return {
    sections,
    bounds: {x: 0, y: 0, width: Math.max(0, left - SECTION_GAP), height: maxHeight},
  };
}
