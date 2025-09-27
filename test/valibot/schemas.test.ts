import { describe, it, expect } from "vitest";
import * as vf from "../../src/valibot/schemas.js";
import * as v from "valibot";

describe("valibot schemas preprocessing", () => {
  describe("string", () => {
    it("should return undefined for empty strings", () => {
      const schema = vf.string();
      const result = v.safeParse(schema, "");
      expect(result.success).toBe(false);
      expect(result.output).toBeUndefined();
    });

    it("should return non-empty strings as-is", () => {
      const schema = vf.string();
      const result = v.safeParse(schema, "hello");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.output).toBe("hello");
      }
    });
  });

  describe("number", () => {
    it("should return undefined for empty strings", () => {
      const schema = vf.number();
      const result = v.safeParse(schema, "");
      expect(result.success).toBe(false);
      expect(result.output).toBeUndefined();
    });

    it("should return undefined for whitespace-only strings", () => {
      const schema = vf.number();
      const result = v.safeParse(schema, " ");
      expect(result.success).toBe(false);
      expect(result.output).toBeUndefined();
    });

    it("should convert string numbers to numbers", () => {
      const schema = vf.number();
      const result = v.safeParse(schema, "123");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.output).toBe(123);
      }
    });

    it("should handle invalid number strings", () => {
      const schema = vf.number();
      const result = v.safeParse(schema, "abc");
      expect(result.success).toBe(false);
      expect(result.output).toBeNaN();
    });
  });

  describe("boolean", () => {
    it("should return undefined for empty strings", () => {
      const schema = vf.boolean();
      const result = v.safeParse(schema, "");
      expect(result.success).toBe(false);
      expect(result.output).toBeUndefined();
    });

    it("should return true for truthy string values", () => {
      const schema = vf.boolean();
      const truthyValues = ["true", "on", "1", "yes"];

      truthyValues.forEach((value) => {
        const result = v.safeParse(schema, value);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.output).toBe(true);
        }
      });
    });

    it("should return false for falsy string values", () => {
      const schema = vf.boolean();
      const falsyValues = ["false", "off", "0", "no", "maybe", "hello"];

      falsyValues.forEach((value) => {
        const result = v.safeParse(schema, value);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.output).toBe(false);
        }
      });
    });
  });

  describe("date", () => {
    it("should return undefined for empty strings", () => {
      const schema = vf.date();
      const result = v.safeParse(schema, "");
      expect(result.success).toBe(false);
      expect(result.output).toBeUndefined();
    });

    it("should convert string dates to Date objects", () => {
      const schema = vf.date();
      const result = v.safeParse(schema, "2023-01-01");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.output).toBeInstanceOf(Date);
        expect(result.output.getFullYear()).toBe(2023);
      }
    });

    it("should handle invalid date strings", () => {
      const schema = vf.date();
      const result = v.safeParse(schema, "not-a-date");
      expect(result.success).toBe(false);
      expect(result.output).toBe("not-a-date");
    });
  });

  describe("file", () => {
    it("should return undefined for empty files", () => {
      const schema = vf.file();
      const emptyFile = new File([], "empty.txt");
      const result = v.safeParse(schema, emptyFile);
      expect(result.success).toBe(false);
      expect(result.output).toBeUndefined();
    });

    it("should return valid files as-is", () => {
      const schema = vf.file();
      const file = new File(["content"], "test.txt");
      const result = v.safeParse(schema, file);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.output).toBe(file);
      }
    });
  });

  describe("picklist", () => {
    it("should return undefined for empty strings", () => {
      const schema = vf.picklist(["a", "b", "c"]);
      const result = v.safeParse(schema, "");
      expect(result.success).toBe(false);
      expect(result.output).toBeUndefined();
    });

    it("should return valid picklist values as-is", () => {
      const schema = vf.picklist(["a", "b", "c"]);
      const result = v.safeParse(schema, "a");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.output).toBe("a");
      }
    });

    it("should handle invalid picklist values", () => {
      const schema = vf.picklist(["a", "b", "c"]);
      const result = v.safeParse(schema, "d");
      expect(result.success).toBe(false);
      expect(result.output).toBe("d");
    });
  });

  describe("bigint", () => {
    it("should return undefined for empty strings", () => {
      const schema = vf.bigint();
      const result = v.safeParse(schema, "");
      expect(result.success).toBe(false);
      expect(result.output).toBeUndefined();
    });

    it("should return undefined for whitespace-only strings", () => {
      const schema = vf.bigint();
      const result = v.safeParse(schema, " ");
      expect(result.success).toBe(false);
      expect(result.output).toBeUndefined();
    });

    it("should convert string numbers to bigint", () => {
      const schema = vf.bigint();
      const result = v.safeParse(schema, "123");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.output).toBe(123n);
      }
    });

    it("should handle invalid bigint strings", () => {
      const schema = vf.bigint();
      const result = v.safeParse(schema, "abc");
      expect(result.success).toBe(false);
      expect(result.output).toBe("abc");
    });
  });

  describe("array", () => {
    it("should return empty array for empty strings", () => {
      const schema = vf.array(vf.string());
      const result = v.safeParse(schema, "");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.output).toEqual([]);
      }
    });

    it("should pass through arrays unchanged", () => {
      const schema = vf.array(vf.string());
      const result = v.safeParse(schema, ["a", "b", "c"]);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.output).toEqual(["a", "b", "c"]);
      }
    });

    it("should convert single values to single-item arrays", () => {
      const schema = vf.array(vf.string());
      const result = v.safeParse(schema, "hello");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.output).toEqual(["hello"]);
      }
    });

    it("should validate array elements", () => {
      const schema = vf.array(vf.number());
      const result = v.safeParse(schema, ["123", "456"]);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.output).toEqual([123, 456]);
      }
    });
  });
});
