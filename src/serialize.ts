import type { UnknownRecord } from "type-fest";
import type { InputValue } from "./types.js";

export interface SerializeOptions {
  /** The string value to use for boolean `true`.
   * @default "on"
   */
  booleanTrueValue?: "true" | "on" | "1" | "yes";

  /** The string value to use for boolean `false`.
   * @default "off"
   */
  booleanFalseValue?: "false" | "off" | "0" | "no";
}

/**
 * Serializes a fully typed value back to the InputValue shape for use in form elements.
 * This function transforms validated data (like from `submission.value`)
 * back into the format suitable for HTML form default values and checked attributes.
 *
 * @param value The value to serialize.
 * @param options Configuration for serialization behavior.
 * @returns The serialized value.
 *
 * @example
 * ```ts
 * serialize(123); // Returns "123"
 * serialize(true); // Returns "on"
 * serialize(false); // Returns "off"
 * serialize(new Date()) // Returns "2025-01-17T17:04:25.059Z"
 * serialize({username: "test", age: 100}) // Returns {username: "test", age: "100"}
 * ```
 */
export function serialize<T>(
  value: T,
  options: SerializeOptions = {},
): InputValue<T> {
  const { booleanTrueValue = "on", booleanFalseValue = "off" } = options;

  if (Array.isArray(value)) {
    return value.map((item) => serialize(item, options)) as InputValue<T>;
  }

  if (isPlainObject(value)) {
    const result: UnknownRecord = {};
    for (const key of Object.keys(value)) {
      if (Object.hasOwn(value, key)) {
        result[key] = serialize((value as UnknownRecord)[key], options);
      }
    }
    return result as InputValue<T>;
  }

  if (typeof value === "number" || typeof value === "bigint") {
    return value.toString() as InputValue<T>;
  }

  if (typeof value === "boolean") {
    return (value ? booleanTrueValue : booleanFalseValue) as InputValue<T>;
  }

  if (value instanceof Date) {
    return value.toISOString() as InputValue<T>;
  }

  return value as InputValue<T>;
}

function isPlainObject(value: unknown): value is UnknownRecord {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  return (
    value.constructor === Object &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}
