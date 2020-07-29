"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function handleWindowClick(_, _a) {
    var state = _a.state, actions = _a.actions, dom = _a.dom;
    if (!state.isOpen)
        return;
    actions.close();
    dom.select.blur();
}
exports.default = handleWindowClick;
//# sourceMappingURL=handleWindowClick.js.map