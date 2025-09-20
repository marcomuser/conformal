import type { StandardSchemaV1 } from "@standard-schema/spec";
import { decode } from "./decode.js";
import { toSubmission } from "./submission.js";
import type { SchemaResult } from "./types.js";

/**
 * Parses and validates FormData against a schema.
 *
 * @param schema A Standard Schema object.
 * @param formData FormData to parse and validate.
 * @returns A Standard Schema Result with a `submission()` method.
 *
 * @example
 * ```ts
 * const result = parseFormData(schema, formData);
 * const submission = result.submission();
 *
 * if (submission.status === 'success') {
 *   console.log(submission.value); // Validated data
 * } else {
 *   console.log(submission.fieldErrors); // Validation errors
 * }
 * ```
 */
export function parseFormData<T extends StandardSchemaV1>(
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
