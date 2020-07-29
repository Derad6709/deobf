"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function handleItemsListScroll(e, _a) {
    var state = _a.state, actions = _a.actions, dom = _a.dom;
    e.stopPropagation();
    var _b = dom.itemsList, offsetHeight = _b.offsetHeight, scrollHeight = _b.scrollHeight, scrollTop = _b.scrollTop;
    if (scrollTop === 0) {
        actions.topOut();
    }
    else if (scrollTop === scrollHeight - offsetHeight) {
        actions.bottomOut();
    }
    else {
        actions.scroll();
    }
}
exports.default = handleItemsListScroll;
//# sourceMappingURL=handleItemsListScroll.js.map