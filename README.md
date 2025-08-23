# Conformal

Conformal is a TypeScript library designed to simplify the handling of form data and object manipulation in web applications. It provides utilities for parsing `FormData` into structured objects, validating them against schemas, and serializing values for use in HTML forms. This library is ideal for developers who need a robust solution for managing form data in a type-safe manner.

## Features

- **Parse FormData**: Convert `FormData` into structured objects with typed values.
- **Schema Validation**: Validate parsed data against a schema using `parseWithSchema`.
- **Path Utilities**: Get and set deep values in objects using dot and bracket notation.
- **Serialization**: Serialize values for use in HTML form elements.

## Installation

Install Conformal via npm or the package manager of your choice:

```bash
npm install conformal
```

## Usage

### Parsing with Standard Schema

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
    import { z } from "zod";

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

      if (result.success) {
        console.log(result.value); // Successful result value
      } else {
        console.log(result.issues); // Validation errors
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

### Parsing FormData

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

### Serialization

The `serialize` function transforms values for use in HTML form elements.

```typescript
import { serialize } from "conformal";

console.log(serialize(123)); // "123"
console.log(serialize(true)); // true
console.log(serialize(new Date())); // "2025-01-17T17:04:25.059Z"
console.log(serialize(null)); // undefined
console.log(serialize({ username: "test", age: 100 })); // { username: "test", age: "100" }
```

### Path Utilities

#### Get Path

Retrieve a value from an object using a path.

```typescript
import { getPath } from "conformal";

const value = getPath({ a: { b: { c: ["hey", "Hi!"] } } }, "a.b.c[1]");
// Returns 'Hi!'
```

#### Set Path

Set a value in an object using a path.

```typescript
import { setPath } from "conformal";

const newObj = setPath({ a: { b: { c: [] } } }, "a.b.c[1]", "hey");
// Returns { a: { b: { c: [<empty>, 'hey'] } } }
```

## License

Conformal is licensed under the MIT License.
