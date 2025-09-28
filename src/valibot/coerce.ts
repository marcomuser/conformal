import * as v from "valibot";
import * as coerce from "../coerce.js";

export function coerceString(): v.SchemaWithPipe<
  readonly [v.UnknownSchema, v.TransformAction<unknown, unknown>]
> {
  return v.pipe(v.unknown(), v.transform(coerce.coerceString));
}

export function coerceNumber(): v.SchemaWithPipe<
  readonly [v.UnknownSchema, v.TransformAction<unknown, unknown>]
> {
  return v.pipe(v.unknown(), v.transform(coerce.coerceNumber));
}

export function coerceBigint() {
  return v.pipe(v.unknown(), v.transform(coerce.coerceBigint));
}

export function coerceBoolean(): v.SchemaWithPipe<
  readonly [v.UnknownSchema, v.TransformAction<unknown, unknown>]
> {
  return v.pipe(v.unknown(), v.transform(coerce.coerceBoolean));
}

export function coerceDate(): v.SchemaWithPipe<
  readonly [v.UnknownSchema, v.TransformAction<unknown, unknown>]
> {
  return v.pipe(v.unknown(), v.transform(coerce.coerceDate));
}

export function coerceFile(): v.SchemaWithPipe<
  readonly [v.UnknownSchema, v.TransformAction<unknown, unknown>]
> {
  return v.pipe(v.unknown(), v.transform(coerce.coerceFile));
}

export function coerceArray(): v.SchemaWithPipe<
  readonly [v.UnknownSchema, v.TransformAction<unknown, unknown[]>]
> {
  return v.pipe(v.unknown(), v.transform(coerce.coerceArray));
}
