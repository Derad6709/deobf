"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Group = /** @class */ (function () {
    function Group() {
        this.label = '';
        this.options = [];
        this.isDisabled = false;
    }
    Object.defineProperty(Group.prototype, "totalOptions", {
        get: function () {
            return this.options.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Group.prototype, "hasLabel", {
        get: function () {
            return this.label !== '';
        },
        enumerable: true,
        configurable: true
    });
    return Group;
}());
exports.default = Group;
//# sourceMappingURL=Group.js.map