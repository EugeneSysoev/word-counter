## Purpose

Concise, repo-specific instructions for AI agents to be immediately productive in this codebase.

## Big picture

- This is a small TypeScript CLI tool that counts words in UTF-8 `.txt` files (primarily Russian). The executable entrypoint is `src/index.ts`. The core logic lives in `src/wordCounter.ts` and public shapes are in `src/types.ts`.
- Build output goes to `dist/` (see `tsconfig.json`). The package exposes a CLI via the `bin` field in `package.json` which points to `./dist/index.js`.

## Key files to read first

- `src/index.ts` — CLI argument parsing and user-facing output. Example usage implemented here: `word-counter document.txt` and `word-counter document.txt -t`.
- `src/wordCounter.ts` — core algorithm: synchronous `readFileSync`, `processText` tokenization (lowercases and splits on /[^а-яё-]+/), `EXCLUDED_WORDS` set, frequency map, and `getTopWords`.
- `src/types.ts` — exports `WordCountResult` and `CommandLineOptions` used across the project.
- `package.json` — scripts you can run: `npm run build` (tsc), `npm start` (node dist/index.js), `npm run dev` (tsc && node dist/index.js), `npm run lint` and `npm run lint:fix`.
- `tsconfig.json` — CommonJS target, `rootDir: ./src`, `outDir: ./dist`, `strict: true`.

## Conventions & small-but-important details

- File types: only `.txt` files are intentionally supported — `WordCounter.countWords` throws for non-`.txt` paths. Validate file extension before calling lower-level APIs.
- Tokenization: `processText` uses `.toLowerCase()` and splits on `[^а-яё-]+`. It deliberately preserves `ё` and hyphenated words. When changing tokenization, preserve support for Russian letters and `ё`.
- Stop-words: `EXCLUDED_WORDS` is a Set of common Russian particles. New stop-words should be added to that Set in `src/wordCounter.ts` (keep them lowercase).
- Sync IO: code uses `fs.readFileSync` and throws on failure. Do not convert to async unless you update the caller (`src/index.ts`) to await/handle promises.
- Output shape: `WordCountResult` always contains `totalWords` and optionally `topWords` (array with `{word, count}`); keep compatibility when editing.
- CLI parsing: `src/index.ts` keeps parsing minimal: first non-flag arg = file path; `-t|--top` toggles top words. If you modify flags, update the help text in `displayHelp()`.

## Build / run / debug

- Build: `npm run build` (runs `tsc` and writes to `dist/`).
- Run built CLI: `npm start` (invokes `node dist/index.js`).
- Quick dev run (no watcher): `npm run dev` (rebuild then run). There is no watch script; if you need iterative runs, re-run `npm run dev` after edits.
- Lint: `npm run lint` and `npm run lint:fix` (ESLint configured for TypeScript).

Example: build and run the bundled tool on the included `test.txt`:

```powershell
npm run build
npm start -- test.txt -t
```

## When editing code: checklist for PRs and patches

- If you change any exported types (in `src/types.ts`) update all callers (`src/index.ts`, `src/wordCounter.ts`).
- Maintain the `#!/usr/bin/env node` shebang in `src/index.ts` if you alter the file — the built `dist/index.js` should remain executable when published as a CLI.
- Preserve tokenization behavior for Russian (`ё`) unless intentionally changing language support; document any change in the PR description.
- Keep sync IO behavior unless you intentionally migrate to async: migrating requires changes in `main()` flow and error handling in `src/index.ts`.

## Edge cases and tests to consider (discoverable from code)

- Passing a non-`.txt` file triggers an explicit error; callers rely on that. Add tests for extension checks.
- Empty files should return `totalWords: 0` and no `topWords` unless requested.
- Adding language support: update `processText` regex and `EXCLUDED_WORDS` accordingly.

## Where to look for follow-ups

- No tests are present in the repo — if you add tests, follow the existing `tsconfig.json` settings and add a simple test runner dependency (document install in `package.json`).
- If you add runtime dependencies, update `package.json` and avoid changing build scripts; consumers expect `npm run build` to produce `dist/index.js`.

---

If anything in these notes is unclear or you'd like more examples (unit tests, a watch/dev loop, or CI-ready commands), tell me which area to expand and I will iterate.