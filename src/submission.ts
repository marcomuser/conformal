import type { StandardSchemaV1 } from "@standard-schema/spec";
import type { InputValue, Submission } from "./types.js";
import type { PartialDeep, UnknownRecord } from "type-fest";

export function toSubmission<Output>(
  input: UnknownRecord,
  result: StandardSchemaV1.Result<Output>,
): Submission<Output> {
  const { formErrors, fieldErrors } = getFormErrors(result.issues);

  return result.issues
    ? {
        status: "error",
        value: undefined,
        input: input as PartialDeep<InputValue<Output>>,
        formErrors,
        fieldErrors,
      }
    : {
        status: "success",
        value: result.value,
        input: input as PartialDeep<InputValue<Output>>,
        formErrors,
        fieldErrors,
      };
}

export function getFormErrors(issues?: ReadonlyArray<StandardSchemaV1.Issue>) {
  const formErrors: string[] = [];
  const fieldErrors: Record<string, string[]> = {};

  if (issues) {
    for (const issue of issues) {
      const fieldPath = getFieldPath(issue);
      if (fieldPath) {
        if (fieldErrors[fieldPath]) {
          fieldErrors[fieldPath].push(issue.message);
        } else {
          fieldErrors[fieldPath] = [issue.message];
        }
      } else {
        formErrors.push(issue.message);
      }
    }
  }

  return { formErrors, fieldErrors };
}

export function getFieldPath(issue: StandardSchemaV1.Issue): string | null {
  if (issue.path?.length) {
    let fieldPath = "";
    for (const item of issue.path) {
      const key = typeof item === "object" ? item.key : item;
      if (typeof key === "string" || typeof key === "number") {
        if (fieldPath) {
          // Check if it's a valid array index (number or numeric string)
          if (
            typeof key === "number" ||
            (typeof key === "string" && /^\d+$/.test(key))
          ) {
            fieldPath += `[${key}]`;
          } else {
            fieldPath += `.${key}`;
          }
        } else {
          fieldPath += key;
        }
      } else {
        return null;
      }
    }
    return fieldPath;
  }
  return null;
}
