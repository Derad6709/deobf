"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Dom = /** @class */ (function () {
    function Dom() {
        this.select = null;
        this.root = null;
        this.head = null;
        this.value = null;
        this.body = null;
        this.arrow = null;
        this.itemsList = null;
        this.item = [];
        this.group = [];
        this.option = [];
    }
    Dom.prototype.sumItemsHeight = function (max) {
        if (max === void 0) { max = Infinity; }
        var totalHeight = 0;
        for (var i = 0, item = void 0; (item = this.item[i]); i++) {
            if (i === max)
                break;
            totalHeight += item.offsetHeight;
        }
        return totalHeight;
    };
    return Dom;
}());
exports.default = Dom;
//# sourceMappingURL=Dom.js.map