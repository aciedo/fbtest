# FlatBuffer testing

A simple repo for testing FlatBuffers with TypeScript & Rust to see if it's a viable option for our project.

Make sure you have `flatc` installed. You can get pre-built binaries from [here](https://github.com/google/flatbuffers/releases). You need Rust installed for Rust, and Node.js 18 (installed with [volta](https://volta.sh/)) and `pnpm` (`volta install pnpm`) for TypeScript.

## TypeScript

Main file is `index.ts` which is compiled to `index.js` with `tsc` with `pnpm build`. Run with `node index.js`.

```bash
pnpm install
pnpm build
node index.js
```

## Rust

Not completed yet. Generated file at `monster_generated.rs`.
