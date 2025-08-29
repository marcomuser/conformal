# Conformal

Conformal is a TypeScript library designed to simplify the handling of form data and object manipulation in web applications. It provides utilities for parsing `FormData` into structured objects, validating them against schemas, and serializing values for use in HTML forms. The library also exports useful types like `Submission` and `PathsFromObject` for advanced use cases. This library is ideal for developers who need a robust solution for managing form data in a type-safe manner.

### Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [parseWithSchema](#parsewithschema)
  - [Submission](#submission)
  - [parse](#parse)
  - [serialize](#serialize)
  - [getPath](#getpath)
  - [setPath](#setpath)
  - [PathsFromObject](#pathsfromobject)
- [Example: React Server Actions](#example-react-server-actions)
- [License](#license)

## Features

### 🚀 **End-to-End Form Data Management**

Conformal streamlines the way you handle `FormData` by providing a complete solution from parsing to validation to error handling. Never deal with untyped form data again!

### 🔒 **Type Safety Without Compromise**

- **Zero Runtime Type Errors**: Parse `FormData` into fully typed objects with automatic TypeScript inference
- **Schema-First Validation**: Integrate seamlessly with Zod, Valibot, or any Standard Schema implementation
- **Compile-Time Guarantees**: Catch form structure issues before they reach production

### 🎯 **Flexible Form Data Parsing**

- **Smart Notation Support**: Handle complex nested structures with dot notation (`user.profile.name`) and bracket notation (`items[0].type`)
- **Automatic Type Coercion**: Convert form strings to numbers, booleans, and dates automatically
- **Array Handling**: Seamlessly parse duplicate keys into arrays and handle sparse array indices

### 🛡️ **Straightforward Error Handling**

- **Never Lose User Input**: The submission pattern preserves all form data, even when validation fails
- **Granular Error Control**: Separate field-specific errors from form-level errors for precise UI feedback
- **Progressive Enhancement**: Build better error handling without breaking existing functionality

### ⚡ **Performance & Developer Experience**

- **Tree-Shakable**: Only import what you need
- **Universal**: Works in browsers, Node.js, and edge runtimes
- **Framework Agnostic**: Use with React, Vue, Svelte, or vanilla JavaScript

## Installation

Install Conformal via npm or the package manager of your choice:

```bash
npm install conformal
```

## Usage

### parseWithSchema

The `parseWithSchema` function parses and validates [FormData](https://developer.mozilla.org/docs/Web/API/FormData) against a [Standard Schema](https://standardschema.dev). It internally uses the [parse](#parse) function to first convert the `FormData` into a structured object before applying schema validation.

```html
<body>
  <form id="userForm">
    <input type="text" name="name" placeholder="Name" />
    <input type="number" name="age" placeholder="Age" />
    <input type="text" name="hobbies" placeholder="Hobby 1" />
    <input type="text" name="hobbies" placeholder="Hobby 2" />
    <button type="submit">Submit</button>
  </form>

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

The `Submission` type represents the result of form validation and provides a discriminated union interface for handling both successful and failed validation results. This is the type that the `submission()` method returns from `parseWithSchema`, making it easy to handle form validation outcomes in a type-safe way.

```typescript
import type { Submission } from "conformal";

// The Submission type is a discriminated union with two variants:
type SubmissionExample<Output> =
  | {
      /** The outcome of the last submission */
      readonly status: "success";
      /** The typed output value. Only present if `status === "success"` */
      readonly value: Output;
      /** The raw user input as submitted */
      readonly input: PartialDeep<ParsedValue<Output>>;
      /** Field-specific validation errors */
      readonly fieldErrors: Partial<Record<PathsFromObject<Output>, string[]>>;
      /** Form-level validation errors */
      readonly formErrors: ReadonlyArray<string>;
    }
  | {
      /** The outcome of the last submission */
      readonly status: "idle" | "error";
      /** The typed output value. Only present if `status === "success"` */
      readonly value?: undefined;
      /** The raw user input as submitted */
      readonly input: PartialDeep<ParsedValue<Output>>;
      /** Field-specific validation errors */
      readonly fieldErrors: Partial<Record<PathsFromObject<Output>, string[]>>;
      /** Form-level validation errors */
      readonly formErrors: ReadonlyArray<string>;
    };
```

**Key Benefits:**

- **Discriminated Union**: Type-safe handling with `status` as the discriminator
- **Generic Type Support**: `Submission<Output>` provides full type inference for your data
- **Data Preservation**: Raw input is always available, even on validation failure
- **Granular Error Handling**: Separate field and form-level errors for precise UI feedback
- **Readonly Properties**: Immutable structure prevents accidental mutations
- **Type Safety**: Full TypeScript support with automatic inference and compile-time guarantees

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

## Example: React Server Actions

Handling form data in React applications often involves dealing with untyped `FormData` objects, which can lead to runtime errors and cumbersome data handling. Here's a simple example of a React action without type safety:

```tsx
async function submitAction(formData) {
  "use server";
  const name = formData.get("name"); // File | string | null
  const age = formData.get("age"); // File | string | null
  console.log({ name, age });
}

export function Form() {
  return (
    <form action={submitAction}>
      <input name="name" />
      <input name="age" />
      <button type="submit">Submit</button>
    </form>
  );
}
```

By introducing `parseWithSchema`, you can ensure that the form data is parsed and validated against a schema, ensuring that form data adheres to expected types and structures:

```tsx
import { parseWithSchema } from "conformal";
import * as z from "zod";

const schema = z.object({
  name: z.string(),
  age: z.coerce.number(),
});

async function submitAction(formData) {
  "use server";
  const submission = parseWithSchema(schema, formData).submission();

  if (submission.status !== "success") {
    return submission;
  }

  const name = submission.value.name; // string
  const age = submission.value.age; // number
  console.log({ name, age });
}

export function Form() {
  return (
    <form action={submitAction}>
      <input name="name" />
      <input name="age" />
      <button type="submit">Submit</button>
    </form>
  );
}
```

**Key Benefits of the Submission Pattern:**

- **Form Preservation**: The submission object contains raw user input (`submission.input`) to prevent data loss when validation fails
- **Targeted Error Display**: Field-specific validation errors (`submission.fieldErrors`) allow you to show errors next to specific form fields
- **Form-Level Feedback**: General validation errors (`submission.formErrors`) can be displayed as summary messages

## License

Conformal is licensed under the MIT License.
