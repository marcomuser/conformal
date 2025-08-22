import type { UnknownRecord } from "type-fest";
import { setPath } from "./path.js";
import type { AnyRecord, ParsedValue } from "./types.js";

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
