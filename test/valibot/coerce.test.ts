import { describe, it, expect } from "vitest";
import * as vf from "../../src/valibot/coerce.js";
import * as v from "valibot";

describe("valibot coercion pipes", () => {
  describe("coerceString", () => {
    it("should coerce valid strings", () => {
      const schema = v.pipe(vf.coerceString(), v.string());
      const result = v.safeParse(schema, "hello");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.output).toBe("hello");
      }
    });

    it("should fail validation for empty strings", () => {
      const schema = v.pipe(vf.coerceString(), v.string());
      const result = v.safeParse(schema, "");
      expect(result.success).toBe(false);
    });

    it("should pass validation for empty strings when optional", () => {
      const schema = v.pipe(vf.coerceString(), v.optional(v.string()));
      const result = v.safeParse(schema, "");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.output).toBeUndefined();
      }
    });

    it("should work with email validation", () => {
      const schema = v.pipe(vf.coerceString(), v.string(), v.email());
      const result = v.safeParse(schema, "test@example.com");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.output).toBe("test@example.com");
      }
    });

    it("should work with URL validation", () => {
      const schema = v.pipe(vf.coerceString(), v.string(), v.url());
      const result = v.safeParse(schema, "https://example.com");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.output).toBe("https://example.com");
      }
    });
  });

  describe("coerceNumber", () => {
    it("should coerce string numbers to numbers", () => {
      const schema = v.pipe(vf.coerceNumber(), v.number());
      const result = v.safeParse(schema, "123");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.output).toBe(123);
      }
    });

    it("should fail validation for empty strings", () => {
      const schema = v.pipe(vf.coerceNumber(), v.number());
      const result = v.safeParse(schema, "");
      expect(result.success).toBe(false);
    });

    it("should pass validation for empty strings when optional", () => {
      const schema = v.pipe(vf.coerceNumber(), v.optional(v.number()));
      const result = v.safeParse(schema, "");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.output).toBeUndefined();
      }
    });

    it("should work with minValue validation", () => {
      const schema = v.pipe(vf.coerceNumber(), v.number(), v.minValue(16));
      const result = v.safeParse(schema, "18");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.output).toBe(18);
      }
    });

    it("should fail minValue validation", () => {
      const schema = v.pipe(vf.coerceNumber(), v.number(), v.minValue(16));
      const result = v.safeParse(schema, "15");
      expect(result.success).toBe(false);
    });
  });

  describe("coerceBigint", () => {
    it("should coerce string numbers to bigints", () => {
      const schema = v.pipe(vf.coerceBigint(), v.bigint());
      const result = v.safeParse(schema, "123");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.output).toBe(123n);
      }
    });

    it("should fail validation for empty strings", () => {
      const schema = v.pipe(vf.coerceBigint(), v.bigint());
      const result = v.safeParse(schema, "");
      expect(result.success).toBe(false);
    });

    it("should pass validation for empty strings when optional", () => {
      const schema = v.pipe(vf.coerceBigint(), v.optional(v.bigint()));
      const result = v.safeParse(schema, "");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.output).toBeUndefined();
      }
    });
  });

  describe("coerceBoolean", () => {
    it("should coerce form boolean values", () => {
      const schema = v.pipe(vf.coerceBoolean(), v.boolean());
      const result = v.safeParse(schema, "on");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.output).toBe(true);
      }
    });

    it("should coerce 'off' to false", () => {
      const schema = v.pipe(vf.coerceBoolean(), v.boolean());
      const result = v.safeParse(schema, "off");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.output).toBe(false);
      }
    });

    it("should fail validation for empty strings", () => {
      const schema = v.pipe(vf.coerceBoolean(), v.boolean());
      const result = v.safeParse(schema, "");
      expect(result.success).toBe(false);
    });

    it("should pass validation for empty strings when optional", () => {
      const schema = v.pipe(vf.coerceBoolean(), v.optional(v.boolean()));
      const result = v.safeParse(schema, "");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.output).toBeUndefined();
      }
    });
  });

  describe("coerceDate", () => {
    it("should coerce date strings to Date objects", () => {
      const schema = v.pipe(vf.coerceDate(), v.date());
      const result = v.safeParse(schema, "2023-01-01");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.output).toBeInstanceOf(Date);
      }
    });

    it("should fail validation for empty strings", () => {
      const schema = v.pipe(vf.coerceDate(), v.date());
      const result = v.safeParse(schema, "");
      expect(result.success).toBe(false);
    });

    it("should pass validation for empty strings when optional", () => {
      const schema = v.pipe(vf.coerceDate(), v.optional(v.date()));
      const result = v.safeParse(schema, "");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.output).toBeUndefined();
      }
    });
  });

  describe("coerceFile", () => {
    it("should handle valid files", () => {
      const schema = v.pipe(vf.coerceFile(), v.file());
      const file = new File(["content"], "test.txt");
      const result = v.safeParse(schema, file);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.output).toBe(file);
      }
    });

    it("should fail validation for empty files", () => {
      const schema = v.pipe(vf.coerceFile(), v.file());
      const file = new File([], "empty.txt");
      const result = v.safeParse(schema, file);
      expect(result.success).toBe(false);
    });

    it("should pass validation for files with size 0 when optional", () => {
      const schema = v.pipe(vf.coerceFile(), v.optional(v.file()));
      const file = new File([], "empty.txt");
      const result = v.safeParse(schema, file);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.output).toBeUndefined();
      }
    });
  });

  describe("coerceArray", () => {
    it("should handle valid arrays", () => {
      const schema = v.pipe(vf.coerceArray(), v.array(v.string()));
      const result = v.safeParse(schema, ["a", "b", "c"]);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.output).toEqual(["a", "b", "c"]);
      }
    });

    it("should coerce single values to arrays", () => {
      const schema = v.pipe(vf.coerceArray(), v.array(v.string()));
      const result = v.safeParse(schema, "single-value");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.output).toEqual(["single-value"]);
      }
    });

    it("should coerce empty strings to empty arrays", () => {
      const schema = v.pipe(vf.coerceArray(), v.array(v.string()));
      const result = v.safeParse(schema, "");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.output).toEqual([]);
      }
    });

    it("should work with nested coercion pipes", () => {
      const schema = v.pipe(
        vf.coerceArray(),
        v.array(v.pipe(vf.coerceString(), v.string())),
      );
      const result = v.safeParse(schema, ["hello", "world"]);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.output).toEqual(["hello", "world"]);
      }
    });
  });
});
