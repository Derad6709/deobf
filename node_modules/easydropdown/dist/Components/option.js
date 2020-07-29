"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var composeClassName_1 = require("../Shared/Util/composeClassName");
function option(optionState, state, classNames) {
    var isSelected = state.selectedOption === optionState;
    var className = composeClassName_1.default([
        classNames.option,
        [isSelected, classNames.optionSelected],
        [optionState === state.focusedOption, classNames.optionFocused],
        [optionState.isDisabled, classNames.optionDisabled]
    ]);
    return ("\n        <div\n            class=\"" + className + "\"\n            data-ref=\"option item\"\n            role=\"option\"\n            title=\"" + optionState.label + "\"\n            " + (isSelected ? 'aria-selected="true"' : '') + "\n            " + (optionState.isDisabled ? 'aria-disabled="true"' : '') + "\n            >\n                " + optionState.label + "\n        </div>\n    ");
}
exports.default = option;
//# sourceMappingURL=option.js.map