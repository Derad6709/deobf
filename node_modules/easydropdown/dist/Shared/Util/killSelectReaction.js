"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var killSelectReaction = function (select, _a) {
    var actions = _a.actions, timers = _a.timers;
    var keyingResetDuration = 100;
    window.clearTimeout(timers.keyingTimeoutId);
    actions.keying();
    timers.keyingTimeoutId = window.setTimeout(function () { return actions.resetKeying(); }, keyingResetDuration);
    select.disabled = true;
    setTimeout(function () {
        select.disabled = false;
        select.focus();
    });
};
exports.default = killSelectReaction;
//# sourceMappingURL=killSelectReaction.js.map