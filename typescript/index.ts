import * as flatbuffers from 'flatbuffers';

const reps = 2_500_000;

import { Weapon, Monster, Vec3, Color, Equipment } from './monster_generated';

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
let jsonStr = `{"pos":{"x":1,"y":2,"z":3},"hp":300,"name":"Orc","inventory":[0,1,2,3,4,5,6,7,8,9],"color":"Red","weapons":[{"name":"Sword","damage":3},{"name":"Axe","damage":5}],"equipped_type":"Weapon","equipped":{"name":"Axe","damage":5},"path":[{"x":4,"y":5,"z":6},{"x":1,"y":2,"z":3}]}`

console.log("Warming up...")
for (let i = 0; i < 250_000; i++) {
    doFb();
    doJson();
}

const ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

function to_b58(buf: Uint8Array) {
  let str = "";
  let carry = 0;
  let i = 0;
  while (i < buf.length || carry) {
    let acc = carry;
    let j = 0;
    while (j < buf.length) {
      acc = acc * 256 + buf[j];
      buf[j] = Math.floor(acc / 58);
      acc %= 58;
      j++;
    }
    str += ALPHABET[acc];
    carry = buf[i] === 0 ? 1 : 0;
    i++;
  }
  return str;
}

const fbOut = doFb();
console.log(`\n--------- FlatBuffer`)
console.log(`Encoded (b58): ${to_b58(fbOut)}`);
console.log(`Length: ${fbOut.length} bytes`);

let start = performance.now();
for (let i = 0; i < reps; i++) {
    doJson();
}
let end = performance.now();
const jsonOpUs = (end - start) / reps * 1000;
console.log(`us per op: ${Math.round(jsonOpUs * 1000) / 1000} us`);

const jsonOut = doJson();
console.log(`\n--------- JSON`)
console.log(`Encoded: ${jsonOut}`);
console.log(`Length: ${jsonOut.length} bytes`);

start = performance.now();

for (let i = 0; i < reps; i++) {
    doFb();
}

end = performance.now();
const fbOpUs = (end - start) / reps * 1000;
console.log(`us per op: ${Math.round(fbOpUs * 1000) / 1000} us`);


console.log(`\nfbOpUs / jsonOpUs: ${Math.round((fbOpUs / jsonOpUs) * 1000) / 1000}x`);
console.log(`Size improvement: ${Math.round((fbOut.length / jsonOut.length) * 1000) / 1000}x`);


// yes, flatbuffers are more code to write than JSON, but this code runs 1.6x faster (even though it's pure JS) and is 70% of the size
function doFb() {
    // extract the monster from bytes
    let m = new flatbuffers.ByteBuffer(fbBuf)
    let monster = Monster.getRootAsMonster(m);

    // clone the monster
    let builder = new flatbuffers.Builder(1024);
    let weaponOne = builder.createString(monster.weapons(0)?.name()!);
    let weaponTwo = builder.createString(monster.weapons(1)?.name()!);

    Weapon.startWeapon(builder);
    Weapon.addName(builder, weaponOne);
    Weapon.addDamage(builder, monster.weapons(0)?.damage()!);
    let sword = Weapon.endWeapon(builder);

    Weapon.startWeapon(builder);
    Weapon.addName(builder, weaponTwo);
    Weapon.addDamage(builder, monster.weapons(1)?.damage()!);
    let axe = Weapon.endWeapon(builder);

    let weapons = Monster.createWeaponsVector(builder, [sword, axe])

    let name = builder.createString(monster.name()!);
    let inv = Monster.createInventoryVector(builder, monster.inventoryArray()!);

    Monster.startPathVector(builder, 2);
    Vec3.createVec3(builder, 1.0, 2.0, 3.0);
    Vec3.createVec3(builder, 4.0, 5.0, 6.0);
    let path = builder.endVector();

    Monster.startMonster(builder);
    Monster.addPos(builder, Vec3.createVec3(builder, monster.pos()?.x()!, monster.pos()?.y()!, monster.pos()?.z()!));
    Monster.addHp(builder, monster.hp());
    Monster.addColor(builder, monster.color())
    Monster.addName(builder, name);
    Monster.addInventory(builder, inv);
    Monster.addWeapons(builder, weapons);
    Monster.addEquippedType(builder, monster.equippedType());
    Monster.addEquipped(builder, axe);
    Monster.addPath(builder, path);
    let orc = Monster.endMonster(builder);
    builder.finish(orc); 

    return builder.asUint8Array();
}

// JSON is slower even if it's written in C++, but has less code to write
function doJson() {
    // extract the monster from bytes
    const monster = JSON.parse(jsonStr);
    // clone the monster
    const s = JSON.stringify(monster);

    return s;
}
