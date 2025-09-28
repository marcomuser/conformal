import { describe, expect, it } from "vitest";
import { serialize } from "../src/serialize.js";

describe("serialize", () => {
  it("serializes numbers to strings", () => {
    expect(serialize(123)).toBe("123");
    expect(serialize(0)).toBe("0");
    expect(serialize(-42)).toBe("-42");
  });

  it("serializes booleans to strings", () => {
    expect(serialize(true)).toBe("on");
    expect(serialize(false)).toBe("off");
  });

  it("serializes booleans with custom true value", () => {
    expect(serialize(true, { booleanTrueValue: "yes" })).toBe("yes");
  });

  it("serializes booleans with custom false value", () => {
    expect(serialize(false, { booleanFalseValue: "no" })).toBe("no");
  });

  it("serializes dates to ISO strings", () => {
    const date = new Date("2024-01-01T12:00:00.000Z");
    expect(serialize(date)).toBe("2024-01-01T12:00:00.000Z");
  });

  it("serializes plain objects", () => {
    const obj = {
      a: 1,
      b: "hello",
      c: true,
      d: false,
      e: new Date("2024-02-20T10:00:00.000Z"),
    };
    expect(serialize(obj)).toEqual({
      a: "1",
      b: "hello",
      c: "on",
      d: "off",
      e: "2024-02-20T10:00:00.000Z",
    });
  });

  it("serializes nested objects", () => {
    const obj = { a: { b: 1, c: { d: "test", e: true, f: false } } };
    expect(serialize(obj)).toEqual({
      a: {
        b: "1",
        c: {
          d: "test",
          e: "on",
          f: "off",
        },
      },
    });
  });

  it("serializes arrays", () => {
    const arr = [1, "test", true, false, new Date("2024-03-15T15:30:00.000Z")];
    expect(serialize(arr)).toEqual([
      "1",
      "test",
      "on",
      "off",
      "2024-03-15T15:30:00.000Z",
    ]);
  });

  it("serializes nested arrays and objects", () => {
    const data = {
      a: [1, { b: true, c: false, d: new Date("2024-10-10") }],
      e: { f: [2, 3], g: true, h: false },
    };
    expect(serialize(data)).toEqual({
      a: ["1", { b: "on", c: "off", d: "2024-10-10T00:00:00.000Z" }],
      e: { f: ["2", "3"], g: "on", h: "off" },
    });
  });

  it("serializes bigint to string", () => {
    expect(serialize(1234567890123456789012345678901234567890n)).toBe(
      "1234567890123456789012345678901234567890",
    );
  });

  it("does not serialize files", () => {
    const file = new File(["test"], "test.txt", { type: "text/plain" });
    expect(serialize(file)).toBe(file); // Should return the instance itself
  });

  it("does not serialize class instances", () => {
    class MyClass {
      prop1 = "test";
      method1() {
        return "method";
      }
    }
    const instance = new MyClass();
    expect(serialize(instance)).toBe(instance); // Should return the instance itself
  });

  it("does not serialize functions", () => {
    const myFunction = () => "function";
    expect(serialize(myFunction)).toBe(myFunction); // Should return the function itself
  });

  it("does not serialize regex", () => {
    const myRegex = /test/g;
    expect(serialize(myRegex)).toBe(myRegex); // Should return the regex itself
  });

  it("does not serialize Maps", () => {
    const myMap = new Map([["key1", "value1"]]);
    expect(serialize(myMap)).toBe(myMap); // Should return the Map itself
  });

  it("does not serialize Sets", () => {
    const mySet = new Set([1, 2, 3]);
    expect(serialize(mySet)).toBe(mySet); // Should return the Set itself
  });
});
