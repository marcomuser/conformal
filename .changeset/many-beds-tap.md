---
"conformal": minor
---

Deprecate zod utilities

- Mark `conformal/zod` utilities as deprecated
- Zod's `z.preprocess` returns a `ZodPipe` which doesn't allow method chaining, making these utilities less useful than expected
- Zod utilities will be removed in the next major release
- Users can migrate to using z.preprocess with the new coerce functions directly:

```typescript
import * as z from "zod";
import { coerceNumber } from "conformal";

z.preprocess(coerceNumber, z.number().min(5));
```
