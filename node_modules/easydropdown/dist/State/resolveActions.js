"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CollisionType_1 = require("../Shared/Util/Constants/CollisionType");
var BodyStatus_1 = require("./Constants/BodyStatus");
var ScrollStatus_1 = require("./Constants/ScrollStatus");
var resolveActions = function (state) { return ({
    focus: function () {
        state.isFocused = true;
    },
    blur: function () {
        state.isFocused = false;
    },
    invalidate: function () {
        state.isInvalid = true;
    },
    validate: function () {
        state.isInvalid = false;
    },
    topOut: function () {
        state.scrollStatus = ScrollStatus_1.default.AT_TOP;
    },
    bottomOut: function () {
        state.scrollStatus = ScrollStatus_1.default.AT_BOTTOM;
    },
    scroll: function () {
        state.scrollStatus = ScrollStatus_1.default.SCROLLED;
    },
    makeScrollable: function () {
        state.isScrollable = true;
    },
    makeUnscrollable: function () {
        state.isScrollable = false;
    },
    open: function (maxBodyHeight, collisionType, isScrollable) {
        if (state.isDisabled)
            return;
        this.closeOthers();
        switch (collisionType) {
            case CollisionType_1.default.NONE:
            case CollisionType_1.default.TOP:
                state.bodyStatus = BodyStatus_1.default.OPEN_BELOW;
                break;
            case CollisionType_1.default.BOTTOM:
                state.bodyStatus = BodyStatus_1.default.OPEN_ABOVE;
                break;
        }
        state.isScrollable = isScrollable;
        state.maxBodyHeight = maxBodyHeight;
        this.scrollToView(state, true);
    },
    close: function () {
        state.bodyStatus = BodyStatus_1.default.CLOSED;
        state.focusedIndex = -1;
        this.blur();
    },
    startClickSelecting: function () {
        state.isClickSelecting = true;
    },
    selectOption: function (index, close) {
        if (close === void 0) { close = true; }
        var optionAtIndex = state.getOptionFromIndex(index);
        state.isClickSelecting = false;
        if (index > -1 && (!optionAtIndex || optionAtIndex.isDisabled))
            return;
        state.selectedIndex = index;
        if (state.isInvalid && state.hasValue) {
            this.validate();
        }
        if (state.isSearching) {
            this.scrollToView(state);
        }
        else if (close) {
            this.close();
        }
    },
    focusOption: function (index, shouldScrollToView) {
        if (shouldScrollToView === void 0) { shouldScrollToView = false; }
        var scrollToMiddle = Math.abs(index - state.focusedIndex) > 1;
        state.focusedIndex = index;
        if (shouldScrollToView) {
            this.scrollToView(state, scrollToMiddle);
        }
    },
    search: function () {
        state.isSearching = true;
    },
    resetSearch: function () {
        state.isSearching = false;
    },
    keying: function () {
        state.isKeying = true;
    },
    resetKeying: function () {
        state.isKeying = false;
    },
    useNative: function () {
        state.isUseNativeMode = true;
    }
}); };
exports.default = resolveActions;
//# sourceMappingURL=resolveActions.js.map