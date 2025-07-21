import type React from "react"
import { useState, useRef, useCallback, useEffect } from "react"
import type { StickyNote as StickyNoteType, Position, CreateNoteData, Size } from "./types"
import { StickyNote } from "./components/StickyNote/StickyNote"
import { CreateNoteModal } from "./components/CreateNoteModal/CreateNoteModal"
import { TrashZone } from "./components/TrashZone/TrashZone"
import { useLocalStorage } from "./hooks/useLocalStorage"
import { createNote, getMaxZIndex } from "./utils/noteUtils"
import "./App.css"

function App() {
  const { notes, saveNotes } = useLocalStorage()
  const [modalState, setModalState] = useState<{
    isOpen: boolean
    position: Position
  }>({
    isOpen: false,
    position: { x: 0, y: 0 },
  })
  const [draggedNoteId, setDraggedNoteId] = useState<string | null>(null)
  const [isOverTrash, setIsOverTrash] = useState(false)
  const trashRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [currentDrag, setCurrentDrag] = useState<{
    noteId: string
    type: "move" | "resize"
    startPos: Position
    offset: Position
    initialSize: Size
  } | null>(null)

  const handleContainerClick = useCallback((e: React.MouseEvent) => {
    if (e.target === containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      const position: Position = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }

      setModalState({
        isOpen: true,
        position,
      })
    }
  }, [])

  const handleCreateNote = useCallback(
    (data: CreateNoteData) => {
      const maxZIndex = getMaxZIndex(notes)
      const newNote = createNote(data.size, data.position, maxZIndex, data.color)
      const updatedNotes = [...notes, newNote]
      saveNotes(updatedNotes)
    },
    [notes, saveNotes],
  )

  const handleUpdateNote = useCallback(
    (id: string, updates: Partial<StickyNoteType>) => {
      const updatedNotes = notes.map((note) => (note.id === id ? { ...note, ...updates } : note))
      saveNotes(updatedNotes)

      if (updates.position && trashRef.current && currentDrag) {
        const note = updatedNotes.find((n) => n.id === id)
        if (note) {
          const trashRect = trashRef.current.getBoundingClientRect()
          const noteRect = {
            left: note.position.x,
            right: note.position.x + note.size.width,
            top: note.position.y,
            bottom: note.position.y + note.size.height,
          }

          const overTrash = !(
            noteRect.right < trashRect.left ||
            noteRect.left > trashRect.right ||
            noteRect.bottom < trashRect.top ||
            noteRect.top > trashRect.bottom
          )

          setIsOverTrash(overTrash)
          setDraggedNoteId(overTrash ? id : null)
        }
      }
    },
    [notes, saveNotes, currentDrag],
  )

  const handleDeleteNote = useCallback(
    (id: string) => {
      const updatedNotes = notes.filter((note) => note.id !== id)
      saveNotes(updatedNotes)
      setIsOverTrash(false)
      setDraggedNoteId(null)
    },
    [notes, saveNotes],
  )

  const handleBringToFront = useCallback(
    (id: string) => {
      const maxZIndex = getMaxZIndex(notes)
      const updatedNotes = notes.map((note) => (note.id === id ? { ...note, zIndex: maxZIndex + 1 } : note))
      saveNotes(updatedNotes)
    },
    [notes, saveNotes],
  )

  const closeModal = useCallback(() => {
    setModalState((prev) => ({ ...prev, isOpen: false }))
  }, [])

  const handleGlobalMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!currentDrag) return

      const note = notes.find((n) => n.id === currentDrag.noteId)
      if (!note) return

      if (currentDrag.type === "move") {
        const newPosition: Position = {
          x: Math.max(0, e.clientX - currentDrag.offset.x),
          y: Math.max(0, e.clientY - currentDrag.offset.y),
        }
        handleUpdateNote(currentDrag.noteId, { position: newPosition })

        if (trashRef.current) {
          const trashRect = trashRef.current.getBoundingClientRect()
          const noteRect = {
            left: newPosition.x,
            right: newPosition.x + note.size.width,
            top: newPosition.y,
            bottom: newPosition.y + note.size.height,
          }

          const overTrash = !(
            noteRect.right < trashRect.left ||
            noteRect.left > trashRect.right ||
            noteRect.bottom < trashRect.top ||
            noteRect.top > trashRect.bottom
          )

          setIsOverTrash(overTrash)
          setDraggedNoteId(overTrash ? currentDrag.noteId : null)
        }
      } else if (currentDrag.type === "resize") {
        const deltaX = e.clientX - currentDrag.startPos.x
        const deltaY = e.clientY - currentDrag.startPos.y

        const newSize: Size = {
          width: Math.max(150, currentDrag.initialSize.width + deltaX),
          height: Math.max(100, currentDrag.initialSize.height + deltaY),
        }
        handleUpdateNote(currentDrag.noteId, { size: newSize })
      }
    },
    [currentDrag, notes, handleUpdateNote],
  )

  const handleGlobalMouseUp = useCallback(() => {
    if (currentDrag && currentDrag.type === "move" && isOverTrash) {
      handleDeleteNote(currentDrag.noteId)
    }
    setCurrentDrag(null)
    setIsOverTrash(false)
    setDraggedNoteId(null)
  }, [currentDrag, isOverTrash, handleDeleteNote])

  useEffect(() => {
    if (currentDrag) {
      document.addEventListener("mousemove", handleGlobalMouseMove)
      document.addEventListener("mouseup", handleGlobalMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleGlobalMouseMove)
        document.removeEventListener("mouseup", handleGlobalMouseUp)
      }
    }
  }, [currentDrag, handleGlobalMouseMove, handleGlobalMouseUp])

  const handleDragStart = useCallback(
    (noteId: string, type: "move" | "resize", e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()

      const note = notes.find((n) => n.id === noteId)
      if (!note) return

      handleBringToFront(noteId)

      const offset: Position = {
        x: e.clientX - note.position.x,
        y: e.clientY - note.position.y,
      }

      setCurrentDrag({
        noteId,
        type,
        startPos: { x: e.clientX, y: e.clientY },
        offset,
        initialSize: note.size,
      })
    },
    [notes, handleBringToFront],
  )

  return (
    <div className="app">
      <div ref={containerRef} className="canvas" onClick={handleContainerClick}>
        {notes.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-content">
              <h1 className="empty-state-title">Sticky Notes</h1>
              <p className="empty-state-subtitle">Click anywhere to create a new note</p>
            </div>
          </div>
        )}

        {notes.map((note) => (
          <StickyNote
            key={note.id}
            note={note}
            onUpdate={handleUpdateNote}
            onDelete={handleDeleteNote}
            onBringToFront={handleBringToFront}
            onDragStart={handleDragStart}
            isOverTrash={isOverTrash && draggedNoteId === note.id}
            isDragging={currentDrag?.noteId === note.id}
          />
        ))}
      </div>

      <div ref={trashRef}>
        <TrashZone isActive={isOverTrash} />
      </div>

      <CreateNoteModal
        isOpen={modalState.isOpen}
        position={modalState.position}
        onClose={closeModal}
        onCreate={handleCreateNote}
      />
    </div>
  )
}

export default App
