import { describe, expect, it } from "vitest";
import {
  toSubmission,
  getFormErrors,
  getFieldPath,
} from "../src/submission.js";
import type { StandardSchemaV1 } from "@standard-schema/spec";

describe("toSubmission", () => {
  it("should return success submission when validation passes", () => {
    const input = { name: "John", age: "30" };
    const result = {
      value: { name: "John", age: 30 },
      issues: undefined,
    } satisfies StandardSchemaV1.Result<{ name: string; age: number }>;

    const submission = toSubmission(input, result);

    expect(submission.status).toBe("success");
    expect(submission.value).toEqual({ name: "John", age: 30 });
    expect(submission.input).toEqual(input);
    expect(submission.formErrors).toEqual([]);
    expect(submission.fieldErrors).toEqual({});
  });

  it("should return error submission when validation fails", () => {
    const input = { name: "", age: "invalid" };
    const result = {
      issues: [
        {
          message: "Name is required",
          path: [{ key: "name" }],
        },
        {
          message: "Age must be a number",
          path: [{ key: "age" }],
        },
      ],
    } satisfies StandardSchemaV1.Result<{ name: string; age: number }>;

    const submission = toSubmission(input, result);

    expect(submission.status).toBe("error");
    expect(submission.value).toBeUndefined();
    expect(submission.input).toEqual(input);
    expect(submission.formErrors).toEqual([]);
    expect(submission.fieldErrors).toEqual({
      name: ["Name is required"],
      age: ["Age must be a number"],
    });
  });

  it("should handle empty input object", () => {
    const input = {};
    const result = {
      value: {},
      issues: undefined,
    } satisfies StandardSchemaV1.Result<{}>;

    const submission = toSubmission(input, result);

    expect(submission.status).toBe("success");
    expect(submission.value).toEqual({});
    expect(submission.input).toEqual({});
  });
});

describe("getFormErrors", () => {
  it("should return empty errors when no issues provided", () => {
    const result = getFormErrors();

    expect(result.formErrors).toEqual([]);
    expect(result.fieldErrors).toEqual({});
  });

  it("should return empty errors when issues array is empty", () => {
    const result = getFormErrors([]);

    expect(result.formErrors).toEqual([]);
    expect(result.fieldErrors).toEqual({});
  });

  it("should categorize field errors by path", () => {
    const issues = [
      {
        message: "Name is required",
        path: [{ key: "name" }],
      },
      {
        message: "Name is too short",
        path: [{ key: "name" }],
      },
      {
        message: "Age must be a number",
        path: [{ key: "age" }],
      },
    ] satisfies StandardSchemaV1.Issue[];

    const result = getFormErrors(issues);

    expect(result.formErrors).toEqual([]);
    expect(result.fieldErrors).toEqual({
      name: ["Name is required", "Name is too short"],
      age: ["Age must be a number"],
    });
  });

  it("should put issues without path into form errors", () => {
    const issues = [
      {
        message: "Name is required",
        path: [{ key: "name" }],
      },
      {
        message: "Form submission failed",
        path: undefined,
      },
    ] satisfies StandardSchemaV1.Issue[];

    const result = getFormErrors(issues);

    expect(result.formErrors).toEqual(["Form submission failed"]);
    expect(result.fieldErrors).toEqual({
      name: ["Name is required"],
    });
  });
});

describe("getFieldPath", () => {
  describe("PathSegment notation ({key: PropertyKey})", () => {
    it("should handle simple string key", () => {
      const issue = {
        message: "Name is required",
        path: [{ key: "name" }],
      } satisfies StandardSchemaV1.Issue;

      const result = getFieldPath(issue);

      expect(result).toBe("name");
    });

    it("should handle simple number key", () => {
      const issue = {
        message: "Item is required",
        path: [{ key: 0 }],
      } satisfies StandardSchemaV1.Issue;

      const result = getFieldPath(issue);

      expect(result).toBe("0");
    });

    it("should handle nested object path", () => {
      const issue = {
        message: "Street is required",
        path: [{ key: "address" }, { key: "street" }],
      } satisfies StandardSchemaV1.Issue;

      const result = getFieldPath(issue);

      expect(result).toBe("address.street");
    });

    it("should handle array index", () => {
      const issue = {
        message: "Item is required",
        path: [{ key: "items" }, { key: 0 }],
      } satisfies StandardSchemaV1.Issue;

      const result = getFieldPath(issue);

      expect(result).toBe("items[0]");
    });

    it("should handle string array index", () => {
      const issue = {
        message: "Item is required",
        path: [{ key: "items" }, { key: "1" }],
      } satisfies StandardSchemaV1.Issue;

      const result = getFieldPath(issue);

      expect(result).toBe("items[1]");
    });

    it("should handle mixed path with objects and arrays", () => {
      const issue = {
        message: "Type is required",
        path: [
          { key: "user" },
          { key: "contacts" },
          { key: 0 },
          { key: "type" },
        ],
      } satisfies StandardSchemaV1.Issue;

      const result = getFieldPath(issue);

      expect(result).toBe("user.contacts[0].type");
    });

    it("should handle deep nested mixed path", () => {
      const issue = {
        message: "Value is required",
        path: [
          { key: "level1" },
          { key: 0 },
          { key: "level2" },
          { key: "level3" },
          { key: 1 },
          { key: "value" },
        ],
      } satisfies StandardSchemaV1.Issue;

      const result = getFieldPath(issue);

      expect(result).toBe("level1[0].level2.level3[1].value");
    });
  });

  describe('Flat array notation (["name"])', () => {
    it("should handle simple string key", () => {
      const issue = {
        message: "Name is required",
        path: ["name"],
      } satisfies StandardSchemaV1.Issue;

      const result = getFieldPath(issue);

      expect(result).toBe("name");
    });

    it("should handle simple number key", () => {
      const issue = {
        message: "Item is required",
        path: [0],
      } satisfies StandardSchemaV1.Issue;

      const result = getFieldPath(issue);

      expect(result).toBe("0");
    });

    it("should handle nested object path", () => {
      const issue = {
        message: "Street is required",
        path: ["address", "street"],
      } satisfies StandardSchemaV1.Issue;

      const result = getFieldPath(issue);

      expect(result).toBe("address.street");
    });

    it("should handle array index", () => {
      const issue = {
        message: "Item is required",
        path: ["items", 0],
      } satisfies StandardSchemaV1.Issue;

      const result = getFieldPath(issue);

      expect(result).toBe("items[0]");
    });

    it("should handle string array index", () => {
      const issue = {
        message: "Item is required",
        path: ["items", "1"],
      } satisfies StandardSchemaV1.Issue;

      const result = getFieldPath(issue);

      expect(result).toBe("items[1]");
    });

    it("should handle mixed path with objects and arrays", () => {
      const issue = {
        message: "Type is required",
        path: ["user", "contacts", 0, "type"],
      } satisfies StandardSchemaV1.Issue;

      const result = getFieldPath(issue);

      expect(result).toBe("user.contacts[0].type");
    });
  });

  describe("mixed notation", () => {
    it("should handle mixed object and array notation", () => {
      const issue = {
        message: "Street is required",
        path: [{ key: "address" }, "street"],
      } satisfies StandardSchemaV1.Issue;

      const result = getFieldPath(issue);

      expect(result).toBe("address.street");
    });

    it("should handle mixed array and object notation", () => {
      const issue = {
        message: "Type is required",
        path: ["user", { key: "contacts" }, 0, { key: "type" }],
      } satisfies StandardSchemaV1.Issue;

      const result = getFieldPath(issue);

      expect(result).toBe("user.contacts[0].type");
    });
  });

  describe("edge cases", () => {
    it("should return null when no path provided", () => {
      const issue = {
        message: "No path error",
        path: undefined,
      } satisfies StandardSchemaV1.Issue;

      const result = getFieldPath(issue);

      expect(result).toBeNull();
    });

    it("should return null when path is empty array", () => {
      const issue = {
        message: "Empty path error",
        path: [],
      } satisfies StandardSchemaV1.Issue;

      const result = getFieldPath(issue);

      expect(result).toBeNull();
    });

    it("should return null for invalid key types", () => {
      const issue = {
        message: "Invalid key error",
        path: [{ key: Symbol("invalid") }],
      } satisfies StandardSchemaV1.Issue;

      const result = getFieldPath(issue);

      expect(result).toBeNull();
    });
  });
});
