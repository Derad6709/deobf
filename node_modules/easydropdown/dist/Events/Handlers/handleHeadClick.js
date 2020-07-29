"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dispatchOpen_1 = require("../../Shared/Util/dispatchOpen");
var getIsMobilePlatform_1 = require("../../Shared/Util/getIsMobilePlatform");
function handleHeadClick(injectedGetIsMobilePlatform, e, _a) {
    var state = _a.state, actions = _a.actions, dom = _a.dom, config = _a.config;
    if (state.isUseNativeMode)
        return;
    var isMobilePlatform = injectedGetIsMobilePlatform(window.navigator.userAgent);
    e.stopPropagation();
    if (state.isClosed) {
        dispatchOpen_1.default(actions, config, dom);
        if (isMobilePlatform) {
            actions.focus();
        }
        else {
            dom.select.focus();
        }
    }
    else {
        actions.close();
    }
}
exports.handleHeadClick = handleHeadClick;
var boundHandleHeadClick = handleHeadClick.bind(null, getIsMobilePlatform_1.default);
exports.default = boundHandleHeadClick;
//# sourceMappingURL=handleHeadClick.js.map