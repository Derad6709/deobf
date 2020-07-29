"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cache_1 = require("./cache");
var Easydropdown_1 = require("./Easydropdown");
var EasydropdownFacade_1 = require("./EasydropdownFacade");
function factory(selectElementOrSelector, options) {
    if (options === void 0) { options = {}; }
    var selectElement = selectElementOrSelector;
    if (typeof selectElementOrSelector === 'string') {
        selectElement = document.querySelector(selectElementOrSelector);
    }
    if (!(selectElement instanceof HTMLSelectElement)) {
        throw new TypeError('[EasyDropDown] Invalid select element provided');
    }
    if (selectElement.multiple) {
        throw new Error('[EasyDropDown] EasyDropDown does not support the `multiple`' +
            ' attribute on select elements.');
    }
    for (var _i = 0, cache_2 = cache_1.default; _i < cache_2.length; _i++) {
        var cachedInstance = cache_2[_i];
        if (cachedInstance.selectElement === selectElement) {
            return new EasydropdownFacade_1.default(cachedInstance);
        }
    }
    var instance = new Easydropdown_1.default(selectElement, options);
    // @ts-ignore
    cache_1.default.push(instance);
    return new EasydropdownFacade_1.default(instance);
}
function decorateFactory(factoryFn) {
    factoryFn.all = function (options) {
        if (options === void 0) { options = {}; }
        var selects = document.querySelectorAll('select');
        Array.prototype.forEach.call(selects, function (select) {
            var instance = factory(select, options);
            return instance;
        });
    };
    factoryFn.destroy = function () {
        var cacheCopy = cache_1.default.slice();
        cacheCopy.forEach(function (instance) { return instance.destroy(); });
    };
    return factoryFn;
}
var decoratedFactory = decorateFactory(factory);
exports.default = decoratedFactory;
//# sourceMappingURL=factory.js.map