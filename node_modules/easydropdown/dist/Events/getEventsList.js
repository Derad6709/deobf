"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var handleBodyClick_1 = require("./Handlers/handleBodyClick");
var handleBodyMousedown_1 = require("./Handlers/handleBodyMousedown");
var handleBodyMouseover_1 = require("./Handlers/handleBodyMouseover");
var handleHeadClick_1 = require("./Handlers/handleHeadClick");
var handleItemsListScroll_1 = require("./Handlers/handleItemsListScroll");
var handleSelectBlur_1 = require("./Handlers/handleSelectBlur");
var handleSelectFocus_1 = require("./Handlers/handleSelectFocus");
var handleSelectInvalid_1 = require("./Handlers/handleSelectInvalid");
var handleSelectKeydown_1 = require("./Handlers/handleSelectKeydown");
var handleSelectKeypress_1 = require("./Handlers/handleSelectKeypress");
var handleWindowClick_1 = require("./Handlers/handleWindowClick");
var handleWindowClick_2 = require("./Handlers/handleWindowClick");
var getEventsList = function (dom) { return [
    {
        target: dom.head,
        type: 'click',
        handler: handleHeadClick_1.default
    },
    {
        target: dom.body,
        type: 'mousedown',
        handler: handleBodyMousedown_1.default
    },
    {
        target: dom.body,
        type: 'click',
        handler: handleBodyClick_1.default
    },
    {
        target: dom.body,
        type: 'mouseover',
        handler: handleBodyMouseover_1.default
    },
    {
        target: dom.itemsList,
        type: 'scroll',
        handler: handleItemsListScroll_1.default
    },
    {
        target: dom.select,
        type: 'keydown',
        handler: handleSelectKeydown_1.default
    },
    {
        target: dom.select,
        type: 'invalid',
        handler: handleSelectInvalid_1.default
    },
    {
        target: dom.select,
        type: 'keypress',
        handler: handleSelectKeypress_1.default
    },
    {
        target: dom.select,
        type: 'focus',
        handler: handleSelectFocus_1.default
    },
    {
        target: dom.select,
        type: 'blur',
        handler: handleSelectBlur_1.default
    },
    {
        target: document.documentElement,
        type: 'click',
        handler: handleWindowClick_1.default
    },
    {
        target: window,
        type: 'resize',
        handler: handleWindowClick_2.default,
        throttle: 100
    }
]; };
exports.default = getEventsList;
//# sourceMappingURL=getEventsList.js.map