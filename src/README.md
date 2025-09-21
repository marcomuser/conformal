# Core API

## Functions

### parseFormData

The `parseFormData` function parses and validates [FormData](https://developer.mozilla.org/docs/Web/API/FormData) against a [Standard Schema](https://standardschema.dev). It internally uses the [decode](#decode) function to first convert the `FormData` into a structured object before applying schema validation.

```typescript
import { parseFormData } from "conformal";

const result = parseFormData(schema, formData);
const submission = result.submission();

if (submission.status === "success") {
  console.log(submission.value); // Validated data
} else {
  console.log(submission.fieldErrors); // Validation errors
}
```

The `parseFormData` function returns the Standard Schema `Result` extended with a `submission()` method. This method returns a consistent [Submission](#submission) object that makes it easy to handle both successful and failed validation results.

### decode

The `decode` function allows you to convert a `FormData` object into a structured object with typed values. It supports both dot notation for nested objects and square bracket notation for arrays. You can mix dot and square bracket notation to create complex structures. The `decode` function allows you to create your own schema validator in cases where `parseFormData` does not support your use case.

```typescript
import { decode } from "conformal";

const formData = new FormData();
formData.append("user.name", "John Doe");
formData.append("user.age", "30");
formData.append("user.contacts[0].type", "email");
formData.append("user.contacts[0].value", "john.doe@example.com");
formData.append("user.contacts[1].type", "phone");
formData.append("user.contacts[1].value", "123-456-7890");

const result = decode<{
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

The `serialize` function transforms fully typed values back to the `InputValue` shape for use in form elements. This is particularly useful for setting default values in form fields when you have validated data from a previous submission and want to pre-fill forms with existing data from a database.

```typescript
import { serialize } from "conformal";

console.log(serialize(123)); // "123"
console.log(serialize(true)); // "on"
console.log(serialize(new Date())); // "2025-01-17T17:04:25.059Z"
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

Set a value in an object using a path. The `setPath` function is used internally by the `decode` function and provides powerful object manipulation capabilities. **Note**: Creates copies only where needed to preserve immutability, avoiding unnecessary deep copying for better performance.

```typescript
import { setPath } from "conformal";

const newObj = setPath({ a: { b: { c: [] } } }, "a.b.c[1]", "hey");
// Returns { a: { b: { c: [<empty>, 'hey'] } } }
```

## Types

### Submission

The `Submission` type represents the result of form validation and provides a clean interface for handling both successful and failed validation results. This is the shape that the `submission()` method returns:

- **`status`**: A string that tells you the outcome - either `"success"` when validation passes, `"error"` when it fails, or `"idle"` for initial states
- **`value`**: Contains your validated and typed data when `status` is `"success"`. This is `undefined` when there are validation errors
- **`input`**: Always contains the raw user input that was submitted, regardless of validation success or failure. This is useful for preserving user input even when validation fails
- **`fieldErrors`**: An object that maps field names to arrays of error messages. For example, `{ "email": ["Invalid email format"], "age": ["Must be a number"] }`. This is empty when validation succeeds
- **`formErrors`**: An array of form-level validation errors that aren't tied to specific fields. For example, `["Passwords don't match", "Terms must be accepted"]`. This is empty when validation succeeds

```typescript
const submission = parseFormData(schema, formData).submission();

if (submission.status === "success") {
  // Use validated data
  console.log("User created:", submission.value);
  // submission.value is fully typed based on your schema
} else {
  // Handle validation errors
  console.log("Field errors:", submission.fieldErrors);
  console.log("Form errors:", submission.formErrors);
  // submission.input contains the raw user input for re-display
  console.log("User input:", submission.input);
}
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
