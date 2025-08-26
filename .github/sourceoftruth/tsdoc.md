# TSDoc Requirement Checklist (TypeScript 5.9.2)

Use this checklist to standardize TSDoc across a TypeScript 5.9.2 codebase. It
focuses on enforceable conventions, minimum documentation coverage, and
compatibility with popular tooling such as API Extractor and TypeDoc.

## Scope and Goals

- Align doc comments with TSDoc standard (not raw JSDoc).
- Ensure API surfaces are discoverable, accurate, and tool-friendly.
- Avoid type duplication in comments—leverage the TypeScript types.

## Global Requirements

- Use /\*_ … _/ TSDoc block comments above declarations (no // line comments for
  API docs).
- Write concise, developer-oriented docs; avoid restating types already clear
  from signatures.
- Keep comments language-neutral, present tense, and imperative for commands.
- Prefer Markdown inline formatting where allowed (code spans, lists, links) and
  keep it restrained.

## Project Configuration

- Enable strict type-checking (recommended): strict true in tsconfig.
- Ensure declaration output for public packages: declaration true or use d.ts
  rollups in build.
- Ensure source-level doc comments are preserved in the emitted declarations.
- Document generation target: choose and configure one:
  - API Extractor (for API review, d.ts rollups, and model JSON)
  - TypeDoc (for HTML/Markdown documentation)

## Coverage Targets

- Public API (exported) must be documented:
  - Packages, namespaces, modules
  - Public classes, interfaces, type aliases, enums
  - Public functions, methods, properties, accessors, constants
- Internal-only or non-exported entities should either be:
  - Documented if significant, or
  - Hidden via @internal or project tooling configuration
- Minimum standards:
  - All exported declarations: summary present
  - All parameters: described
  - All return values: described (unless void/obvious)
  - All thrown errors: described if part of contract
  - All deprecations: annotated and justified

## Comment Structure Requirements

- Start with a one-sentence summary line.
- Optionally follow with a blank line and extended remarks.
- Order of sections:
  1. Summary
  2. Remarks
  3. Example(s)
  4. Parameters
  5. Returns
  6. Throws
  7. See also
  8. Tags (deprecated, internal, beta, sealed, override, etc.)

## Allowed TSDoc Tags (Core)

- @remarks – Longer description beyond summary.
- @example – One or more code examples; use fenced code blocks with language.
- @param name – Description for each parameter; match parameter names exactly.
- @returns – Description of the return value.
- @throws – Specify error types/conditions (document observable contract).
- @see – References to related APIs or docs.
- @defaultValue – For fields with default behavior/values.
- @deprecated – Reason and alternative; include migration guidance.
- @internal – Exclude from public docs; for internal-only APIs.
- @beta or @alpha – Mark stability; ensure tooling recognizes release tags.
- @sealed/@virtual/@override – Behavioral contracts where applicable.

Note: Avoid undocumented custom tags unless tooling is configured to support
them.

## Prohibitions and Pitfalls

- Do not duplicate types in prose (avoid “param x: string” in text).
- Do not include implementation details that can drift from code; focus on
  observable behavior.
- Do not use HTML where Markdown suffices.
- Do not rely on JSDoc-only type syntax; TypeScript types come from signatures,
  not comments.
- Avoid vague summaries like “Helper function” or “Does X”.

## Style Guide Essentials

- Summary: one concise sentence, active voice.
- Parameter descriptions: explain purpose, units, constraints, notable defaults.
- Returns: what is returned, shape/semantics, non-obvious behaviors (e.g., null
  vs empty).
- Throws: documented only for errors that are part of the contract (not
  incidental).
- Examples: runnable or realistic code snippets, minimal imports, show expected
  behavior/output.
- Use code formatting:
  - Inline code with backticks: `likeThis`
  - Fenced blocks: `ts ... `
- Links:
  - Prefer relative references via @see or in Markdown; avoid fragile external
    links where possible.

## API Surface Specifics

### Functions

- Document all parameters via @param.
- Clarify side effects and performance notes in @remarks if relevant.
- Document error modes via @throws.

### Classes

- Class summary describes purpose and key responsibilities.
- Constructor parameters documented; note invariants and required preconditions.
- Methods and accessors documented; note mutability and side effects.
- Properties: include @defaultValue when relevant.

### Interfaces and Type Aliases

- Summarize intent and compatibility expectations.
- For complex shapes, add @remarks explaining important fields/constraints.

### Enums

- Enum summary describes the domain.
- Every member gets a short description; document flags/bitwise semantics if
  applicable.

### Generics and Overloads

- Explain generic type parameters in @remarks (constraints, inference
  expectations).
- For overloads, ensure summaries differentiate when to use each overload.

### Errors and Exceptions

- Prefer typed error results (e.g., discriminated unions) where appropriate.
- If throwing, standardize error classes and document in @throws.

## Stability and Versioning

- Use @beta/@alpha for pre-release APIs.
- Use @deprecated with version and migration path; avoid silent removals.
- Maintain changelogs that cross-reference added/deprecated/removed APIs.

## Examples Standard

- At least one realistic @example for public entry points.
- Ensure examples compile under TypeScript 5.9.2 syntax.
- Prefer deterministic examples; show input and expected output where helpful.

## Internationalization and Accessibility

- Avoid colloquialisms; keep wording clear for non-native speakers.
- Describe units, time zones, encodings, locales when relevant.

## Tooling and Validation

- Lint for doc presence/quality using:
  - ESLint rules for requiring TSDoc on exported members
  - Custom rules for empty summaries, missing @param/@returns
- Validate with chosen doc tool:
  - API Extractor: no undocumented exports; approved API reports
  - TypeDoc: build with zero warnings for unmatched/malformed tags

## Documentation Debt Rules

- New or changed public APIs must include complete TSDoc before merge.
- Failing checks (missing summary/params/returns or malformed tags) block CI.
- Track debt with issues linked to symbols and commit SHA.

## Migration Aids

- For existing JSDoc:
  - Remove type annotations from comments; rely on TS types.
  - Replace non-standard tags with TSDoc equivalents or supported custom tags in
    tooling config.
  - Normalize summaries and parameter descriptions.

## Review Checklist (Per Symbol)

- Summary present and accurate.
- @remarks used for non-trivial behavior.
- All @param present, accurate, and match names.
- @returns present when non-void.
- @throws documented for contractually thrown errors.
- Examples present where beneficial and compile.
- Deprecated/beta/internal tags used correctly.
- No type info duplicated in prose; no stale implementation details.
- Markdown renders cleanly (no broken code fences/links).
- Spelling/grammar passes.

## Sample TSDoc Templates

### Function

/\*\*

- Computes the checksum for a UTF-8 string.
-
- @remarks Uses the CRC32c polynomial. Input is normalized to NFC before
  processing.
-
- @param input - The UTF-8 string to hash.
- @param seed - Optional seed to vary the result; use 0 for the default
  behavior.
- @returns The unsigned 32-bit checksum as a number.
- @throws RangeError - Thrown if the normalized input exceeds the maximum
  allowed length.
-
- @example
- ```ts

  ```

- const sum = crc32c("hello");
- // sum === 0x9AE0DAAF
- ```

  ```

-
- @see normalize _/ export function crc32c(input: string, seed = 0): number { /_
  ... \*/ }

### Class

/\*\*

- A resilient queue with at-least-once delivery.
-
- @remarks Messages are persisted to disk and retried with exponential backoff.
  \*/ export class DurableQueue { /\*\*
  - Enqueues a message for processing.
  -
  - @param message - The JSON-serializable payload.
  - @returns A unique message identifier. _/ enqueue(message: unknown): string {
    /_ ... \*/ } }

### Interface

/\*\*

- Configuration for HTTP client retries.
-
- @remarks Time values are in milliseconds. _/ export interface RetryOptions {
  /\*\* Maximum number of retry attempts. _/ attempts: number; /** Base delay
  before the first retry. \*/ baseDelayMs: number; /** Whether to use jitter to
  randomize backoff intervals. \*/ jitter?: boolean; }

## Maintenance

- Periodically audit public API TSDoc for accuracy after feature changes.
- Keep examples updated with current APIs and runtime behavior.
- Automate CI to fail on undocumented exports or malformed tags.

---

Notes

- This checklist is tailored for TypeScript 5.9.2 syntax and build behavior.
- If a specific documentation generator is mandated, augment this with its
  configuration and tag support matrix.

[1](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-9.html)
[2](https://github.com/microsoft/typescript/releases)
[3](https://devblogs.microsoft.com/typescript/announcing-typescript-5-9/)
[4](https://www.npmjs.com/package/typescript)
[5](https://devblogs.microsoft.com/typescript/)
[6](https://www.youtube.com/watch?v=oH_-6TyxVhI)
[7](https://www.nuget.org/packages/Microsoft.TypeScript.MSBuild/5.9.2)
[8](https://www.youtube.com/watch?v=La56RcRrPIo)
[9](https://marketplace.visualstudio.com/items?itemName=TypeScriptTeam.typescript-592)
[10](https://tsdoc.org)
