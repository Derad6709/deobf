"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var POLL_INTERVAL_DURATION = 100;
function pollForSelectChange(selectElement, state, actions, config) {
    var lastValue = selectElement.value;
    var pollIntervalId = window.setInterval(function () {
        if (selectElement.value !== lastValue) {
            var selectedIndex = state.getOptionIndexFromValue(selectElement.value);
            actions.selectOption(selectedIndex, config.behavior.closeOnSelect);
            actions.focusOption(selectedIndex, true);
        }
        lastValue = selectElement.value;
    }, POLL_INTERVAL_DURATION);
    return pollIntervalId;
}
exports.default = pollForSelectChange;
//# sourceMappingURL=pollForSelectChange.js.map