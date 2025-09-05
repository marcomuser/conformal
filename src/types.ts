import type { StandardSchemaV1 } from "@standard-schema/spec";
import type { Get, PartialDeep, Paths, UnknownRecord } from "type-fest";

export type InputValue<Value> = Value extends Date | number | bigint | boolean
  ? string
  : Value extends Blob
    ? File
    : Value extends Array<infer Item>
      ? Array<InputValue<Item>>
      : Value extends AnyRecord
        ? { [Key in keyof Value]: InputValue<Value[Key]> }
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

export type Submission<Output = UnknownRecord> =
  | {
      /** The outcome of the last submission. */
      readonly status: "success";
      /** The typed output value. Only present if `status === "success"`. */
      readonly value: Output;
      /** The raw user input as submitted. */
      readonly input: PartialDeep<InputValue<Output>>;
      /** Field-specific validation errors. */
      readonly fieldErrors: Partial<Record<PathsFromObject<Output>, string[]>>;
      /** Form-level validation errors. */
      readonly formErrors: ReadonlyArray<string>;
    }
  | {
      /** The outcome of the last submission. */
      readonly status: "idle" | "error";
      /** The typed output value. Only present if `status === "success"`. */
      readonly value?: undefined;
      /** The raw user input as submitted. */
      readonly input: PartialDeep<InputValue<Output>>;
      /** Field-specific validation errors. */
      readonly fieldErrors: Partial<Record<PathsFromObject<Output>, string[]>>;
      /** Form-level validation errors. */
      readonly formErrors: ReadonlyArray<string>;
    };

export type SchemaResult<T extends StandardSchemaV1> = StandardSchemaV1.Result<
  StandardSchemaV1.InferOutput<T>
> & {
  submission: () => Submission<StandardSchemaV1.InferOutput<T>>;
};
