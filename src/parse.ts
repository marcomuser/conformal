import type { StandardSchemaV1 } from "@standard-schema/spec";
import type { UnknownRecord } from "type-fest";
import { setPath } from "./path.js";
import { toSubmission } from "./submission.js";
import type { AnyRecord, InputValue, SchemaResult } from "./types.js";

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
export function parse<FormValues = UnknownRecord>(
  formData: FormData,
): InputValue<FormValues> {
  let formValues: AnyRecord = {};
  const keys = new Set(formData.keys());

  for (const key of keys) {
    const allVal = formData.getAll(key);
    const val = allVal.length > 1 ? allVal : allVal.at(0);
    formValues = setPath(formValues, key, val);
  }

  return formValues as InputValue<FormValues>;
}

/**
 * Parses a `FormData` object into a structured object with typed values and validates it against a schema.
 *
 * @param schema A schema object that implements the Standard Schema specification.
 * @param formData A `FormData` object to parse and validate.
 * @returns A `SchemaResult` object that extends the standard schema validation result with a `submission()` method.
 *          The `submission()` method returns a `Submission` object that provides a consistent interface for handling
 *          both successful and failed validation results.
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
 * const submission = result.submission();
 *
 * if (submission.status === 'success') {
 *   console.log(submission.value); // { name: 'John Doe', age: 30, hobbies: ['Music', 'Coding'] }
 *   console.log(submission.input); // Raw parsed form data
 * } else {
 *   console.log(submission.fieldErrors); // Field-specific validation errors
 *   console.log(submission.formErrors); // Form-level validation errors
 *   console.log(submission.input); // Raw parsed form data
 * }
 * ```
 */
export function parseWithSchema<T extends StandardSchemaV1>(
  schema: T,
  formData: FormData,
): SchemaResult<T> {
  const input = parse<StandardSchemaV1.InferOutput<T>>(formData);
  const result = schema["~standard"].validate(input);

  if (result instanceof Promise) {
    throw new TypeError("Schema validation must be synchronous");
  }

  return {
    ...result,
    submission() {
      return toSubmission<StandardSchemaV1.InferOutput<T>>(input, result);
    },
  };
}
