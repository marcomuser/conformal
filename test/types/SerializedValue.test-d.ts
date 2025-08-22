import { describe, expectTypeOf, it } from "vitest";
import type { SerializedValue } from "../../src/types.js";

describe("SerializedValue", () => {
  it("should handle primitives", () => {
    expectTypeOf<SerializedValue<number>>().toEqualTypeOf<string>();
    expectTypeOf<SerializedValue<bigint>>().toEqualTypeOf<string>();
    expectTypeOf<SerializedValue<Date>>().toEqualTypeOf<string>();
    expectTypeOf<SerializedValue<string>>().toEqualTypeOf<string>();
    expectTypeOf<SerializedValue<boolean>>().toEqualTypeOf<boolean>();
    expectTypeOf<SerializedValue<null>>().toEqualTypeOf<undefined>();
    expectTypeOf<SerializedValue<undefined>>().toEqualTypeOf<undefined>();
    expectTypeOf<SerializedValue<symbol>>().toEqualTypeOf<symbol>();
  });

  it("should handle arrays", () => {
    expectTypeOf<SerializedValue<number[]>>().toEqualTypeOf<string[]>();
    expectTypeOf<SerializedValue<string[]>>().toEqualTypeOf<string[]>();
    expectTypeOf<SerializedValue<Date[]>>().toEqualTypeOf<string[]>();
    expectTypeOf<SerializedValue<boolean[]>>().toEqualTypeOf<boolean[]>();
    expectTypeOf<SerializedValue<null[]>>().toEqualTypeOf<undefined[]>();
    expectTypeOf<SerializedValue<(number | string)[]>>().toEqualTypeOf<
      string[]
    >();
  });

  it("should handle records", () => {
    expectTypeOf<SerializedValue<Record<string, number>>>().toEqualTypeOf<
      Record<string, string>
    >();
    expectTypeOf<SerializedValue<{ a: number; b: string }>>().toEqualTypeOf<{
      a: string;
      b: string;
    }>();
    expectTypeOf<
      SerializedValue<{ a: number; b: { c: Date } }>
    >().toEqualTypeOf<{
      a: string;
      b: { c: string };
    }>();
    expectTypeOf<SerializedValue<{ a: number; b: number[] }>>().toEqualTypeOf<{
      a: string;
      b: string[];
    }>();
  });

  it("should handle Blob and File", () => {
    expectTypeOf<SerializedValue<Blob>>().toEqualTypeOf<Blob>();
    expectTypeOf<SerializedValue<File>>().toEqualTypeOf<File>();
  });

  it("should handle complex nested types", () => {
    type Nested = {
      a: number;
      b: string[];
      c: {
        d: Date;
        e: {
          f: bigint;
          g: null;
        }[];
      };
    };
    type ExpectedNested = {
      a: string;
      b: string[];
      c: {
        d: string;
        e: {
          f: string;
          g: undefined;
        }[];
      };
    };
    expectTypeOf<SerializedValue<Nested>>().toEqualTypeOf<ExpectedNested>();
  });

  it("should handle complex nested interfaces", () => {
    interface Nested {
      a: number;
      b: string[];
      c: {
        d: Date;
        e: {
          f: bigint;
          g: null;
        }[];
      };
    }
    type ExpectedNested = {
      a: string;
      b: string[];
      c: {
        d: string;
        e: {
          f: string;
          g: undefined;
        }[];
      };
    };
    expectTypeOf<SerializedValue<Nested>>().toEqualTypeOf<ExpectedNested>();
  });

  it("should handle string union types", () => {
    type TestSchema = {
      value: "birds" | "cats" | "dogs" | "other";
    };
    type ExpectedType = {
      value: "birds" | "cats" | "dogs" | "other";
    };

    expectTypeOf<SerializedValue<TestSchema>>().toEqualTypeOf<ExpectedType>();
  });
});
