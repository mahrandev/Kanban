
# GEMINI.md

## Project Overview

This is a Kanban task manager application built with React and Vite. It uses Supabase for the backend and database, and Tailwind CSS for styling. The app features drag-and-drop functionality for tasks, implemented with `@dnd-kit`.

**Key Technologies:**

*   **Frontend:** React, Vite
*   **Backend & Database:** Supabase
*   **Styling:** Tailwind CSS
*   **Drag & Drop:** `@dnd-kit`
*   **UI Components:** Radix UI

**Architecture:**

The application is structured with a main `App.jsx` component that handles authentication and data fetching. The UI is broken down into smaller components located in `src/components`. The main components are:

*   `Auth.jsx`: Handles user authentication.
*   `Sidebar.jsx`: Displays the list of boards.
*   `Header.jsx`: The main header of the application.
*   `Board.jsx`: The main component that renders the columns and tasks.
*   `Column.jsx`: Renders a single column.
*   `TaskCard.jsx`: Renders a single task card.
*   Modals for adding, viewing, editing, and deleting tasks.

## Building and Running

**1. Install Dependencies:**

```bash
npm install
```

**2. Run the Development Server:**

```bash
npm run dev
```

**3. Build for Production:**

```bash
npm run build
```

**4. Lint the Code:**

```bash
npm run lint
```

## Development Conventions

*   The project uses ESLint for code linting.
*   The code is formatted with Prettier.
*   The project follows a component-based architecture.
*   State management is handled with React hooks (`useState`, `useEffect`).
*   The project uses Supabase for all backend operations, including authentication and database interactions.
