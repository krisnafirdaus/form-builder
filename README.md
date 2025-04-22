# Schema-Driven Form Builder

This project implements a reusable, schema-driven form rendering component in React with TypeScript, built using Vite.

## Objectives Met

*   **`FormRenderer` Component:** Dynamically renders a form based on a provided schema array (`src/components/FormRenderer.tsx`).
*   **Supported Field Types:** Text, Number, Select, Date Range.
*   **Styling:** Basic, responsive CSS styling using global CSS (`src/index.css`) for readability.
*   **Validation:** Handles `required` fields (including conditional requirements) and displays error messages upon submission attempt.
*   **Submission:** Displays a JSON summary of the valid form data upon successful submission.
*   **Extensibility:** Designed with interfaces (`src/types/index.ts`) to be extensible.
*   **Accessibility:** Basic accessibility features included (labels, `aria-invalid`, `aria-describedby`).
*   **No Third-Party Form Libraries:** Form state and validation are handled manually using React hooks.
*   **Bonus: Conditional Logic:** Demonstrates showing/requiring a field based on another field's value (e.g., "Company Name" depends on "Employed").

## Project Structure

```
/
├── public/
├── src/
│   ├── assets/            # Static assets (logos, etc.)
│   ├── components/        # Reusable React components
│   │   └── FormRenderer.tsx # The core form rendering component
│   ├── types/             # TypeScript type definitions
│   │   └── index.ts       # Form schema and state types
│   ├── App.css            # App-specific styles (minimal)
│   ├── App.tsx            # Main application component, schema definition, usage example
│   ├── index.css          # Global styles (including form styling)
│   ├── main.tsx           # Application entry point
│   └── vite-env.d.ts      # Vite environment types
├── .eslintrc.cjs        # ESLint configuration
├── .gitignore
├── index.html           # Main HTML template
├── package.json
├── package-lock.json
├── README.md            # This file
├── tsconfig.json        # TypeScript configuration
├── tsconfig.node.json
└── vite.config.ts       # Vite configuration
```

## Setup and Running

1.  **Clone the repository or extract the zip file.**
2.  **Navigate to the project directory:**
    ```bash
    cd form-builder
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Run the development server:**
    ```bash
    npm run dev
    ```
5.  Open your browser and navigate to the URL provided by Vite (usually `http://localhost:5173`).

## Future Considerations / Testing

Given the time constraint (approx. 2.5 hours), formal unit/integration tests (e.g., using Vitest/React Testing Library) were not implemented.

**If more time were available, I would add:**

*   **Unit Tests (`FormRenderer.test.tsx`):**
    *   Test rendering of each field type based on the schema.
    *   Test input changes update the internal state correctly.
    *   Test validation logic (required fields, error messages).
    *   Test conditional rendering and requirement logic.
    *   Test successful submission callback (`onSubmit`) is called with correct data.
*   **More Input Types:** Implement bonus types like `radio` and `checkbox`.
*   **Advanced Validation:** Add support for more complex validation rules beyond just `required` (e.g., min/max length, patterns, email format). This could involve extending the schema definition.
*   **Async Submission:** Handle asynchronous submission states (loading, success, error).
*   **Refined Styling:** Further improve UI/UX, potentially integrating with a design system or utility classes like Tailwind CSS if appropriate for the broader application context.
*   **Accessibility Audit:** Perform a more thorough accessibility check using tools like Axe DevTools.
