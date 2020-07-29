"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Behavior_1 = require("./Behavior");
var Callbacks_1 = require("./Callbacks");
var ClassNames_1 = require("./ClassNames");
var Config = /** @class */ (function () {
    function Config() {
        this.callbacks = new Callbacks_1.default();
        this.classNames = new ClassNames_1.default();
        this.behavior = new Behavior_1.default();
        Object.seal(this);
    }
    return Config;
}());
exports.default = Config;
//# sourceMappingURL=Config.js.map