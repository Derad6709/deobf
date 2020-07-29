"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var throttle_1 = require("../Shared/Util/throttle");
var EventBinding_1 = require("./EventBinding");
var getEventsList_1 = require("./getEventsList");
function bindEvent(handlerParams, eventBindingRaw) {
    var eventBinding = new EventBinding_1.default(eventBindingRaw);
    if (!eventBinding.target)
        return eventBinding;
    var boundHandler = function (e) { return eventBinding.handler(e, handlerParams); };
    if (eventBinding.throttle > 0) {
        eventBinding.boundHandler = throttle_1.default(boundHandler, eventBinding.throttle);
    }
    else {
        eventBinding.boundHandler = boundHandler;
    }
    eventBinding.target.addEventListener(eventBinding.type, eventBinding.boundHandler);
    return eventBinding;
}
exports.bindEvent = bindEvent;
function bindEvents(handlerParams) {
    return getEventsList_1.default(handlerParams.dom).map(bindEvent.bind(null, handlerParams));
}
exports.default = bindEvents;
//# sourceMappingURL=bindEvents.js.map