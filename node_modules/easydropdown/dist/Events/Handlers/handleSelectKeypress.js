"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var KeyCodes = require("../Constants/KeyCodes");
var SEARCH_RESET_DURATION = 1200;
function handleSelectKeypress(_a, _b, searchResetDuration) {
    var keyCode = _a.keyCode;
    var actions = _b.actions, timers = _b.timers, state = _b.state;
    if (searchResetDuration === void 0) { searchResetDuration = SEARCH_RESET_DURATION; }
    if (state.isUseNativeMode || [KeyCodes.UP, KeyCodes.DOWN].includes(keyCode))
        return;
    window.clearTimeout(timers.searchTimeoutId);
    actions.search();
    timers.searchTimeoutId = window.setTimeout(function () { return actions.resetSearch(); }, searchResetDuration);
}
exports.default = handleSelectKeypress;
//# sourceMappingURL=handleSelectKeypress.js.map