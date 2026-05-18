# create-neutralinojs-vite-app

> Scaffold a Neutralinojs + Vite + React app with one command.

Neutralinojs is a lightweight alternative to Electron — no bundled browser engine, uses the OS native WebView. This tool gives you a production-ready starting point with React + Vite, pre-configured HMR, and the Neutralinojs native API wired up and ready to use.

## Usage

```bash
npx create-neutralinojs-vite-app my-app
```

Or pass no arguments for interactive mode:

```bash
npx create-neutralinojs-vite-app
```

## What you get

- ⚡ **Vite** — instant HMR, fast builds
- ⚛️ **React 18** — with JS or TypeScript
- 🖥️ **Neutralinojs** — pre-configured `neutralino.config.json` pointed at Vite dev server (`localhost:5173`)
- 🎨 **Prettier** — baked into every template
- 📦 **concurrently** — `npm run dev` starts Vite and Neutralinojs together

## After scaffolding

```bash
cd my-app
npm install
npm run neu:update   # downloads Neutralinojs binaries
npm run dev          # starts Vite + Neutralinojs
```

## Templates

| Template | Command |
|----------|---------|
| React + Vite + JavaScript | `npx create-neutralinojs-vite-app` → No TypeScript |
| React + Vite + TypeScript | `npx create-neutralinojs-vite-app` → Yes TypeScript |

## Why this exists

Setting up Neutralinojs with Vite manually requires configuring `neutralino.config.json` to point at the Vite dev server, resolving port conflicts, and wiring up `@neutralinojs/lib`. This tool does all of that for you.

## Requirements

- Node.js 18+
- [Neutralinojs CLI](https://neutralino.js.org/docs/getting-started/your-first-neutralinojs-app) (`npm i -g @neutralinojs/neu`)

## License

MIT — [Ankit Mohanty](https://github.com/Ankit-Mohanty-23)
