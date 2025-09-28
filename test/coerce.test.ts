import { describe, it, expect } from "vitest";
import {
  coerceString,
  coerceNumber,
  coerceBigint,
  coerceBoolean,
  coerceDate,
  coerceFile,
  coerceArray,
} from "../src/coerce.js";

describe("coerce functions", () => {
  describe("coerceString", () => {
    it("should return undefined for empty strings", () => {
      expect(coerceString("")).toBeUndefined();
    });

    it("should pass through non-string values unchanged", () => {
      expect(coerceString(123)).toBe(123);
      expect(coerceString(null)).toBe(null);
      expect(coerceString(undefined)).toBe(undefined);
    });

    it("should return non-empty strings as-is", () => {
      expect(coerceString("hello")).toBe("hello");
      expect(coerceString(" ")).toBe(" ");
    });
  });

  describe("coerceNumber", () => {
    it("should return undefined for empty strings", () => {
      expect(coerceNumber("")).toBeUndefined();
    });

    it("should return undefined for whitespace-only strings", () => {
      expect(coerceNumber(" ")).toBeUndefined();
    });

    it("should pass through non-string values unchanged", () => {
      expect(coerceNumber(42)).toBe(42);
      expect(coerceNumber(null)).toBe(null);
    });

    it("should convert valid number strings", () => {
      expect(coerceNumber("42")).toBe(42);
      expect(coerceNumber("3.14")).toBe(3.14);
      expect(coerceNumber("-10")).toBe(-10);
    });

    it("should return original string for invalid bigint strings", () => {
      expect(coerceNumber("abc")).toBe("abc");
      expect(coerceNumber("12.34.56")).toBe("12.34.56");
    });
  });

  describe("coerceBigint", () => {
    it("should return undefined for empty strings", () => {
      expect(coerceBigint("")).toBeUndefined();
    });

    it("should return undefined for whitespace-only strings", () => {
      expect(coerceBigint(" ")).toBeUndefined();
    });

    it("should pass through non-string values unchanged", () => {
      expect(coerceBigint(42n)).toBe(42n);
      expect(coerceBigint(null)).toBe(null);
    });

    it("should convert valid bigint strings", () => {
      expect(coerceBigint("42")).toBe(42n);
      expect(coerceBigint("9007199254740991")).toBe(9007199254740991n);
    });

    it("should return original string for invalid bigint strings", () => {
      expect(coerceBigint("abc")).toBe("abc");
      expect(coerceBigint("12.34")).toBe("12.34");
    });
  });

  describe("coerceBoolean", () => {
    it("should return undefined for empty strings", () => {
      expect(coerceBoolean("")).toBeUndefined();
    });

    it("should pass through non-string values unchanged", () => {
      expect(coerceBoolean(true)).toBe(true);
      expect(coerceBoolean(false)).toBe(false);
      expect(coerceBoolean(null)).toBe(null);
    });

    it("should convert truthy strings to true", () => {
      expect(coerceBoolean("true")).toBe(true);
      expect(coerceBoolean("on")).toBe(true);
      expect(coerceBoolean("1")).toBe(true);
      expect(coerceBoolean("yes")).toBe(true);
    });

    it("should convert falsy strings to false", () => {
      expect(coerceBoolean("false")).toBe(false);
      expect(coerceBoolean("off")).toBe(false);
      expect(coerceBoolean("0")).toBe(false);
      expect(coerceBoolean("no")).toBe(false);
    });

    it("should return original string for unrecognized values", () => {
      expect(coerceBoolean("maybe")).toBe("maybe");
      expect(coerceBoolean("unknown")).toBe("unknown");
    });
  });

  describe("coerceDate", () => {
    it("should return undefined for empty strings", () => {
      expect(coerceDate("")).toBeUndefined();
    });

    it("should pass through non-string values unchanged", () => {
      const date = new Date();
      expect(coerceDate(date)).toBe(date);
      expect(coerceDate(null)).toBe(null);
    });

    it("should convert valid date strings", () => {
      const result = coerceDate("2023-01-01");
      expect(result).toBeInstanceOf(Date);
      expect((result as Date).getFullYear()).toBe(2023);
    });

    it("should return original string for invalid date strings", () => {
      expect(coerceDate("invalid-date")).toBe("invalid-date");
      expect(coerceDate("32/13/2023")).toBe("32/13/2023");
    });
  });

  describe("coerceFile", () => {
    it("should return undefined for empty files", () => {
      const emptyFile = new File([], "test.txt");
      expect(coerceFile(emptyFile)).toBeUndefined();
    });

    it("should pass through non-File values unchanged", () => {
      expect(coerceFile("not-a-file")).toBe("not-a-file");
      expect(coerceFile(null)).toBe(null);
    });

    it("should return non-empty files as-is", () => {
      const file = new File(["content"], "test.txt");
      expect(coerceFile(file)).toBe(file);
    });
  });

  describe("coerceArray", () => {
    it("should return empty array for empty strings", () => {
      expect(coerceArray("")).toEqual([]);
    });

    it("should pass through arrays unchanged", () => {
      const arr = [1, 2, 3];
      expect(coerceArray(arr)).toBe(arr);
    });

    it("should wrap non-arrays in an array", () => {
      expect(coerceArray("hello")).toEqual(["hello"]);
      expect(coerceArray(42)).toEqual([42]);
      expect(coerceArray(null)).toEqual([null]);
    });
  });
});
