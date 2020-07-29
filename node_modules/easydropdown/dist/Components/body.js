"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var composeClassName_1 = require("../Shared/Util/composeClassName");
var group_1 = require("./group");
function body(state, classNames) {
    var className = composeClassName_1.default([
        classNames.body,
        [state.isAtTop, classNames.bodyAtTop],
        [state.isAtBottom, classNames.bodyAtBottom],
        [state.isScrollable, classNames.bodyScrollable]
    ]);
    var styleAttr = state.isOpen ?
        "style=\"max-height: " + state.maxBodyHeight + "px;\"" : '';
    return ("\n        <div\n            class=\"" + className + "\"\n            data-ref=\"body\"\n            role=\"listbox\"\n            " + (state.isOpen ? '' : 'aria-hidden') + "\n        >\n            <div class=\"" + classNames.itemsList + "\"\n                data-ref=\"itemsList\"\n                " + styleAttr + ">\n                " + state.groups.map(function (groupState) { return group_1.default(groupState, state, classNames); }).join('') + "\n            </div>\n            <div class=" + classNames.gradientTop + " role=\"presentation\"></div>\n            <div class=" + classNames.gradientBottom + " role=\"presentation\"></div>\n        </div>\n    ");
}
exports.default = body;
//# sourceMappingURL=body.js.map