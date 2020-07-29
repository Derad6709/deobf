"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function throttle(handler, delay) {
    var timerId = null;
    var last = -Infinity;
    return function () {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var now = Date.now();
        var later = function () {
            timerId = null;
            handler.apply(_this, args);
            last = now;
        };
        var difference = now - last;
        if (difference >= delay) {
            later();
        }
        else {
            clearTimeout(timerId);
            timerId = setTimeout(later, delay - difference);
        }
    };
}
exports.default = throttle;
//# sourceMappingURL=throttle.js.map