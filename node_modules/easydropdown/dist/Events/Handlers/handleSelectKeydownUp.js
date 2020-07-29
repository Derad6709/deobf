"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dispatchOpen_1 = require("../../Shared/Util/dispatchOpen");
var killSelectReaction_1 = require("../../Shared/Util/killSelectReaction");
function handleSelectKeydownUp(e, handlerParams) {
    var metaKey = e.metaKey, target = e.target;
    var state = handlerParams.state, config = handlerParams.config, dom = handlerParams.dom, actions = handlerParams.actions;
    var focusedIndex = state.focusedIndex > -1 ?
        state.focusedIndex : state.selectedIndex;
    var iterations = 0;
    var incrementAmount = 1;
    e.preventDefault();
    killSelectReaction_1.default(target, handlerParams);
    if (metaKey) {
        incrementAmount = Math.round(Math.max(state.totalOptions / 2, config.behavior.maxVisibleItems));
    }
    do {
        focusedIndex -= incrementAmount;
        incrementAmount = 1;
        if (focusedIndex < 0) {
            focusedIndex = config.behavior.loop ? state.totalOptions - 1 : 0;
        }
        actions.focusOption(focusedIndex, true);
        iterations++;
    } while (state.focusedOption &&
        state.focusedOption.isDisabled &&
        iterations < state.totalOptions);
    if (state.isClosed) {
        dispatchOpen_1.default(actions, config, dom);
    }
}
exports.default = handleSelectKeydownUp;
//# sourceMappingURL=handleSelectKeydownUp.js.map