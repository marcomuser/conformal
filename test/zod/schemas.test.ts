import { describe, it, expect } from "vitest";
import * as zf from "../../src/zod/schemas.js";
import * as z from "zod";

describe("zod schemas integration", () => {
  describe("string", () => {
    it("should work with valid strings", () => {
      const schema = zf.string();
      const result = schema.safeParse("hello");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("hello");
      }
    });

    it("should handle validation errors", () => {
      const schema = z.string().min(5);
      const result = schema.safeParse("hi");
      expect(result.success).toBe(false);
    });

    it("should work with form data coercion", () => {
      const schema = zf.string();
      const result = schema.safeParse("");
      expect(result.success).toBe(false);
    });
  });

  describe("number", () => {
    it("should work with valid numbers", () => {
      const schema = zf.number();
      const result = schema.safeParse(42);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(42);
      }
    });

    it("should handle validation errors", () => {
      const schema = z.number().min(10);
      const result = schema.safeParse(5);
      expect(result.success).toBe(false);
    });

    it("should work with form data coercion", () => {
      const schema = zf.number();
      const result = schema.safeParse("123");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(123);
      }
    });
  });

  describe("bigint", () => {
    it("should work with valid bigints", () => {
      const schema = zf.bigint();
      const result = schema.safeParse(42n);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(42n);
      }
    });

    it("should handle validation errors", () => {
      const schema = z.bigint().min(10n);
      const result = schema.safeParse(5n);
      expect(result.success).toBe(false);
    });

    it("should work with form data coercion", () => {
      const schema = zf.bigint();
      const result = schema.safeParse("123");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(123n);
      }
    });
  });

  describe("boolean", () => {
    it("should work with valid booleans", () => {
      const schema = zf.boolean();
      const result = schema.safeParse(true);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(true);
      }
    });

    it("should work with form data coercion", () => {
      const schema = zf.boolean();
      const result = schema.safeParse("true");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(true);
      }
    });
  });

  describe("date", () => {
    it("should work with valid dates", () => {
      const schema = zf.date();
      const date = new Date("2023-01-01");
      const result = schema.safeParse(date);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(date);
      }
    });

    it("should work with form data coercion", () => {
      const schema = zf.date();
      const result = schema.safeParse("2023-01-01");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBeInstanceOf(Date);
      }
    });
  });

  describe("enum", () => {
    it("should work with valid enum values", () => {
      const schema = zf.enum_(["a", "b", "c"]);
      const result = schema.safeParse("a");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("a");
      }
    });

    it("should handle validation errors", () => {
      const schema = zf.enum_(["a", "b", "c"]);
      const result = schema.safeParse("d");
      expect(result.success).toBe(false);
    });
  });

  describe("file", () => {
    it("should work with valid files", () => {
      const schema = zf.file();
      const file = new File(["content"], "test.txt");
      const result = schema.safeParse(file);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(file);
      }
    });
  });

  describe("email", () => {
    it("should work with valid emails", () => {
      const schema = zf.email();
      const result = schema.safeParse("test@example.com");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("test@example.com");
      }
    });

    it("should handle validation errors", () => {
      const schema = zf.email();
      const result = schema.safeParse("invalid-email");
      expect(result.success).toBe(false);
    });
  });

  describe("url", () => {
    it("should work with valid URLs", () => {
      const schema = zf.url();
      const result = schema.safeParse("https://example.com");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("https://example.com");
      }
    });

    it("should handle validation errors", () => {
      const schema = zf.url();
      const result = schema.safeParse("not-a-url");
      expect(result.success).toBe(false);
    });
  });

  describe("array", () => {
    it("should work with valid arrays", () => {
      const schema = zf.array(zf.string());
      const result = schema.safeParse(["a", "b", "c"]);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(["a", "b", "c"]);
      }
    });

    it("should work with form data coercion", () => {
      const schema = zf.array(zf.string());
      const result = schema.safeParse("single-value");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(["single-value"]);
      }
    });
  });
});
