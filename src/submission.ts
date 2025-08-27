import type { StandardSchemaV1 } from "@standard-schema/spec";
import type { ParsedValue, Submission } from "./types.js";
import type { UnknownRecord } from "type-fest";

export function toSubmission<Output>(
  input: UnknownRecord,
  result: StandardSchemaV1.Result<Output>,
): Submission<ParsedValue<Output>, Output> {
  return {
    input: input as ParsedValue<Output>,
    value: result.issues ? undefined : result.value,
  };
}
