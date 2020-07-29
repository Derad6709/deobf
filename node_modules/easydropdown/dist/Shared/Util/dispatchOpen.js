"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var detectBodyCollision_1 = require("./detectBodyCollision");
function dispatchOpen(injectedDetectBodyCollision, actions, config, dom) {
    var collisionData = injectedDetectBodyCollision(dom, config);
    var maxVisibleItems = collisionData.maxVisibleItemsOverride > -1 ?
        collisionData.maxVisibleItemsOverride : config.behavior.maxVisibleItems;
    var isScrollable = dom.item.length > maxVisibleItems;
    var maxBodyHeight = dom.sumItemsHeight(maxVisibleItems);
    actions.open(maxBodyHeight, collisionData.type, isScrollable);
}
exports.dispatchOpen = dispatchOpen;
var boundDispatchOpen = dispatchOpen.bind(null, detectBodyCollision_1.default);
exports.default = boundDispatchOpen;
//# sourceMappingURL=dispatchOpen.js.map