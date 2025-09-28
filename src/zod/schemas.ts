import * as z from "zod";
import {
  coerceString,
  coerceNumber,
  coerceBigint,
  coerceBoolean,
  coerceDate,
  coerceFile,
  coerceArray,
} from "../coerce.js";

export function string(params?: Parameters<typeof z.string>[0]) {
  return z.preprocess(coerceString, z.string(params));
}

export function number(params?: Parameters<typeof z.number>[0]) {
  return z.preprocess(coerceNumber, z.number(params));
}

export function bigint(params?: Parameters<typeof z.bigint>[0]) {
  return z.preprocess(coerceBigint, z.bigint(params));
}

export function boolean(params?: Parameters<typeof z.boolean>[0]) {
  return z.preprocess(coerceBoolean, z.boolean(params));
}

export function date(params?: Parameters<typeof z.date>[0]) {
  return z.preprocess(coerceDate, z.date(params));
}

export function enum_<const T extends readonly string[]>(
  values: T,
  params?: Parameters<typeof z.enum>[1],
) {
  return z.preprocess(coerceString, z.enum(values, params));
}

export function file(params?: Parameters<typeof z.file>[0]) {
  return z.preprocess(coerceFile, z.file(params));
}

export function email(params?: Parameters<typeof z.email>[0]) {
  return z.preprocess(coerceString, z.email(params));
}

export function url(params?: Parameters<typeof z.url>[0]) {
  return z.preprocess(coerceString, z.url(params));
}

export const object = z.object;

export function array<T extends z.core.SomeType>(
  element: T,
  params?: Parameters<typeof z.array>[1],
) {
  return z.preprocess(coerceArray, z.array(element, params));
}
