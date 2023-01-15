planus-example – Small examples showing how to use planus with Rust
===================================================================

Basic concepts
--------------

For every type (except enums) in the flatbuffers schema planus generates both an
owned type, named the same as the flatbuffers type, and a reference type with a
`Ref` suffix and a lifetime tied to the buffer containing the serialized
flatbuffers data.  The owned type can be created from the reference type using
the `TryInto` trait.

The generated code cannot panic, so every function that can potentially fail
returns a `planus::Result`. This can quickly lead to a lot of `unwrap()`, so we
recommended that you put your planus code into a function where you can use the
`?` operator to propagate the deserialization errors.

Running the examples
--------------------

Here are some recommended commands to get started:

```console
# Generate a PDF overview of the schema using GraphViz
planus dot ../monster.fbs -o monster.dot
dot -Tsvg monster.dot -o monster.svg

# Re-generate the monster_generated.rs file in case ../monster.fbs has been changed
planus rust ../monster.fbs -o src/monster_generated.rs

# Run the API-test to generate monster.bin
cargo run --example api_example monster.bin

# Print the file generated by the API-test
cargo run --example print monster.bin

# Convert the file to json
cargo run --example to_json monster.bin > monster.json

# Convert back to binary form
cargo run --example from_json monster.json monster2.bin

# Open the documentation for the crate
cargo doc --open
```