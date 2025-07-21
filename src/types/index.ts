export interface Position {
  x: number
  y: number
}

export interface Size {
  width: number
  height: number
}

export interface StickyNote {
  id: string
  position: Position
  size: Size
  content: string
  color: string
  zIndex: number
  createdAt: Date
  updatedAt: Date
}

export interface DragState {
  isDragging: boolean
  dragType: "move" | "resize" | null
  startPosition: Position
  startSize: Size
  offset: Position
}

export type NoteSize = "small" | "medium" | "large"

export interface CreateNoteData {
  size: NoteSize
  position: Position
  color?: string
}
