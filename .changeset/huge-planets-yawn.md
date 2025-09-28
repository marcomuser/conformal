---
"conformal": minor
---

Add coerce functions

- Add `coerceString`, `coerceNumber`, `coerceBigint`, `coerceBoolean`, `coerceDate`, `coerceFile`, `coerceArray` functions
- These utilities help convert form input values to their expected types
- Essential for building custom schema implementations (like zod preproccessors or valibot transforms)
