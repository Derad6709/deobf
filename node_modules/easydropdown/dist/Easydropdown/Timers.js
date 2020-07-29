"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Timers = /** @class */ (function () {
    function Timers() {
    }
    Timers.prototype.clear = function () {
        var _this = this;
        Object.keys(this).forEach(function (key) { return window.clearInterval(_this[key]); });
    };
    return Timers;
}());
exports.default = Timers;
//# sourceMappingURL=Timers.js.map