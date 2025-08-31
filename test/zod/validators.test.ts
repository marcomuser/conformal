import { describe, it, expect } from "vitest";
import * as zf from "../../src/zod/validators";

describe("zod validators preprocessing", () => {
  describe("string", () => {
    it("should return undefined for empty strings", () => {
      const schema = zf.string();
      const result = schema.safeParse("");
      expect(result.success).toBe(false);
      expect(result.data).toBeUndefined();
    });

    it("should pass through non-string values unchanged", () => {
      const schema = zf.string();
      const result = schema.safeParse(123);
      expect(result.success).toBe(false);
      expect(result.data).toBeUndefined();
    });

    it("should return non-empty strings as-is", () => {
      const schema = zf.string();
      const result = schema.safeParse("hello");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("hello");
      }
    });
  });

  describe("number", () => {
    it("should return undefined for empty strings", () => {
      const schema = zf.number();
      const result = schema.safeParse("");
      expect(result.success).toBe(false);
      expect(result.data).toBeUndefined();
    });

    it("should return undefined for whitespace-only strings", () => {
      const schema = zf.number();
      const result = schema.safeParse(" ");
      console.log(result);
      expect(result.success).toBe(false);
      expect(result.data).toBeUndefined();
    });

    it("should pass through non-string values unchanged", () => {
      const schema = zf.number();
      const result = schema.safeParse(42);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(42);
      }
    });

    it("should convert string numbers to numbers", () => {
      const schema = zf.number();
      const result = schema.safeParse("123");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(123);
      }
    });
  });

  describe("boolean", () => {
    it("should return undefined for empty strings", () => {
      const schema = zf.boolean();
      const result = schema.safeParse("");
      expect(result.success).toBe(false);
      expect(result.data).toBeUndefined();
    });

    it("should pass through non-string values unchanged", () => {
      const schema = zf.boolean();
      const result = schema.safeParse(true);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(true);
      }
    });

    it("should return true for truthy string values", () => {
      const schema = zf.boolean();
      const truthyValues = ["true", "on", "1", "yes"];

      truthyValues.forEach((value) => {
        const result = schema.safeParse(value);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toBe(true);
        }
      });
    });

    it("should return false for non-truthy string values", () => {
      const schema = zf.boolean();
      const falsyValues = ["false", "off", "0", "no", "maybe", "hello"];

      falsyValues.forEach((value) => {
        const result = schema.safeParse(value);
        expect(result.success).toBe(false);
        expect(result.data).toBeUndefined();
      });
    });
  });

  describe("date", () => {
    it("should return undefined for empty strings", () => {
      const schema = zf.date();
      const result = schema.safeParse("");
      expect(result.success).toBe(false);
      expect(result.data).toBeUndefined();
    });

    it("should pass through non-string values unchanged", () => {
      const schema = zf.date();
      const date = new Date();
      const result = schema.safeParse(date);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(date);
      }
    });

    it("should convert string dates to Date objects", () => {
      const schema = zf.date();
      const result = schema.safeParse("2023-01-01");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBeInstanceOf(Date);
        expect(result.data.getFullYear()).toBe(2023);
      }
    });
  });

  describe("file", () => {
    it("should return undefined for empty files", () => {
      const schema = zf.file();
      const emptyFile = new File([], "empty.txt");
      const result = schema.safeParse(emptyFile);
      expect(result.success).toBe(false);
      expect(result.data).toBeUndefined();
    });

    it("should pass through non-File values unchanged", () => {
      const schema = zf.file();
      const result = schema.safeParse("not-a-file");
      expect(result.success).toBe(false);
      expect(result.data).toBeUndefined();
    });

    it("should return valid files as-is", () => {
      const schema = zf.file();
      const file = new File(["content"], "test.txt");
      const result = schema.safeParse(file);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(file);
      }
    });
  });

  describe("enum", () => {
    it("should return undefined for empty strings", () => {
      const schema = zf.enum_(["a", "b", "c"]);
      const result = schema.safeParse("");
      expect(result.success).toBe(false);
      expect(result.data).toBeUndefined();
    });

    it("should pass through non-string values unchanged", () => {
      const schema = zf.enum_(["a", "b", "c"]);
      const result = schema.safeParse(123);
      expect(result.success).toBe(false);
      expect(result.data).toBeUndefined();
    });

    it("should return valid enum values as-is", () => {
      const schema = zf.enum_(["a", "b", "c"]);
      const result = schema.safeParse("a");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("a");
      }
    });
  });

  describe("email", () => {
    it("should return undefined for empty strings", () => {
      const schema = zf.email();
      const result = schema.safeParse("");
      expect(result.success).toBe(false);
      expect(result.data).toBeUndefined();
    });

    it("should pass through non-string values unchanged", () => {
      const schema = zf.email();
      const result = schema.safeParse(123);
      expect(result.success).toBe(false);
      expect(result.data).toBeUndefined();
    });

    it("should return valid email strings as-is", () => {
      const schema = zf.email();
      const result = schema.safeParse("test@example.com");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("test@example.com");
      }
    });
  });

  describe("url", () => {
    it("should return undefined for empty strings", () => {
      const schema = zf.url();
      const result = schema.safeParse("");
      expect(result.success).toBe(false);
      expect(result.data).toBeUndefined();
    });

    it("should pass through non-string values unchanged", () => {
      const schema = zf.url();
      const result = schema.safeParse(123);
      expect(result.success).toBe(false);
      expect(result.data).toBeUndefined();
    });

    it("should return valid URL strings as-is", () => {
      const schema = zf.url();
      const result = schema.safeParse("https://example.com");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("https://example.com");
      }
    });
  });

  describe("bigint", () => {
    it("should return undefined for empty strings", () => {
      const schema = zf.bigint();
      const result = schema.safeParse("");
      expect(result.success).toBe(false);
      expect(result.data).toBeUndefined();
    });

    it("should return undefined for whitespace-only strings", () => {
      const schema = zf.bigint();
      const result = schema.safeParse(" ");
      expect(result.success).toBe(false);
      expect(result.data).toBeUndefined();
    });

    it("should pass through non-string values unchanged", () => {
      const schema = zf.bigint();
      const result = schema.safeParse(42n);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(42n);
      }
    });

    it("should convert string numbers to bigint", () => {
      const schema = zf.bigint();
      const result = schema.safeParse("123");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(123n);
      }
    });
  });
});
