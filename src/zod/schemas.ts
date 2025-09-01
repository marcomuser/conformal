import * as z from "zod";

export function string(params?: Parameters<typeof z.string>[0]) {
  return z.preprocess((v) => {
    if (typeof v !== "string") {
      return v;
    }
    if (v === "") {
      return undefined;
    }
    return v;
  }, z.string(params));
}

export function number(params?: Parameters<typeof z.number>[0]) {
  return z.preprocess((v) => {
    if (typeof v !== "string") {
      return v;
    }
    if (v.trim() === "") {
      return undefined;
    }
    return Number(v);
  }, z.number(params));
}

export function bigint(params?: Parameters<typeof z.bigint>[0]) {
  return z.preprocess((v) => {
    if (typeof v !== "string") {
      return v;
    }
    if (v.trim() === "") {
      return undefined;
    }
    return BigInt(v);
  }, z.bigint(params));
}

export function boolean(params?: Parameters<typeof z.boolean>[0]) {
  return z.preprocess((v) => {
    if (typeof v !== "string") {
      return v;
    }
    if (v === "") {
      return undefined;
    }
    return v === "true" || v === "on" || v === "1" || v === "yes" ? true : v;
  }, z.boolean(params));
}

export function date(params?: Parameters<typeof z.date>[0]) {
  return z.preprocess((v) => {
    if (typeof v !== "string") {
      return v;
    }
    if (v === "") {
      return undefined;
    }
    return new Date(v);
  }, z.date(params));
}

export function enum_<T extends readonly [string, ...string[]]>(
  values: T,
  params?: Parameters<typeof z.enum>[1],
) {
  return z.preprocess(
    (v) => {
      if (typeof v !== "string") {
        return v;
      }
      if (v === "") {
        return undefined;
      }
      return v;
    },
    z.enum(values, params),
  );
}

export function file(params?: Parameters<typeof z.file>[0]) {
  return z.preprocess((v) => {
    if (!(v instanceof File)) {
      return v;
    }
    if (v.size === 0) {
      return undefined;
    }
    return v;
  }, z.file(params));
}

export function email(params?: Parameters<typeof z.email>[0]) {
  return z.preprocess((v) => {
    if (typeof v !== "string") {
      return v;
    }
    if (v === "") {
      return undefined;
    }
    return v;
  }, z.email(params));
}

export function url(params?: Parameters<typeof z.url>[0]) {
  return z.preprocess((v) => {
    if (typeof v !== "string") {
      return v;
    }
    if (v === "") {
      return undefined;
    }
    return v;
  }, z.url(params));
}
