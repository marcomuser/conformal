import * as v from "valibot";

export function string<
  const TMessage extends v.ErrorMessage<v.StringIssue> | undefined,
>(message?: TMessage) {
  return v.pipe(
    v.string(message),
    v.transform((input) => {
      if (input === "") {
        return undefined;
      }
      return input;
    }),
    v.string(message),
  );
}

export function number<
  const TMessage extends
    | v.ErrorMessage<v.StringIssue | v.NumberIssue>
    | undefined,
>(message?: TMessage) {
  return v.pipe(
    v.string(message),
    v.transform((input) => {
      if (input.trim() === "") {
        return undefined;
      }
      return Number(input);
    }),
    v.number(message),
  );
}

export function bigint<
  const TMessage extends
    | v.ErrorMessage<v.StringIssue | v.BigintIssue>
    | undefined,
>(message?: TMessage) {
  return v.pipe(
    v.string(message),
    v.transform((input) => {
      if (input.trim() === "") {
        return undefined;
      }
      try {
        return BigInt(input);
      } catch {
        return input;
      }
    }),
    v.bigint(message),
  );
}

export function boolean<
  const TMessage extends
    | v.ErrorMessage<v.StringIssue | v.BooleanIssue>
    | undefined,
>(message?: TMessage) {
  return v.pipe(
    v.string(message),
    v.transform((input) => {
      if (input === "") {
        return undefined;
      }
      return input === "true" ||
        input === "on" ||
        input === "1" ||
        input === "yes"
        ? true
        : false;
    }),
    v.boolean(message),
  );
}

export function date<
  const TMessage extends
    | v.ErrorMessage<v.StringIssue | v.DateIssue>
    | undefined,
>(message?: TMessage) {
  return v.pipe(
    v.string(message),
    v.transform((input) => {
      if (input === "") {
        return undefined;
      }
      const date = new Date(input);
      return Number.isNaN(date.getTime()) ? input : date;
    }),
    v.date(message),
  );
}

export function picklist<
  const TOptions extends
    | readonly string[]
    | readonly number[]
    | readonly bigint[],
  const TMessage extends
    | v.ErrorMessage<
        v.PicklistIssue | v.StringIssue | v.NumberIssue | v.BigintIssue
      >
    | undefined,
>(options: TOptions, message?: TMessage) {
  return v.pipe(
    v.string(),
    v.transform((input) => {
      const isString = options.some((opt) => typeof opt === "string");
      const isNumber = options.some((opt) => typeof opt === "number");
      const isBigInt = options.some((opt) => typeof opt === "bigint");

      if (isString) {
        if (input === "") {
          return undefined;
        }
        return input;
      }
      if (isNumber) {
        if (input.trim() === "") {
          return undefined;
        }
        return Number(input);
      }

      if (isBigInt) {
        if (input.trim() === "") {
          return undefined;
        }
        try {
          return BigInt(input);
        } catch {
          return input;
        }
      }
      return input;
    }),
    v.picklist(options, message),
  );
}

export function file<
  const TMessage extends v.ErrorMessage<v.FileIssue> | undefined,
>(message?: TMessage) {
  return v.pipe(
    v.file(message),
    v.transform((input) => {
      if (input.size === 0) {
        return undefined;
      }
      return input;
    }),
    v.file(message),
  );
}

export function array(
  item: v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
  message?: v.ErrorMessage<v.ArrayIssue>,
) {
  return v.pipe(
    v.unknown(),
    v.transform((input) => {
      if (Array.isArray(input)) {
        return input;
      }
      if (input === "") {
        return [];
      }
      return [input];
    }),
    v.array(item, message),
  );
}
