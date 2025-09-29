# Valibot Utilities

> ⚠️ **Experimental**: These utilities are still in development and may change.

The Valibot Utilities are provided under the `conformal/valibot` subpath. Valibot is an optional peer dependency, so you can freely choose another Standard Schema library if you prefer without depending on Valibot.

## Coercion Pipes

These coercion pipes handle the conversion from form input values to rich JS types. They convert empty strings to `undefined`, coerce string inputs to appropriate types (numbers, dates, booleans), and handle `File` objects. They're composable pipes that can be combined with any valibot validation schema using `v.pipe()`.

For concrete reference of coercion rules, refer to the [Coerce Functions](../README.md#coerce-functions) documentation.

```typescript
import * as vf from "conformal/valibot";
import * as v from "valibot";

v.object({
  name: v.pipe(vf.coerceString(), v.string()),
  email: v.pipe(vf.coerceString(), v.string(), v.email()),
  age: v.pipe(vf.coerceNumber(), v.number(), v.minValue(16)),
  hobbies: v.pipe(
    vf.coerceArray(),
    v.array(v.pipe(vf.coerceString(), v.string())),
  ),
  birthDate: v.pipe(vf.coerceDate(), v.date()),
  acceptTerms: v.pipe(vf.coerceBoolean(), v.boolean()),
  profilePicture: v.pipe(vf.coerceFile(), v.file()),
  transactionAmount: v.pipe(vf.coerceBigint(), v.bigint()),
});
```
