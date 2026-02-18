# CareMatrix Frontend (React + Vite)

This project has been migrated from a static HTML/CSS/JS build to a React application powered by Vite.

## Tech stack

- React 18
- Vite 5
- Plain CSS styling (existing stylesheet retained)

## Scripts

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Migration approach

- The original UI markup was moved into a React-rendered template (`src/legacyMarkup.js`).
- The original DOM behavior from `app.js` was moved into `src/legacyApp.js` and initialized from React.
- Existing styling was preserved in `src/styles.css`.

This keeps the existing behavior and design while running the application through a modern React + Vite setup.
