import { describe, expectTypeOf, it } from "vitest";
import type { ParsedValue } from "../../src/types.js";

describe("ParsedValue", () => {
  it("should handle primitive types", () => {
    expectTypeOf<ParsedValue<string>>().toEqualTypeOf<string>();
    expectTypeOf<ParsedValue<number>>().toEqualTypeOf<string>();
    expectTypeOf<ParsedValue<boolean>>().toEqualTypeOf<string | undefined>();
    expectTypeOf<ParsedValue<Date>>().toEqualTypeOf<string>();
    expectTypeOf<ParsedValue<bigint>>().toEqualTypeOf<string>();
  });

  it("should handle null", () => {
    expectTypeOf<ParsedValue<null>>().toEqualTypeOf<undefined>();
  });

  it("should handle Blob and File", () => {
    expectTypeOf<ParsedValue<Blob>>().toEqualTypeOf<File>();
    expectTypeOf<ParsedValue<File>>().toEqualTypeOf<File>();
  });

  it("should handle File in array", () => {
    expectTypeOf<ParsedValue<File[]>>().toEqualTypeOf<File[]>();
  });

  it("should handle flat object", () => {
    type TestSchema = {
      name: string;
      age: number;
    };
    type ExpectedType = {
      name: string;
      age: string;
    };
    expectTypeOf<ParsedValue<TestSchema>>().toEqualTypeOf<ExpectedType>();
  });

  it("should handle nested objects", () => {
    type TestSchema = {
      person: {
        name: string;
        address: {
          street: string;
        };
      };
    };
    type ExpectedType = {
      person: {
        name: string;
        address: {
          street: string;
        };
      };
    };
    expectTypeOf<ParsedValue<TestSchema>>().toEqualTypeOf<ExpectedType>();
  });

  it("should handle arrays of primitives", () => {
    expectTypeOf<ParsedValue<string[]>>().toEqualTypeOf<string[]>();
    expectTypeOf<ParsedValue<number[]>>().toEqualTypeOf<string[]>();
  });

  it("should handle arrays of objects", () => {
    type TestSchema = { value: number };
    type ExpectedType = { value: string }[];
    expectTypeOf<ParsedValue<TestSchema[]>>().toEqualTypeOf<ExpectedType>();
  });

  it("should handle complex nested types", () => {
    type TestSchema = {
      name: string;
      tags: string[];
      details: {
        address: {
          street: string;
          numbers: number[];
        };
        meta:
          | {
              active: boolean;
            }[]
          | null;
      };
    };

    type ExpectedType = {
      name: string;
      tags: string[];
      details: {
        address: {
          street: string;
          numbers: string[];
        };
        meta:
          | {
              active: string | undefined;
            }[]
          | undefined;
      };
    };

    expectTypeOf<ParsedValue<TestSchema>>().toEqualTypeOf<ExpectedType>();
  });

  it("should handle complex nested interfaces", () => {
    interface TestSchema {
      name: string;
      tags: string[];
      details: {
        address: {
          street: string;
          numbers: number[];
        };
        meta:
          | {
              active: boolean;
            }[]
          | null;
      };
    }

    type ExpectedType = {
      name: string;
      tags: string[];
      details: {
        address: {
          street: string;
          numbers: string[];
        };
        meta:
          | {
              active: string | undefined;
            }[]
          | undefined;
      };
    };

    expectTypeOf<ParsedValue<TestSchema>>().toEqualTypeOf<ExpectedType>();
  });

  it("should handle union types in objects", () => {
    type TestSchema = {
      value: string | number;
    };
    type ExpectedType = {
      value: string;
    };

    expectTypeOf<ParsedValue<TestSchema>>().toEqualTypeOf<ExpectedType>();
  });

  it("should handle string union types", () => {
    type TestSchema = {
      value: "birds" | "cats" | "dogs" | "other";
    };
    type ExpectedType = {
      value: "birds" | "cats" | "dogs" | "other";
    };

    expectTypeOf<ParsedValue<TestSchema>>().toEqualTypeOf<ExpectedType>();
  });
});
