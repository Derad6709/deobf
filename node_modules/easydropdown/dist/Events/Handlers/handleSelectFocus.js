"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dispatchOpen_1 = require("../../Shared/Util/dispatchOpen");
function handleSelectFocus(e, _a) {
    var actions = _a.actions, config = _a.config, dom = _a.dom, state = _a.state;
    actions.focus();
    if (config.behavior.openOnFocus && !state.isUseNativeMode) {
        dispatchOpen_1.default(actions, config, dom);
    }
}
exports.default = handleSelectFocus;
//# sourceMappingURL=handleSelectFocus.js.map