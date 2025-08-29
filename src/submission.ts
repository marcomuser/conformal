import type { StandardSchemaV1 } from "@standard-schema/spec";
import type { ParsedValue, Submission } from "./types.js";
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
        input: input as PartialDeep<ParsedValue<Output>>,
        formErrors,
        fieldErrors,
      }
    : {
        status: "success",
        value: result.value,
        input: input as PartialDeep<ParsedValue<Output>>,
        formErrors,
        fieldErrors,
      };
}

function getFormErrors(issues?: ReadonlyArray<StandardSchemaV1.Issue>) {
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

function getFieldPath(issue: StandardSchemaV1.Issue): string | null {
  if (issue.path?.length) {
    let dotPath = "";
    for (const item of issue.path) {
      const key = typeof item === "object" ? item.key : item;
      if (typeof key === "string" || typeof key === "number") {
        if (dotPath) {
          // For array indices, use bracket notation; for object properties, use dot notation
          if (typeof key === "number") {
            dotPath += `[${key}]`;
          } else {
            dotPath += `.${key}`;
          }
        } else {
          dotPath += key;
        }
      } else {
        return null;
      }
    }
    return dotPath;
  }
  return null;
}
