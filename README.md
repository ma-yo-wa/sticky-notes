# Sticky Notes

## Architecture Overview

Sticky Notes is a single-page React application written in TypeScript, designed for desktop browsers. The app is structured around a main `App` component that manages the state of all notes, with a component for individual sticky note, a modal for note creation, and a trash zone for deletion. All drag-and-drop and resizing logic is implemented manually using React state, refs, and mouse events, in line with the assessment requirements. The application uses a custom hook to persist notes in local storage, ensuring that notes are restored on page load.

The UI is built with plain CSS for clarity and maintainability, and the codebase is organized for readability and ease of review. Static typing is enforced throughout using TypeScript interfaces for notes, positions, and sizes, ensuring type safety and code quality. The design prioritizes usability, with intuitive interactions for creating, moving, resizing, editing, and deleting notes.

## Features Implemented
- Create a new note of the specified size at the specified position (via modal and click location)
- Change note size by dragging the resize handle
- Move a note by dragging
- Remove a note by dragging it over a predefined trash zone
- Edit note text (double-click to edit)
- Move notes to front on interaction
- Save notes to local storage and restore on page load
- Choose different note colors

## Build & Run Instructions
1. Install dependencies:
   ```
   npm install
   ```
2. Start the development server:
   ```
   npm run dev
   ```
3. Open [http://localhost:5173](http://localhost:5173) in your browser.

---

**Note:** All core and 4 out of 5 bonus features are implemented. Due to time constraints, saving notes to a REST API and unit tests are not included.