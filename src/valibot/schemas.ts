import * as v from "valibot";
import {
  coerceString,
  coerceNumber,
  coerceBigint,
  coerceBoolean,
  coerceDate,
  coerceFile,
  coerceArray,
} from "../coerce.js";

export function string<
  const TMessage extends v.ErrorMessage<v.StringIssue> | undefined,
>(message?: TMessage) {
  return v.pipe(v.unknown(), v.transform(coerceString), v.string(message));
}

export function number<
  const TMessage extends v.ErrorMessage<v.NumberIssue> | undefined,
>(message?: TMessage) {
  return v.pipe(v.unknown(), v.transform(coerceNumber), v.number(message));
}

export function bigint<
  const TMessage extends v.ErrorMessage<v.BigintIssue> | undefined,
>(message?: TMessage) {
  return v.pipe(v.unknown(), v.transform(coerceBigint), v.bigint(message));
}

export function boolean<
  const TMessage extends v.ErrorMessage<v.BooleanIssue> | undefined,
>(message?: TMessage) {
  return v.pipe(v.unknown(), v.transform(coerceBoolean), v.boolean(message));
}

export function date<
  const TMessage extends v.ErrorMessage<v.DateIssue> | undefined,
>(message?: TMessage) {
  return v.pipe(v.unknown(), v.transform(coerceDate), v.date(message));
}

export function picklist<
  const TOptions extends string[] | Readonly<string[]>,
  const TMessage extends v.ErrorMessage<v.PicklistIssue> | undefined,
>(options: TOptions, message?: TMessage) {
  return v.pipe(
    v.unknown(),
    v.transform(coerceString),
    v.picklist(options, message),
  );
}

export function file<
  const TMessage extends v.ErrorMessage<v.FileIssue> | undefined,
>(message?: TMessage) {
  return v.pipe(v.unknown(), v.transform(coerceFile), v.file(message));
}

export function array(
  item: v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
  message?: v.ErrorMessage<v.ArrayIssue>,
) {
  return v.pipe(v.unknown(), v.transform(coerceArray), v.array(item, message));
}
