"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AttributeChangeType_1 = require("./Constants/AttributeChangeType");
var DomChangeType_1 = require("./Constants/DomChangeType");
function domPatch(node, command) {
    switch (command.type) {
        case DomChangeType_1.default.NONE:
            return node;
        case DomChangeType_1.default.REPLACE:
            node.parentElement.replaceChild(command.newNode, node);
            return command.newNode;
        case DomChangeType_1.default.INNER:
            if (node instanceof Text) {
                node.textContent = command.newTextContent;
            }
            else if (command.childCommands.length > 0) {
                command.childCommands.forEach(function (childCommand, i) { return domPatch(node.childNodes[i], childCommand); });
            }
            else {
                node.innerHTML = command.newInnerHtml;
            }
            return node;
        case DomChangeType_1.default.OUTER:
            patchAttributes(node, command.attributeChanges);
            return node;
        case DomChangeType_1.default.FULL:
            if (command.childCommands.length > 0) {
                command.childCommands.forEach(function (childCommand, i) { return domPatch(node.childNodes[i], childCommand); });
            }
            else {
                node.innerHTML = command.newInnerHtml;
            }
            patchAttributes(node, command.attributeChanges);
            return node;
    }
}
function patchAttributes(el, attributeChanges) {
    var raf = window.requestAnimationFrame;
    attributeChanges.forEach(function (change) {
        if (raf && ['class', 'style'].indexOf(change.name) > -1) {
            raf(function () { return patchAttribute(el, change); });
        }
        else {
            patchAttribute(el, change);
        }
    });
}
function patchAttribute(el, change) {
    switch (change.type) {
        case AttributeChangeType_1.default.ADD:
        case AttributeChangeType_1.default.EDIT:
            el.setAttribute(change.name, change.value);
            break;
        case AttributeChangeType_1.default.REMOVE:
            el.removeAttribute(change.name);
            break;
    }
}
exports.default = domPatch;
//# sourceMappingURL=domPatch.js.map