# Minimal Todo App

A focused, single-page todo list built with Vite and React. Add tasks with the button or Enter, mark them complete, and remove them. Task state is intentionally held in memory and resets when the page reloads.

## Requirements

- Node.js 20 or newer
- npm

## Install and run

```sh
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite.

## Verify

Run component tests:

```sh
cd frontend
node node_modules/vitest/vitest.mjs run
```

Run the browser journey (Playwright Chromium must be installed in the environment):

```sh
cd frontend
node node_modules/@playwright/test/cli.js test
```

Build the static site:

```sh
cd frontend
node node_modules/vite/bin/vite.js build
```

The production bundle is written to `frontend/dist/` and can be served by any static host.
