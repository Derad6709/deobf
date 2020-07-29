"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var arrow_1 = require("./arrow");
var value_1 = require("./value");
var head = function (state, classNames) { return ("\n    <div class=\"" + classNames.head + "\" data-ref=\"head\">\n        " + value_1.default(state, classNames) + "\n        " + arrow_1.default(state, classNames) + "\n        <select class=\"" + classNames.select + "\" data-ref=\"select\"></select>\n    </div>\n"); };
exports.default = head;
//# sourceMappingURL=head.js.map