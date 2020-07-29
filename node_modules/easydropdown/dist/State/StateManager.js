"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var helpful_merge_1 = require("helpful-merge");
var resolveActions_1 = require("./resolveActions");
var StateManager = /** @class */ (function () {
    function StateManager() {
    }
    StateManager.proxyActions = function (state, injectedActions, onAction) {
        var stateProxy = StateManager.createStateProxy(state, onAction);
        var actions = resolveActions_1.default(stateProxy);
        helpful_merge_1.default(actions, injectedActions);
        return actions;
    };
    StateManager.createStateProxy = function (state, onAction) {
        return Object.seal(StateManager
            .getPropertyDescriptorsFromValue(state, onAction)
            .reduce(function (proxy, _a) {
            var key = _a.key, get = _a.get, set = _a.set;
            return Object.defineProperty(proxy, key, {
                enumerable: true,
                get: get,
                set: set
            });
        }, {}));
    };
    StateManager.getPropertyDescriptorsFromValue = function (state, onAction) {
        var prototype = Object.getPrototypeOf(state);
        var allKeys = Object.keys(state).concat(Object.keys(prototype));
        return allKeys
            .reduce(function (localDescriptors, key) {
            var propertyDescriptor = Object.getOwnPropertyDescriptor(state, key) ||
                Object.getOwnPropertyDescriptor(prototype, key);
            var isAccessorProperty = typeof propertyDescriptor.get === 'function';
            localDescriptors.push({
                get: StateManager.readPropertyValue.bind(null, state, key),
                set: isAccessorProperty ?
                    void 0 : StateManager.updatePropertyValue.bind(null, state, key, onAction),
                key: key
            });
            return localDescriptors;
        }, []);
    };
    StateManager.readPropertyValue = function (state, key) {
        return state[key];
    };
    StateManager.updatePropertyValue = function (state, key, onAction, value) {
        if (state[key] === value)
            return;
        state[key] = value;
        onAction(state, key);
    };
    return StateManager;
}());
exports.default = StateManager;
//# sourceMappingURL=StateManager.js.map