import type React from "react"
import { useState, useRef } from "react"
import type { StickyNote as StickyNoteType } from "@/types"
import "./StickyNote.css"

interface StickyNoteProps {
  note: StickyNoteType
  onUpdate: (id: string, updates: Partial<StickyNoteType>) => void
  onDelete: (id: string) => void
  onBringToFront: (id: string) => void
  onDragStart: (noteId: string, type: "move" | "resize", e: React.MouseEvent) => void
  isOverTrash: boolean
  isDragging: boolean
}

export const StickyNote: React.FC<StickyNoteProps> = ({ note, onUpdate, onBringToFront, onDragStart, isOverTrash }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [content, setContent] = useState(note.content)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsEditing(true)
    setTimeout(() => textareaRef.current?.focus(), 0)
  }

  const handleContentSave = () => {
    onUpdate(note.id, {
      content,
      updatedAt: new Date(),
    })
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleContentSave()
    } else if (e.key === "Escape") {
      setContent(note.content)
      setIsEditing(false)
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isEditing) return
    onDragStart(note.id, "move", e)
  }

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDragStart(note.id, "resize", e)
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onBringToFront(note.id)
  }

  return (
    <div
      className={`sticky-note ${isOverTrash ? "over-trash" : ""}`}
      style={{
        left: note.position.x,
        top: note.position.y,
        width: note.size.width,
        height: note.size.height,
        backgroundColor: note.color,
        zIndex: note.zIndex,
      }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      {isEditing ? (
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onBlur={handleContentSave}
          onKeyDown={handleKeyDown}
          className="sticky-note-textarea"
          placeholder="Type your note here..."
        />
      ) : (
        <div className="sticky-note-text">
          {note.content || <span className="sticky-note-placeholder">Double-click to edit...</span>}
        </div>
      )}

      <div className="resize-handle" onMouseDown={handleResizeMouseDown} />
    </div>
  )
}
