import { describe, expectTypeOf, it } from "vitest";
import type { InputValue } from "../../src/types.js";

describe("InputValue", () => {
  it("should handle primitive types", () => {
    expectTypeOf<InputValue<string>>().toEqualTypeOf<string>();
    expectTypeOf<InputValue<number>>().toEqualTypeOf<string>();
    expectTypeOf<InputValue<boolean>>().toEqualTypeOf<string>();
    expectTypeOf<InputValue<Date>>().toEqualTypeOf<string>();
    expectTypeOf<InputValue<bigint>>().toEqualTypeOf<string>();
  });

  it("should handle Blob and File", () => {
    expectTypeOf<InputValue<Blob>>().toEqualTypeOf<File>();
    expectTypeOf<InputValue<File>>().toEqualTypeOf<File>();
  });

  it("should handle File in array", () => {
    expectTypeOf<InputValue<File[]>>().toEqualTypeOf<File[]>();
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
    expectTypeOf<InputValue<TestSchema>>().toEqualTypeOf<ExpectedType>();
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
    expectTypeOf<InputValue<TestSchema>>().toEqualTypeOf<ExpectedType>();
  });

  it("should handle arrays of primitives", () => {
    expectTypeOf<InputValue<string[]>>().toEqualTypeOf<string[]>();
    expectTypeOf<InputValue<number[]>>().toEqualTypeOf<string[]>();
  });

  it("should handle arrays of objects", () => {
    type TestSchema = { value: number };
    type ExpectedType = { value: string }[];
    expectTypeOf<InputValue<TestSchema[]>>().toEqualTypeOf<ExpectedType>();
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
              active: string;
            }[]
          | null;
      };
    };

    expectTypeOf<InputValue<TestSchema>>().toEqualTypeOf<ExpectedType>();
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
              active: string;
            }[]
          | null;
      };
    };

    expectTypeOf<InputValue<TestSchema>>().toEqualTypeOf<ExpectedType>();
  });

  it("should handle union types in objects", () => {
    type TestSchema = {
      value: string | number;
    };
    type ExpectedType = {
      value: string;
    };

    expectTypeOf<InputValue<TestSchema>>().toEqualTypeOf<ExpectedType>();
  });

  it("should handle string union types", () => {
    type TestSchema = {
      value: "birds" | "cats" | "dogs" | "other";
    };
    type ExpectedType = {
      value: "birds" | "cats" | "dogs" | "other";
    };

    expectTypeOf<InputValue<TestSchema>>().toEqualTypeOf<ExpectedType>();
  });
});
