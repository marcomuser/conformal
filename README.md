# Conformal

> Type-safe form submissions for the modern web.

Conformal helps you work with native [`FormData`](https://developer.mozilla.org/docs/Web/API/FormData) the way frameworks are moving: directly. It solves two major pain points:

- ✅ **Strongly typed FormData parsing** – Turn native `FormData` into real objects with full TypeScript inference (nested objects and arrays with dot/bracket notation).
- ✅ **Canonical submission flow** – A single `Submission` object that preserves raw input, separates field vs. form errors, and standardizes the success/error states.

Works everywhere: In browsers, Node.js, and edge runtimes with React, Vue, Svelte, or vanilla JavaScript. No framework lock-in.

### Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [parseWithSchema](#parsewithschema)
  - [Submission](#submission)
  - [parse](#parse)
  - [serialize](#serialize)
  - [getPath](#getpath)
  - [setPath](#setpath)
  - [PathsFromObject](#pathsfromobject)
- [Zod Field Schemas](#zod-field-schemas)
- [Example: React Server Actions](#example-react-server-actions)
- [License](#license)

## Installation

Install Conformal via npm or the package manager of your choice:

```bash
npm install conformal
```

## Usage

### parseWithSchema

The `parseWithSchema` function parses and validates [FormData](https://developer.mozilla.org/docs/Web/API/FormData) against a [Standard Schema](https://standardschema.dev). It internally uses the [parse](#parse) function to first convert the `FormData` into a structured object before applying schema validation.

**🚀 Try it yourself**: This example includes an import map and can be run directly in a browser!

```html
<body>
  <form id="userForm">
    <input type="text" name="name" placeholder="Name" />
    <input type="number" name="age" placeholder="Age" />
    <input type="text" name="hobbies" placeholder="Hobby 1" />
    <input type="text" name="hobbies" placeholder="Hobby 2" />
    <button type="submit">Submit</button>
  </form>

  <script type="importmap">
    {
      "imports": {
        "conformal": "https://cdn.jsdelivr.net/npm/conformal/+esm",
        "zod": "https://cdn.jsdelivr.net/npm/zod/+esm"
      }
    }
  </script>

  <script type="module">
    import { parseWithSchema } from "conformal";
    import * as z from "zod";

    const schema = z.object({
      name: z.string(),
      age: z.coerce.number(),
      hobbies: z.string().array(),
    });

    const form = document.getElementById("userForm");
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const submission = parseWithSchema(schema, formData).submission();

      if (submission.status === "success") {
        console.log(submission.value); // Successful result value
        console.log(submission.input); // Raw parsed form data
      } else {
        console.log(submission.fieldErrors); // Field-specific validation errors
        console.log(submission.formErrors); // Form-level validation errors
        console.log(submission.input); // Raw parsed form data
      }
    });
  </script>
</body>
```

This will result in the following data structure:

```typescript
const value = {
  name: "John Doe",
  age: 30,
  hobbies: ["Music", "Coding"],
};
```

The `parseWithSchema` function returns a `SchemaResult` object that extends the standard schema validation result with a `submission()` method. This method provides a consistent `Submission` object that makes it easy to handle both successful and failed validation results:

```typescript
const submission = parseWithSchema(schema, formData).submission();

if (submission.status === "success") {
  // Access validated data
  const validatedData = submission.value;
  // Access raw parsed form data
  const rawInput = submission.input;
} else {
  // Handle validation errors
  const fieldErrors = submission.fieldErrors; // Field-specific errors
  const formErrors = submission.formErrors; // Form-level errors
  // Access raw parsed form data even on failure
  const rawInput = submission.input;
}
```

### Submission

The `Submission` type represents the result of form validation and provides a clean interface for handling both successful and failed validation results. This is the type that the `submission()` method returns from `parseWithSchema`.

**Properties:**

- **`status`**: A string that tells you the outcome - either `"success"` when validation passes, `"error"` when it fails, or `"idle"` for initial states
- **`value`**: Contains your validated and typed data when `status` is `"success"`. This is `undefined` when there are validation errors
- **`input`**: Always contains the raw user input that was submitted, regardless of validation success or failure. This is useful for preserving user input even when validation fails
- **`fieldErrors`**: An object that maps field names to arrays of error messages. For example, `{ "email": ["Invalid email format"], "age": ["Must be a number"] }`. This is empty when validation succeeds
- **`formErrors`**: An array of form-level validation errors that aren't tied to specific fields. For example, `["Passwords don't match", "Terms must be accepted"]`. This is empty when validation succeeds

**Key Benefits:**

- **Type Safety**: Full TypeScript support with automatic type inference for your data
- **Data Preservation**: Raw input is always available, even on validation failure
- **Granular Error Handling**: Separate field and form-level errors for precise UI feedback
- **Immutable**: All properties are read-only, preventing accidental mutations

### parse

The `parse` function allows you to convert a `FormData` object into a structured object with typed values. It supports both dot notation for nested objects and square bracket notation for arrays. You can mix dot and square bracket notation to create complex structures. The `parse` function allows you to create your own schema validator in cases where `parseWithSchema` does not support your use case.

```typescript
import { parse } from "conformal";

const formData = new FormData();
formData.append("user.name", "John Doe");
formData.append("user.age", "30");
formData.append("user.contacts[0].type", "email");
formData.append("user.contacts[0].value", "john.doe@example.com");
formData.append("user.contacts[1].type", "phone");
formData.append("user.contacts[1].value", "123-456-7890");

const result = parse<{
  user: {
    name: string;
    age: string;
    contacts: { type: string; value: string }[];
  };
}>(formData);
```

This will result in the following data structure:

```typescript
const result = {
  user: {
    name: "John Doe",
    age: "30",
    contacts: [
      { type: "email", value: "john.doe@example.com" },
      { type: "phone", value: "123-456-7890" },
    ],
  },
};
```

### serialize

The `serialize` function transforms values for use in HTML form elements. It is particularly useful for setting default values in form fields, especially when integrating with a backend to pre-fill forms with existing data. By converting various data types into a format suitable for HTML attributes, `serialize` ensures that values are correctly displayed in form elements.

```typescript
import { serialize } from "conformal";

console.log(serialize(123)); // "123"
console.log(serialize(true)); // true
console.log(serialize(new Date())); // "2025-01-17T17:04:25.059Z"
console.log(serialize(null)); // undefined
console.log(serialize({ username: "test", age: 100 })); // { username: "test", age: "100" }
```

### getPath

Retrieve a value from an object using a path. This function is a foundational tool for handling object paths using dot and square bracket notation. It's particularly useful for developers building custom client-side validation libraries or complex data manipulation patterns.

```typescript
import { getPath } from "conformal";

const value = getPath({ a: { b: { c: ["hey", "Hi!"] } } }, "a.b.c[1]");
// Returns 'Hi!'
```

### setPath

Set a value in an object using a path. The `setPath` function is used internally by the `parse` function and provides powerful object manipulation capabilities. **Note**: Creates copies only where needed to preserve immutability, avoiding unnecessary deep copying for better performance.

```typescript
import { setPath } from "conformal";

const newObj = setPath({ a: { b: { c: [] } } }, "a.b.c[1]", "hey");
// Returns { a: { b: { c: [<empty>, 'hey'] } } }
```

### PathsFromObject

Extract all possible paths from an object type while automatically excluding paths that lead to browser-specific built-in types such as Blob, FileList, and Date. This type utility is useful for creating abstractions that enable type-safe access to specific fields within complex form data structures.

```typescript
import type { PathsFromObject } from "conformal";

interface UserForm {
  user: {
    name: string;
    profilePicture: File;
    contacts: { type: string; value: string }[];
  };
}

type Paths = PathsFromObject<UserForm>;
// Paths will be "user" | "user.name" | "user.profilePicture" | "user.contacts" | `user.contacts[${number}]` | `user.contacts[${number}].type` | `user.contacts[${number}].value`
```

## Zod Field Schemas

Conformal provides optional Zod utilities that are **thin preprocessing wrappers** around Zod schemas. They automatically handle form input patterns (empty strings, type coercion, boolean detection) while maintaining **100% Zod compatibility**.

**Zero learning curve** - use them exactly like regular Zod schemas with all methods (`.optional()`, `.array()`, `.min()`, etc.). Import from `conformal/zod` to keep your bundle lean if you don't use Zod.

```typescript
import * as z from "zod";
import * as zf from "conformal/zod";

const formSchema = z.object({
  name: zf.string().optional(),
  email: zf.email(),
  age: zf.number().min(13, "Must be at least 13 years old"),
  birthDate: zf.date(),
  acceptTerms: zf.boolean(),
  profilePicture: zf.file(),
  accountType: zf.enum(["personal", "business"]),
  website: zf.url().optional(),
  transactionAmount: zf.bigint(),
});
```

## Example: React Server Actions

Here's how to get type-safe form data, built-in validation, and complete control over submission state with Conformal:

```tsx
import { useActionState } from "react";
import { parseWithSchema } from "conformal";
import * as z from "zod";
import * as zf from "conformal/zod";

const schema = z.object({
  name: zf.string(),
  age: zf.number(),
});

async function submitAction(formData) {
  "use server";
  const submission = parseWithSchema(schema, formData).submission();

  if (submission.status !== "success") {
    return submission;
  }

  // Type-safe access to validated data
  const { name, age } = submission.value;
  await saveInDb({ name, age });

  // Reset form on successful submission
  return { ...submission, input: {} };
}

export function UserForm() {
  const [submission, formAction] = useActionState(submitAction, {
    status: "idle",
    input: {},
    fieldErrors: {},
    formErrors: [],
  });

  return (
    <form action={formAction}>
      <input
        name="name"
        placeholder="Name"
        defaultValue={submission.input.name}
      />
      {submission.fieldErrors.name && (
        <span>{submission.fieldErrors.name.at(0)}</span>
      )}

      <input
        name="age"
        type="number"
        placeholder="Age"
        defaultValue={submission.input.age}
      />
      {submission.fieldErrors.age && (
        <span>{submission.fieldErrors.age.at(0)}</span>
      )}

      <button type="submit">Submit</button>
    </form>
  );
}
```

**Key Benefits of the Submission Pattern:**

- **Type Safety**: `submission.value` gives you fully typed, validated data when validation succeeds
- **Form Preservation**: `submission.input` preserves raw user input even when validation fails, preventing data loss
- **Granular Error Handling**: `submission.fieldErrors` provides field-specific errors for precise UI feedback
- **Form-Level Validation**: `submission.formErrors` handles cross-field validation and server errors
- **Unified State**: Single `submission` object handles all submission states (idle, success, error) consistently

## License

Conformal is licensed under the MIT License.
