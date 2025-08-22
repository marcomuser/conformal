/**
 * This file was originally ported from nanostores: https://github.com/nanostores/nanostores
 * @license
 * Copyright 2020 Andrey Sitnik <andrey@sitnik.ru>
 * Copyright (c) 2025 Marco Muser
 * SPDX-License-Identifier: MIT
 */

import type { UnknownRecord } from "type-fest";
import type { AnyRecord, GetFromObject, PathsFromObject } from "./types.js";

/**
 * Get a value by object path. `undefined` if key is missing.
 *
 * @param obj Any object.
 * @param path Path splitted by dots and `[]`. Like: `props.arr[1].nested`.
 * @returns The value for this path. Undefined if key is missing.
 *
 * @example
 * ```ts
 * getPath({ a: { b: { c: ['hey', 'Hi!'] } } }, 'a.b.c[1]') // Returns 'Hi!'
 * ```
 */
export function getPath<T extends AnyRecord, K extends PathsFromObject<T>>(
  obj: T,
  path: K,
): GetFromObject<T, K> {
  const allKeys = getAllKeysFromPath(path);
  let res = obj;
  for (const key of allKeys) {
    if (res === undefined) {
      break;
    }
    res = res[key];
  }
  return res as GetFromObject<T, K>;
}

/**
 * Set a deep value by path. Copies are made at each level of `path` so that no
 * part of the original object is mutated (but it does not do a full deep copy
 * -- some sub-objects may still be shared between the old value and the new
 * one). Sparse arrays will be created if you set arbitrary length.
 *
 * @param obj Any object.
 * @param path Path splitted by dots and `[]`. Like: `props.arr[1].nested`.
 * @returns The new object.
 *
 * @example
 * ```ts
 * setPath({ a: { b: { c: [] } } }, 'a.b.c[1]', 'hey')
 * // Returns { a: { b: { c: [<empty>, 'hey'] } } }
 * ```
 */
export function setPath<TObj extends UnknownRecord, TPath extends string, TVal>(
  obj: TObj,
  path: TPath,
  value: TVal,
): TObj {
  return setByKey(
    obj != null ? obj : ({} as TObj),
    getAllKeysFromPath(path),
    value,
  ) as TObj;
}

function setByKey<TObj extends AnyRecord>(
  obj: TObj,
  splittedKeys: string[],
  value: unknown,
) {
  const key = splittedKeys[0];

  if (
    key === "__proto__" ||
    (key === "constructor" && splittedKeys[1] === "prototype")
  ) {
    return obj;
  }

  const copy = Array.isArray(obj) ? [...obj] : { ...obj };
  if (splittedKeys.length === 1) {
    if (value === undefined || value === null) {
      if (Array.isArray(copy)) {
        copy.splice(Number(key), 1);
      } else {
        delete copy[key];
      }
    } else {
      copy[key as any] = value;
    }
    return copy;
  }
  ensureKey(copy, key, splittedKeys[1]);
  copy[key as any] = setByKey(copy[key as any], splittedKeys.slice(1), value);
  return copy;
}

function getAllKeysFromPath(path: string): string[] {
  return path.split(".").flatMap(getKeyAndIndicesFromKey);
}

const ARRAY_INDEX = /(.*)\[(\d+)\]/;
function getKeyAndIndicesFromKey(key: string): string[] {
  if (ARRAY_INDEX.test(key)) {
    const [, keyPart, index] = key.match(ARRAY_INDEX) ?? [];
    return [...getKeyAndIndicesFromKey(keyPart), index];
  }
  return [key];
}

const IS_NUMBER = /^\d+$/;
function ensureKey(obj: AnyRecord, key: string, nextKey: string) {
  if (key in obj) {
    return;
  }

  const isNum = IS_NUMBER.test(nextKey);

  if (isNum) {
    obj[key] = Array(parseInt(nextKey, 10) + 1);
  } else {
    obj[key] = {};
  }
}
