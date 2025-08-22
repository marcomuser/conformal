import { describe, expectTypeOf, it } from "vitest";
import type { PathsFromObject } from "../../src/types.js";

describe("PathsFromObject", () => {
  it("should not add Date properties to inferred object paths", () => {
    interface TestSchema {
      a: string;
      b: Date;
    }

    type ExpectedType = "a" | "b";

    expectTypeOf<PathsFromObject<TestSchema>>().toEqualTypeOf<ExpectedType>();
  });

  it("should not add Blob or File properties to inferred object paths", () => {
    interface TestSchema {
      a: string;
      b: Blob;
      c: File;
    }

    type ExpectedType = "a" | "b" | "c";

    expectTypeOf<PathsFromObject<TestSchema>>().toEqualTypeOf<ExpectedType>();
  });

  it("should not add FileList properties to inferred object paths", () => {
    interface TestSchema {
      a: string;
      b: FileList;
    }

    type ExpectedType = "a" | "b";

    expectTypeOf<PathsFromObject<TestSchema>>().toEqualTypeOf<ExpectedType>();
  });

  it("should infer all paths from complex nested interface", () => {
    interface TestSchema {
      a: number;
      b: string[];
      c: {
        d: Date;
        e: {
          f: bigint;
          g: File;
        }[];
      };
    }
    type ExpectedType =
      | "a"
      | "b"
      | `b[${number}]`
      | "c"
      | "c.d"
      | "c.e"
      | `c.e[${number}]`
      | `c.e[${number}].f`
      | `c.e[${number}].g`;

    expectTypeOf<PathsFromObject<TestSchema>>().toEqualTypeOf<ExpectedType>();
  });

  it("should infer all paths from complex nested type", () => {
    type TestSchema = {
      a: number;
      b: string[];
      c: {
        d: Date;
        e: {
          f: bigint;
          g: File;
        }[];
      };
    };
    type ExpectedType =
      | "a"
      | "b"
      | `b[${number}]`
      | "c"
      | "c.d"
      | "c.e"
      | `c.e[${number}]`
      | `c.e[${number}].f`
      | `c.e[${number}].g`;

    expectTypeOf<PathsFromObject<TestSchema>>().toEqualTypeOf<ExpectedType>();
  });
});
