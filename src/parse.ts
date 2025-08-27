import type { StandardSchemaV1 } from "@standard-schema/spec";
import type { UnknownRecord } from "type-fest";
import { setPath } from "./path.js";
import type { AnyRecord, ParsedValue, SchemaResult } from "./types.js";

/**
 * Parses a `FormData` object into a structured object with typed values.
 *
 * @param formData A `FormData` object.
 * @returns An object representing the form data, with types derived from the `FormValues` generic.
 *
 * @example
 * ```ts
 * const formData = new FormData();
 * formData.append('name', 'John Doe');
 * formData.append('age', '30');
 * formData.append('hobbies', 'Music');
 * formData.append('hobbies', 'Coding');
 *
 * parse<{ name: string; age: string; hobbies: string[] }>(formData);
 * // Returns { name: 'John Doe', age: '30', hobbies: ['Music', 'Coding'] }
 * ```
 */
export function parse<FormValues extends AnyRecord = UnknownRecord>(
  formData: FormData,
): ParsedValue<FormValues> {
  let formValues: AnyRecord = {};
  const keys = new Set(formData.keys());

  for (const key of keys) {
    const allVal = formData.getAll(key);
    const val = allVal.length > 1 ? allVal : allVal.at(0);
    formValues = setPath(formValues, key, val);
  }

  return formValues as ParsedValue<FormValues>;
}

/**
 * Parses a `FormData` object into a structured object with typed values and validates it against a schema.
 *
 * @param schema A schema object that implements the Standard Schema specification.
 * @param formData A `FormData` object to parse and validate.
 * @returns A result object indicating success or failure, with the validated data on success or validation issues on failure.
 *
 * @example
 * ```ts
 * import * as z from 'zod';
 *
 * const schema = z.object({
 *   name: z.string(),
 *   age: z.coerce.number(),
 *   hobbies: z.string().array(),
 * });
 *
 * const formData = new FormData();
 * formData.append('name', 'John Doe');
 * formData.append('age', '30');
 * formData.append('hobbies', 'Music');
 * formData.append('hobbies', 'Coding');
 *
 * const result = parseWithSchema(schema, formData);
 * if (result.success) {
 *   console.log(result.value); // { name: 'John Doe', age: 30, hobbies: ['Music', 'Coding'] }
 * } else {
 *   console.log(result.issues); // Validation errors
 * }
 * ```
 */
export function parseWithSchema<T extends StandardSchemaV1>(
  schema: T,
  formData: FormData,
): SchemaResult<StandardSchemaV1.InferOutput<T>> {
  const input = parse(formData);
  const result = schema["~standard"].validate(input);

  if (result instanceof Promise) {
    throw new TypeError("Schema validation must be synchronous");
  }

  return result.issues
    ? {
        success: false,
        issues: result.issues,
      }
    : {
        success: true,
        value: result.value,
      };
}
