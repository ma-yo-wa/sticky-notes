import React from "react"
import { useState } from "react"
import type { NoteSize, CreateNoteData, Position } from "../../types"
import "./CreateNoteModal.css"

interface CreateNoteModalProps {
  isOpen: boolean
  position: Position
  onClose: () => void
  onCreate: (data: CreateNoteData) => void
}

const SIZE_OPTIONS: { value: NoteSize; label: string; dimensions: string }[] = [
  { value: "small", label: "Small", dimensions: "200×150" },
  { value: "medium", label: "Medium", dimensions: "250×200" },
  { value: "large", label: "Large", dimensions: "300×250" },
]

const COLORS = [
  "#FFE066", // Yellow
  "#FF9999", // Pink
  "#99CCFF", // Blue
  "#99FF99", // Green
  "#FFCC99", // Orange
  "#CC99FF", // Purple
]

export const CreateNoteModal: React.FC<CreateNoteModalProps> = ({ isOpen, position, onClose, onCreate }) => {
  const [selectedSize, setSelectedSize] = useState<NoteSize>("medium")
  const [selectedColor, setSelectedColor] = useState(COLORS[0])

  if (!isOpen) return null

  const handleCreate = () => {
    onCreate({
      size: selectedSize,
      position,
      color: selectedColor,
    })
    onClose()
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div
        className="modal-content"
        style={{
          left: Math.min(position.x, window.innerWidth - 300),
          top: Math.min(position.y, window.innerHeight - 400),
        }}
      >
        <h2 className="modal-title">Create New Note</h2>

        <div className="form-group">
          <label className="form-label">Size</label>
          <div className="radio-group">
            {SIZE_OPTIONS.map((option) => (
              <label key={option.value} className="radio-option">
                <input
                  type="radio"
                  name="size"
                  value={option.value}
                  checked={selectedSize === option.value}
                  onChange={(e) => setSelectedSize(e.target.value as NoteSize)}
                  className="radio-input"
                />
                <span className="radio-label">
                  {option.label} ({option.dimensions}px)
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Color</label>
          <div className="color-group">
            {COLORS.map((color) => (
              <button
                key={color}
                className={`color-button ${selectedColor === color ? "selected" : ""}`}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
              />
            ))}
          </div>
        </div>

        <div className="modal-actions">
          <button onClick={onClose} className="button button-secondary">
            Cancel
          </button>
          <button onClick={handleCreate} className="button button-primary">
            Create Note
          </button>
        </div>
      </div>
    </div>
  )
}
