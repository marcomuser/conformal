# Valibot Utilities

> ⚠️ **Experimental**: These utilities are still in development and may change.

The Valibot Utilities are provided under the `conformal/valibot` subpath. Valibot is an optional peer dependency, so you can freely choose another Standard Schema library if you prefer without depending on Valibot.

## Field Schemas

Conformal's field schemas are preprocessing wrappers that handle common form input patterns automatically. They convert empty strings to `undefined`, coerce string inputs to appropriate types (numbers, dates, booleans), and handle `File` objects. They're fully compatible with Valibot and can be mixed with regular Valibot schemas.

```typescript
import * as vf from "conformal/valibot";
import * as v from "valibot";

v.object({
  name: v.optional(vf.string()),
  email: v.pipe(vf.string(), v.email()),
  age: v.pipe(vf.number(), v.minValue(16)),
  hobbies: vf.array(vf.string()),
  birthDate: vf.date(),
  acceptTerms: vf.boolean(),
  profilePicture: vf.file(),
  accountType: vf.picklist(["personal", "business"]),
  website: v.optional(v.pipe(vf.string(), v.url())),
  transactionAmount: vf.bigint(),
});
```
