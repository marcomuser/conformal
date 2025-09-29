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

/**
 * @deprecated The Zod utilities will be removed in the next major release.
 */
export function string(
  params?: Parameters<typeof z.string>[0],
): z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodString> {
  return z.preprocess(coerceString, z.string(params));
}

/**
 * @deprecated The Zod utilities will be removed in the next major release.
 */
export function number(
  params?: Parameters<typeof z.number>[0],
): z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodNumber> {
  return z.preprocess(coerceNumber, z.number(params));
}

/**
 * @deprecated The Zod utilities will be removed in the next major release.
 */
export function bigint(
  params?: Parameters<typeof z.bigint>[0],
): z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodBigInt> {
  return z.preprocess(coerceBigint, z.bigint(params));
}

/**
 * @deprecated The Zod utilities will be removed in the next major release.
 */
export function boolean(
  params?: Parameters<typeof z.boolean>[0],
): z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodBoolean> {
  return z.preprocess(coerceBoolean, z.boolean(params));
}

/**
 * @deprecated The Zod utilities will be removed in the next major release.
 */
export function date(
  params?: Parameters<typeof z.date>[0],
): z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodDate> {
  return z.preprocess(coerceDate, z.date(params));
}

/**
 * @deprecated The Zod utilities will be removed in the next major release.
 */
export function enum_<const T extends readonly string[]>(
  values: T,
  params?: Parameters<typeof z.enum>[1],
): z.ZodPipe<
  z.ZodTransform<unknown, unknown>,
  z.ZodEnum<{
    [k in keyof { [k in T[number]]: k }]: { [k in T[number]]: k }[k];
  }>
> {
  return z.preprocess(coerceString, z.enum(values, params));
}

/**
 * @deprecated The Zod utilities will be removed in the next major release.
 */
export function file(
  params?: Parameters<typeof z.file>[0],
): z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodFile> {
  return z.preprocess(coerceFile, z.file(params));
}

/**
 * @deprecated The Zod utilities will be removed in the next major release.
 */
export function email(
  params?: Parameters<typeof z.email>[0],
): z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodEmail> {
  return z.preprocess(coerceString, z.email(params));
}

/**
 * @deprecated The Zod utilities will be removed in the next major release.
 */
export function url(
  params?: Parameters<typeof z.url>[0],
): z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodURL> {
  return z.preprocess(coerceString, z.url(params));
}

/**
 * @deprecated The Zod utilities will be removed in the next major release.
 */
export const object: <T extends z.ZodRawShape>(
  shape: T,
) => z.ZodObject<z.core.util.Writeable<T>, z.core.$strip> = z.object;

/**
 * @deprecated The Zod utilities will be removed in the next major release.
 */
export function array<T extends z.core.SomeType>(
  element: T,
  params?: Parameters<typeof z.array>[1],
): z.ZodPipe<z.ZodTransform<unknown[], unknown>, z.ZodArray<T>> {
  return z.preprocess(coerceArray, z.array(element, params));
}
