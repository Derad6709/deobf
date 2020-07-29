"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var helpful_merge_1 = require("helpful-merge");
var Config_1 = require("../Config/Config");
var bindEvents_1 = require("../Events/bindEvents");
var Renderer_1 = require("../Renderer/Renderer");
var dispatchOpen_1 = require("../Shared/Util/dispatchOpen");
var pollForSelectChange_1 = require("../Shared/Util/pollForSelectChange");
var pollForSelectMutation_1 = require("../Shared/Util/pollForSelectMutation");
var closeOthers_1 = require("../State/InjectedActions/closeOthers");
var scrollToView_1 = require("../State/InjectedActions/scrollToView");
var StateManager_1 = require("../State/StateManager");
var StateMapper_1 = require("../State/StateMapper");
var cache_1 = require("./cache");
var Timers_1 = require("./Timers");
var Easydropdown = /** @class */ (function () {
    function Easydropdown(selectElement, options) {
        this.config = helpful_merge_1.default(new Config_1.default(), options, true);
        this.state = StateMapper_1.default.mapFromSelect(selectElement, this.config);
        this.renderer = new Renderer_1.default(this.config.classNames);
        this.dom = this.renderer.render(this.state, selectElement);
        this.timers = new Timers_1.default();
        this.actions = StateManager_1.default.proxyActions(this.state, {
            closeOthers: closeOthers_1.default.bind(null, this, cache_1.default),
            scrollToView: scrollToView_1.default.bind(null, this.dom, this.timers)
        }, this.handleStateUpdate.bind(this));
        this.eventBindings = bindEvents_1.default({
            actions: this.actions,
            config: this.config,
            dom: this.dom,
            state: this.state,
            timers: this.timers
        });
        this.timers.pollChangeIntervalId = pollForSelectChange_1.default(this.dom.select, this.state, this.actions, this.config);
        if (this.config.behavior.liveUpdates) {
            this.timers.pollMutationIntervalId = pollForSelectMutation_1.default(this.dom.select, this.state, this.refresh.bind(this));
        }
    }
    Object.defineProperty(Easydropdown.prototype, "selectElement", {
        get: function () {
            return this.dom.select;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Easydropdown.prototype, "value", {
        get: function () {
            return this.state.value;
        },
        set: function (nextValue) {
            if (typeof nextValue !== 'string') {
                throw new TypeError('[EasyDropDown] Provided value not a valid string');
            }
            this.dom.select.value = nextValue;
        },
        enumerable: true,
        configurable: true
    });
    Easydropdown.prototype.open = function () {
        dispatchOpen_1.default(this.actions, this.config, this.dom);
    };
    Easydropdown.prototype.close = function () {
        this.actions.close();
    };
    Easydropdown.prototype.refresh = function () {
        this.state = helpful_merge_1.default(this.state, StateMapper_1.default.mapFromSelect(this.dom.select, this.config));
        this.renderer.update(this.state);
        this.dom.group.length = this.dom.option.length = this.dom.item.length = 0;
        Renderer_1.default.queryDomRefs(this.dom, ['group', 'option', 'item']);
    };
    Easydropdown.prototype.validate = function () {
        if (!this.state.isRequired || this.state.hasValue) {
            return true;
        }
        this.actions.invalidate();
        return false;
    };
    Easydropdown.prototype.destroy = function () {
        this.timers.clear();
        this.eventBindings.forEach(function (binding) { return binding.unbind(); });
        this.renderer.destroy();
        var cacheIndex = cache_1.default.indexOf(this);
        cache_1.default.splice(cacheIndex, 1);
    };
    Easydropdown.prototype.handleStateUpdate = function (state, key) {
        var callbacks = this.config.callbacks;
        this.renderer.update(state, key);
        switch (key) {
            case 'bodyStatus': {
                var cb = void 0;
                if (state.isOpen) {
                    cb = callbacks.onOpen;
                }
                else {
                    cb = callbacks.onClose;
                }
                if (typeof cb === 'function')
                    cb();
                break;
            }
            case 'selectedIndex': {
                var cb = callbacks.onSelect;
                if (typeof cb === 'function')
                    cb(state.value);
                break;
            }
            case 'isClickSelecting': {
                var cb = callbacks.onOptionClick;
                if (state[key] === false) {
                    var nextValue = state.getOptionFromIndex(state.focusedIndex).value;
                    if (typeof cb === 'function')
                        cb(nextValue);
                }
            }
        }
    };
    return Easydropdown;
}());
exports.default = Easydropdown;
//# sourceMappingURL=Easydropdown.js.map