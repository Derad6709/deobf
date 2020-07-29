"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getScrollTop(currentScrollTop, optionOffsetTop, optionHeight, bodyHeight, scrollOffset) {
    var max = currentScrollTop + bodyHeight;
    var remainder;
    if (optionOffsetTop < currentScrollTop) {
        return optionOffsetTop - scrollOffset;
    }
    else if ((remainder = (optionOffsetTop + optionHeight) - max) > 0) {
        return currentScrollTop + remainder + scrollOffset;
    }
    return currentScrollTop;
}
exports.getScrollTop = getScrollTop;
function scrollToView(dom, timers, state, scrollToMiddle) {
    if (scrollToMiddle === void 0) { scrollToMiddle = false; }
    var index = Math.max(0, state.focusedIndex > -1 ? state.focusedIndex : state.selectedIndex);
    var option = dom.option[index];
    if (!option)
        return;
    var offset = scrollToMiddle ? (state.maxBodyHeight / 2) - (option.offsetHeight / 2) : 0;
    var scrollTop = getScrollTop(dom.itemsList.scrollTop, option.offsetTop, option.offsetHeight, state.maxBodyHeight, offset);
    if (scrollTop === dom.itemsList.scrollTop)
        return;
    dom.itemsList.scrollTop = scrollTop;
}
exports.default = scrollToView;
//# sourceMappingURL=scrollToView.js.map