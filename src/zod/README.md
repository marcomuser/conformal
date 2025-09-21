# Zod Utilities

## Field Schemas

Conformal's field schemas are preprocessing wrappers that handle common form input patterns automatically. They convert empty strings to `undefined`, coerce string inputs to appropriate types (numbers, dates, booleans), and handle file uploads. They're fully compatible with Zod and can be mixed with regular Zod schemas.

```typescript
import * as zf from "conformal/zod";

const formSchema = zf.object({
  name: zf.string().optional(),
  email: zf.email(),
  age: zf.number().min(13, "Must be at least 13 years old"),
  hobbies: zf.array(zf.string()),
  birthDate: zf.date(),
  acceptTerms: zf.boolean(),
  profilePicture: zf.file(),
  accountType: zf.enum(["personal", "business"]),
  website: zf.url().optional(),
  transactionAmount: zf.bigint(),
});
```
