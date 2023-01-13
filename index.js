"use strict";
exports.__esModule = true;
var flatbuffers = require("flatbuffers");
var reps = 1000000;
var monster_generated_1 = require("./monster_generated");
for (var i = 0; i < reps; i++) {
    doFb();
}
doFb(true);
doJson(true);
var start = performance.now();
for (var i = 0; i < reps; i++) {
    doFb();
}
var end = performance.now();
console.log("Time: ".concat(end - start, " ms"));
var fbOpUs = (end - start) / reps * 1000;
console.log("us per op: ".concat(fbOpUs, " us"));
start = performance.now();
for (var i = 0; i < reps; i++) {
    doJson();
}
end = performance.now();
console.log("Time: ".concat(end - start, " ms"));
var jsonOpUs = (end - start) / reps * 1000;
console.log("us per op: ".concat(jsonOpUs, " us"));
console.log("fbOpUs / jsonOpUs: ".concat(fbOpUs / jsonOpUs));
function doFb(output) {
    if (output === void 0) { output = false; }
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
    var buf = builder.asUint8Array(); // Of type `Uint8Array`.
    if (output) {
        // convert buf to hex string
        var hex = '';
        for (var i = 0; i < buf.length; i++) {
            hex += ('00' + buf[i].toString(16)).slice(-2);
        }
        console.log(hex);
        console.log(buf.length);
    }
}
function doJson(output) {
    if (output === void 0) { output = false; }
    var monsterS = {
        pos: {
            x: 1.0,
            y: 2.0,
            z: 3.0
        },
        hp: 300,
        name: "Orc",
        inventory: [
            0,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9
        ],
        color: "Red",
        weapons: [
            {
                name: "Sword",
                damage: 3
            },
            {
                name: "Axe",
                damage: 5
            }
        ],
        equipped_type: "Weapon",
        equipped: {
            name: "Axe",
            damage: 5
        },
        path: [
            {
                x: 4.0,
                y: 5.0,
                z: 6.0
            },
            {
                x: 1.0,
                y: 2.0,
                z: 3.0
            }
        ]
    };
    var s = JSON.stringify(monsterS);
    if (output) {
        console.log(s);
        console.log(s.length);
    }
}
