import * as flatbuffers from 'flatbuffers';

const reps = 1000000;

import { Weapon, Monster, Vec3, Color, Equipment } from './monster_generated';

for (let i = 0; i < reps; i++) {
    doFb();
}

doFb(true);
doJson(true);

// Create a `flatbuffer.Builder`, which will be used to create our
// monsters' FlatBuffers.
let builder = new flatbuffers.Builder(1024);
let weaponOne = builder.createString('Sword');
let weaponTwo = builder.createString('Axe');

// Create the first `Weapon` ('Sword').
Weapon.startWeapon(builder);
Weapon.addName(builder, weaponOne);
Weapon.addDamage(builder, 3);
let sword = Weapon.endWeapon(builder);

// Create the second `Weapon` ('Axe').
Weapon.startWeapon(builder);
Weapon.addName(builder, weaponTwo);
Weapon.addDamage(builder, 5);
let axe = Weapon.endWeapon(builder);

// Serialize a name for our monster, called 'Orc'.
let name = builder.createString('Orc');

// Create a `vector` representing the inventory of the Orc. Each number
// could correspond to an item that can be claimed after he is slain.
let treasure = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
let inv = Monster.createInventoryVector(builder, treasure);

// Create an array from the two `Weapon`s and pass it to the
// `createWeaponsVector()` method to create a FlatBuffer vector.
let weaps = [sword, axe];
let weapons = Monster.createWeaponsVector(builder, weaps);

Monster.startPathVector(builder, 2);
Vec3.createVec3(builder, 1.0, 2.0, 3.0);
Vec3.createVec3(builder, 4.0, 5.0, 6.0);
let path = builder.endVector();

// Create our monster by using `startMonster()` and `endMonster()`.
Monster.startMonster(builder);
Monster.addPos(builder, Vec3.createVec3(builder, 1.0, 2.0, 3.0));
Monster.addHp(builder, 300);
Monster.addColor(builder, Color.Red)
Monster.addName(builder, name);
Monster.addInventory(builder, inv);
Monster.addWeapons(builder, weapons);
Monster.addEquippedType(builder, Equipment.Weapon);
Monster.addEquipped(builder, axe);
Monster.addPath(builder, path);
let orc = Monster.endMonster(builder);

Monster.addEquippedType(builder, Equipment.Weapon); // Union type
Monster.addEquipped(builder, axe); // Union data

// Call `finish()` to instruct the builder that this monster is complete.
builder.finish(orc); // You could also call `MyGame.Monster.finishMonsterBuffer(builder, orc);`.

// This must be called after `finish()`.
let fbBuf = builder.asUint8Array(); // Of type `Uint8Array`.

let start = performance.now();

for (let i = 0; i < reps; i++) {
    doFb();
}

let end = performance.now();
console.log(`Time: ${end - start} ms`);
const fbOpUs = (end - start) / reps * 1000;
console.log(`us per op: ${fbOpUs} us`);

start = performance.now();
for (let i = 0; i < reps; i++) {
    doJson();
}
end = performance.now();
console.log(`Time: ${end - start} ms`);
const jsonOpUs = (end - start) / reps * 1000;
console.log(`us per op: ${jsonOpUs} us`);

console.log(`fbOpUs / jsonOpUs: ${fbOpUs / jsonOpUs}`);



function doFb(output = false) {
    let m = new flatbuffers.ByteBuffer(fbBuf)
    let monster = Monster.getRootAsMonster(m);

    // Create a `flatbuffer.Builder`, which will be used to create our
    // monsters' FlatBuffers.
    let builder = new flatbuffers.Builder(1024);
    let weaponOne = builder.createString('Sword');
    let weaponTwo = builder.createString('Axe');

    // Create the first `Weapon` ('Sword').
    Weapon.startWeapon(builder);
    Weapon.addName(builder, weaponOne);
    Weapon.addDamage(builder, 3);
    let sword = Weapon.endWeapon(builder);

    // Create the second `Weapon` ('Axe').
    Weapon.startWeapon(builder);
    Weapon.addName(builder, weaponTwo);
    Weapon.addDamage(builder, 5);
    let axe = Weapon.endWeapon(builder);

    // Serialize a name for our monster, called 'Orc'.
    let name = builder.createString('Orc');

    // Create a `vector` representing the inventory of the Orc. Each number
    // could correspond to an item that can be claimed after he is slain.
    let treasure = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    let inv = Monster.createInventoryVector(builder, treasure);

    // Create an array from the two `Weapon`s and pass it to the
    // `createWeaponsVector()` method to create a FlatBuffer vector.
    let weaps = [sword, axe];
    let weapons = Monster.createWeaponsVector(builder, weaps);

    Monster.startPathVector(builder, 2);
    Vec3.createVec3(builder, 1.0, 2.0, 3.0);
    Vec3.createVec3(builder, 4.0, 5.0, 6.0);
    let path = builder.endVector();

    // Create our monster by using `startMonster()` and `endMonster()`.
    Monster.startMonster(builder);
    Monster.addPos(builder, Vec3.createVec3(builder, 1.0, 2.0, 3.0));
    Monster.addHp(builder, 300);
    Monster.addColor(builder, Color.Red)
    Monster.addName(builder, name);
    Monster.addInventory(builder, inv);
    Monster.addWeapons(builder, weapons);
    Monster.addEquippedType(builder, Equipment.Weapon);
    Monster.addEquipped(builder, axe);
    Monster.addPath(builder, path);
    let orc = Monster.endMonster(builder);

    Monster.addEquippedType(builder, Equipment.Weapon); // Union type
    Monster.addEquipped(builder, axe); // Union data

    // Call `finish()` to instruct the builder that this monster is complete.
    builder.finish(orc); // You could also call `MyGame.Monster.finishMonsterBuffer(builder, orc);`.

    // This must be called after `finish()`.
    let buf = builder.asUint8Array(); // Of type `Uint8Array`.

    if (output) {
        // convert buf to hex string
        let hex = '';
        for (let i = 0; i < buf.length; i++) {
            hex += ('00' + buf[i].toString(16)).slice(-2);
        }
        console.log(buf)
        console.log(hex);
        console.log(buf.length)

    }
}

function doJson(output = false) {
    const monster = JSON.parse(`{"pos":{"x":1,"y":2,"z":3},"hp":300,"name":"Orc","inventory":[0,1,2,3,4,5,6,7,8,9],"color":"Red","weapons":[{"name":"Sword","damage":3},{"name":"Axe","damage":5}],"equipped_type":"Weapon","equipped":{"name":"Axe","damage":5},"path":[{"x":4,"y":5,"z":6},{"x":1,"y":2,"z":3}]}`);
    const s = JSON.stringify(monster);

    if (output) {
        console.log(s);
        console.log(s.length);
    }
}