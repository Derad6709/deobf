"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var closestParent_1 = require("../../Shared/Util/closestParent");
var Selectors = require("../Constants/Selectors");
function handleBodyMouseover(e, _a) {
    var state = _a.state, actions = _a.actions, dom = _a.dom;
    e.stopPropagation();
    var option = closestParent_1.default(e.target, Selectors.OPTION, true);
    if (!option || state.isKeying)
        return;
    var optionIndex = Array.prototype.indexOf.call(dom.option, option);
    actions.focusOption(optionIndex);
}
exports.default = handleBodyMouseover;
//# sourceMappingURL=handleBodyMouseover.js.map