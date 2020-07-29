"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Behavior = /** @class */ (function () {
    function Behavior() {
        this.showPlaceholderWhenOpen = false;
        this.openOnFocus = false;
        this.closeOnSelect = true;
        this.useNativeUiOnMobile = true;
        this.loop = false;
        this.clampMaxVisibleItems = true;
        this.liveUpdates = false;
        this.maxVisibleItems = 15;
        Object.seal(this);
    }
    return Behavior;
}());
exports.default = Behavior;
//# sourceMappingURL=Behavior.js.map