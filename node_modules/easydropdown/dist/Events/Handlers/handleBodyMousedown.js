"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var closestParent_1 = require("../../Shared/Util/closestParent");
var Selectors = require("../Constants/Selectors");
function handleBodyMousedown(e, _a) {
    var actions = _a.actions;
    e.stopPropagation();
    var option = closestParent_1.default(e.target, Selectors.OPTION, true);
    if (!option)
        return;
    actions.startClickSelecting();
}
exports.default = handleBodyMousedown;
//# sourceMappingURL=handleBodyMousedown.js.map