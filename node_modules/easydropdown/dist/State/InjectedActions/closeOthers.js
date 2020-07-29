"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function closeOthers(thisInstance, cache) {
    for (var _i = 0, cache_1 = cache; _i < cache_1.length; _i++) {
        var instance = cache_1[_i];
        if (instance !== thisInstance)
            instance.actions.close();
    }
}
exports.default = closeOthers;
//# sourceMappingURL=closeOthers.js.map