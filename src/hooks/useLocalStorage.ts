import { useState, useEffect } from "react"
import type { StickyNote } from "../types"

const STORAGE_KEY = "sticky-notes"

export const useLocalStorage = () => {
  const [notes, setNotes] = useState<StickyNote[]>([])

  useEffect(() => {
    const savedNotes = localStorage.getItem(STORAGE_KEY)
    if (savedNotes) {
      try {
        const parsed = JSON.parse(savedNotes)
        const notesWithDates = parsed.map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt),
        }))
        setNotes(notesWithDates)
      } catch (error) {
        console.error("Failed to parse saved notes:", error)
      }
    }
  }, [])

  const saveNotes = (notesToSave: StickyNote[]) => {
    setNotes(notesToSave)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notesToSave))
  }

  return { notes, saveNotes }
}
