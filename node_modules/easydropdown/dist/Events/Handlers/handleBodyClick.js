"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var closestParent_1 = require("../../Shared/Util/closestParent");
var Selectors = require("../Constants/Selectors");
function handleBodyClick(e, _a) {
    var state = _a.state, actions = _a.actions, dom = _a.dom, config = _a.config;
    e.stopPropagation();
    var option = closestParent_1.default(e.target, Selectors.OPTION, true);
    if (!option)
        return;
    var optionIndex = Array.prototype.indexOf.call(dom.option, option);
    actions.selectOption(optionIndex, config.behavior.closeOnSelect);
}
exports.default = handleBodyClick;
//# sourceMappingURL=handleBodyClick.js.map