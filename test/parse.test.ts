import { describe, expect, it } from "vitest";
import { z } from "zod";
import { parse, parseWithSchema } from "../src/parse.js";

describe("parse", () => {
  it("should handle simple key-value pairs", () => {
    const file = new File(["test content"], "test.txt");
    const formData = new FormData();
    formData.append("name", "John Doe");
    formData.append("age", "30");
    formData.append("file", file);

    const parsedData = parse(formData);
    expect(parsedData).toEqual({ name: "John Doe", age: "30", file });
  });

  it("should handle nested objects", () => {
    const formData = new FormData();
    formData.append("address.street", "123 Main St");
    formData.append("address.city", "Anytown");

    const parsedData = parse(formData);
    expect(parsedData).toEqual({
      address: { street: "123 Main St", city: "Anytown" },
    });
  });

  it("should handle arrays", () => {
    const formData = new FormData();
    formData.append("items[0]", "apple");
    formData.append("items[1]", "banana");

    const parsedData = parse(formData);
    expect(parsedData).toEqual({ items: ["apple", "banana"] });
  });

  it("should handle nested objects and arrays combined", () => {
    const formData = new FormData();
    formData.append("tasks[0].content", "Write code");
    formData.append("tasks[0].completed", "true");
    formData.append("tasks[1].content", "Test code");
    formData.append("tasks[1].details.priority", "high");

    const parsedData = parse(formData);
    expect(parsedData).toEqual({
      tasks: [
        { content: "Write code", completed: "true" },
        { content: "Test code", details: { priority: "high" } },
      ],
    });
  });

  it("should handle empty form data", () => {
    const formData = new FormData();
    const parsedData = parse(formData);
    expect(parsedData).toEqual({});
  });

  it("should handle array with non-consecutive indexes", () => {
    const formData = new FormData();
    formData.append("items[0]", "apple");
    formData.append("items[2]", "orange");

    const parsedData = parse(formData);
    expect(parsedData).toEqual({ items: ["apple", undefined, "orange"] });
  });

  it("should handle multiple nested objects", () => {
    const formData = new FormData();
    formData.append("level1.level2.level3.value", "deep value");

    const parsedData = parse(formData);
    expect(parsedData).toEqual({
      level1: { level2: { level3: { value: "deep value" } } },
    });
  });

  it("should handle multiple nested arrays", () => {
    const formData = new FormData();
    formData.append("level1[0].level2[0].level3.value", "deep value 1");
    formData.append("level1[0].level2[1].level3.value", "deep value 2");
    formData.append("level1[1].level2[0].level3.value", "deep value 3");

    const parsedData = parse(formData);
    expect(parsedData).toEqual({
      level1: [
        {
          level2: [
            { level3: { value: "deep value 1" } },
            { level3: { value: "deep value 2" } },
          ],
        },
        { level2: [{ level3: { value: "deep value 3" } }] },
      ],
    });
  });

  it("should handle duplicate keys as an array of values", () => {
    const formData = new FormData();
    formData.append("item", "apple");
    formData.append("item", "banana");
    formData.append("item", "orange");

    const parsedData = parse(formData);
    expect(parsedData).toEqual({ item: ["apple", "banana", "orange"] });
  });

  it("should handle duplicate keys in nested objects", () => {
    const formData = new FormData();
    formData.append("items.name", "apple");
    formData.append("items.name", "banana");

    const parsedData = parse(formData);
    expect(parsedData).toEqual({ items: { name: ["apple", "banana"] } });
  });

  it("should handle duplicate keys in nested arrays", () => {
    const formData = new FormData();
    formData.append("items[0].name", "apple");
    formData.append("items[0].name", "banana");
    formData.append("items[1].name", "orange");
    formData.append("items[1].name", "grape");

    const parsedData = parse(formData);
    expect(parsedData).toEqual({
      items: [{ name: ["apple", "banana"] }, { name: ["orange", "grape"] }],
    });
  });

  it("should handle duplicate keys mixed with unique keys", () => {
    const formData = new FormData();
    formData.append("name", "Test User");
    formData.append("items", "apple");
    formData.append("items", "banana");
    formData.append("count", "42");

    const parsedData = parse(formData);
    expect(parsedData).toEqual({
      name: "Test User",
      items: ["apple", "banana"],
      count: "42",
    });
  });

  it("should handle duplicate/unique keys with empty strings", () => {
    const formData = new FormData();
    formData.append("name", "Test User");
    formData.append("items", "apple");
    formData.append("items", "");
    formData.append("items", "banana");
    formData.append("count", "42");
    formData.append("emptyValue", "");
    formData.append("nested.emptyValue", "");
    formData.append("nested.items", "first");
    formData.append("nested.items", "second");

    expect(parse(formData)).toStrictEqual({
      name: "Test User",
      items: ["apple", "", "banana"],
      count: "42",
      emptyValue: "",
      nested: { emptyValue: "", items: ["first", "second"] },
    });
  });
});

describe("parseWithSchema", () => {
  it("should return success result when validation passes", () => {
    const schema = z.object({
      name: z.string(),
      age: z.coerce.number(),
      hobbies: z.array(z.string()),
    });

    const formData = new FormData();
    formData.append("name", "John Doe");
    formData.append("age", "30");
    formData.append("hobbies", "Music");
    formData.append("hobbies", "Coding");

    const result = parseWithSchema(schema, formData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value).toEqual({
        name: "John Doe",
        age: 30,
        hobbies: ["Music", "Coding"],
      });
    }
  });

  it("should return failure result when validation fails", () => {
    const schema = z.object({
      name: z.string(),
      age: z.number(), // Note: not coerced, so string will fail
      email: z.email(),
    });

    const formData = new FormData();
    formData.append("name", "John Doe");
    formData.append("age", "not-a-number");
    formData.append("email", "invalid-email");

    const result = parseWithSchema(schema, formData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.issues).toBeDefined();
      expect(result.issues.length).toBeGreaterThan(0);
      expect(result.value).toBeUndefined();
    }
  });

  it("should handle nested object validation", () => {
    const schema = z.object({
      user: z.object({
        profile: z.object({
          name: z.string(),
          age: z.coerce.number(),
        }),
      }),
    });

    const formData = new FormData();
    formData.append("user.profile.name", "Jane");
    formData.append("user.profile.age", "25");

    const result = parseWithSchema(schema, formData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value).toEqual({
        user: {
          profile: {
            name: "Jane",
            age: 25,
          },
        },
      });
    }
  });

  it("should throw TypeError when schema validation returns a Promise", () => {
    // Create a mock schema that returns a Promise
    const asyncSchema = {
      "~standard": {
        validate: () => Promise.resolve({ value: {}, issues: undefined }),
      },
    };

    const formData = new FormData();
    formData.append("name", "test");

    expect(() => {
      parseWithSchema(asyncSchema as any, formData);
    }).toThrow(TypeError);
    expect(() => {
      parseWithSchema(asyncSchema as any, formData);
    }).toThrow("Schema validation must be synchronous");
  });

  it("should handle array validation", () => {
    const schema = z.object({
      items: z.array(z.string().min(1)),
    });

    const formData = new FormData();
    formData.append("items", "apple");
    formData.append("items", "banana");
    formData.append("items", "cherry");

    const result = parseWithSchema(schema, formData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value).toEqual({
        items: ["apple", "banana", "cherry"],
      });
    }
  });

  it("should return failure for array validation with invalid items", () => {
    const schema = z.object({
      items: z.array(z.string().min(3)), // Minimum length 3
    });

    const formData = new FormData();
    formData.append("items", "ok"); // Too short
    formData.append("items", "valid");

    const result = parseWithSchema(schema, formData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.issues).toBeDefined();
      expect(result.issues.length).toBeGreaterThan(0);
    }
  });
});
