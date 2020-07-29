"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createDomElementFromHtml(html) {
    var temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.firstElementChild;
}
exports.default = createDomElementFromHtml;
//# sourceMappingURL=createDomElementFromHtml.js.map