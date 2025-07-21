import type { StickyNote, NoteSize, Position, Size } from "../types"

const SIZE_MAP: Record<NoteSize, Size> = {
  small: { width: 200, height: 150 },
  medium: { width: 250, height: 200 },
  large: { width: 300, height: 250 },
}

const COLORS = [
  "#FFE066", // Yellow
  "#FF9999", // Pink
  "#99CCFF", // Blue
  "#99FF99", // Green
  "#FFCC99", // Orange
  "#CC99FF", // Purple
]

export const createNote = (size: NoteSize, position: Position, maxZIndex: number, color?: string): StickyNote => {
  const now = new Date()

  return {
    id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    position,
    size: SIZE_MAP[size],
    content: "",
    color: color || COLORS[Math.floor(Math.random() * COLORS.length)],
    zIndex: maxZIndex + 1,
    createdAt: now,
    updatedAt: now,
  }
}

export const isPositionOverElement = (position: Position, element: HTMLElement): boolean => {
  const rect = element.getBoundingClientRect()
  return position.x >= rect.left && position.x <= rect.right && position.y >= rect.top && position.y <= rect.bottom
}

export const getMaxZIndex = (notes: StickyNote[]): number => {
  return notes.reduce((max, note) => Math.max(max, note.zIndex), 0)
}
