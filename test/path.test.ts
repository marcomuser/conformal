/**
 * This file was originally ported from nanostores: https://github.com/nanostores/nanostores
 * @license
 * Copyright 2020 Andrey Sitnik <andrey@sitnik.ru>
 * Copyright (c) 2025 Marco Muser
 * SPDX-License-Identifier: MIT
 */

import { describe, expect, it } from "vitest";
import { getPath, setPath } from "../src/path.js";

describe("getPath", () => {
  it("path evaluates correct value", () => {
    const exampleObj = {
      a: "123",
      b: { c: 123, d: [{ e: 123 }] },
      f: [
        [1, 2],
        [5, 4],
      ],
    };

    expect(getPath(exampleObj, "a")).toBe("123");
    expect(getPath(exampleObj, "b.c")).toBe(123);
    expect(getPath(exampleObj, "b.d[0]")).toStrictEqual({ e: 123 });
    expect(getPath(exampleObj, "b.d[0].e")).toBe(123);

    expect(getPath(exampleObj, "f[0][1]")).toBe(2);

    // @ts-expect-error: incorrect key here
    expect(getPath(exampleObj, "abra.cadabra.booms")).toBeUndefined();
  });

  it("supports multidimensional arrays with diverging shape", () => {
    const exampleObj = {
      f: [
        [1, 2],
        [{ g: 3 }, 4],
      ],
    };

    expect(getPath(exampleObj, "f[1][0].g")).toBe(3);
  });

  it("should have path type never for empty object and return undefined", () => {
    // @ts-expect-error incorrect key here
    expect(getPath({}, "a.b")).toBeUndefined();
  });

  it("should throw error when object is null", () => {
    // @ts-expect-error incorrect obj here
    expect(() => getPath(null, "a")).toThrowError();
  });
});

describe("setPath", () => {
  it("simple path setting", () => {
    type TestObj = {
      a: {
        b?: { c: string; d: { e: string }[] };
        e: number;
      };
      f: string;
    };
    let initial: TestObj = { a: { e: 123 }, f: "" };

    initial = setPath(initial, "f", "hey");
    expect(initial).toStrictEqual({ a: { e: 123 }, f: "hey" });
  });

  it("nested arrays path setting", () => {
    type TestObj = {
      a: {
        b: { c: number }[][][];
        d: { e: string }[][];
      }[];
    };
    let initial: TestObj = { a: [{ b: [[[{ c: 1 }]]], d: [[{ e: "val1" }]] }] };

    initial = setPath(initial, "a[0].b[0][0][0].c", 2);
    initial = setPath(initial, "a[0].d[0][1]", { e: "val2" });
    expect(initial).toStrictEqual({
      a: [{ b: [[[{ c: 2 }]]], d: [[{ e: "val1" }, { e: "val2" }]] }],
    });
  });

  it("creating objects", () => {
    type TestObj = { a?: { b?: { c?: { d: string } } } };
    let initial: TestObj = {};

    initial = setPath(initial, "a.b.c.d", "val");
    expect(initial.a?.b?.c?.d).toBe("val");
  });

  it("creating arrays", () => {
    type TestObj = { a?: string[] };
    let initial: TestObj = {};

    initial = setPath(initial, "a[0]", "val");
    expect(initial).toStrictEqual({ a: ["val"] });
    initial = setPath(initial, "a[3]", "val3");
    // The expected value is a sparse array
    const expectedA = ["val"];
    expectedA[3] = "val3";
    expect(initial).toStrictEqual({ a: expectedA });
  });

  it("removes arrays", () => {
    type TestObj = { a?: string[] };
    let initial: TestObj = { a: ["a", "b"] };

    initial = setPath(initial, "a[1]", undefined);
    expect(initial).toStrictEqual({ a: ["a"] });

    initial = setPath(initial, "a[0]", undefined);
    expect(initial).toStrictEqual({ a: [] });
  });

  it("changes object reference at this level and earlier levels when key is changed", () => {
    type Obj = { a: { b: { c: number; d: string }; e: number } };
    const b = { c: 1, d: "1" };
    const a = { b, e: 1 };

    let initial: Obj = { a };

    initial = setPath(initial, "a.b.c", 2);
    expect(initial.a).not.toBe(a);
    expect(initial.a.b).not.toBe(b);

    initial = setPath(initial, "a.e", 2);
    expect(initial.a).not.toBe(a);
  });

  it("array items mutation changes identity on the same and earlier levels", () => {
    const arr1 = { a: 1 };
    const arr2 = { a: 2 };
    const d = [arr1, arr2];
    const c = { d };

    const initial = { a: { b: { c } } };
    const newInitial = setPath(initial, "a.b.c.d[1].a", 3);
    expect(newInitial).not.toBe(initial);
    expect(newInitial.a.b.c.d).not.toBe(d);
    expect(newInitial.a.b.c.d[0]).toBe(d[0]);
    expect(newInitial.a.b.c.d[1]).not.toBe(arr2);
    expect(newInitial.a.b.c.d[1]).toStrictEqual({ a: 3 });
  });

  it("setting path with numbers inside does not produce any unnecessary stuff inside", () => {
    let obj: any = {};

    obj = setPath(obj, "123key", "value");
    obj = setPath(obj, "key123", "value");

    expect(obj).toStrictEqual({ "123key": "value", key123: "value" });
  });

  it("ensures referential equality for unchanged parts of the object", () => {
    const obj = {
      a: {
        b: "c",
        c: ["d", "f"],
      },
    };

    const newObj = setPath(obj, "a.b", "f");

    expect(obj.a.c).toBe(newObj.a.c);
  });

  it("ensures referential inequality for updated parts of the object", () => {
    const obj = {
      a: {
        b: "c",
        c: ["d", "f"],
      },
    };

    const newObj = setPath(obj, "a.b", "f");

    expect(obj).not.toBe(newObj);
    expect(obj.a).not.toBe(newObj.a);
    expect(obj.a.b).not.toBe(newObj.a.b);
  });

  it("should not allow prototype pollution via __proto__", () => {
    const obj = {};
    const result = setPath(obj, "__proto__.polluted", "test");

    // @ts-expect-error prototype pollution check
    expect({}.polluted).toBeUndefined();
    // @ts-expect-error prototype pollution check
    expect(result.__proto__).toEqual({});
  });

  it("should not allow prototype pollution via constructor", () => {
    const obj = {};
    const result = setPath(obj, "constructor.prototype.polluted", "test");

    // @ts-expect-error prototype pollution check
    expect({}.polluted).toBeUndefined();
    expect(result.constructor).toBe(Object);
  });
});
