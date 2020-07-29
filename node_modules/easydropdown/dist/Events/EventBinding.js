"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var helpful_merge_1 = require("helpful-merge");
var EventBinding = /** @class */ (function () {
    function EventBinding(eventBindingRaw) {
        this.type = '';
        this.target = null;
        this.debounce = 0;
        this.throttle = 0;
        this.handler = null;
        this.boundHandler = null;
        this.passive = false;
        helpful_merge_1.default(this, eventBindingRaw);
        Object.seal(this);
    }
    EventBinding.prototype.unbind = function () {
        if (!this.target)
            return;
        this.target.removeEventListener(this.type, this.boundHandler);
    };
    return EventBinding;
}());
exports.default = EventBinding;
//# sourceMappingURL=EventBinding.js.map