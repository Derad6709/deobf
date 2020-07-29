"use strict";
/**
 * Returns the closest parent of a given element matching the
 * provided selector, optionally including the element itself.
 */
Object.defineProperty(exports, "__esModule", { value: true });
function closestParent(el, selector, includeSelf) {
    if (includeSelf === void 0) { includeSelf = false; }
    var parent = el.parentNode;
    if (includeSelf && el.matches(selector)) {
        return el;
    }
    while (parent && parent !== document.body) {
        if (parent.matches && parent.matches(selector)) {
            return parent;
        }
        else if (parent.parentNode) {
            parent = parent.parentNode;
        }
        else {
            return null;
        }
    }
    return null;
}
exports.default = closestParent;
//# sourceMappingURL=closestParent.js.map