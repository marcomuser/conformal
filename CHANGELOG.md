# conformal

## 2.1.1

### Patch Changes

- [#39](https://github.com/marcomuser/conformal/pull/39) [`76d370d`](https://github.com/marcomuser/conformal/commit/76d370dc71027ce45c044c6f9d7e0116e83383ef) Thanks [@marcomuser](https://github.com/marcomuser)! - Align coerceNumber invalid input handling

- [#39](https://github.com/marcomuser/conformal/pull/39) [`76d370d`](https://github.com/marcomuser/conformal/commit/76d370dc71027ce45c044c6f9d7e0116e83383ef) Thanks [@marcomuser](https://github.com/marcomuser)! - Refactored valibot utilities from schemas to composable coercion pipes for form input preprocessing.

## 2.1.0

### Minor Changes

- [#35](https://github.com/marcomuser/conformal/pull/35) [`3224bd7`](https://github.com/marcomuser/conformal/commit/3224bd71d94dd0841adb4002be73377bead4e8e7) Thanks [@marcomuser](https://github.com/marcomuser)! - Add coerce functions
  - Add `coerceString`, `coerceNumber`, `coerceBigint`, `coerceBoolean`, `coerceDate`, `coerceFile`, `coerceArray` functions
  - These utilities help convert form input values to their expected types
  - Essential for building custom schema implementations (like zod preproccessors or valibot transforms)

- [#35](https://github.com/marcomuser/conformal/pull/35) [`3224bd7`](https://github.com/marcomuser/conformal/commit/3224bd71d94dd0841adb4002be73377bead4e8e7) Thanks [@marcomuser](https://github.com/marcomuser)! - Deprecate zod utilities
  - Mark `conformal/zod` utilities as deprecated
  - Zod's `z.preprocess` returns a `ZodPipe` which doesn't allow method chaining, making these utilities less useful than expected
  - Zod utilities will be removed in the next major release
  - Users can migrate to using z.preprocess with the new coerce functions directly:

  ```typescript
  import * as z from "zod";
  import { coerceNumber } from "conformal";

  z.preprocess(coerceNumber, z.number().min(5));
  ```

- [#35](https://github.com/marcomuser/conformal/pull/35) [`3224bd7`](https://github.com/marcomuser/conformal/commit/3224bd71d94dd0841adb4002be73377bead4e8e7) Thanks [@marcomuser](https://github.com/marcomuser)! - Add valibot schemas
  - Add `conformal/valibot` subpath with valibot utilities
  - Provides `string`, `number`, `boolean`, `date`, `bigint`, `picklist`, `file`, `array` schemas
  - Uses conformal's coerce functions for automatic form input preprocessing
  - Fully compatible with valibot and can be mixed with regular valibot schemas
  - Marked as experimental - API may change

### Patch Changes

- [#35](https://github.com/marcomuser/conformal/pull/35) [`3224bd7`](https://github.com/marcomuser/conformal/commit/3224bd71d94dd0841adb4002be73377bead4e8e7) Thanks [@marcomuser](https://github.com/marcomuser)! - Align serialize false boolean behavior with coerceBoolean

## 2.0.0

### Major Changes

- [#29](https://github.com/marcomuser/conformal/pull/29) [`cc831d5`](https://github.com/marcomuser/conformal/commit/cc831d546af61cb1f5e8160afebace780e9ee50f) Thanks [@marcomuser](https://github.com/marcomuser)! - ## Breaking Changes
  - **Rename `parse` to `decode`**: The `parse` function has been renamed to `decode` to better reflect its purpose of decoding FormData into structured objects. This is a pure data transformation function with no validation.
  - **Rename `parseWithSchema` to `parseFormData`**: The `parseWithSchema` function has been renamed to `parseFormData` to be more specific about its input type and purpose. This function parses and validates FormData against a schema.

- [#29](https://github.com/marcomuser/conformal/pull/29) [`cc831d5`](https://github.com/marcomuser/conformal/commit/cc831d546af61cb1f5e8160afebace780e9ee50f) Thanks [@marcomuser](https://github.com/marcomuser)! - ## Breaking Changes
  - **Upgrade type-fest to v5**: This release upgrades to type-fest v5, which requires TypeScript 5.9+ and Node.js v20+. Users will need to upgrade their TypeScript and Node.js versions to continue using this library.

## 1.4.0

### Minor Changes

- [#25](https://github.com/marcomuser/conformal/pull/25) [`22a44cb`](https://github.com/marcomuser/conformal/commit/22a44cb1cb7e7e24be5d87dce4ff88b247f1caa0) Thanks [@marcomuser](https://github.com/marcomuser)! - Enhance zod field schemas with array support and improved error handling
  - Add `zf.array()` with FormData-friendly preprocessing for multiselect/multicheckbox handling (single values become single-item arrays, multiple values stay arrays, empty strings become empty arrays)
  - Improve `zf.bigint()` with try-catch for graceful error handling to avoid runtime exceptions
  - Improve `zf.date()` with invalid date detection
  - Export `zf.object()` for convenient access alongside other zod field schemas

## 1.3.1

### Patch Changes

- [#17](https://github.com/marcomuser/conformal/pull/17) [`2dd994d`](https://github.com/marcomuser/conformal/commit/2dd994d53dbbbb0466ef1befe32331069db4be03) Thanks [@marcomuser](https://github.com/marcomuser)! - Align serialize with parse behavior

- [#19](https://github.com/marcomuser/conformal/pull/19) [`859196a`](https://github.com/marcomuser/conformal/commit/859196a14583824c11b618443f534abd3ad100b9) Thanks [@marcomuser](https://github.com/marcomuser)! - fix react example

## 1.3.0

### Minor Changes

- [#14](https://github.com/marcomuser/conformal/pull/14) [`5d5a4dd`](https://github.com/marcomuser/conformal/commit/5d5a4dd823649d90a78d4acb1c8bc611dcee9a85) Thanks [@marcomuser](https://github.com/marcomuser)! - Add zod field schemas

## 1.2.1

### Patch Changes

- [#11](https://github.com/marcomuser/conformal/pull/11) [`23953d3`](https://github.com/marcomuser/conformal/commit/23953d3d0d7c720be2cdeed10e5808de0768e0ab) Thanks [@marcomuser](https://github.com/marcomuser)! - Fix ParsedValue type to match parse behavior

## 1.2.0

### Minor Changes

- [#8](https://github.com/marcomuser/conformal/pull/8) [`b39f302`](https://github.com/marcomuser/conformal/commit/b39f302de67eb49ea79e6d96ae370bd8af4b56c0) Thanks [@marcomuser](https://github.com/marcomuser)! - Add submission() method to parseWithSchema return object

## 1.1.0

### Minor Changes

- [#5](https://github.com/marcomuser/conformal/pull/5) [`54a6604`](https://github.com/marcomuser/conformal/commit/54a6604b80228a1a884505bff26289bddbd258c5) Thanks [@marcomuser](https://github.com/marcomuser)! - Added PathsFromObject type to package exports.
  Fixed legacy node10 resolution.
