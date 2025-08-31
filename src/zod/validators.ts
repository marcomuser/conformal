import * as z from "zod";

export function string(params?: string | z.core.$ZodStringParams) {
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

export function number(params?: z.core.$ZodNumberParams) {
  return z.preprocess((v) => {
    if (typeof v !== "string") {
      return v;
    }
    if (v === "") {
      return undefined;
    }
    return Number(v);
  }, z.number(params));
}

export function bigint(params?: z.core.$ZodBigIntParams) {
  return z.preprocess((v) => {
    if (typeof v !== "string") {
      return v;
    }
    if (v === "") {
      return undefined;
    }
    return BigInt(v);
  }, z.bigint(params));
}

export function boolean(params?: z.core.$ZodBooleanParams) {
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

export function date(params?: z.core.$ZodDateParams) {
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
  params?: z.core.$ZodEnumParams,
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
