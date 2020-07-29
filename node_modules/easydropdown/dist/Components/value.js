"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var value = function (state, classNames) {
    return ("\n        <div\n            class=\"" + classNames.value + "\"\n            data-ref=\"value\"\n            " + (state.isPlaceholderShown ? "aria-placeholder=\"" + state.humanReadableValue + "\"" : '') + "\n        >\n            " + state.humanReadableValue + "\n        </div>\n    ");
};
exports.default = value;
//# sourceMappingURL=value.js.map