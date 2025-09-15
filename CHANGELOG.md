# conformal

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
