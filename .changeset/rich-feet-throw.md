---
"conformal": minor
---

Add valibot schemas

- Add `conformal/valibot` subpath with valibot utilities
- Provides `string`, `number`, `boolean`, `date`, `bigint`, `picklist`, `file`, `array` schemas
- Uses conformal's coerce functions for automatic form input preprocessing
- Fully compatible with valibot and can be mixed with regular valibot schemas
- Marked as experimental - API may change
