"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var helpful_merge_1 = require("helpful-merge");
var Config_1 = require("../Config/Config");
var BodyStatus_1 = require("./Constants/BodyStatus");
var ScrollStatus_1 = require("./Constants/ScrollStatus");
var Group_1 = require("./Group");
var Option_1 = require("./Option");
var State = /** @class */ (function () {
    function State(stateRaw, config) {
        if (stateRaw === void 0) { stateRaw = null; }
        if (config === void 0) { config = new Config_1.default(); }
        this.groups = [];
        this.focusedIndex = -1;
        this.selectedIndex = -1;
        this.maxVisibleItemsOverride = -1;
        this.maxBodyHeight = -1;
        this.name = '';
        this.placeholder = '';
        this.scrollStatus = ScrollStatus_1.default.AT_TOP;
        this.bodyStatus = BodyStatus_1.default.CLOSED;
        this.isDisabled = false;
        this.isRequired = false;
        this.isInvalid = false;
        this.isFocused = false;
        this.isUseNativeMode = false;
        this.isScrollable = false;
        this.isClickSelecting = false;
        this.isSearching = false;
        this.isKeying = false;
        this.config = config;
        if (!stateRaw)
            return;
        helpful_merge_1.default(this, stateRaw);
        this.groups = this.groups.map(function (groupRaw) {
            var group = helpful_merge_1.default(new Group_1.default(), groupRaw);
            group.options = group.options.map(function (optionRaw) { return helpful_merge_1.default(new Option_1.default(), optionRaw); });
            return group;
        });
    }
    Object.defineProperty(State.prototype, "totalGroups", {
        get: function () {
            return this.groups.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(State.prototype, "lastGroup", {
        get: function () {
            return this.groups[this.groups.length - 1];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(State.prototype, "totalOptions", {
        get: function () {
            return this.groups.reduce(function (total, group) { return total + group.totalOptions; }, 0);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(State.prototype, "selectedOption", {
        get: function () {
            return this.getOptionFromIndex(this.selectedIndex);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(State.prototype, "focusedOption", {
        get: function () {
            return this.getOptionFromIndex(this.focusedIndex);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(State.prototype, "value", {
        get: function () {
            return this.selectedOption ? this.selectedOption.value : '';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(State.prototype, "humanReadableValue", {
        get: function () {
            if ((!this.hasValue && this.hasPlaceholder) ||
                (this.config.behavior.showPlaceholderWhenOpen &&
                    this.hasPlaceholder &&
                    this.isOpen)) {
                return this.placeholder;
            }
            return this.label;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(State.prototype, "label", {
        get: function () {
            return this.selectedOption ? this.selectedOption.label : '';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(State.prototype, "hasPlaceholder", {
        get: function () {
            return this.placeholder !== '';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(State.prototype, "isPlaceholderShown", {
        get: function () {
            return this.hasPlaceholder && !this.hasValue;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(State.prototype, "hasValue", {
        get: function () {
            return this.value !== '';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(State.prototype, "isGrouped", {
        get: function () {
            return Boolean(this.groups.find(function (group) { return group.hasLabel; }));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(State.prototype, "isOpen", {
        get: function () {
            return this.bodyStatus !== BodyStatus_1.default.CLOSED;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(State.prototype, "isClosed", {
        get: function () {
            return this.bodyStatus === BodyStatus_1.default.CLOSED;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(State.prototype, "isOpenAbove", {
        get: function () {
            return this.bodyStatus === BodyStatus_1.default.OPEN_ABOVE;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(State.prototype, "isOpenBelow", {
        get: function () {
            return this.bodyStatus === BodyStatus_1.default.OPEN_BELOW;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(State.prototype, "isAtTop", {
        get: function () {
            return this.scrollStatus === ScrollStatus_1.default.AT_TOP;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(State.prototype, "isAtBottom", {
        get: function () {
            return this.scrollStatus === ScrollStatus_1.default.AT_BOTTOM;
        },
        enumerable: true,
        configurable: true
    });
    State.prototype.getOptionFromIndex = function (index) {
        var groupStartIndex = 0;
        for (var _i = 0, _a = this.groups; _i < _a.length; _i++) {
            var group = _a[_i];
            if (index < 0)
                break;
            var groupEndIndex = Math.max(0, groupStartIndex + group.totalOptions - 1);
            if (index <= groupEndIndex) {
                var option = group.options[index - groupStartIndex];
                return option;
            }
            groupStartIndex += group.totalOptions;
        }
        return null;
    };
    State.prototype.getOptionIndexFromValue = function (value) {
        var index = -1;
        for (var _i = 0, _a = this.groups; _i < _a.length; _i++) {
            var group = _a[_i];
            for (var _b = 0, _c = group.options; _b < _c.length; _b++) {
                var option = _c[_b];
                index++;
                if (option.value === value) {
                    return index;
                }
            }
        }
        return -1;
    };
    return State;
}());
exports.default = State;
//# sourceMappingURL=State.js.map