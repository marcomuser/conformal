import { describe, expectTypeOf, it } from "vitest";
import { getPath } from "../../src/path.js";

describe("getPath types", () => {
  it("should have type number for number property access", () => {
    const obj = { a: 1 };
    expectTypeOf(getPath(obj, "a")).toEqualTypeOf<number>();
  });

  it("should have type string for string property access", () => {
    const obj = { a: { b: "hello" } };
    expectTypeOf(getPath(obj, "a.b")).toEqualTypeOf<string>();
  });

  it("should have type number | undefined for array element access", () => {
    const obj = { a: [1, 2, 3] };
    expectTypeOf(getPath(obj, "a[0]")).toEqualTypeOf<number | undefined>();
  });

  it("should have type number | undefined for object property in array access", () => {
    const obj = { a: [{ b: 1 }] };
    expectTypeOf(getPath(obj, "a[0].b")).toEqualTypeOf<number | undefined>();
  });

  it("should not accept undefined as object", () => {
    // @ts-expect-error incorrect obj here
    expectTypeOf(getPath(undefined, "a")).toEqualTypeOf<never>();
  });

  it("supports multidimensional arrays with diverging shape", () => {
    const exampleObj = {
      f: [
        [1, 2],
        [{ g: 3 }, 4],
      ],
    };

    expectTypeOf(getPath(exampleObj, "f[1][0].g")).toEqualTypeOf<
      // @ts-expect-error TypeScript infers `f` as `(number[] | { g: number }[])[]` due to the mixed types in the inner arrays.
      // This union type prevents precise type checking of nested properties like `f[1][0].g`, as TS doesn't know for certain that `f[1][0]` will have a `g` property.
      number | undefined
    >();
  });
});
