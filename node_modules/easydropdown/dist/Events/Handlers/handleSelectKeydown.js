"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dispatchOpen_1 = require("../../Shared/Util/dispatchOpen");
var killSelectReaction_1 = require("../../Shared/Util/killSelectReaction");
var KeyCodes = require("../Constants/KeyCodes");
var handleSelectKeydownDown_1 = require("./handleSelectKeydownDown");
var handleSelectKeydownUp_1 = require("./handleSelectKeydownUp");
function handleSelectKeydown(e, handlerParams) {
    var keyCode = e.keyCode, target = e.target;
    var state = handlerParams.state, actions = handlerParams.actions, dom = handlerParams.dom, config = handlerParams.config;
    if (state.isUseNativeMode || state.isDisabled)
        return;
    switch (keyCode) {
        case KeyCodes.DOWN:
            handleSelectKeydownDown_1.default(e, handlerParams);
            break;
        case KeyCodes.UP:
            handleSelectKeydownUp_1.default(e, handlerParams);
            break;
        case KeyCodes.SPACE:
            if (state.isSearching) {
                e.stopPropagation();
                return;
            }
        case KeyCodes.ENTER:
            e.stopPropagation();
            e.preventDefault();
            killSelectReaction_1.default(target, handlerParams);
            if (state.isOpen) {
                actions.selectOption(state.focusedIndex, config.behavior.closeOnSelect);
            }
            else {
                dispatchOpen_1.default(actions, config, dom);
            }
            break;
        case KeyCodes.ESC:
            actions.close();
            break;
    }
}
exports.default = handleSelectKeydown;
//# sourceMappingURL=handleSelectKeydown.js.map