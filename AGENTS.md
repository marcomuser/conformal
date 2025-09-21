# Conformal — AGENTS.md

Agent-focused notes for safe, fast contributions. Format reference: [agents.md](https://agents.md/).

## Setup

```bash
npm i
npm run typecheck
npm run test
```

Examples:

```bash
cd examples/react && npm i && npm run dev
cd examples/svelte && npm i && npm run dev
```

## Public API

- `conformal`: `getPath`, `setPath`, `decode`, `parseFormData`, `serialize`; types: `PathsFromObject`, `Submission`
- `conformal/zod`: `string`, `number`, `boolean`, `date`, `bigint`, `enum`, `file`, `url`, `email`, `object`, `array`

Exports live in `src/index.ts` and `src/zod/index.ts`.

## Non‑negotiable invariants

- `parseFormData` is synchronous; throw `TypeError("Schema validation must be synchronous")` if schema returns a Promise.
- `setPath`/`getPath` are immutable and prototype‑safe (block `__proto__`, `constructor.prototype`); support nested arrays/objects and sparse indices.
- `Submission` always includes `input`; separate `fieldErrors` (dot/bracket paths, numeric indices in brackets) from `formErrors`.
- `serialize`: number/bigint → `.toString()`, boolean → `"on"`/`""` (configurable), `Date` → ISO via `.toISOString()`.
- Types `InputValue<T>` and `PathsFromObject<T>` must remain correct for nested structures and browser types.

## Code style

- TypeScript strict mode (see `tsconfig.json` flags).
- ESM-only, isomorphic runtime (no Node-only APIs).
- Prettier formatting: `npm run format:write`.
- Keep runtime deps minimal; `zod` is an optional peer dependency.

## Build & test

```bash
# Fast local CI
npm run format:check && npm run typecheck && npm run test

# Focus tests
npx vitest run -t "<name>"      # by test name
npx vitest run test/parse.test.ts
```

## Quick playbooks

- Add a Zod helper: edit `src/zod/schemas.ts`, re-export in `src/zod/index.ts`, add tests in `test/zod/`, update README's Zod section.
- Fix path bug: add failing test in `test/path.test.ts`, update `src/path.ts` (immutability + guards), run full checks.
- Public API change: update `src/index.ts`, tests, README; keep exports stable.
