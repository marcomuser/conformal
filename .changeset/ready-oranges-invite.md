---
"conformal": minor
---

Enhance zod field schemas with array support and improved error handling

- Add `zf.array()` with FormData-friendly preprocessing for multiselect/multicheckbox handling (single values become single-item arrays, multiple values stay arrays, empty strings become empty arrays)
- Improve `zf.bigint()` with try-catch for graceful error handling to avoid runtime exceptions
- Improve `zf.date()` with invalid date detection
- Export `zf.object()` for convenient access alongside other zod field schemas
