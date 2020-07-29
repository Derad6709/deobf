"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var composeClassName_1 = require("../Shared/Util/composeClassName");
var option_1 = require("./option");
var group = function (groupState, state, classNames) {
    var className = composeClassName_1.default([
        classNames.group,
        [groupState.isDisabled, classNames.groupDisabled],
        [groupState.hasLabel, classNames.groupHasLabel]
    ]);
    return ("\n        <div class=\"" + className + "\" data-ref=\"group\" role=\"group\">\n            " + (groupState.hasLabel ?
        "<div class=\"" + classNames.groupLabel + "\" data-ref=\"item\">" + groupState.label + "</div>" : '') + "\n            " + groupState.options.map(function (optionState) { return option_1.default(optionState, state, classNames); }).join('') + "\n        </div>\n    ");
};
exports.default = group;
//# sourceMappingURL=group.js.map