"use strict";
// automatically generated by the FlatBuffers compiler, do not modify
exports.__esModule = true;
exports.unionListToEquipment = exports.unionToEquipment = exports.Equipment = void 0;
var weapon_js_1 = require("../../my-game/sample/weapon.js");
/**
 * Weapons or other equipment
 */
var Equipment;
(function (Equipment) {
    Equipment[Equipment["NONE"] = 0] = "NONE";
    /**
     * Equipment of the weapon-type
     */
    Equipment[Equipment["Weapon"] = 1] = "Weapon";
})(Equipment = exports.Equipment || (exports.Equipment = {}));
function unionToEquipment(type, accessor) {
    switch (Equipment[type]) {
        case 'NONE': return null;
        case 'Weapon': return accessor(new weapon_js_1.Weapon());
        default: return null;
    }
}
exports.unionToEquipment = unionToEquipment;
function unionListToEquipment(type, accessor, index) {
    switch (Equipment[type]) {
        case 'NONE': return null;
        case 'Weapon': return accessor(index, new weapon_js_1.Weapon());
        default: return null;
    }
}
exports.unionListToEquipment = unionListToEquipment;
