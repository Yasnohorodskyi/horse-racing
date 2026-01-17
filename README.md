# Vue Horse Racing Game

A lightweight single-page horse racing simulator built with Vue 2 and Vuex.

## Features
- Generate a race program with 6 rounds (1200–2200m), 20 horses, and 10 participants per round
- Real-time race simulation with per-lane progress, finish line, and status (Idle/Ready/Racing/Paused/Finished)
- Start/pause control with automatic progression between rounds
- Program panel (planned horses) and Results panel (placements by round)
- Horse roster with randomized condition scores and color identities
- Unit + E2E coverage for core flows

## Tech Stack
- Vue 2.7 + Vuex 3
- Vue CLI, SCSS
- Jest (unit/integration), Cypress (E2E)

## Getting Started
Prerequisites: Node.js (LTS recommended), npm

```bash
npm install
npm run serve
```

App runs at `http://localhost:8080`.

## Scripts
```bash
npm run serve       # dev server
npm run build       # production build
npm run lint        # lint
npm run format      # prettier
npm run test:unit   # Jest unit tests
npm run test:e2e    # Cypress headless
npm run test:e2e:open
```

## Project Structure
```text
src/
  components/       # UI building blocks (track, panels, header)
  store/            # Vuex state + race simulation logic
  utils/            # formatting and random helpers
tests/              # Jest unit/integration tests
cypress/            # Cypress E2E tests
```
