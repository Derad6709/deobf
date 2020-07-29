"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var POLL_INTERVAL_DURATION = 300;
function pollForSelectMutation(selectElement, state, handleMutation) {
    var lastOuterHtml = selectElement.outerHTML;
    var pollIntervalId = window.setInterval(function () {
        var outerHTML = selectElement.outerHTML;
        if (outerHTML !== lastOuterHtml && !state.isKeying) {
            handleMutation();
        }
        lastOuterHtml = outerHTML;
    }, POLL_INTERVAL_DURATION);
    return pollIntervalId;
}
exports.default = pollForSelectMutation;
//# sourceMappingURL=pollForSelectMutation.js.map