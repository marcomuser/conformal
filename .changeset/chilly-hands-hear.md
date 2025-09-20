---
"conformal": major
---

## Breaking Changes

- **Rename `parse` to `decode`**: The `parse` function has been renamed to `decode` to better reflect its purpose of decoding FormData into structured objects. This is a pure data transformation function with no validation.
- **Rename `parseWithSchema` to `parseFormData`**: The `parseWithSchema` function has been renamed to `parseFormData` to be more specific about its input type and purpose. This function parses and validates FormData against a schema.
