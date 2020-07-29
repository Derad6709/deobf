"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var helpful_merge_1 = require("helpful-merge");
var getIsMobilePlatform_1 = require("../Shared/Util/getIsMobilePlatform");
var Group_1 = require("./Group");
var Option_1 = require("./Option");
var State_1 = require("./State");
var StateMapper = /** @class */ (function () {
    function StateMapper() {
    }
    StateMapper.mapFromSelect = function (selectElement, config) {
        var state = new State_1.default(null, config);
        var isWithinGroup = false;
        state.name = selectElement.name;
        state.isDisabled = selectElement.disabled;
        state.isRequired = selectElement.required;
        state.isUseNativeMode = (config.behavior.useNativeUiOnMobile &&
            getIsMobilePlatform_1.default(window.navigator.userAgent));
        for (var i = 0, child = void 0; (child = selectElement.children[i]); i++) {
            if (i === 0 && child.getAttribute('data-placeholder') !== null) {
                state.placeholder = child.textContent;
                child.value = '';
                continue;
            }
            if (child instanceof HTMLOptionElement) {
                if (isWithinGroup === false) {
                    state.groups.push(StateMapper.mapGroup());
                    isWithinGroup = true;
                }
                state.lastGroup.options.push(StateMapper.mapOption(child));
                if (child.selected)
                    state.selectedIndex = state.totalOptions - 1;
            }
            else if (child instanceof HTMLOptGroupElement) {
                isWithinGroup = true;
                state.groups.push(StateMapper.mapGroup(child));
                for (var j = 0, groupChild = void 0; (groupChild = child.children[j]); j++) {
                    state.lastGroup.options.push(StateMapper.mapOption(groupChild, child));
                    if (groupChild.selected)
                        state.selectedIndex = state.totalOptions - 1;
                }
                isWithinGroup = false;
            }
            else {
                throw new TypeError("[EasyDropDown] Invalid child tag \"" + child.tagName + "\" found in provided `<select>` element");
            }
        }
        return Object.seal(state);
    };
    StateMapper.mapGroup = function (group) {
        if (group === void 0) { group = null; }
        return helpful_merge_1.default(new Group_1.default(), {
            label: group ? group.label : '',
            isDisabled: group ? group.disabled : false
        });
    };
    StateMapper.mapOption = function (option, group) {
        if (group === void 0) { group = null; }
        if (!(option instanceof HTMLOptionElement))
            throw new TypeError('[EasyDropDown] Invalid markup structure');
        var isParentGroupDisabled = group !== null && group.disabled;
        return helpful_merge_1.default(new Option_1.default(), {
            label: option.textContent,
            value: option.value,
            isDisabled: option.disabled || isParentGroupDisabled
        });
    };
    return StateMapper;
}());
exports.default = StateMapper;
//# sourceMappingURL=StateMapper.js.map