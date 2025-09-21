# Conformal

> Type-safe form submissions for the modern web.

Conformal helps you work with native [`FormData`](https://developer.mozilla.org/docs/Web/API/FormData) the way frameworks are moving: directly. It solves two major pain points:

- ✅ **Strongly typed FormData parsing** – Turn native `FormData` into real objects with full TypeScript inference (nested objects and arrays with dot/bracket notation).
- ✅ **Canonical submission flow** – A single `Submission` object that preserves raw input, separates field vs. form errors, and standardizes the success/error states.

Works everywhere: In browsers, Node.js, and edge runtimes with React, Vue, Svelte, or vanilla JavaScript.

### Table of Contents

- [Installation](#installation)
- [Live Examples](#live-examples)
- [API Reference](#api-reference)
- [License](#license)

## Installation

Install Conformal via npm or the package manager of your choice:

```bash
npm install conformal
```

## Live Examples

- **React** - Form actions with useActionState: [StackBlitz](https://stackblitz.com/github/marcomuser/conformal/tree/main/examples/react?embed=1&theme=dark&preset=node&file=src/Form.tsx) | [Source](https://github.com/marcomuser/conformal/tree/main/examples/react)

- **SvelteKit** - Server-side form actions: [StackBlitz](https://stackblitz.com/github/marcomuser/conformal/tree/main/examples/svelte?embed=1&theme=dark&preset=node&file=src/routes/%2Bpage.server.ts) | [Source](https://github.com/marcomuser/conformal/tree/main/examples/svelte)

## API Reference

### Core Functions

- **[`parseFormData`](src/README.md#parseformdata)** - Parse and validate FormData
- **[`decode`](src/README.md#decode)** - Convert FormData to objects
- **[`serialize`](src/README.md#serialize)** - Convert values to compatible format for field default values
- **[`getPath`](src/README.md#getpath)** - Access nested object values
- **[`setPath`](src/README.md#setpath)** - Set nested object values

### Types

- **[`Submission`](src/README.md#submission)** - Validation result type
- **[`PathsFromObject`](src/README.md#pathsfromobject)** - Extract paths from types

### Zod Utilities

- **[Zod Field Schemas](src/zod/README.md)** - Pre-configured Zod schemas for forms

## License

Conformal is licensed under the MIT License.
