"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EasydropdownFacade = /** @class */ (function () {
    function EasydropdownFacade(implementation) {
        this.open = implementation.open.bind(implementation);
        this.close = implementation.close.bind(implementation);
        this.refresh = implementation.refresh.bind(implementation);
        this.destroy = implementation.destroy.bind(implementation);
        this.validate = implementation.validate.bind(implementation);
        Object.defineProperties(this, {
            value: {
                get: function () { return implementation.value; },
                set: function (nextValue) { return implementation.value = nextValue; }
            }
        });
    }
    return EasydropdownFacade;
}());
exports.default = EasydropdownFacade;
//# sourceMappingURL=EasydropdownFacade.js.map