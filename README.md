# FlatBuffer testing

A simple repo for testing FlatBuffers with TypeScript & Rust to see if it's a viable option for our project.

Make sure you have `flatc` installed. You can get pre-built binaries from [here](https://github.com/google/flatbuffers/releases). You need Rust installed for Rust, and Node.js 18 (installed with [volta](https://volta.sh/)) and `pnpm` (`volta install pnpm`) for TypeScript.

## TypeScript

Main file is `index.ts` which is compiled to `index.js` with `tsc`.

```bash
cd typescript
pnpm install
pnpm bench
```

### Benchmarks

```bash
pnpm bench

> flatc --ts --gen-object-api ../monster.fbs && tsc index.ts && node index.js

Warming up...

--------- FlatBuffer
Encoded (b58): wYa...XGU
Length: 192 bytes
us per op: 3.616 us

--------- JSON
Encoded: {"pos":...3}]}
Length: 274 bytes
us per op: 5.667 us

fbOpUs / jsonOpUs: 1.567x
Size improvement: 0.701x
```

## Rust

Not completed yet. Generated file at `monster_generated.rs`.

```bash
cd rust
cargo install planus-cli
planus rust -o monster_generated.rs ../monster.fbs
```
