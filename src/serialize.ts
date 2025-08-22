import type { UnknownRecord } from "type-fest";
import type { SerializedValue } from "./types.js";

/**
 * Serializes a value for use in the default value or checked attribute of input elements.
 * This function handles the necessary transformation whenever possible. Otherwise, it will return the value as is.
 *
 * @param value The value to serialize.
 * @returns The serialized value.
 *
 * @example
 * ```ts
 * serialize(123); // Returns "123"
 * serialize(true); // Returns true
 * serialize(new Date()) // Returns "2025-01-17T17:04:25.059Z"
 * serialize(null); // Returns undefined
 * serialize({username: "test", age: 100}) // Returns {username: "test", age: "100"}
 * ```
 */
export function serialize<T>(value: T): SerializedValue<T> {
  if (value === null) {
    return undefined as SerializedValue<T>;
  }

  if (Array.isArray(value)) {
    return value.map((item) => serialize(item)) as SerializedValue<T>;
  }

  if (isPlainObject(value)) {
    const result: UnknownRecord = {};
    for (const key of Object.keys(value)) {
      if (Object.hasOwn(value, key)) {
        result[key] = serialize((value as UnknownRecord)[key]);
      }
    }
    return result as SerializedValue<T>;
  }

  if (typeof value === "number" || typeof value === "bigint") {
    return value.toString() as SerializedValue<T>;
  }

  if (value instanceof Date) {
    return value.toISOString() as SerializedValue<T>;
  }

  return value as SerializedValue<T>;
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
