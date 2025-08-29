# Conformal

Conformal is a TypeScript library designed to simplify the handling of form data and object manipulation in web applications. It provides utilities for parsing `FormData` into structured objects, validating them against schemas, and serializing values for use in HTML forms. This library is ideal for developers who need a robust solution for managing form data in a type-safe manner.

### Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [parseWithSchema](#parsewithschema)
  - [parse](#parse)
  - [serialize](#serialize)
  - [Path Utilities](#path-utilities)
    - [getPath](#getpath)
    - [setPath](#setpath)
    - [PathsFromObject](#pathsfromobject)
- [Example: React Server Actions](#example-react-server-actions)
- [License](#license)

## Features

- **Typed FormData Parsing**: Parse `FormData` into structured objects with typed values, eliminating the need to work with untyped form values.

- **Schema Validation**: Validate parsed data against a schema using `parseWithSchema`. This ensures that your form data adheres to expected structures and types, reducing runtime errors and ensuring data integrity.

- **Serialization**: Transform values for use in HTML form elements, making it easy to set default values from backend data. This feature is ideal for pre-filling forms in editing scenarios.

- **Path Utilities**: Utilize `getPath` and `setPath` to manage deep values in objects using dot and bracket notation. These utilities are essential for developers building custom client-side validation libraries or complex data manipulation patterns.

## Installation

Install Conformal via npm or the package manager of your choice:

```bash
npm install conformal
```

## Usage

### parseWithSchema

The `parseWithSchema` function parses and validates [FormData](https://developer.mozilla.org/docs/Web/API/FormData) against a [Standard Schema](https://standardschema.dev). It internally uses the `parse` function (see below) to first convert the `FormData` into a structured object before applying schema validation.

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
      const result = parseWithSchema(schema, formData);
      const submission = result.submission();

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

```ts
const value = {
  name: "John Doe",
  age: 30,
  hobbies: ["Music", "Coding"],
};
```

The `parseWithSchema` function returns a `SchemaResult` object that extends the standard schema validation result with a `submission()` method. This method provides a consistent `Submission` object that makes it easy to handle both successful and failed validation results:

```ts
const result = parseWithSchema(schema, formData);
const submission = result.submission();

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

The `Submission` object provides a unified interface that includes:

- **`status`**: Either `"success"`, `"error"`, or `"idle"`
- **`value`**: The validated data (only present on success)
- **`input`**: The raw parsed form data (always present)
- **`fieldErrors`**: Field-specific validation errors
- **`formErrors`**: Form-level validation errors

### parse

The `parse` function allows you to convert a `FormData` object into a structured object with typed values. It supports both dot notation for nested objects and square bracket notation for arrays. You can mix dot and square bracket notation to create complex structures. The `parse` function allows you to create your own schema validator in cases where `parseWithSchema` does not support your usecase.

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

```ts
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

### Path Utilities

The path utilities, `getPath` and `setPath`, are foundational tools for handling object paths using dot and square bracket notation. They are particularly useful for developers looking to build custom client-side validation libraries. These functions enshrine the contract for dot and square bracket notation, making them essential for managing complex data structures.

#### getPath

Retrieve a value from an object using a path.

```typescript
import { getPath } from "conformal";

const value = getPath({ a: { b: { c: ["hey", "Hi!"] } } }, "a.b.c[1]");
// Returns 'Hi!'
```

#### setPath

Set a value in an object using a path. The `setPath` function is used internally by the `parse` function.

```typescript
import { setPath } from "conformal";

const newObj = setPath({ a: { b: { c: [] } } }, "a.b.c[1]", "hey");
// Returns { a: { b: { c: [<empty>, 'hey'] } } }
```

#### PathsFromObject

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
