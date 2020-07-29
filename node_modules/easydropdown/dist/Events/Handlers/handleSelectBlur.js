"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function handleSelectBlur(e, _a) {
    var actions = _a.actions, state = _a.state, config = _a.config;
    if (state.isKeying)
        return;
    actions.blur();
    if (config.behavior.openOnFocus && !state.isClickSelecting)
        actions.close();
}
exports.default = handleSelectBlur;
//# sourceMappingURL=handleSelectBlur.js.map