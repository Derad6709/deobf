"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var helpful_merge_1 = require("helpful-merge");
var AttributeChangeType_1 = require("./Constants/AttributeChangeType");
var DomChangeType_1 = require("./Constants/DomChangeType");
var PatchCommand_1 = require("./PatchCommand");
function domDiff(prev, next) {
    var totalChildNodes = -1;
    var command = new PatchCommand_1.default();
    if (prev instanceof HTMLSelectElement) {
        command.type = DomChangeType_1.default.NONE;
        return command;
    }
    if (prev instanceof Text && next instanceof Text) {
        if (prev.textContent === next.textContent) {
            command.type = DomChangeType_1.default.NONE;
        }
        else {
            command.type = DomChangeType_1.default.INNER;
            command.newTextContent = next.textContent;
        }
    }
    else if (prev instanceof HTMLElement && next instanceof HTMLElement) {
        if (prev.tagName !== next.tagName) {
            command.type = DomChangeType_1.default.REPLACE;
            command.newNode = next;
        }
        else if (prev.outerHTML === next.outerHTML) {
            command.type = DomChangeType_1.default.NONE;
        }
        else if (prev.innerHTML === next.innerHTML) {
            helpful_merge_1.default(command, diffAttributeChanges(prev, next));
        }
        else {
            helpful_merge_1.default(command, diffAttributeChanges(prev, next));
            if (command.attributeChanges.length > 0) {
                command.type = DomChangeType_1.default.FULL;
            }
            else {
                command.type = DomChangeType_1.default.INNER;
            }
            if ((totalChildNodes = prev.childNodes.length) > 0 && totalChildNodes === next.childNodes.length) {
                for (var i = 0, childNode = void 0; (childNode = prev.childNodes[i]); i++) {
                    command.childCommands.push(domDiff(childNode, next.childNodes[i]));
                }
            }
            else {
                command.newInnerHtml = next.innerHTML;
            }
        }
    }
    else {
        command.type = DomChangeType_1.default.REPLACE;
        command.newNode = next;
    }
    return command;
}
function diffAttributeChanges(prev, next) {
    var totalAttributes = Math.max(prev.attributes.length, next.attributes.length);
    var attributesMap = {};
    var undef = void (0);
    var attributeChanges = [];
    for (var i = 0; i < totalAttributes; i++) {
        var attr1 = prev.attributes[i];
        var attr2 = next.attributes[i];
        if (attr1 && attributesMap[attr1.name] === undef) {
            attributesMap[attr1.name] = [];
        }
        if (attr2 && attributesMap[attr2.name] === undef) {
            attributesMap[attr2.name] = [];
        }
        if (attr1)
            attributesMap[attr1.name][0] = attr1.value;
        if (attr2)
            attributesMap[attr2.name][1] = attr2.value;
    }
    var keys = Object.keys(attributesMap);
    if (keys.length > 1) {
        keys.sort();
    }
    for (var i = 0, key = void 0; (key = keys[i]); i++) {
        var attr = attributesMap[key];
        var change = {
            type: null,
            name: key,
            value: null
        };
        if (attr[0] === attr[1])
            continue;
        if (attr[0] === undef) {
            change.type = AttributeChangeType_1.default.ADD;
            change.value = attr[1];
        }
        else if (attr[1] === undef) {
            change.type = AttributeChangeType_1.default.REMOVE,
                change.value = '';
        }
        else {
            change.type = AttributeChangeType_1.default.EDIT,
                change.value = attr[1];
        }
        attributeChanges.push(change);
    }
    return {
        type: DomChangeType_1.default.OUTER,
        attributeChanges: attributeChanges
    };
}
exports.default = domDiff;
//# sourceMappingURL=domDiff.js.map