"use strict";
exports.__esModule = true;
var flatbuffers = require("flatbuffers");
var reps = 2500000;
var monster_generated_1 = require("./monster_generated");
// Create a `flatbuffer.Builder`, which will be used to create our
// monsters' FlatBuffers.
var builder = new flatbuffers.Builder(1024);
var weaponOne = builder.createString('Sword');
var weaponTwo = builder.createString('Axe');
// Create the first `Weapon` ('Sword').
monster_generated_1.Weapon.startWeapon(builder);
monster_generated_1.Weapon.addName(builder, weaponOne);
monster_generated_1.Weapon.addDamage(builder, 3);
var sword = monster_generated_1.Weapon.endWeapon(builder);
// Create the second `Weapon` ('Axe').
monster_generated_1.Weapon.startWeapon(builder);
monster_generated_1.Weapon.addName(builder, weaponTwo);
monster_generated_1.Weapon.addDamage(builder, 5);
var axe = monster_generated_1.Weapon.endWeapon(builder);
// Serialize a name for our monster, called 'Orc'.
var name = builder.createString('Orc');
// Create a `vector` representing the inventory of the Orc. Each number
// could correspond to an item that can be claimed after he is slain.
var treasure = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
var inv = monster_generated_1.Monster.createInventoryVector(builder, treasure);
// Create an array from the two `Weapon`s and pass it to the
// `createWeaponsVector()` method to create a FlatBuffer vector.
var weaps = [sword, axe];
var weapons = monster_generated_1.Monster.createWeaponsVector(builder, weaps);
monster_generated_1.Monster.startPathVector(builder, 2);
monster_generated_1.Vec3.createVec3(builder, 1.0, 2.0, 3.0);
monster_generated_1.Vec3.createVec3(builder, 4.0, 5.0, 6.0);
var path = builder.endVector();
// Create our monster by using `startMonster()` and `endMonster()`.
monster_generated_1.Monster.startMonster(builder);
monster_generated_1.Monster.addPos(builder, monster_generated_1.Vec3.createVec3(builder, 1.0, 2.0, 3.0));
monster_generated_1.Monster.addHp(builder, 300);
monster_generated_1.Monster.addColor(builder, monster_generated_1.Color.Red);
monster_generated_1.Monster.addName(builder, name);
monster_generated_1.Monster.addInventory(builder, inv);
monster_generated_1.Monster.addWeapons(builder, weapons);
monster_generated_1.Monster.addEquippedType(builder, monster_generated_1.Equipment.Weapon);
monster_generated_1.Monster.addEquipped(builder, axe);
monster_generated_1.Monster.addPath(builder, path);
var orc = monster_generated_1.Monster.endMonster(builder);
monster_generated_1.Monster.addEquippedType(builder, monster_generated_1.Equipment.Weapon); // Union type
monster_generated_1.Monster.addEquipped(builder, axe); // Union data
// Call `finish()` to instruct the builder that this monster is complete.
builder.finish(orc); // You could also call `MyGame.Monster.finishMonsterBuffer(builder, orc);`.
// This must be called after `finish()`.
var fbBuf = builder.asUint8Array(); // Of type `Uint8Array`.
var jsonStr = "{\"pos\":{\"x\":1,\"y\":2,\"z\":3},\"hp\":300,\"name\":\"Orc\",\"inventory\":[0,1,2,3,4,5,6,7,8,9],\"color\":\"Red\",\"weapons\":[{\"name\":\"Sword\",\"damage\":3},{\"name\":\"Axe\",\"damage\":5}],\"equipped_type\":\"Weapon\",\"equipped\":{\"name\":\"Axe\",\"damage\":5},\"path\":[{\"x\":4,\"y\":5,\"z\":6},{\"x\":1,\"y\":2,\"z\":3}]}";
console.log("Warming up...");
for (var i = 0; i < 250000; i++) {
    doFb();
    doJson();
}
var ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function to_b58(buf) {
    var str = "";
    var carry = 0;
    var i = 0;
    while (i < buf.length || carry) {
        var acc = carry;
        var j = 0;
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
var fbOut = doFb();
console.log("\n--------- FlatBuffer:");
console.log("Encoded (b58): ".concat(to_b58(fbOut)));
console.log("Length: ".concat(fbOut.length, " bytes"));
var start = performance.now();
for (var i = 0; i < reps; i++) {
    doJson();
}
var end = performance.now();
var jsonOpUs = (end - start) / reps * 1000;
console.log("us per op: ".concat(jsonOpUs, " us"));
var jsonOut = doJson();
console.log("\n--------- JSON:");
console.log("Encoded: ".concat(jsonOut));
console.log("Length: ".concat(jsonOut.length, " bytes"));
start = performance.now();
for (var i = 0; i < reps; i++) {
    doFb();
}
end = performance.now();
var fbOpUs = (end - start) / reps * 1000;
console.log("us per op: ".concat(Math.round(fbOpUs * 1000) / 1000, " us"));
console.log("fbOpUs / jsonOpUs: ".concat(Math.round((fbOpUs / jsonOpUs) * 1000) / 1000, "x"));
console.log("Size improvement: ".concat(Math.round((fbOut.length / jsonOut.length) * 1000) / 1000, "x"));
// yes, flatbuffers are more code to write than JSON, but this code runs 1.6x faster (even though it's pure JS) and is 70% of the size
function doFb() {
    var _a, _b, _c, _d, _e, _f, _g;
    // extract the monster from bytes
    var m = new flatbuffers.ByteBuffer(fbBuf);
    var monster = monster_generated_1.Monster.getRootAsMonster(m);
    // clone the monster
    var builder = new flatbuffers.Builder(1024);
    var weaponOne = builder.createString((_a = monster.weapons(0)) === null || _a === void 0 ? void 0 : _a.name());
    var weaponTwo = builder.createString((_b = monster.weapons(1)) === null || _b === void 0 ? void 0 : _b.name());
    monster_generated_1.Weapon.startWeapon(builder);
    monster_generated_1.Weapon.addName(builder, weaponOne);
    monster_generated_1.Weapon.addDamage(builder, (_c = monster.weapons(0)) === null || _c === void 0 ? void 0 : _c.damage());
    var sword = monster_generated_1.Weapon.endWeapon(builder);
    monster_generated_1.Weapon.startWeapon(builder);
    monster_generated_1.Weapon.addName(builder, weaponTwo);
    monster_generated_1.Weapon.addDamage(builder, (_d = monster.weapons(1)) === null || _d === void 0 ? void 0 : _d.damage());
    var axe = monster_generated_1.Weapon.endWeapon(builder);
    var weapons = monster_generated_1.Monster.createWeaponsVector(builder, [sword, axe]);
    var name = builder.createString(monster.name());
    var inv = monster_generated_1.Monster.createInventoryVector(builder, monster.inventoryArray());
    monster_generated_1.Monster.startPathVector(builder, 2);
    monster_generated_1.Vec3.createVec3(builder, 1.0, 2.0, 3.0);
    monster_generated_1.Vec3.createVec3(builder, 4.0, 5.0, 6.0);
    var path = builder.endVector();
    monster_generated_1.Monster.startMonster(builder);
    monster_generated_1.Monster.addPos(builder, monster_generated_1.Vec3.createVec3(builder, (_e = monster.pos()) === null || _e === void 0 ? void 0 : _e.x(), (_f = monster.pos()) === null || _f === void 0 ? void 0 : _f.y(), (_g = monster.pos()) === null || _g === void 0 ? void 0 : _g.z()));
    monster_generated_1.Monster.addHp(builder, monster.hp());
    monster_generated_1.Monster.addColor(builder, monster.color());
    monster_generated_1.Monster.addName(builder, name);
    monster_generated_1.Monster.addInventory(builder, inv);
    monster_generated_1.Monster.addWeapons(builder, weapons);
    monster_generated_1.Monster.addEquippedType(builder, monster.equippedType());
    monster_generated_1.Monster.addEquipped(builder, axe);
    monster_generated_1.Monster.addPath(builder, path);
    var orc = monster_generated_1.Monster.endMonster(builder);
    builder.finish(orc);
    return builder.asUint8Array();
}
// JSON is slower even if it's written in C++, but has less code to write
function doJson() {
    // extract the monster from bytes
    var monster = JSON.parse(jsonStr);
    // clone the monster
    var s = JSON.stringify(monster);
    return s;
}
