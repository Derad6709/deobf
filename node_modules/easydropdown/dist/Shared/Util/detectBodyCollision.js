"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CollisionType_1 = require("./Constants/CollisionType");
var CLEARSPACE = 10;
function mapCollisionData(deltaTop, deltaBottom, maxHeight, itemHeight) {
    var type = CollisionType_1.default.NONE;
    var maxVisibleItemsOverride = -1;
    if (deltaTop <= maxHeight && deltaBottom <= maxHeight) {
        var largestDelta = Math.max(deltaBottom, deltaTop);
        type = deltaTop < deltaBottom ? CollisionType_1.default.TOP : CollisionType_1.default.BOTTOM;
        maxVisibleItemsOverride = Math.floor(largestDelta / itemHeight);
    }
    else if (deltaTop <= maxHeight) {
        type = CollisionType_1.default.TOP;
    }
    else if (deltaBottom <= maxHeight) {
        type = CollisionType_1.default.BOTTOM;
    }
    return { type: type, maxVisibleItemsOverride: maxVisibleItemsOverride };
}
exports.mapCollisionData = mapCollisionData;
function detectBodyCollision(dom, config) {
    var bbHead = dom.head.getBoundingClientRect();
    var wh = window.innerHeight;
    var deltaTop = bbHead.top - CLEARSPACE;
    var deltaBottom = wh - bbHead.bottom - CLEARSPACE;
    if (dom.option.length < 1)
        return {
            type: CollisionType_1.default.NONE,
            maxVisibleItemsOverride: -1
        };
    var maxVisibleItems = Math.min(config.behavior.maxVisibleItems, dom.item.length);
    var maxHeight = dom.sumItemsHeight(maxVisibleItems);
    var itemHeight = dom.sumItemsHeight(1);
    return mapCollisionData(deltaTop, deltaBottom, maxHeight, itemHeight);
}
exports.default = detectBodyCollision;
//# sourceMappingURL=detectBodyCollision.js.map