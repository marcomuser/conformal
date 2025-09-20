import { describe, expect, it } from "vitest";
import { z } from "zod";
import { parseFormData } from "../src/parse.js";

describe("parseFormData", () => {
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

    const result = parseFormData(schema, formData);
    const submission = result.submission();

    expect(submission.status).toBe("success");
    expect(submission.value).toEqual({
      name: "John Doe",
      age: 30,
      hobbies: ["Music", "Coding"],
    });
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

    const result = parseFormData(schema, formData);
    const submission = result.submission();

    expect(submission.status).toBe("error");
    expect(submission.value).toBeUndefined();
    expect(submission.fieldErrors).toBeDefined();
    expect(Object.keys(submission.fieldErrors).length).toBeGreaterThan(0);
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

    const result = parseFormData(schema, formData);
    const submission = result.submission();

    expect(submission.status).toBe("success");
    expect(submission.value).toEqual({
      user: {
        profile: {
          name: "Jane",
          age: 25,
        },
      },
    });
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
      parseFormData(asyncSchema as any, formData);
    }).toThrow(TypeError);
    expect(() => {
      parseFormData(asyncSchema as any, formData);
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

    const result = parseFormData(schema, formData);
    const submission = result.submission();

    expect(submission.status).toBe("success");
    expect(submission.value).toEqual({
      items: ["apple", "banana", "cherry"],
    });
  });

  it("should return failure for array validation with invalid items", () => {
    const schema = z.object({
      items: z.array(z.string().min(3)), // Minimum length 3
    });

    const formData = new FormData();
    formData.append("items", "ok"); // Too short
    formData.append("items", "valid");

    const result = parseFormData(schema, formData);
    const submission = result.submission();

    expect(submission.status).toBe("error");
    expect(submission.value).toBeUndefined();
    expect(submission.fieldErrors).toBeDefined();
    expect(Object.keys(submission.fieldErrors).length).toBeGreaterThan(0);
  });

  it("should provide submission method that returns success submission", () => {
    const schema = z.object({
      name: z.string(),
      age: z.coerce.number(),
    });

    const formData = new FormData();
    formData.append("name", "John Doe");
    formData.append("age", "30");

    const result = parseFormData(schema, formData);
    const submission = result.submission();

    expect(submission.status).toBe("success");
    expect(submission.value).toEqual({
      name: "John Doe",
      age: 30,
    });
    expect(submission.input).toEqual({
      name: "John Doe",
      age: "30",
    });
    expect(submission.formErrors).toEqual([]);
    expect(submission.fieldErrors).toEqual({});
  });

  it("should provide submission method that returns error submission", () => {
    const schema = z.object({
      name: z.string().min(3),
      age: z.coerce.number().min(18),
    });

    const formData = new FormData();
    formData.append("name", "Jo"); // Too short
    formData.append("age", "16"); // Too young

    const result = parseFormData(schema, formData);
    const submission = result.submission();

    expect(submission.status).toBe("error");
    expect(submission.value).toBeUndefined();
    expect(submission.input).toEqual({
      name: "Jo",
      age: "16",
    });
    expect(submission.formErrors).toEqual([]);
    expect(submission.fieldErrors).toEqual({
      name: expect.arrayContaining([expect.stringContaining("3")]),
      age: expect.arrayContaining([expect.stringContaining("18")]),
    });
  });
});
