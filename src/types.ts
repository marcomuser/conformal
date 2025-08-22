import type { Get, Paths } from "type-fest";

export type ParsedValue<Value> = Value extends Date | number | bigint
  ? string
  : Value extends boolean
    ? string | undefined
    : Value extends Blob
      ? File
      : Value extends null
        ? undefined
        : Value extends Array<infer Item>
          ? Array<ParsedValue<Item>>
          : Value extends AnyRecord
            ? { [Key in keyof Value]: ParsedValue<Value[Key]> }
            : Value;

export type SerializedValue<Value> = Value extends Blob | FileList
  ? Value
  : Value extends Date | number | bigint
    ? string
    : Value extends null
      ? undefined
      : Value extends Array<infer Item>
        ? Array<SerializedValue<Item>>
        : Value extends AnyRecord
          ? { [Key in keyof Value]: SerializedValue<Value[Key]> }
          : Value;

type FilterBrowserBuiltIns<Value> = Value extends Blob | FileList | Date
  ? never
  : Value extends Array<infer Item>
    ? Array<FilterBrowserBuiltIns<Item>>
    : Value extends AnyRecord
      ? { [Key in keyof Value]: FilterBrowserBuiltIns<Value[Key]> }
      : never;

export type PathsFromObject<BaseType> = Paths<
  FilterBrowserBuiltIns<BaseType>,
  { bracketNotation: true }
>;

export type GetFromObject<
  BaseType,
  Path extends PathsFromObject<BaseType>,
> = Get<BaseType, Path, { strict: true }>;

export type AnyRecord = Record<PropertyKey, any>;
