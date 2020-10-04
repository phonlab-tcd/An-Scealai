/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
// previous version:
// https://github.com/angular-ui/bootstrap/blob/07c31d0731f7cb068a1932b8e01d2312b796b4ec/src/position/position.js
var 
// previous version:
// https://github.com/angular-ui/bootstrap/blob/07c31d0731f7cb068a1932b8e01d2312b796b4ec/src/position/position.js
Positioning = /** @class */ (function () {
    function Positioning() {
    }
    /**
     * @param {?} element
     * @return {?}
     */
    Positioning.prototype.getAllStyles = /**
     * @param {?} element
     * @return {?}
     */
    function (element) { return window.getComputedStyle(element); };
    /**
     * @param {?} element
     * @param {?} prop
     * @return {?}
     */
    Positioning.prototype.getStyle = /**
     * @param {?} element
     * @param {?} prop
     * @return {?}
     */
    function (element, prop) { return this.getAllStyles(element)[prop]; };
    /**
     * @param {?} element
     * @return {?}
     */
    Positioning.prototype.isStaticPositioned = /**
     * @param {?} element
     * @return {?}
     */
    function (element) {
        return (this.getStyle(element, 'position') || 'static') === 'static';
    };
    /**
     * @param {?} element
     * @return {?}
     */
    Positioning.prototype.offsetParent = /**
     * @param {?} element
     * @return {?}
     */
    function (element) {
        /** @type {?} */
        var offsetParentEl = (/** @type {?} */ (element.offsetParent)) || document.documentElement;
        while (offsetParentEl && offsetParentEl !== document.documentElement && this.isStaticPositioned(offsetParentEl)) {
            offsetParentEl = (/** @type {?} */ (offsetParentEl.offsetParent));
        }
        return offsetParentEl || document.documentElement;
    };
    /**
     * @param {?} element
     * @param {?=} round
     * @return {?}
     */
    Positioning.prototype.position = /**
     * @param {?} element
     * @param {?=} round
     * @return {?}
     */
    function (element, round) {
        if (round === void 0) { round = true; }
        /** @type {?} */
        var elPosition;
        /** @type {?} */
        var parentOffset = { width: 0, height: 0, top: 0, bottom: 0, left: 0, right: 0 };
        if (this.getStyle(element, 'position') === 'fixed') {
            elPosition = element.getBoundingClientRect();
            elPosition = {
                top: elPosition.top,
                bottom: elPosition.bottom,
                left: elPosition.left,
                right: elPosition.right,
                height: elPosition.height,
                width: elPosition.width
            };
        }
        else {
            /** @type {?} */
            var offsetParentEl = this.offsetParent(element);
            elPosition = this.offset(element, false);
            if (offsetParentEl !== document.documentElement) {
                parentOffset = this.offset(offsetParentEl, false);
            }
            parentOffset.top += offsetParentEl.clientTop;
            parentOffset.left += offsetParentEl.clientLeft;
        }
        elPosition.top -= parentOffset.top;
        elPosition.bottom -= parentOffset.top;
        elPosition.left -= parentOffset.left;
        elPosition.right -= parentOffset.left;
        if (round) {
            elPosition.top = Math.round(elPosition.top);
            elPosition.bottom = Math.round(elPosition.bottom);
            elPosition.left = Math.round(elPosition.left);
            elPosition.right = Math.round(elPosition.right);
        }
        return elPosition;
    };
    /**
     * @param {?} element
     * @param {?=} round
     * @return {?}
     */
    Positioning.prototype.offset = /**
     * @param {?} element
     * @param {?=} round
     * @return {?}
     */
    function (element, round) {
        if (round === void 0) { round = true; }
        /** @type {?} */
        var elBcr = element.getBoundingClientRect();
        /** @type {?} */
        var viewportOffset = {
            top: window.pageYOffset - document.documentElement.clientTop,
            left: window.pageXOffset - document.documentElement.clientLeft
        };
        /** @type {?} */
        var elOffset = {
            height: elBcr.height || element.offsetHeight,
            width: elBcr.width || element.offsetWidth,
            top: elBcr.top + viewportOffset.top,
            bottom: elBcr.bottom + viewportOffset.top,
            left: elBcr.left + viewportOffset.left,
            right: elBcr.right + viewportOffset.left
        };
        if (round) {
            elOffset.height = Math.round(elOffset.height);
            elOffset.width = Math.round(elOffset.width);
            elOffset.top = Math.round(elOffset.top);
            elOffset.bottom = Math.round(elOffset.bottom);
            elOffset.left = Math.round(elOffset.left);
            elOffset.right = Math.round(elOffset.right);
        }
        return elOffset;
    };
    /*
      Return false if the element to position is outside the viewport
    */
    /*
        Return false if the element to position is outside the viewport
      */
    /**
     * @param {?} hostElement
     * @param {?} targetElement
     * @param {?} placement
     * @param {?=} appendToBody
     * @return {?}
     */
    Positioning.prototype.positionElements = /*
        Return false if the element to position is outside the viewport
      */
    /**
     * @param {?} hostElement
     * @param {?} targetElement
     * @param {?} placement
     * @param {?=} appendToBody
     * @return {?}
     */
    function (hostElement, targetElement, placement, appendToBody) {
        var _a = tslib_1.__read(placement.split('-'), 2), _b = _a[0], placementPrimary = _b === void 0 ? 'top' : _b, _c = _a[1], placementSecondary = _c === void 0 ? 'center' : _c;
        /** @type {?} */
        var hostElPosition = appendToBody ? this.offset(hostElement, false) : this.position(hostElement, false);
        /** @type {?} */
        var targetElStyles = this.getAllStyles(targetElement);
        /** @type {?} */
        var marginTop = parseFloat(targetElStyles.marginTop);
        /** @type {?} */
        var marginBottom = parseFloat(targetElStyles.marginBottom);
        /** @type {?} */
        var marginLeft = parseFloat(targetElStyles.marginLeft);
        /** @type {?} */
        var marginRight = parseFloat(targetElStyles.marginRight);
        /** @type {?} */
        var topPosition = 0;
        /** @type {?} */
        var leftPosition = 0;
        switch (placementPrimary) {
            case 'top':
                topPosition = (hostElPosition.top - (targetElement.offsetHeight + marginTop + marginBottom));
                break;
            case 'bottom':
                topPosition = (hostElPosition.top + hostElPosition.height);
                break;
            case 'left':
                leftPosition = (hostElPosition.left - (targetElement.offsetWidth + marginLeft + marginRight));
                break;
            case 'right':
                leftPosition = (hostElPosition.left + hostElPosition.width);
                break;
        }
        switch (placementSecondary) {
            case 'top':
                topPosition = hostElPosition.top;
                break;
            case 'bottom':
                topPosition = hostElPosition.top + hostElPosition.height - targetElement.offsetHeight;
                break;
            case 'left':
                leftPosition = hostElPosition.left;
                break;
            case 'right':
                leftPosition = hostElPosition.left + hostElPosition.width - targetElement.offsetWidth;
                break;
            case 'center':
                if (placementPrimary === 'top' || placementPrimary === 'bottom') {
                    leftPosition = (hostElPosition.left + hostElPosition.width / 2 - targetElement.offsetWidth / 2);
                }
                else {
                    topPosition = (hostElPosition.top + hostElPosition.height / 2 - targetElement.offsetHeight / 2);
                }
                break;
        }
        /// The translate3d/gpu acceleration render a blurry text on chrome, the next line is commented until a browser fix
        // targetElement.style.transform = `translate3d(${Math.round(leftPosition)}px, ${Math.floor(topPosition)}px, 0px)`;
        targetElement.style.transform = "translate(" + Math.round(leftPosition) + "px, " + Math.round(topPosition) + "px)";
        // Check if the targetElement is inside the viewport
        /** @type {?} */
        var targetElBCR = targetElement.getBoundingClientRect();
        /** @type {?} */
        var html = document.documentElement;
        /** @type {?} */
        var windowHeight = window.innerHeight || html.clientHeight;
        /** @type {?} */
        var windowWidth = window.innerWidth || html.clientWidth;
        return targetElBCR.left >= 0 && targetElBCR.top >= 0 && targetElBCR.right <= windowWidth &&
            targetElBCR.bottom <= windowHeight;
    };
    return Positioning;
}());
// previous version:
// https://github.com/angular-ui/bootstrap/blob/07c31d0731f7cb068a1932b8e01d2312b796b4ec/src/position/position.js
export { Positioning };
/** @type {?} */
var placementSeparator = /\s+/;
/** @type {?} */
var positionService = new Positioning();
/*
 * Accept the placement array and applies the appropriate placement dependent on the viewport.
 * Returns the applied placement.
 * In case of auto placement, placements are selected in order
 *   'top', 'bottom', 'left', 'right',
 *   'top-left', 'top-right',
 *   'bottom-left', 'bottom-right',
 *   'left-top', 'left-bottom',
 *   'right-top', 'right-bottom'.
 * */
/**
 * @param {?} hostElement
 * @param {?} targetElement
 * @param {?} placement
 * @param {?=} appendToBody
 * @param {?=} baseClass
 * @return {?}
 */
export function positionElements(hostElement, targetElement, placement, appendToBody, baseClass) {
    var e_1, _a;
    /** @type {?} */
    var placementVals = Array.isArray(placement) ? placement : (/** @type {?} */ (placement.split(placementSeparator)));
    /** @type {?} */
    var allowedPlacements = [
        'top', 'bottom', 'left', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'left-top', 'left-bottom',
        'right-top', 'right-bottom'
    ];
    /** @type {?} */
    var classList = targetElement.classList;
    /** @type {?} */
    var addClassesToTarget = function (targetPlacement) {
        var _a = tslib_1.__read(targetPlacement.split('-'), 2), primary = _a[0], secondary = _a[1];
        /** @type {?} */
        var classes = [];
        if (baseClass) {
            classes.push(baseClass + "-" + primary);
            if (secondary) {
                classes.push(baseClass + "-" + primary + "-" + secondary);
            }
            classes.forEach(function (classname) { classList.add(classname); });
        }
        return classes;
    };
    // Remove old placement classes to avoid issues
    if (baseClass) {
        allowedPlacements.forEach(function (placementToRemove) { classList.remove(baseClass + "-" + placementToRemove); });
    }
    // replace auto placement with other placements
    /** @type {?} */
    var hasAuto = placementVals.findIndex(function (val) { return val === 'auto'; });
    if (hasAuto >= 0) {
        allowedPlacements.forEach(function (obj) {
            if (placementVals.find(function (val) { return val.search('^' + obj) !== -1; }) == null) {
                placementVals.splice(hasAuto++, 1, (/** @type {?} */ (obj)));
            }
        });
    }
    // coordinates where to position
    // Required for transform:
    /** @type {?} */
    var style = targetElement.style;
    style.position = 'absolute';
    style.top = '0';
    style.left = '0';
    style['will-change'] = 'transform';
    /** @type {?} */
    var testPlacement;
    /** @type {?} */
    var isInViewport = false;
    try {
        for (var placementVals_1 = tslib_1.__values(placementVals), placementVals_1_1 = placementVals_1.next(); !placementVals_1_1.done; placementVals_1_1 = placementVals_1.next()) {
            testPlacement = placementVals_1_1.value;
            /** @type {?} */
            var addedClasses = addClassesToTarget(testPlacement);
            if (positionService.positionElements(hostElement, targetElement, testPlacement, appendToBody)) {
                isInViewport = true;
                break;
            }
            // Remove the baseClasses for further calculation
            if (baseClass) {
                addedClasses.forEach(function (classname) { classList.remove(classname); });
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (placementVals_1_1 && !placementVals_1_1.done && (_a = placementVals_1.return)) _a.call(placementVals_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    if (!isInViewport) {
        // If nothing match, the first placement is the default one
        testPlacement = placementVals[0];
        addClassesToTarget(testPlacement);
        positionService.positionElements(hostElement, targetElement, testPlacement, appendToBody);
    }
    return testPlacement;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9zaXRpb25pbmcuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC8iLCJzb3VyY2VzIjpbInV0aWwvcG9zaXRpb25pbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUVBOzs7O0lBQUE7SUE2SkEsQ0FBQzs7Ozs7SUE1SlMsa0NBQVk7Ozs7SUFBcEIsVUFBcUIsT0FBb0IsSUFBSSxPQUFPLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7Ozs7OztJQUUvRSw4QkFBUTs7Ozs7SUFBaEIsVUFBaUIsT0FBb0IsRUFBRSxJQUFZLElBQVksT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzs7Ozs7SUFFakcsd0NBQWtCOzs7O0lBQTFCLFVBQTJCLE9BQW9CO1FBQzdDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMsSUFBSSxRQUFRLENBQUMsS0FBSyxRQUFRLENBQUM7SUFDdkUsQ0FBQzs7Ozs7SUFFTyxrQ0FBWTs7OztJQUFwQixVQUFxQixPQUFvQjs7WUFDbkMsY0FBYyxHQUFHLG1CQUFhLE9BQU8sQ0FBQyxZQUFZLEVBQUEsSUFBSSxRQUFRLENBQUMsZUFBZTtRQUVsRixPQUFPLGNBQWMsSUFBSSxjQUFjLEtBQUssUUFBUSxDQUFDLGVBQWUsSUFBSSxJQUFJLENBQUMsa0JBQWtCLENBQUMsY0FBYyxDQUFDLEVBQUU7WUFDL0csY0FBYyxHQUFHLG1CQUFhLGNBQWMsQ0FBQyxZQUFZLEVBQUEsQ0FBQztTQUMzRDtRQUVELE9BQU8sY0FBYyxJQUFJLFFBQVEsQ0FBQyxlQUFlLENBQUM7SUFDcEQsQ0FBQzs7Ozs7O0lBRUQsOEJBQVE7Ozs7O0lBQVIsVUFBUyxPQUFvQixFQUFFLEtBQVk7UUFBWixzQkFBQSxFQUFBLFlBQVk7O1lBQ3JDLFVBQXNCOztZQUN0QixZ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LGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsYUFBYSxFQUFFLGFBQWEsRUFBRSxZQUFZLENBQUMsRUFBRTtnQkFDN0YsWUFBWSxHQUFHLElBQUksQ0FBQztnQkFDcEIsTUFBTTthQUNQO1lBRUQsaURBQWlEO1lBQ2pELElBQUksU0FBUyxFQUFFO2dCQUNiLFlBQVksQ0FBQyxPQUFPLENBQUMsVUFBQyxTQUFTLElBQU8sU0FBUyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3ZFO1NBQ0Y7Ozs7Ozs7OztJQUVELElBQUksQ0FBQyxZQUFZLEVBQUU7UUFDakIsMkRBQTJEO1FBQzNELGFBQWEsR0FBRyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakMsa0JBQWtCLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDbEMsZUFBZSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxhQUFhLEVBQUUsYUFBYSxFQUFFLFlBQVksQ0FBQyxDQUFDO0tBQzNGO0lBRUQsT0FBTyxhQUFhLENBQUM7QUFDdkIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIHByZXZpb3VzIHZlcnNpb246XG4vLyBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci11aS9ib290c3RyYXAvYmxvYi8wN2MzMWQwNzMxZjdjYjA2OGExOTMyYjhlMDFkMjMxMmI3OTZiNGVjL3NyYy9wb3NpdGlvbi9wb3NpdGlvbi5qc1xuZXhwb3J0IGNsYXNzIFBvc2l0aW9uaW5nIHtcbiAgcHJpdmF0ZSBnZXRBbGxTdHlsZXMoZWxlbWVudDogSFRNTEVsZW1lbnQpIHsgcmV0dXJuIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpOyB9XG5cbiAgcHJpdmF0ZSBnZXRTdHlsZShlbGVtZW50OiBIVE1MRWxlbWVudCwgcHJvcDogc3RyaW5nKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuZ2V0QWxsU3R5bGVzKGVsZW1lbnQpW3Byb3BdOyB9XG5cbiAgcHJpdmF0ZSBpc1N0YXRpY1Bvc2l0aW9uZWQoZWxlbWVudDogSFRNTEVsZW1lbnQpOiBib29sZWFuIHtcbiAgICByZXR1cm4gKHRoaXMuZ2V0U3R5bGUoZWxlbWVudCwgJ3Bvc2l0aW9uJykgfHwgJ3N0YXRpYycpID09PSAnc3RhdGljJztcbiAgfVxuXG4gIHByaXZhdGUgb2Zmc2V0UGFyZW50KGVsZW1lbnQ6IEhUTUxFbGVtZW50KTogSFRNTEVsZW1lbnQge1xuICAgIGxldCBvZmZzZXRQYXJlbnRFbCA9IDxIVE1MRWxlbWVudD5lbGVtZW50Lm9mZnNldFBhcmVudCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG5cbiAgICB3aGlsZSAob2Zmc2V0UGFyZW50RWwgJiYgb2Zmc2V0UGFyZW50RWwgIT09IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCAmJiB0aGlzLmlzU3RhdGljUG9zaXRpb25lZChvZmZzZXRQYXJlbnRFbCkpIHtcbiAgICAgIG9mZnNldFBhcmVudEVsID0gPEhUTUxFbGVtZW50Pm9mZnNldFBhcmVudEVsLm9mZnNldFBhcmVudDtcbiAgICB9XG5cbiAgICByZXR1cm4gb2Zmc2V0UGFyZW50RWwgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICB9XG5cbiAgcG9zaXRpb24oZWxlbWVudDogSFRNTEVsZW1lbnQsIHJvdW5kID0gdHJ1ZSk6IENsaWVudFJlY3Qge1xuICAgIGxldCBlbFBvc2l0aW9uOiBDbGllbnRSZWN0O1xuICAgIGxldCBwYXJlbnRPZmZzZXQ6IENsaWVudFJlY3QgPSB7d2lkdGg6IDAsIGhlaWdodDogMCwgdG9wOiAwLCBib3R0b206IDAsIGxlZnQ6IDAsIHJpZ2h0OiAwfTtcblxuICAgIGlmICh0aGlzLmdldFN0eWxlKGVsZW1lbnQsICdwb3NpdGlvbicpID09PSAnZml4ZWQnKSB7XG4gICAgICBlbFBvc2l0aW9uID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIGVsUG9zaXRpb24gPSB7XG4gICAgICAgIHRvcDogZWxQb3NpdGlvbi50b3AsXG4gICAgICAgIGJvdHRvbTogZWxQb3NpdGlvbi5ib3R0b20sXG4gICAgICAgIGxlZnQ6IGVsUG9zaXRpb24ubGVmdCxcbiAgICAgICAgcmlnaHQ6IGVsUG9zaXRpb24ucmlnaHQsXG4gICAgICAgIGhlaWdodDogZWxQb3NpdGlvbi5oZWlnaHQsXG4gICAgICAgIHdpZHRoOiBlbFBvc2l0aW9uLndpZHRoXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBvZmZzZXRQYXJlbnRFbCA9IHRoaXMub2Zmc2V0UGFyZW50KGVsZW1lbnQpO1xuXG4gICAgICBlbFBvc2l0aW9uID0gdGhpcy5vZmZzZXQoZWxlbWVudCwgZmFsc2UpO1xuXG4gICAgICBpZiAob2Zmc2V0UGFyZW50RWwgIT09IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkge1xuICAgICAgICBwYXJlbnRPZmZzZXQgPSB0aGlzLm9mZnNldChvZmZzZXRQYXJlbnRFbCwgZmFsc2UpO1xuICAgICAgfVxuXG4gICAgICBwYXJlbnRPZmZzZXQudG9wICs9IG9mZnNldFBhcmVudEVsLmNsaWVudFRvcDtcbiAgICAgIHBhcmVudE9mZnNldC5sZWZ0ICs9IG9mZnNldFBhcmVudEVsLmNsaWVudExlZnQ7XG4gICAgfVxuXG4gICAgZWxQb3NpdGlvbi50b3AgLT0gcGFyZW50T2Zmc2V0LnRvcDtcbiAgICBlbFBvc2l0aW9uLmJvdHRvbSAtPSBwYXJlbnRPZmZzZXQudG9wO1xuICAgIGVsUG9zaXRpb24ubGVmdCAtPSBwYXJlbnRPZmZzZXQubGVmdDtcbiAgICBlbFBvc2l0aW9uLnJpZ2h0IC09IHBhcmVudE9mZnNldC5sZWZ0O1xuXG4gICAgaWYgKHJvdW5kKSB7XG4gICAgICBlbFBvc2l0aW9uLnRvcCA9IE1hdGgucm91bmQoZWxQb3NpdGlvbi50b3ApO1xuICAgICAgZWxQb3NpdGlvbi5ib3R0b20gPSBNYXRoLnJvdW5kKGVsUG9zaXRpb24uYm90dG9tKTtcbiAgICAgIGVsUG9zaXRpb24ubGVmdCA9IE1hdGgucm91bmQoZWxQb3NpdGlvbi5sZWZ0KTtcbiAgICAgIGVsUG9zaXRpb24ucmlnaHQgPSBNYXRoLnJvdW5kKGVsUG9zaXRpb24ucmlnaHQpO1xuICAgIH1cblxuICAgIHJldHVybiBlbFBvc2l0aW9uO1xuICB9XG5cbiAgb2Zmc2V0KGVsZW1lbnQ6IEhUTUxFbGVtZW50LCByb3VuZCA9IHRydWUpOiBDbGllbnRSZWN0IHtcbiAgICBjb25zdCBlbEJjciA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3Qgdmlld3BvcnRPZmZzZXQgPSB7XG4gICAgICB0b3A6IHdpbmRvdy5wYWdlWU9mZnNldCAtIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRUb3AsXG4gICAgICBsZWZ0OiB3aW5kb3cucGFnZVhPZmZzZXQgLSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50TGVmdFxuICAgIH07XG5cbiAgICBsZXQgZWxPZmZzZXQgPSB7XG4gICAgICBoZWlnaHQ6IGVsQmNyLmhlaWdodCB8fCBlbGVtZW50Lm9mZnNldEhlaWdodCxcbiAgICAgIHdpZHRoOiBlbEJjci53aWR0aCB8fCBlbGVtZW50Lm9mZnNldFdpZHRoLFxuICAgICAgdG9wOiBlbEJjci50b3AgKyB2aWV3cG9ydE9mZnNldC50b3AsXG4gICAgICBib3R0b206IGVsQmNyLmJvdHRvbSArIHZpZXdwb3J0T2Zmc2V0LnRvcCxcbiAgICAgIGxlZnQ6IGVsQmNyLmxlZnQgKyB2aWV3cG9ydE9mZnNldC5sZWZ0LFxuICAgICAgcmlnaHQ6IGVsQmNyLnJpZ2h0ICsgdmlld3BvcnRPZmZzZXQubGVmdFxuICAgIH07XG5cbiAgICBpZiAocm91bmQpIHtcbiAgICAgIGVsT2Zmc2V0LmhlaWdodCA9IE1hdGgucm91bmQoZWxPZmZzZXQuaGVpZ2h0KTtcbiAgICAgIGVsT2Zmc2V0LndpZHRoID0gTWF0aC5yb3VuZChlbE9mZnNldC53aWR0aCk7XG4gICAgICBlbE9mZnNldC50b3AgPSBNYXRoLnJvdW5kKGVsT2Zmc2V0LnRvcCk7XG4gICAgICBlbE9mZnNldC5ib3R0b20gPSBNYXRoLnJvdW5kKGVsT2Zmc2V0LmJvdHRvbSk7XG4gICAgICBlbE9mZnNldC5sZWZ0ID0gTWF0aC5yb3VuZChlbE9mZnNldC5sZWZ0KTtcbiAgICAgIGVsT2Zmc2V0LnJpZ2h0ID0gTWF0aC5yb3VuZChlbE9mZnNldC5yaWdodCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGVsT2Zmc2V0O1xuICB9XG5cbiAgLypcbiAgICBSZXR1cm4gZmFsc2UgaWYgdGhlIGVsZW1lbnQgdG8gcG9zaXRpb24gaXMgb3V0c2lkZSB0aGUgdmlld3BvcnRcbiAgKi9cbiAgcG9zaXRpb25FbGVtZW50cyhob3N0RWxlbWVudDogSFRNTEVsZW1lbnQsIHRhcmdldEVsZW1lbnQ6IEhUTUxFbGVtZW50LCBwbGFjZW1lbnQ6IHN0cmluZywgYXBwZW5kVG9Cb2R5PzogYm9vbGVhbik6XG4gICAgICBib29sZWFuIHtcbiAgICBjb25zdFtwbGFjZW1lbnRQcmltYXJ5ID0gJ3RvcCcsIHBsYWNlbWVudFNlY29uZGFyeSA9ICdjZW50ZXInXSA9IHBsYWNlbWVudC5zcGxpdCgnLScpO1xuXG4gICAgY29uc3QgaG9zdEVsUG9zaXRpb24gPSBhcHBlbmRUb0JvZHkgPyB0aGlzLm9mZnNldChob3N0RWxlbWVudCwgZmFsc2UpIDogdGhpcy5wb3NpdGlvbihob3N0RWxlbWVudCwgZmFsc2UpO1xuICAgIGNvbnN0IHRhcmdldEVsU3R5bGVzID0gdGhpcy5nZXRBbGxTdHlsZXModGFyZ2V0RWxlbWVudCk7XG5cbiAgICBjb25zdCBtYXJnaW5Ub3AgPSBwYXJzZUZsb2F0KHRhcmdldEVsU3R5bGVzLm1hcmdpblRvcCk7XG4gICAgY29uc3QgbWFyZ2luQm90dG9tID0gcGFyc2VGbG9hdCh0YXJnZXRFbFN0eWxlcy5tYXJnaW5Cb3R0b20pO1xuICAgIGNvbnN0IG1hcmdpbkxlZnQgPSBwYXJzZUZsb2F0KHRhcmdldEVsU3R5bGVzLm1hcmdpbkxlZnQpO1xuICAgIGNvbnN0IG1hcmdpblJpZ2h0ID0gcGFyc2VGbG9hdCh0YXJnZXRFbFN0eWxlcy5tYXJnaW5SaWdodCk7XG5cbiAgICBsZXQgdG9wUG9zaXRpb24gPSAwO1xuICAgIGxldCBsZWZ0UG9zaXRpb24gPSAwO1xuXG4gICAgc3dpdGNoIChwbGFjZW1lbnRQcmltYXJ5KSB7XG4gICAgICBjYXNlICd0b3AnOlxuICAgICAgICB0b3BQb3NpdGlvbiA9IChob3N0RWxQb3NpdGlvbi50b3AgLSAodGFyZ2V0RWxlbWVudC5vZmZzZXRIZWlnaHQgKyBtYXJnaW5Ub3AgKyBtYXJnaW5Cb3R0b20pKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdib3R0b20nOlxuICAgICAgICB0b3BQb3NpdGlvbiA9IChob3N0RWxQb3NpdGlvbi50b3AgKyBob3N0RWxQb3NpdGlvbi5oZWlnaHQpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2xlZnQnOlxuICAgICAgICBsZWZ0UG9zaXRpb24gPSAoaG9zdEVsUG9zaXRpb24ubGVmdCAtICh0YXJnZXRFbGVtZW50Lm9mZnNldFdpZHRoICsgbWFyZ2luTGVmdCArIG1hcmdpblJpZ2h0KSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAncmlnaHQnOlxuICAgICAgICBsZWZ0UG9zaXRpb24gPSAoaG9zdEVsUG9zaXRpb24ubGVmdCArIGhvc3RFbFBvc2l0aW9uLndpZHRoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgc3dpdGNoIChwbGFjZW1lbnRTZWNvbmRhcnkpIHtcbiAgICAgIGNhc2UgJ3RvcCc6XG4gICAgICAgIHRvcFBvc2l0aW9uID0gaG9zdEVsUG9zaXRpb24udG9wO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2JvdHRvbSc6XG4gICAgICAgIHRvcFBvc2l0aW9uID0gaG9zdEVsUG9zaXRpb24udG9wICsgaG9zdEVsUG9zaXRpb24uaGVpZ2h0IC0gdGFyZ2V0RWxlbWVudC5vZmZzZXRIZWlnaHQ7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbGVmdCc6XG4gICAgICAgIGxlZnRQb3NpdGlvbiA9IGhvc3RFbFBvc2l0aW9uLmxlZnQ7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAncmlnaHQnOlxuICAgICAgICBsZWZ0UG9zaXRpb24gPSBob3N0RWxQb3NpdGlvbi5sZWZ0ICsgaG9zdEVsUG9zaXRpb24ud2lkdGggLSB0YXJnZXRFbGVtZW50Lm9mZnNldFdpZHRoO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2NlbnRlcic6XG4gICAgICAgIGlmIChwbGFjZW1lbnRQcmltYXJ5ID09PSAndG9wJyB8fCBwbGFjZW1lbnRQcmltYXJ5ID09PSAnYm90dG9tJykge1xuICAgICAgICAgIGxlZnRQb3NpdGlvbiA9IChob3N0RWxQb3NpdGlvbi5sZWZ0ICsgaG9zdEVsUG9zaXRpb24ud2lkdGggLyAyIC0gdGFyZ2V0RWxlbWVudC5vZmZzZXRXaWR0aCAvIDIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRvcFBvc2l0aW9uID0gKGhvc3RFbFBvc2l0aW9uLnRvcCArIGhvc3RFbFBvc2l0aW9uLmhlaWdodCAvIDIgLSB0YXJnZXRFbGVtZW50Lm9mZnNldEhlaWdodCAvIDIpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIC8vLyBUaGUgdHJhbnNsYXRlM2QvZ3B1IGFjY2VsZXJhdGlvbiByZW5kZXIgYSBibHVycnkgdGV4dCBvbiBjaHJvbWUsIHRoZSBuZXh0IGxpbmUgaXMgY29tbWVudGVkIHVudGlsIGEgYnJvd3NlciBmaXhcbiAgICAvLyB0YXJnZXRFbGVtZW50LnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUzZCgke01hdGgucm91bmQobGVmdFBvc2l0aW9uKX1weCwgJHtNYXRoLmZsb29yKHRvcFBvc2l0aW9uKX1weCwgMHB4KWA7XG4gICAgdGFyZ2V0RWxlbWVudC5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlKCR7TWF0aC5yb3VuZChsZWZ0UG9zaXRpb24pfXB4LCAke01hdGgucm91bmQodG9wUG9zaXRpb24pfXB4KWA7XG5cbiAgICAvLyBDaGVjayBpZiB0aGUgdGFyZ2V0RWxlbWVudCBpcyBpbnNpZGUgdGhlIHZpZXdwb3J0XG4gICAgY29uc3QgdGFyZ2V0RWxCQ1IgPSB0YXJnZXRFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IGh0bWwgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4gICAgY29uc3Qgd2luZG93SGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0IHx8IGh0bWwuY2xpZW50SGVpZ2h0O1xuICAgIGNvbnN0IHdpbmRvd1dpZHRoID0gd2luZG93LmlubmVyV2lkdGggfHwgaHRtbC5jbGllbnRXaWR0aDtcblxuICAgIHJldHVybiB0YXJnZXRFbEJDUi5sZWZ0ID49IDAgJiYgdGFyZ2V0RWxCQ1IudG9wID49IDAgJiYgdGFyZ2V0RWxCQ1IucmlnaHQgPD0gd2luZG93V2lkdGggJiZcbiAgICAgICAgdGFyZ2V0RWxCQ1IuYm90dG9tIDw9IHdpbmRvd0hlaWdodDtcbiAgfVxufVxuXG5jb25zdCBwbGFjZW1lbnRTZXBhcmF0b3IgPSAvXFxzKy87XG5jb25zdCBwb3NpdGlvblNlcnZpY2UgPSBuZXcgUG9zaXRpb25pbmcoKTtcblxuLypcbiAqIEFjY2VwdCB0aGUgcGxhY2VtZW50IGFycmF5IGFuZCBhcHBsaWVzIHRoZSBhcHByb3ByaWF0ZSBwbGFjZW1lbnQgZGVwZW5kZW50IG9uIHRoZSB2aWV3cG9ydC5cbiAqIFJldHVybnMgdGhlIGFwcGxpZWQgcGxhY2VtZW50LlxuICogSW4gY2FzZSBvZiBhdXRvIHBsYWNlbWVudCwgcGxhY2VtZW50cyBhcmUgc2VsZWN0ZWQgaW4gb3JkZXJcbiAqICAgJ3RvcCcsICdib3R0b20nLCAnbGVmdCcsICdyaWdodCcsXG4gKiAgICd0b3AtbGVmdCcsICd0b3AtcmlnaHQnLFxuICogICAnYm90dG9tLWxlZnQnLCAnYm90dG9tLXJpZ2h0JyxcbiAqICAgJ2xlZnQtdG9wJywgJ2xlZnQtYm90dG9tJyxcbiAqICAgJ3JpZ2h0LXRvcCcsICdyaWdodC1ib3R0b20nLlxuICogKi9cbmV4cG9ydCBmdW5jdGlvbiBwb3NpdGlvbkVsZW1lbnRzKFxuICAgIGhvc3RFbGVtZW50OiBIVE1MRWxlbWVudCwgdGFyZ2V0RWxlbWVudDogSFRNTEVsZW1lbnQsIHBsYWNlbWVudDogc3RyaW5nIHwgUGxhY2VtZW50IHwgUGxhY2VtZW50QXJyYXksXG4gICAgYXBwZW5kVG9Cb2R5PzogYm9vbGVhbiwgYmFzZUNsYXNzPzogc3RyaW5nKTogUGxhY2VtZW50IHtcbiAgbGV0IHBsYWNlbWVudFZhbHM6IEFycmF5PFBsYWNlbWVudD4gPVxuICAgICAgQXJyYXkuaXNBcnJheShwbGFjZW1lbnQpID8gcGxhY2VtZW50IDogcGxhY2VtZW50LnNwbGl0KHBsYWNlbWVudFNlcGFyYXRvcikgYXMgQXJyYXk8UGxhY2VtZW50PjtcblxuICBjb25zdCBhbGxvd2VkUGxhY2VtZW50cyA9IFtcbiAgICAndG9wJywgJ2JvdHRvbScsICdsZWZ0JywgJ3JpZ2h0JywgJ3RvcC1sZWZ0JywgJ3RvcC1yaWdodCcsICdib3R0b20tbGVmdCcsICdib3R0b20tcmlnaHQnLCAnbGVmdC10b3AnLCAnbGVmdC1ib3R0b20nLFxuICAgICdyaWdodC10b3AnLCAncmlnaHQtYm90dG9tJ1xuICBdO1xuXG4gIGNvbnN0IGNsYXNzTGlzdCA9IHRhcmdldEVsZW1lbnQuY2xhc3NMaXN0O1xuICBjb25zdCBhZGRDbGFzc2VzVG9UYXJnZXQgPSAodGFyZ2V0UGxhY2VtZW50OiBQbGFjZW1lbnQpOiBBcnJheTxzdHJpbmc+ID0+IHtcbiAgICBjb25zdFtwcmltYXJ5LCBzZWNvbmRhcnldID0gdGFyZ2V0UGxhY2VtZW50LnNwbGl0KCctJyk7XG4gICAgY29uc3QgY2xhc3NlcyA9IFtdO1xuICAgIGlmIChiYXNlQ2xhc3MpIHtcbiAgICAgIGNsYXNzZXMucHVzaChgJHtiYXNlQ2xhc3N9LSR7cHJpbWFyeX1gKTtcbiAgICAgIGlmIChzZWNvbmRhcnkpIHtcbiAgICAgICAgY2xhc3Nlcy5wdXNoKGAke2Jhc2VDbGFzc30tJHtwcmltYXJ5fS0ke3NlY29uZGFyeX1gKTtcbiAgICAgIH1cblxuICAgICAgY2xhc3Nlcy5mb3JFYWNoKChjbGFzc25hbWUpID0+IHsgY2xhc3NMaXN0LmFkZChjbGFzc25hbWUpOyB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGNsYXNzZXM7XG4gIH07XG5cbiAgLy8gUmVtb3ZlIG9sZCBwbGFjZW1lbnQgY2xhc3NlcyB0byBhdm9pZCBpc3N1ZXNcbiAgaWYgKGJhc2VDbGFzcykge1xuICAgIGFsbG93ZWRQbGFjZW1lbnRzLmZvckVhY2goKHBsYWNlbWVudFRvUmVtb3ZlKSA9PiB7IGNsYXNzTGlzdC5yZW1vdmUoYCR7YmFzZUNsYXNzfS0ke3BsYWNlbWVudFRvUmVtb3ZlfWApOyB9KTtcbiAgfVxuXG4gIC8vIHJlcGxhY2UgYXV0byBwbGFjZW1lbnQgd2l0aCBvdGhlciBwbGFjZW1lbnRzXG4gIGxldCBoYXNBdXRvID0gcGxhY2VtZW50VmFscy5maW5kSW5kZXgodmFsID0+IHZhbCA9PT0gJ2F1dG8nKTtcbiAgaWYgKGhhc0F1dG8gPj0gMCkge1xuICAgIGFsbG93ZWRQbGFjZW1lbnRzLmZvckVhY2goZnVuY3Rpb24ob2JqKSB7XG4gICAgICBpZiAocGxhY2VtZW50VmFscy5maW5kKHZhbCA9PiB2YWwuc2VhcmNoKCdeJyArIG9iaikgIT09IC0xKSA9PSBudWxsKSB7XG4gICAgICAgIHBsYWNlbWVudFZhbHMuc3BsaWNlKGhhc0F1dG8rKywgMSwgb2JqIGFzIFBsYWNlbWVudCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvLyBjb29yZGluYXRlcyB3aGVyZSB0byBwb3NpdGlvblxuXG4gIC8vIFJlcXVpcmVkIGZvciB0cmFuc2Zvcm06XG4gIGNvbnN0IHN0eWxlID0gdGFyZ2V0RWxlbWVudC5zdHlsZTtcbiAgc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICBzdHlsZS50b3AgPSAnMCc7XG4gIHN0eWxlLmxlZnQgPSAnMCc7XG4gIHN0eWxlWyd3aWxsLWNoYW5nZSddID0gJ3RyYW5zZm9ybSc7XG5cbiAgbGV0IHRlc3RQbGFjZW1lbnQ6IFBsYWNlbWVudDtcbiAgbGV0IGlzSW5WaWV3cG9ydCA9IGZhbHNlO1xuICBmb3IgKHRlc3RQbGFjZW1lbnQgb2YgcGxhY2VtZW50VmFscykge1xuICAgIGxldCBhZGRlZENsYXNzZXMgPSBhZGRDbGFzc2VzVG9UYXJnZXQodGVzdFBsYWNlbWVudCk7XG5cbiAgICBpZiAocG9zaXRpb25TZXJ2aWNlLnBvc2l0aW9uRWxlbWVudHMoaG9zdEVsZW1lbnQsIHRhcmdldEVsZW1lbnQsIHRlc3RQbGFjZW1lbnQsIGFwcGVuZFRvQm9keSkpIHtcbiAgICAgIGlzSW5WaWV3cG9ydCA9IHRydWU7XG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICAvLyBSZW1vdmUgdGhlIGJhc2VDbGFzc2VzIGZvciBmdXJ0aGVyIGNhbGN1bGF0aW9uXG4gICAgaWYgKGJhc2VDbGFzcykge1xuICAgICAgYWRkZWRDbGFzc2VzLmZvckVhY2goKGNsYXNzbmFtZSkgPT4geyBjbGFzc0xpc3QucmVtb3ZlKGNsYXNzbmFtZSk7IH0pO1xuICAgIH1cbiAgfVxuXG4gIGlmICghaXNJblZpZXdwb3J0KSB7XG4gICAgLy8gSWYgbm90aGluZyBtYXRjaCwgdGhlIGZpcnN0IHBsYWNlbWVudCBpcyB0aGUgZGVmYXVsdCBvbmVcbiAgICB0ZXN0UGxhY2VtZW50ID0gcGxhY2VtZW50VmFsc1swXTtcbiAgICBhZGRDbGFzc2VzVG9UYXJnZXQodGVzdFBsYWNlbWVudCk7XG4gICAgcG9zaXRpb25TZXJ2aWNlLnBvc2l0aW9uRWxlbWVudHMoaG9zdEVsZW1lbnQsIHRhcmdldEVsZW1lbnQsIHRlc3RQbGFjZW1lbnQsIGFwcGVuZFRvQm9keSk7XG4gIH1cblxuICByZXR1cm4gdGVzdFBsYWNlbWVudDtcbn1cblxuZXhwb3J0IHR5cGUgUGxhY2VtZW50ID0gJ2F1dG8nIHwgJ3RvcCcgfCAnYm90dG9tJyB8ICdsZWZ0JyB8ICdyaWdodCcgfCAndG9wLWxlZnQnIHwgJ3RvcC1yaWdodCcgfCAnYm90dG9tLWxlZnQnIHxcbiAgICAnYm90dG9tLXJpZ2h0JyB8ICdsZWZ0LXRvcCcgfCAnbGVmdC1ib3R0b20nIHwgJ3JpZ2h0LXRvcCcgfCAncmlnaHQtYm90dG9tJztcblxuZXhwb3J0IHR5cGUgUGxhY2VtZW50QXJyYXkgPSBQbGFjZW1lbnQgfCBBcnJheTxQbGFjZW1lbnQ+fCBzdHJpbmc7XG4iXX0=