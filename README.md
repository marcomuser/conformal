# Conformal

> Type-safe form submissions for the modern web.

Conformal helps you work with native [`FormData`](https://developer.mozilla.org/docs/Web/API/FormData). It solves two major pain points:

- ✅ **Strongly typed FormData parsing** – Turn native `FormData` into real objects with full TypeScript inference (nested objects and arrays with dot/bracket notation).
- ✅ **Canonical submission flow** – A single `Submission` object that preserves raw input, separates field vs. form errors, and standardizes the success/error states.

Works everywhere: In browsers, Node.js, and edge runtimes with React, Vue, Svelte, or vanilla JavaScript.

### Table of Contents

- [Getting Started](#getting-started)
- [Live Examples](#live-examples)
- [API Reference](#api-reference)
- [License](#license)

## Getting Started

Install Conformal via npm or the package manager of your choice:

```bash
npm install conformal
```

Here's a quick example showing how Conformal handles form validation with a user registration form:

```typescript
import { parseFormData } from "conformal";
import * as z from "zod"; // Tip: Use conformal's coerce functions for form input preprocessing

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email address"),
  age: z.coerce.number().min(18, "Must be at least 18 years old"),
  acceptTerms: z.coerce.boolean(),
});

// In your form action or handler
const result = parseFormData(schema, formData);
const submission = result.submission();

if (submission.status === "success") {
  // submission.value is fully typed: { name: string, email: string, age: number, acceptTerms: boolean }
  console.log("User registered:", submission.value);
} else {
  // submission.fieldErrors contains validation errors: { email: ["Invalid email address"] }
  console.log("Validation errors:", submission.fieldErrors);
  // submission.input preserves the raw user input for re-display
  console.log("User input:", submission.input);
}
```

That's it! Conformal automatically handles FormData parsing, type coercion, and provides a clean submission interface.

## Live Examples

- **React** - Form actions with useActionState: [StackBlitz](https://stackblitz.com/github/marcomuser/conformal/tree/main/examples/react?embed=1&theme=dark&preset=node&file=src/Form.tsx) | [Source](https://github.com/marcomuser/conformal/tree/main/examples/react)

- **SvelteKit** - Server-side form actions: [StackBlitz](https://stackblitz.com/github/marcomuser/conformal/tree/main/examples/svelte?embed=1&theme=dark&preset=node&file=src/routes/%2Bpage.server.ts) | [Source](https://github.com/marcomuser/conformal/tree/main/examples/svelte)

## API Reference

### Core Functions

- **[`parseFormData`](src/README.md#parseformdata)** - Parse FormData with schema validation and get Submission object
- **[`decode`](src/README.md#decode)** - Convert FormData to structured objects (no validation)
- **[`serialize`](src/README.md#serialize)** - Transform typed values back to form-compatible strings
- **[`getPath`](src/README.md#getpath)** - Safely access nested values using dot/bracket notation
- **[`setPath`](src/README.md#setpath)** - Immutably set nested values using dot/bracket notation

### Coerce Functions

- **[`coerceString`](src/README.md#coercestring)** - String handling
- **[`coerceFile`](src/README.md#coercefile)** - File handling
- **[`coerceNumber`](src/README.md#coercenumber)** - String to number coercion
- **[`coerceBigint`](src/README.md#coercebigint)** - String to BigInt coercion
- **[`coerceBoolean`](src/README.md#coerceboolean)** - String to boolean coercion
- **[`coerceDate`](src/README.md#coercedate)** - String to Date coercion
- **[`coerceArray`](src/README.md#coercearray)** - Coerce to array

### Types

- **[`Submission`](src/README.md#submission)** - Standardized submission result with success/error states
- **[`PathsFromObject`](src/README.md#pathsfromobject)** - Type utility to extract all possible object paths

### Valibot Utilities

> ⚠️ **Experimental**: These utilities are still in development and may change.

- **[Valibot Field Schemas](src/valibot/README.md#field-schemas)** - Valibot schemas with automatic form input preprocessing

## License

Conformal is licensed under the MIT License.
