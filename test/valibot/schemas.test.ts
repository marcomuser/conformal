import { describe, it, expect } from "vitest";
import * as vf from "../../src/valibot/schemas.js";
import * as v from "valibot";

describe("valibot schemas integration", () => {
  describe("string", () => {
    it("should work with valid strings", () => {
      const schema = vf.string();
      const result = v.safeParse(schema, "hello");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.output).toBe("hello");
      }
    });

    it("should handle validation errors", () => {
      const schema = v.pipe(vf.string(), v.minLength(5));
      const result = v.safeParse(schema, "hi");
      expect(result.success).toBe(false);
    });

    it("should work with form data coercion", () => {
      const schema = vf.string();
      const result = v.safeParse(schema, "");
      expect(result.success).toBe(false);
    });
  });

  describe("number", () => {
    it("should work with valid numbers", () => {
      const schema = vf.number();
      const result = v.safeParse(schema, 42);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.output).toBe(42);
      }
    });

    it("should handle validation errors", () => {
      const schema = v.pipe(vf.number(), v.minValue(10));
      const result = v.safeParse(schema, 5);
      expect(result.success).toBe(false);
    });

    it("should work with form data coercion", () => {
      const schema = vf.number();
      const result = v.safeParse(schema, "123");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.output).toBe(123);
      }
    });
  });

  describe("bigint", () => {
    it("should work with valid bigints", () => {
      const schema = vf.bigint();
      const result = v.safeParse(schema, 42n);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.output).toBe(42n);
      }
    });

    it("should handle validation errors", () => {
      const schema = v.pipe(vf.bigint(), v.minValue(10n));
      const result = v.safeParse(schema, 5n);
      expect(result.success).toBe(false);
    });

    it("should work with form data coercion", () => {
      const schema = vf.bigint();
      const result = v.safeParse(schema, "123");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.output).toBe(123n);
      }
    });
  });

  describe("boolean", () => {
    it("should work with valid booleans", () => {
      const schema = vf.boolean();
      const result = v.safeParse(schema, true);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.output).toBe(true);
      }
    });

    it("should work with form data coercion", () => {
      const schema = vf.boolean();
      const result = v.safeParse(schema, "true");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.output).toBe(true);
      }
    });
  });

  describe("date", () => {
    it("should work with valid dates", () => {
      const schema = vf.date();
      const date = new Date("2023-01-01");
      const result = v.safeParse(schema, date);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.output).toBe(date);
      }
    });

    it("should work with form data coercion", () => {
      const schema = vf.date();
      const result = v.safeParse(schema, "2023-01-01");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.output).toBeInstanceOf(Date);
      }
    });
  });

  describe("picklist", () => {
    it("should work with valid picklist values", () => {
      const schema = vf.picklist(["a", "b", "c"]);
      const result = v.safeParse(schema, "a");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.output).toBe("a");
      }
    });

    it("should handle validation errors", () => {
      const schema = vf.picklist(["a", "b", "c"]);
      const result = v.safeParse(schema, "d");
      expect(result.success).toBe(false);
    });
  });

  describe("file", () => {
    it("should work with valid files", () => {
      const schema = vf.file();
      const file = new File(["content"], "test.txt");
      const result = v.safeParse(schema, file);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.output).toBe(file);
      }
    });
  });

  describe("array", () => {
    it("should work with valid arrays", () => {
      const schema = vf.array(vf.string());
      const result = v.safeParse(schema, ["a", "b", "c"]);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.output).toEqual(["a", "b", "c"]);
      }
    });

    it("should work with form data coercion", () => {
      const schema = vf.array(vf.string());
      const result = v.safeParse(schema, "single-value");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.output).toEqual(["single-value"]);
      }
    });
  });
});
