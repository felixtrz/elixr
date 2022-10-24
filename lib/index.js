"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Core = exports.Physics = exports.RigidBodyComponent = exports.PhysicsComponent = exports.GamepadWrapper = exports.AXES = exports.BUTTONS = exports.SingleUseXRGameSystem = exports.SingleUseGameSystem = exports.XRGameSystem = exports.GameSystem = exports.GameComponent = exports.GameObject = exports.Types = exports.Not = void 0;
var ecsy_1 = require("ecsy");
Object.defineProperty(exports, "Not", { enumerable: true, get: function () { return ecsy_1.Not; } });
Object.defineProperty(exports, "Types", { enumerable: true, get: function () { return ecsy_1.Types; } });
var GameObject_1 = require("./GameObject");
Object.defineProperty(exports, "GameObject", { enumerable: true, get: function () { return GameObject_1.GameObject; } });
var GameComponent_1 = require("./GameComponent");
Object.defineProperty(exports, "GameComponent", { enumerable: true, get: function () { return GameComponent_1.GameComponent; } });
var GameSystem_1 = require("./GameSystem");
Object.defineProperty(exports, "GameSystem", { enumerable: true, get: function () { return GameSystem_1.GameSystem; } });
Object.defineProperty(exports, "XRGameSystem", { enumerable: true, get: function () { return GameSystem_1.XRGameSystem; } });
Object.defineProperty(exports, "SingleUseGameSystem", { enumerable: true, get: function () { return GameSystem_1.SingleUseGameSystem; } });
Object.defineProperty(exports, "SingleUseXRGameSystem", { enumerable: true, get: function () { return GameSystem_1.SingleUseXRGameSystem; } });
var gamepad_wrapper_1 = require("gamepad-wrapper");
Object.defineProperty(exports, "BUTTONS", { enumerable: true, get: function () { return gamepad_wrapper_1.BUTTONS; } });
Object.defineProperty(exports, "AXES", { enumerable: true, get: function () { return gamepad_wrapper_1.AXES; } });
Object.defineProperty(exports, "GamepadWrapper", { enumerable: true, get: function () { return gamepad_wrapper_1.GamepadWrapper; } });
var PhysicsComponents_1 = require("./physics/PhysicsComponents");
Object.defineProperty(exports, "PhysicsComponent", { enumerable: true, get: function () { return PhysicsComponents_1.PhysicsComponent; } });
Object.defineProperty(exports, "RigidBodyComponent", { enumerable: true, get: function () { return PhysicsComponents_1.RigidBodyComponent; } });
exports.Physics = __importStar(require("cannon-es"));
var Core_1 = require("./Core");
Object.defineProperty(exports, "Core", { enumerable: true, get: function () { return Core_1.Core; } });
//# sourceMappingURL=index.js.map