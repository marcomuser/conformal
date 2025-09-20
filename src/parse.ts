import type { StandardSchemaV1 } from "@standard-schema/spec";
import { decode } from "./decode.js";
import { toSubmission } from "./submission.js";
import type { SchemaResult } from "./types.js";

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
  const input = decode<StandardSchemaV1.InferOutput<T>>(formData);
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
