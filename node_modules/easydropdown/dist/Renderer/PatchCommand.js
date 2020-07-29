"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PatchCommand = /** @class */ (function () {
    function PatchCommand() {
        this.newNode = null;
        this.newInnerHtml = '';
        this.newTextContent = '';
        this.attributeChanges = [];
        this.childCommands = [];
        this.index = null;
    }
    return PatchCommand;
}());
exports.default = PatchCommand;
//# sourceMappingURL=PatchCommand.js.map