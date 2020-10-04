/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { ChangeDetectorRef, ContentChild, ContentChildren, Directive, ElementRef, EventEmitter, forwardRef, Inject, Input, NgZone, Output, QueryList, Renderer2, Optional } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Subject } from 'rxjs';
import { positionElements } from '../util/positioning';
import { ngbAutoClose } from '../util/autoclose';
import { Key } from '../util/key';
import { NgbDropdownConfig } from './dropdown-config';
var NgbNavbar = /** @class */ (function () {
    function NgbNavbar() {
    }
    NgbNavbar.decorators = [
        { type: Directive, args: [{ selector: '.navbar' },] }
    ];
    return NgbNavbar;
}());
export { NgbNavbar };
/**
 * A directive you should put put on a dropdown item to enable keyboard navigation.
 * Arrow keys will move focus between items marked with this directive.
 *
 * \@since 4.1.0
 */
var NgbDropdownItem = /** @class */ (function () {
    function NgbDropdownItem(elementRef) {
        this.elementRef = elementRef;
        this._disabled = false;
    }
    Object.defineProperty(NgbDropdownItem.prototype, "disabled", {
        get: /**
         * @return {?}
         */
        function () { return this._disabled; },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._disabled = (/** @type {?} */ (value)) === '' || value === true; // accept an empty attribute as true
        },
        enumerable: true,
        configurable: true
    });
    NgbDropdownItem.decorators = [
        { type: Directive, args: [{ selector: '[ngbDropdownItem]', host: { 'class': 'dropdown-item', '[class.disabled]': 'disabled' } },] }
    ];
    /** @nocollapse */
    NgbDropdownItem.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    NgbDropdownItem.propDecorators = {
        disabled: [{ type: Input }]
    };
    return NgbDropdownItem;
}());
export { NgbDropdownItem };
if (false) {
    /** @type {?} */
    NgbDropdownItem.prototype._disabled;
    /** @type {?} */
    NgbDropdownItem.prototype.elementRef;
}
/**
 * A directive that wraps dropdown menu content and dropdown items.
 */
var NgbDropdownMenu = /** @class */ (function () {
    function NgbDropdownMenu(dropdown) {
        this.dropdown = dropdown;
        this.placement = 'bottom';
        this.isOpen = false;
    }
    NgbDropdownMenu.decorators = [
        { type: Directive, args: [{
                    selector: '[ngbDropdownMenu]',
                    host: {
                        '[class.dropdown-menu]': 'true',
                        '[class.show]': 'dropdown.isOpen()',
                        '[attr.x-placement]': 'placement',
                        '(keydown.ArrowUp)': 'dropdown.onKeyDown($event)',
                        '(keydown.ArrowDown)': 'dropdown.onKeyDown($event)',
                        '(keydown.Home)': 'dropdown.onKeyDown($event)',
                        '(keydown.End)': 'dropdown.onKeyDown($event)',
                        '(keydown.Enter)': 'dropdown.onKeyDown($event)',
                        '(keydown.Space)': 'dropdown.onKeyDown($event)'
                    }
                },] }
    ];
    /** @nocollapse */
    NgbDropdownMenu.ctorParameters = function () { return [
        { type: NgbDropdown, decorators: [{ type: Inject, args: [forwardRef(function () { return NgbDropdown; }),] }] }
    ]; };
    NgbDropdownMenu.propDecorators = {
        menuItems: [{ type: ContentChildren, args: [NgbDropdownItem,] }]
    };
    return NgbDropdownMenu;
}());
export { NgbDropdownMenu };
if (false) {
    /** @type {?} */
    NgbDropdownMenu.prototype.placement;
    /** @type {?} */
    NgbDropdownMenu.prototype.isOpen;
    /** @type {?} */
    NgbDropdownMenu.prototype.menuItems;
    /** @type {?} */
    NgbDropdownMenu.prototype.dropdown;
}
/**
 * A directive to mark an element to which dropdown menu will be anchored.
 *
 * This is a simple version of the `NgbDropdownToggle` directive.
 * It plays the same role, but doesn't listen to click events to toggle dropdown menu thus enabling support
 * for events other than click.
 *
 * \@since 1.1.0
 */
var NgbDropdownAnchor = /** @class */ (function () {
    function NgbDropdownAnchor(dropdown, _elementRef) {
        this.dropdown = dropdown;
        this._elementRef = _elementRef;
        this.anchorEl = _elementRef.nativeElement;
    }
    /**
     * @return {?}
     */
    NgbDropdownAnchor.prototype.getNativeElement = /**
     * @return {?}
     */
    function () { return this._elementRef.nativeElement; };
    NgbDropdownAnchor.decorators = [
        { type: Directive, args: [{
                    selector: '[ngbDropdownAnchor]',
                    host: { 'class': 'dropdown-toggle', 'aria-haspopup': 'true', '[attr.aria-expanded]': 'dropdown.isOpen()' }
                },] }
    ];
    /** @nocollapse */
    NgbDropdownAnchor.ctorParameters = function () { return [
        { type: NgbDropdown, decorators: [{ type: Inject, args: [forwardRef(function () { return NgbDropdown; }),] }] },
        { type: ElementRef }
    ]; };
    return NgbDropdownAnchor;
}());
export { NgbDropdownAnchor };
if (false) {
    /** @type {?} */
    NgbDropdownAnchor.prototype.anchorEl;
    /** @type {?} */
    NgbDropdownAnchor.prototype.dropdown;
    /** @type {?} */
    NgbDropdownAnchor.prototype._elementRef;
}
/**
 * A directive to mark an element that will toggle dropdown via the `click` event.
 *
 * You can also use `NgbDropdownAnchor` as an alternative.
 */
var NgbDropdownToggle = /** @class */ (function (_super) {
    tslib_1.__extends(NgbDropdownToggle, _super);
    function NgbDropdownToggle(dropdown, elementRef) {
        return _super.call(this, dropdown, elementRef) || this;
    }
    NgbDropdownToggle.decorators = [
        { type: Directive, args: [{
                    selector: '[ngbDropdownToggle]',
                    host: {
                        'class': 'dropdown-toggle',
                        'aria-haspopup': 'true',
                        '[attr.aria-expanded]': 'dropdown.isOpen()',
                        '(click)': 'dropdown.toggle()',
                        '(keydown.ArrowUp)': 'dropdown.onKeyDown($event)',
                        '(keydown.ArrowDown)': 'dropdown.onKeyDown($event)',
                        '(keydown.Home)': 'dropdown.onKeyDown($event)',
                        '(keydown.End)': 'dropdown.onKeyDown($event)'
                    },
                    providers: [{ provide: NgbDropdownAnchor, useExisting: forwardRef(function () { return NgbDropdownToggle; }) }]
                },] }
    ];
    /** @nocollapse */
    NgbDropdownToggle.ctorParameters = function () { return [
        { type: NgbDropdown, decorators: [{ type: Inject, args: [forwardRef(function () { return NgbDropdown; }),] }] },
        { type: ElementRef }
    ]; };
    return NgbDropdownToggle;
}(NgbDropdownAnchor));
export { NgbDropdownToggle };
/**
 * A directive that provides contextual overlays for displaying lists of links and more.
 */
var NgbDropdown = /** @class */ (function () {
    function NgbDropdown(_changeDetector, config, _document, _ngZone, _elementRef, _renderer, ngbNavbar) {
        var _this = this;
        this._changeDetector = _changeDetector;
        this._document = _document;
        this._ngZone = _ngZone;
        this._elementRef = _elementRef;
        this._renderer = _renderer;
        this._closed$ = new Subject();
        /**
         * Defines whether or not the dropdown menu is opened initially.
         */
        this._open = false;
        /**
         * An event fired when the dropdown is opened or closed.
         *
         * The event payload is a `boolean`:
         * * `true` - the dropdown was opened
         * * `false` - the dropdown was closed
         */
        this.openChange = new EventEmitter();
        this.placement = config.placement;
        this.container = config.container;
        this.autoClose = config.autoClose;
        this.display = ngbNavbar ? 'static' : 'dynamic';
        this._zoneSubscription = _ngZone.onStable.subscribe(function () { _this._positionMenu(); });
    }
    /**
     * @return {?}
     */
    NgbDropdown.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this._applyPlacementClasses();
        if (this._open) {
            this._setCloseHandlers();
        }
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    NgbDropdown.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        if (changes.container && this._open) {
            this._applyContainer(this.container);
        }
        if (changes.placement && !changes.placement.isFirstChange) {
            this._applyPlacementClasses();
        }
    };
    /**
     * Checks if the dropdown menu is open.
     */
    /**
     * Checks if the dropdown menu is open.
     * @return {?}
     */
    NgbDropdown.prototype.isOpen = /**
     * Checks if the dropdown menu is open.
     * @return {?}
     */
    function () { return this._open; };
    /**
     * Opens the dropdown menu.
     */
    /**
     * Opens the dropdown menu.
     * @return {?}
     */
    NgbDropdown.prototype.open = /**
     * Opens the dropdown menu.
     * @return {?}
     */
    function () {
        if (!this._open) {
            this._open = true;
            this._applyContainer(this.container);
            this.openChange.emit(true);
            this._setCloseHandlers();
        }
    };
    /**
     * @return {?}
     */
    NgbDropdown.prototype._setCloseHandlers = /**
     * @return {?}
     */
    function () {
        var _this = this;
        ngbAutoClose(this._ngZone, this._document, this.autoClose, function () { return _this.close(); }, this._closed$, this._menu ? [this._menuElement.nativeElement] : [], this._anchor ? [this._anchor.getNativeElement()] : [], '.dropdown-item,.dropdown-divider');
    };
    /**
     * Closes the dropdown menu.
     */
    /**
     * Closes the dropdown menu.
     * @return {?}
     */
    NgbDropdown.prototype.close = /**
     * Closes the dropdown menu.
     * @return {?}
     */
    function () {
        if (this._open) {
            this._open = false;
            this._resetContainer();
            this._closed$.next();
            this.openChange.emit(false);
            this._changeDetector.markForCheck();
        }
    };
    /**
     * Toggles the dropdown menu.
     */
    /**
     * Toggles the dropdown menu.
     * @return {?}
     */
    NgbDropdown.prototype.toggle = /**
     * Toggles the dropdown menu.
     * @return {?}
     */
    function () {
        if (this.isOpen()) {
            this.close();
        }
        else {
            this.open();
        }
    };
    /**
     * @return {?}
     */
    NgbDropdown.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this._resetContainer();
        this._closed$.next();
        this._zoneSubscription.unsubscribe();
    };
    /**
     * @param {?} event
     * @return {?}
     */
    NgbDropdown.prototype.onKeyDown = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        var _this = this;
        // tslint:disable-next-line:deprecation
        /** @type {?} */
        var key = event.which;
        /** @type {?} */
        var itemElements = this._getMenuElements();
        /** @type {?} */
        var position = -1;
        /** @type {?} */
        var isEventFromItems = false;
        /** @type {?} */
        var isEventFromToggle = this._isEventFromToggle(event);
        if (!isEventFromToggle && itemElements.length) {
            itemElements.forEach(function (itemElement, index) {
                if (itemElement.contains((/** @type {?} */ (event.target)))) {
                    isEventFromItems = true;
                }
                if (itemElement === _this._document.activeElement) {
                    position = index;
                }
            });
        }
        // closing on Enter / Space
        if (key === Key.Space || key === Key.Enter) {
            if (isEventFromItems && (this.autoClose === true || this.autoClose === 'inside')) {
                this.close();
            }
            return;
        }
        // opening / navigating
        if (isEventFromToggle || isEventFromItems) {
            this.open();
            if (itemElements.length) {
                switch (key) {
                    case Key.ArrowDown:
                        position = Math.min(position + 1, itemElements.length - 1);
                        break;
                    case Key.ArrowUp:
                        if (this._isDropup() && position === -1) {
                            position = itemElements.length - 1;
                            break;
                        }
                        position = Math.max(position - 1, 0);
                        break;
                    case Key.Home:
                        position = 0;
                        break;
                    case Key.End:
                        position = itemElements.length - 1;
                        break;
                }
                itemElements[position].focus();
            }
            event.preventDefault();
        }
    };
    /**
     * @return {?}
     */
    NgbDropdown.prototype._isDropup = /**
     * @return {?}
     */
    function () { return this._elementRef.nativeElement.classList.contains('dropup'); };
    /**
     * @param {?} event
     * @return {?}
     */
    NgbDropdown.prototype._isEventFromToggle = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        return this._anchor.getNativeElement().contains((/** @type {?} */ (event.target)));
    };
    /**
     * @return {?}
     */
    NgbDropdown.prototype._getMenuElements = /**
     * @return {?}
     */
    function () {
        if (this._menu == null) {
            return [];
        }
        return this._menu.menuItems.filter(function (item) { return !item.disabled; }).map(function (item) { return item.elementRef.nativeElement; });
    };
    /**
     * @return {?}
     */
    NgbDropdown.prototype._positionMenu = /**
     * @return {?}
     */
    function () {
        if (this.isOpen() && this._menu) {
            this._applyPlacementClasses(this.display === 'dynamic' ?
                positionElements(this._anchor.anchorEl, this._bodyContainer || this._menuElement.nativeElement, this.placement, this.container === 'body') :
                this._getFirstPlacement(this.placement));
        }
    };
    /**
     * @param {?} placement
     * @return {?}
     */
    NgbDropdown.prototype._getFirstPlacement = /**
     * @param {?} placement
     * @return {?}
     */
    function (placement) {
        return Array.isArray(placement) ? placement[0] : (/** @type {?} */ (placement.split(' ')[0]));
    };
    /**
     * @return {?}
     */
    NgbDropdown.prototype._resetContainer = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var renderer = this._renderer;
        if (this._menuElement) {
            /** @type {?} */
            var dropdownElement = this._elementRef.nativeElement;
            /** @type {?} */
            var dropdownMenuElement = this._menuElement.nativeElement;
            renderer.appendChild(dropdownElement, dropdownMenuElement);
            renderer.removeStyle(dropdownMenuElement, 'position');
            renderer.removeStyle(dropdownMenuElement, 'transform');
        }
        if (this._bodyContainer) {
            renderer.removeChild(this._document.body, this._bodyContainer);
            this._bodyContainer = null;
        }
    };
    /**
     * @param {?=} container
     * @return {?}
     */
    NgbDropdown.prototype._applyContainer = /**
     * @param {?=} container
     * @return {?}
     */
    function (container) {
        if (container === void 0) { container = null; }
        this._resetContainer();
        if (container === 'body') {
            /** @type {?} */
            var renderer = this._renderer;
            /** @type {?} */
            var dropdownMenuElement = this._menuElement.nativeElement;
            /** @type {?} */
            var bodyContainer = this._bodyContainer = this._bodyContainer || renderer.createElement('div');
            // Override some styles to have the positionning working
            renderer.setStyle(bodyContainer, 'position', 'absolute');
            renderer.setStyle(dropdownMenuElement, 'position', 'static');
            renderer.setStyle(bodyContainer, 'z-index', '1050');
            renderer.appendChild(bodyContainer, dropdownMenuElement);
            renderer.appendChild(this._document.body, bodyContainer);
        }
    };
    /**
     * @param {?=} placement
     * @return {?}
     */
    NgbDropdown.prototype._applyPlacementClasses = /**
     * @param {?=} placement
     * @return {?}
     */
    function (placement) {
        if (this._menu) {
            if (!placement) {
                placement = this._getFirstPlacement(this.placement);
            }
            /** @type {?} */
            var renderer = this._renderer;
            /** @type {?} */
            var dropdownElement = this._elementRef.nativeElement;
            // remove the current placement classes
            renderer.removeClass(dropdownElement, 'dropup');
            renderer.removeClass(dropdownElement, 'dropdown');
            this._menu.placement = placement;
            /*
                  * apply the new placement
                  * in case of top use up-arrow or down-arrow otherwise
                  */
            /** @type {?} */
            var dropdownClass = placement.search('^top') !== -1 ? 'dropup' : 'dropdown';
            renderer.addClass(dropdownElement, dropdownClass);
            /** @type {?} */
            var bodyContainer = this._bodyContainer;
            if (bodyContainer) {
                renderer.removeClass(bodyContainer, 'dropup');
                renderer.removeClass(bodyContainer, 'dropdown');
                renderer.addClass(bodyContainer, dropdownClass);
            }
        }
    };
    NgbDropdown.decorators = [
        { type: Directive, args: [{ selector: '[ngbDropdown]', exportAs: 'ngbDropdown', host: { '[class.show]': 'isOpen()' } },] }
    ];
    /** @nocollapse */
    NgbDropdown.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: NgbDropdownConfig },
        { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] },
        { type: NgZone },
        { type: ElementRef },
        { type: Renderer2 },
        { type: NgbNavbar, decorators: [{ type: Optional }] }
    ]; };
    NgbDropdown.propDecorators = {
        _menu: [{ type: ContentChild, args: [NgbDropdownMenu,] }],
        _menuElement: [{ type: ContentChild, args: [NgbDropdownMenu, { read: ElementRef },] }],
        _anchor: [{ type: ContentChild, args: [NgbDropdownAnchor,] }],
        autoClose: [{ type: Input }],
        _open: [{ type: Input, args: ['open',] }],
        placement: [{ type: Input }],
        container: [{ type: Input }],
        display: [{ type: Input }],
        openChange: [{ type: Output }]
    };
    return NgbDropdown;
}());
export { NgbDropdown };
if (false) {
    /** @type {?} */
    NgbDropdown.prototype._closed$;
    /** @type {?} */
    NgbDropdown.prototype._zoneSubscription;
    /** @type {?} */
    NgbDropdown.prototype._bodyContainer;
    /** @type {?} */
    NgbDropdown.prototype._menu;
    /** @type {?} */
    NgbDropdown.prototype._menuElement;
    /** @type {?} */
    NgbDropdown.prototype._anchor;
    /**
     * Indicates whether the dropdown should be closed when clicking one of dropdown items or pressing ESC.
     *
     * * `true` - the dropdown will close on both outside and inside (menu) clicks.
     * * `false` - the dropdown can only be closed manually via `close()` or `toggle()` methods.
     * * `"inside"` - the dropdown will close on inside menu clicks, but not outside clicks.
     * * `"outside"` - the dropdown will close only on the outside clicks and not on menu clicks.
     * @type {?}
     */
    NgbDropdown.prototype.autoClose;
    /**
     * Defines whether or not the dropdown menu is opened initially.
     * @type {?}
     */
    NgbDropdown.prototype._open;
    /**
     * The preferred placement of the dropdown.
     *
     * Possible values are `"top"`, `"top-left"`, `"top-right"`, `"bottom"`, `"bottom-left"`,
     * `"bottom-right"`, `"left"`, `"left-top"`, `"left-bottom"`, `"right"`, `"right-top"`,
     * `"right-bottom"`
     *
     * Accepts an array of strings or a string with space separated possible values.
     *
     * The default order of preference is `"bottom-left bottom-right top-left top-right"`
     *
     * Please see the [positioning overview](#/positioning) for more details.
     * @type {?}
     */
    NgbDropdown.prototype.placement;
    /**
     * A selector specifying the element the dropdown should be appended to.
     * Currently only supports "body".
     *
     * \@since 4.1.0
     * @type {?}
     */
    NgbDropdown.prototype.container;
    /**
     * Enable or disable the dynamic positioning
     *
     * \@since 4.2.0
     * @type {?}
     */
    NgbDropdown.prototype.display;
    /**
     * An event fired when the dropdown is opened or closed.
     *
     * The event payload is a `boolean`:
     * * `true` - the dropdown was opened
     * * `false` - the dropdown was closed
     * @type {?}
     */
    NgbDropdown.prototype.openChange;
    /** @type {?} */
    NgbDropdown.prototype._changeDetector;
    /** @type {?} */
    NgbDropdown.prototype._document;
    /** @type {?} */
    NgbDropdown.prototype._ngZone;
    /** @type {?} */
    NgbDropdown.prototype._elementRef;
    /** @type {?} */
    NgbDropdown.prototype._renderer;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJvcGRvd24uanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC8iLCJzb3VyY2VzIjpbImRyb3Bkb3duL2Ryb3Bkb3duLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUNMLGlCQUFpQixFQUNqQixZQUFZLEVBQ1osZUFBZSxFQUNmLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLFVBQVUsRUFDVixNQUFNLEVBQ04sS0FBSyxFQUNMLE1BQU0sRUFHTixNQUFNLEVBQ04sU0FBUyxFQUNULFNBQVMsRUFFVCxRQUFRLEVBQ1QsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFBQyxPQUFPLEVBQWUsTUFBTSxNQUFNLENBQUM7QUFFM0MsT0FBTyxFQUE0QixnQkFBZ0IsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ2hGLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUMvQyxPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBRWhDLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBRXBEO0lBQUE7SUFFQSxDQUFDOztnQkFGQSxTQUFTLFNBQUMsRUFBQyxRQUFRLEVBQUUsU0FBUyxFQUFDOztJQUVoQyxnQkFBQztDQUFBLEFBRkQsSUFFQztTQURZLFNBQVM7Ozs7Ozs7QUFTdEI7SUFXRSx5QkFBbUIsVUFBbUM7UUFBbkMsZUFBVSxHQUFWLFVBQVUsQ0FBeUI7UUFUOUMsY0FBUyxHQUFHLEtBQUssQ0FBQztJQVMrQixDQUFDO0lBUDFELHNCQUNJLHFDQUFROzs7O1FBSVosY0FBMEIsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQzs7Ozs7UUFMbEQsVUFDYSxLQUFjO1lBQ3pCLElBQUksQ0FBQyxTQUFTLEdBQUcsbUJBQUssS0FBSyxFQUFB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LGNBQWMsRUFBRSxVQUFVLEVBQUMsRUFBQzs7OztnQkFsSWpHLGlCQUFpQjtnQkF5QlgsaUJBQWlCO2dEQTJLcUQsTUFBTSxTQUFDLFFBQVE7Z0JBM0wzRixNQUFNO2dCQUxOLFVBQVU7Z0JBVVYsU0FBUztnQkF3TGtCLFNBQVMsdUJBQS9CLFFBQVE7Ozt3QkE5RFosWUFBWSxTQUFDLGVBQWU7K0JBQzVCLFlBQVksU0FBQyxlQUFlLEVBQUUsRUFBQyxJQUFJLEVBQUUsVUFBVSxFQUFDOzBCQUVoRCxZQUFZLFNBQUMsaUJBQWlCOzRCQVU5QixLQUFLO3dCQUtMLEtBQUssU0FBQyxNQUFNOzRCQWVaLEtBQUs7NEJBUUwsS0FBSzswQkFPTCxLQUFLOzZCQVNMLE1BQU07O0lBME9ULGtCQUFDO0NBQUEsQUF6U0QsSUF5U0M7U0F4U1ksV0FBVzs7O0lBQ3RCLCtCQUF1Qzs7SUFDdkMsd0NBQXdDOztJQUN4QyxxQ0FBb0M7O0lBRXBDLDRCQUE4RDs7SUFDOUQsbUNBQW9GOztJQUVwRiw4QkFBb0U7Ozs7Ozs7Ozs7SUFVcEUsZ0NBQW1EOzs7OztJQUtuRCw0QkFBNkI7Ozs7Ozs7Ozs7Ozs7OztJQWU3QixnQ0FBbUM7Ozs7Ozs7O0lBUW5DLGdDQUFrQzs7Ozs7OztJQU9sQyw4QkFBdUM7Ozs7Ozs7OztJQVN2QyxpQ0FBbUQ7O0lBRy9DLHNDQUEwQzs7SUFBNkIsZ0NBQXdDOztJQUMvRyw4QkFBdUI7O0lBQUUsa0NBQTRDOztJQUFFLGdDQUE0QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb250ZW50Q2hpbGQsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIGZvcndhcmRSZWYsXG4gIEluamVjdCxcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE91dHB1dCxcbiAgUXVlcnlMaXN0LFxuICBSZW5kZXJlcjIsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIE9wdGlvbmFsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7U3ViamVjdCwgU3Vic2NyaXB0aW9ufSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHtQbGFjZW1lbnQsIFBsYWNlbWVudEFycmF5LCBwb3NpdGlvbkVsZW1lbnRzfSBmcm9tICcuLi91dGlsL3Bvc2l0aW9uaW5nJztcbmltcG9ydCB7bmdiQXV0b0Nsb3NlfSBmcm9tICcuLi91dGlsL2F1dG9jbG9zZSc7XG5pbXBvcnQge0tleX0gZnJvbSAnLi4vdXRpbC9rZXknO1xuXG5pbXBvcnQge05nYkRyb3Bkb3duQ29uZmlnfSBmcm9tICcuL2Ryb3Bkb3duLWNvbmZpZyc7XG5cbkBEaXJlY3RpdmUoe3NlbGVjdG9yOiAnLm5hdmJhcid9KVxuZXhwb3J0IGNsYXNzIE5nYk5hdmJhciB7XG59XG5cbi8qKlxuICogQSBkaXJlY3RpdmUgeW91IHNob3VsZCBwdXQgcHV0IG9uIGEgZHJvcGRvd24gaXRlbSB0byBlbmFibGUga2V5Ym9hcmQgbmF2aWdhdGlvbi5cbiAqIEFycm93IGtleXMgd2lsbCBtb3ZlIGZvY3VzIGJldHdlZW4gaXRlbXMgbWFya2VkIHdpdGggdGhpcyBkaXJlY3RpdmUuXG4gKlxuICogQHNpbmNlIDQuMS4wXG4gKi9cbkBEaXJlY3RpdmUoe3NlbGVjdG9yOiAnW25nYkRyb3Bkb3duSXRlbV0nLCBob3N0OiB7J2NsYXNzJzogJ2Ryb3Bkb3duLWl0ZW0nLCAnW2NsYXNzLmRpc2FibGVkXSc6ICdkaXNhYmxlZCd9fSlcbmV4cG9ydCBjbGFzcyBOZ2JEcm9wZG93bkl0ZW0ge1xuICBwcml2YXRlIF9kaXNhYmxlZCA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpXG4gIHNldCBkaXNhYmxlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX2Rpc2FibGVkID0gPGFueT52YWx1ZSA9PT0gJycgfHwgdmFsdWUgPT09IHRydWU7ICAvLyBhY2NlcHQgYW4gZW1wdHkgYXR0cmlidXRlIGFzIHRydWVcbiAgfVxuXG4gIGdldCBkaXNhYmxlZCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2Rpc2FibGVkOyB9XG5cbiAgY29uc3RydWN0b3IocHVibGljIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+KSB7fVxufVxuXG4vKipcbiAqIEEgZGlyZWN0aXZlIHRoYXQgd3JhcHMgZHJvcGRvd24gbWVudSBjb250ZW50IGFuZCBkcm9wZG93biBpdGVtcy5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW25nYkRyb3Bkb3duTWVudV0nLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5kcm9wZG93bi1tZW51XSc6ICd0cnVlJyxcbiAgICAnW2NsYXNzLnNob3ddJzogJ2Ryb3Bkb3duLmlzT3BlbigpJyxcbiAgICAnW2F0dHIueC1wbGFjZW1lbnRdJzogJ3BsYWNlbWVudCcsXG4gICAgJyhrZXlkb3duLkFycm93VXApJzogJ2Ryb3Bkb3duLm9uS2V5RG93bigkZXZlbnQpJyxcbiAgICAnKGtleWRvd24uQXJyb3dEb3duKSc6ICdkcm9wZG93bi5vbktleURvd24oJGV2ZW50KScsXG4gICAgJyhrZXlkb3duLkhvbWUpJzogJ2Ryb3Bkb3duLm9uS2V5RG93bigkZXZlbnQpJyxcbiAgICAnKGtleWRvd24uRW5kKSc6ICdkcm9wZG93bi5vbktleURvd24oJGV2ZW50KScsXG4gICAgJyhrZXlkb3duLkVudGVyKSc6ICdkcm9wZG93bi5vbktleURvd24oJGV2ZW50KScsXG4gICAgJyhrZXlkb3duLlNwYWNlKSc6ICdkcm9wZG93bi5vbktleURvd24oJGV2ZW50KSdcbiAgfVxufSlcbmV4cG9ydCBjbGFzcyBOZ2JEcm9wZG93bk1lbnUge1xuICBwbGFjZW1lbnQ6IFBsYWNlbWVudCA9ICdib3R0b20nO1xuICBpc09wZW4gPSBmYWxzZTtcblxuICBAQ29udGVudENoaWxkcmVuKE5nYkRyb3Bkb3duSXRlbSkgbWVudUl0ZW1zOiBRdWVyeUxpc3Q8TmdiRHJvcGRvd25JdGVtPjtcblxuICBjb25zdHJ1Y3RvcihASW5qZWN0KGZvcndhcmRSZWYoKCkgPT4gTmdiRHJvcGRvd24pKSBwdWJsaWMgZHJvcGRvd246IE5nYkRyb3Bkb3duKSB7fVxufVxuXG4vKipcbiAqIEEgZGlyZWN0aXZlIHRvIG1hcmsgYW4gZWxlbWVudCB0byB3aGljaCBkcm9wZG93biBtZW51IHdpbGwgYmUgYW5jaG9yZWQuXG4gKlxuICogVGhpcyBpcyBhIHNpbXBsZSB2ZXJzaW9uIG9mIHRoZSBgTmdiRHJvcGRvd25Ub2dnbGVgIGRpcmVjdGl2ZS5cbiAqIEl0IHBsYXlzIHRoZSBzYW1lIHJvbGUsIGJ1dCBkb2Vzbid0IGxpc3RlbiB0byBjbGljayBldmVudHMgdG8gdG9nZ2xlIGRyb3Bkb3duIG1lbnUgdGh1cyBlbmFibGluZyBzdXBwb3J0XG4gKiBmb3IgZXZlbnRzIG90aGVyIHRoYW4gY2xpY2suXG4gKlxuICogQHNpbmNlIDEuMS4wXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tuZ2JEcm9wZG93bkFuY2hvcl0nLFxuICBob3N0OiB7J2NsYXNzJzogJ2Ryb3Bkb3duLXRvZ2dsZScsICdhcmlhLWhhc3BvcHVwJzogJ3RydWUnLCAnW2F0dHIuYXJpYS1leHBhbmRlZF0nOiAnZHJvcGRvd24uaXNPcGVuKCknfVxufSlcbmV4cG9ydCBjbGFzcyBOZ2JEcm9wZG93bkFuY2hvciB7XG4gIGFuY2hvckVsO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgQEluamVjdChmb3J3YXJkUmVmKCgpID0+IE5nYkRyb3Bkb3duKSkgcHVibGljIGRyb3Bkb3duOiBOZ2JEcm9wZG93bixcbiAgICAgIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+KSB7XG4gICAgdGhpcy5hbmNob3JFbCA9IF9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gIH1cblxuICBnZXROYXRpdmVFbGVtZW50KCkgeyByZXR1cm4gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50OyB9XG59XG5cbi8qKlxuICogQSBkaXJlY3RpdmUgdG8gbWFyayBhbiBlbGVtZW50IHRoYXQgd2lsbCB0b2dnbGUgZHJvcGRvd24gdmlhIHRoZSBgY2xpY2tgIGV2ZW50LlxuICpcbiAqIFlvdSBjYW4gYWxzbyB1c2UgYE5nYkRyb3Bkb3duQW5jaG9yYCBhcyBhbiBhbHRlcm5hdGl2ZS5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW25nYkRyb3Bkb3duVG9nZ2xlXScsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnZHJvcGRvd24tdG9nZ2xlJyxcbiAgICAnYXJpYS1oYXNwb3B1cCc6ICd0cnVlJyxcbiAgICAnW2F0dHIuYXJpYS1leHBhbmRlZF0nOiAnZHJvcGRvd24uaXNPcGVuKCknLFxuICAgICcoY2xpY2spJzogJ2Ryb3Bkb3duLnRvZ2dsZSgpJyxcbiAgICAnKGtleWRvd24uQXJyb3dVcCknOiAnZHJvcGRvd24ub25LZXlEb3duKCRldmVudCknLFxuICAgICcoa2V5ZG93bi5BcnJvd0Rvd24pJzogJ2Ryb3Bkb3duLm9uS2V5RG93bigkZXZlbnQpJyxcbiAgICAnKGtleWRvd24uSG9tZSknOiAnZHJvcGRvd24ub25LZXlEb3duKCRldmVudCknLFxuICAgICcoa2V5ZG93bi5FbmQpJzogJ2Ryb3Bkb3duLm9uS2V5RG93bigkZXZlbnQpJ1xuICB9LFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogTmdiRHJvcGRvd25BbmNob3IsIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE5nYkRyb3Bkb3duVG9nZ2xlKX1dXG59KVxuZXhwb3J0IGNsYXNzIE5nYkRyb3Bkb3duVG9nZ2xlIGV4dGVuZHMgTmdiRHJvcGRvd25BbmNob3Ige1xuICBjb25zdHJ1Y3RvcihASW5qZWN0KGZvcndhcmRSZWYoKCkgPT4gTmdiRHJvcGRvd24pKSBkcm9wZG93bjogTmdiRHJvcGRvd24sIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+KSB7XG4gICAgc3VwZXIoZHJvcGRvd24sIGVsZW1lbnRSZWYpO1xuICB9XG59XG5cbi8qKlxuICogQSBkaXJlY3RpdmUgdGhhdCBwcm92aWRlcyBjb250ZXh0dWFsIG92ZXJsYXlzIGZvciBkaXNwbGF5aW5nIGxpc3RzIG9mIGxpbmtzIGFuZCBtb3JlLlxuICovXG5ARGlyZWN0aXZlKHtzZWxlY3RvcjogJ1tuZ2JEcm9wZG93bl0nLCBleHBvcnRBczogJ25nYkRyb3Bkb3duJywgaG9zdDogeydbY2xhc3Muc2hvd10nOiAnaXNPcGVuKCknfX0pXG5leHBvcnQgY2xhc3MgTmdiRHJvcGRvd24gaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgX2Nsb3NlZCQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuICBwcml2YXRlIF96b25lU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gIHByaXZhdGUgX2JvZHlDb250YWluZXI6IEhUTUxFbGVtZW50O1xuXG4gIEBDb250ZW50Q2hpbGQoTmdiRHJvcGRvd25NZW51KSBwcml2YXRlIF9tZW51OiBOZ2JEcm9wZG93bk1lbnU7XG4gIEBDb250ZW50Q2hpbGQoTmdiRHJvcGRvd25NZW51LCB7cmVhZDogRWxlbWVudFJlZn0pIHByaXZhdGUgX21lbnVFbGVtZW50OiBFbGVtZW50UmVmO1xuXG4gIEBDb250ZW50Q2hpbGQoTmdiRHJvcGRvd25BbmNob3IpIHByaXZhdGUgX2FuY2hvcjogTmdiRHJvcGRvd25BbmNob3I7XG5cbiAgLyoqXG4gICAqIEluZGljYXRlcyB3aGV0aGVyIHRoZSBkcm9wZG93biBzaG91bGQgYmUgY2xvc2VkIHdoZW4gY2xpY2tpbmcgb25lIG9mIGRyb3Bkb3duIGl0ZW1zIG9yIHByZXNzaW5nIEVTQy5cbiAgICpcbiAgICogKiBgdHJ1ZWAgLSB0aGUgZHJvcGRvd24gd2lsbCBjbG9zZSBvbiBib3RoIG91dHNpZGUgYW5kIGluc2lkZSAobWVudSkgY2xpY2tzLlxuICAgKiAqIGBmYWxzZWAgLSB0aGUgZHJvcGRvd24gY2FuIG9ubHkgYmUgY2xvc2VkIG1hbnVhbGx5IHZpYSBgY2xvc2UoKWAgb3IgYHRvZ2dsZSgpYCBtZXRob2RzLlxuICAgKiAqIGBcImluc2lkZVwiYCAtIHRoZSBkcm9wZG93biB3aWxsIGNsb3NlIG9uIGluc2lkZSBtZW51IGNsaWNrcywgYnV0IG5vdCBvdXRzaWRlIGNsaWNrcy5cbiAgICogKiBgXCJvdXRzaWRlXCJgIC0gdGhlIGRyb3Bkb3duIHdpbGwgY2xvc2Ugb25seSBvbiB0aGUgb3V0c2lkZSBjbGlja3MgYW5kIG5vdCBvbiBtZW51IGNsaWNrcy5cbiAgICovXG4gIEBJbnB1dCgpIGF1dG9DbG9zZTogYm9vbGVhbiB8ICdvdXRzaWRlJyB8ICdpbnNpZGUnO1xuXG4gIC8qKlxuICAgKiBEZWZpbmVzIHdoZXRoZXIgb3Igbm90IHRoZSBkcm9wZG93biBtZW51IGlzIG9wZW5lZCBpbml0aWFsbHkuXG4gICAqL1xuICBASW5wdXQoJ29wZW4nKSBfb3BlbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBUaGUgcHJlZmVycmVkIHBsYWNlbWVudCBvZiB0aGUgZHJvcGRvd24uXG4gICAqXG4gICAqIFBvc3NpYmxlIHZhbHVlcyBhcmUgYFwidG9wXCJgLCBgXCJ0b3AtbGVmdFwiYCwgYFwidG9wLXJpZ2h0XCJgLCBgXCJib3R0b21cImAsIGBcImJvdHRvbS1sZWZ0XCJgLFxuICAgKiBgXCJib3R0b20tcmlnaHRcImAsIGBcImxlZnRcImAsIGBcImxlZnQtdG9wXCJgLCBgXCJsZWZ0LWJvdHRvbVwiYCwgYFwicmlnaHRcImAsIGBcInJpZ2h0LXRvcFwiYCxcbiAgICogYFwicmlnaHQtYm90dG9tXCJgXG4gICAqXG4gICAqIEFjY2VwdHMgYW4gYXJyYXkgb2Ygc3RyaW5ncyBvciBhIHN0cmluZyB3aXRoIHNwYWNlIHNlcGFyYXRlZCBwb3NzaWJsZSB2YWx1ZXMuXG4gICAqXG4gICAqIFRoZSBkZWZhdWx0IG9yZGVyIG9mIHByZWZlcmVuY2UgaXMgYFwiYm90dG9tLWxlZnQgYm90dG9tLXJpZ2h0IHRvcC1sZWZ0IHRvcC1yaWdodFwiYFxuICAgKlxuICAgKiBQbGVhc2Ugc2VlIHRoZSBbcG9zaXRpb25pbmcgb3ZlcnZpZXddKCMvcG9zaXRpb25pbmcpIGZvciBtb3JlIGRldGFpbHMuXG4gICAqL1xuICBASW5wdXQoKSBwbGFjZW1lbnQ6IFBsYWNlbWVudEFycmF5O1xuXG4gIC8qKlxuICAqIEEgc2VsZWN0b3Igc3BlY2lmeWluZyB0aGUgZWxlbWVudCB0aGUgZHJvcGRvd24gc2hvdWxkIGJlIGFwcGVuZGVkIHRvLlxuICAqIEN1cnJlbnRseSBvbmx5IHN1cHBvcnRzIFwiYm9keVwiLlxuICAqXG4gICogQHNpbmNlIDQuMS4wXG4gICovXG4gIEBJbnB1dCgpIGNvbnRhaW5lcjogbnVsbCB8ICdib2R5JztcblxuICAvKipcbiAgICogRW5hYmxlIG9yIGRpc2FibGUgdGhlIGR5bmFtaWMgcG9zaXRpb25pbmdcbiAgICpcbiAgICogQHNpbmNlIDQuMi4wXG4gICAqL1xuICBASW5wdXQoKSBkaXNwbGF5OiAnZHluYW1pYycgfCAnc3RhdGljJztcblxuICAvKipcbiAgICogQW4gZXZlbnQgZmlyZWQgd2hlbiB0aGUgZHJvcGRvd24gaXMgb3BlbmVkIG9yIGNsb3NlZC5cbiAgICpcbiAgICogVGhlIGV2ZW50IHBheWxvYWQgaXMgYSBgYm9vbGVhbmA6XG4gICAqICogYHRydWVgIC0gdGhlIGRyb3Bkb3duIHdhcyBvcGVuZWRcbiAgICogKiBgZmFsc2VgIC0gdGhlIGRyb3Bkb3duIHdhcyBjbG9zZWRcbiAgICovXG4gIEBPdXRwdXQoKSBvcGVuQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3I6IENoYW5nZURldGVjdG9yUmVmLCBjb25maWc6IE5nYkRyb3Bkb3duQ29uZmlnLCBASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIF9kb2N1bWVudDogYW55LFxuICAgICAgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUsIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LCBwcml2YXRlIF9yZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgICAgQE9wdGlvbmFsKCkgbmdiTmF2YmFyOiBOZ2JOYXZiYXIpIHtcbiAgICB0aGlzLnBsYWNlbWVudCA9IGNvbmZpZy5wbGFjZW1lbnQ7XG4gICAgdGhpcy5jb250YWluZXIgPSBjb25maWcuY29udGFpbmVyO1xuICAgIHRoaXMuYXV0b0Nsb3NlID0gY29uZmlnLmF1dG9DbG9zZTtcblxuICAgIHRoaXMuZGlzcGxheSA9IG5nYk5hdmJhciA/ICdzdGF0aWMnIDogJ2R5bmFtaWMnO1xuXG4gICAgdGhpcy5fem9uZVN1YnNjcmlwdGlvbiA9IF9uZ1pvbmUub25TdGFibGUuc3Vic2NyaWJlKCgpID0+IHsgdGhpcy5fcG9zaXRpb25NZW51KCk7IH0pO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5fYXBwbHlQbGFjZW1lbnRDbGFzc2VzKCk7XG4gICAgaWYgKHRoaXMuX29wZW4pIHtcbiAgICAgIHRoaXMuX3NldENsb3NlSGFuZGxlcnMoKTtcbiAgICB9XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKGNoYW5nZXMuY29udGFpbmVyICYmIHRoaXMuX29wZW4pIHtcbiAgICAgIHRoaXMuX2FwcGx5Q29udGFpbmVyKHRoaXMuY29udGFpbmVyKTtcbiAgICB9XG5cbiAgICBpZiAoY2hhbmdlcy5wbGFjZW1lbnQgJiYgIWNoYW5nZXMucGxhY2VtZW50LmlzRmlyc3RDaGFuZ2UpIHtcbiAgICAgIHRoaXMuX2FwcGx5UGxhY2VtZW50Q2xhc3NlcygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgdGhlIGRyb3Bkb3duIG1lbnUgaXMgb3Blbi5cbiAgICovXG4gIGlzT3BlbigpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX29wZW47IH1cblxuICAvKipcbiAgICogT3BlbnMgdGhlIGRyb3Bkb3duIG1lbnUuXG4gICAqL1xuICBvcGVuKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5fb3Blbikge1xuICAgICAgdGhpcy5fb3BlbiA9IHRydWU7XG4gICAgICB0aGlzLl9hcHBseUNvbnRhaW5lcih0aGlzLmNvbnRhaW5lcik7XG4gICAgICB0aGlzLm9wZW5DaGFuZ2UuZW1pdCh0cnVlKTtcbiAgICAgIHRoaXMuX3NldENsb3NlSGFuZGxlcnMoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9zZXRDbG9zZUhhbmRsZXJzKCkge1xuICAgIG5nYkF1dG9DbG9zZShcbiAgICAgICAgdGhpcy5fbmdab25lLCB0aGlzLl9kb2N1bWVudCwgdGhpcy5hdXRvQ2xvc2UsICgpID0+IHRoaXMuY2xvc2UoKSwgdGhpcy5fY2xvc2VkJCxcbiAgICAgICAgdGhpcy5fbWVudSA/IFt0aGlzLl9tZW51RWxlbWVudC5uYXRpdmVFbGVtZW50XSA6IFtdLCB0aGlzLl9hbmNob3IgPyBbdGhpcy5fYW5jaG9yLmdldE5hdGl2ZUVsZW1lbnQoKV0gOiBbXSxcbiAgICAgICAgJy5kcm9wZG93bi1pdGVtLC5kcm9wZG93bi1kaXZpZGVyJyk7XG4gIH1cblxuICAvKipcbiAgICogQ2xvc2VzIHRoZSBkcm9wZG93biBtZW51LlxuICAgKi9cbiAgY2xvc2UoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX29wZW4pIHtcbiAgICAgIHRoaXMuX29wZW4gPSBmYWxzZTtcbiAgICAgIHRoaXMuX3Jlc2V0Q29udGFpbmVyKCk7XG4gICAgICB0aGlzLl9jbG9zZWQkLm5leHQoKTtcbiAgICAgIHRoaXMub3BlbkNoYW5nZS5lbWl0KGZhbHNlKTtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUb2dnbGVzIHRoZSBkcm9wZG93biBtZW51LlxuICAgKi9cbiAgdG9nZ2xlKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmlzT3BlbigpKSB7XG4gICAgICB0aGlzLmNsb3NlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub3BlbigpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX3Jlc2V0Q29udGFpbmVyKCk7XG5cbiAgICB0aGlzLl9jbG9zZWQkLm5leHQoKTtcbiAgICB0aGlzLl96b25lU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICBvbktleURvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6ZGVwcmVjYXRpb25cbiAgICBjb25zdCBrZXkgPSBldmVudC53aGljaDtcbiAgICBjb25zdCBpdGVtRWxlbWVudHMgPSB0aGlzLl9nZXRNZW51RWxlbWVudHMoKTtcblxuICAgIGxldCBwb3NpdGlvbiA9IC0xO1xuICAgIGxldCBpc0V2ZW50RnJvbUl0ZW1zID0gZmFsc2U7XG4gICAgY29uc3QgaXNFdmVudEZyb21Ub2dnbGUgPSB0aGlzLl9pc0V2ZW50RnJvbVRvZ2dsZShldmVudCk7XG5cbiAgICBpZiAoIWlzRXZlbnRGcm9tVG9nZ2xlICYmIGl0ZW1FbGVtZW50cy5sZW5ndGgpIHtcbiAgICAgIGl0ZW1FbGVtZW50cy5mb3JFYWNoKChpdGVtRWxlbWVudCwgaW5kZXgpID0+IHtcbiAgICAgICAgaWYgKGl0ZW1FbGVtZW50LmNvbnRhaW5zKGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudCkpIHtcbiAgICAgICAgICBpc0V2ZW50RnJvbUl0ZW1zID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXRlbUVsZW1lbnQgPT09IHRoaXMuX2RvY3VtZW50LmFjdGl2ZUVsZW1lbnQpIHtcbiAgICAgICAgICBwb3NpdGlvbiA9IGluZGV4O1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBjbG9zaW5nIG9uIEVudGVyIC8gU3BhY2VcbiAgICBpZiAoa2V5ID09PSBLZXkuU3BhY2UgfHwga2V5ID09PSBLZXkuRW50ZXIpIHtcbiAgICAgIGlmIChpc0V2ZW50RnJvbUl0ZW1zICYmICh0aGlzLmF1dG9DbG9zZSA9PT0gdHJ1ZSB8fCB0aGlzLmF1dG9DbG9zZSA9PT0gJ2luc2lkZScpKSB7XG4gICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBvcGVuaW5nIC8gbmF2aWdhdGluZ1xuICAgIGlmIChpc0V2ZW50RnJvbVRvZ2dsZSB8fCBpc0V2ZW50RnJvbUl0ZW1zKSB7XG4gICAgICB0aGlzLm9wZW4oKTtcblxuICAgICAgaWYgKGl0ZW1FbGVtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgc3dpdGNoIChrZXkpIHtcbiAgICAgICAgICBjYXNlIEtleS5BcnJvd0Rvd246XG4gICAgICAgICAgICBwb3NpdGlvbiA9IE1hdGgubWluKHBvc2l0aW9uICsgMSwgaXRlbUVsZW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBLZXkuQXJyb3dVcDpcbiAgICAgICAgICAgIGlmICh0aGlzLl9pc0Ryb3B1cCgpICYmIHBvc2l0aW9uID09PSAtMSkge1xuICAgICAgICAgICAgICBwb3NpdGlvbiA9IGl0ZW1FbGVtZW50cy5sZW5ndGggLSAxO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBvc2l0aW9uID0gTWF0aC5tYXgocG9zaXRpb24gLSAxLCAwKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgS2V5LkhvbWU6XG4gICAgICAgICAgICBwb3NpdGlvbiA9IDA7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIEtleS5FbmQ6XG4gICAgICAgICAgICBwb3NpdGlvbiA9IGl0ZW1FbGVtZW50cy5sZW5ndGggLSAxO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaXRlbUVsZW1lbnRzW3Bvc2l0aW9uXS5mb2N1cygpO1xuICAgICAgfVxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9pc0Ryb3B1cCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2Ryb3B1cCcpOyB9XG5cbiAgcHJpdmF0ZSBfaXNFdmVudEZyb21Ub2dnbGUoZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICByZXR1cm4gdGhpcy5fYW5jaG9yLmdldE5hdGl2ZUVsZW1lbnQoKS5jb250YWlucyhldmVudC50YXJnZXQgYXMgSFRNTEVsZW1lbnQpO1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0TWVudUVsZW1lbnRzKCk6IEhUTUxFbGVtZW50W10ge1xuICAgIGlmICh0aGlzLl9tZW51ID09IG51bGwpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX21lbnUubWVudUl0ZW1zLmZpbHRlcihpdGVtID0+ICFpdGVtLmRpc2FibGVkKS5tYXAoaXRlbSA9PiBpdGVtLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCk7XG4gIH1cblxuICBwcml2YXRlIF9wb3NpdGlvbk1lbnUoKSB7XG4gICAgaWYgKHRoaXMuaXNPcGVuKCkgJiYgdGhpcy5fbWVudSkge1xuICAgICAgdGhpcy5fYXBwbHlQbGFjZW1lbnRDbGFzc2VzKFxuICAgICAgICAgIHRoaXMuZGlzcGxheSA9PT0gJ2R5bmFtaWMnID9cbiAgICAgICAgICAgICAgcG9zaXRpb25FbGVtZW50cyhcbiAgICAgICAgICAgICAgICAgIHRoaXMuX2FuY2hvci5hbmNob3JFbCwgdGhpcy5fYm9keUNvbnRhaW5lciB8fCB0aGlzLl9tZW51RWxlbWVudC5uYXRpdmVFbGVtZW50LCB0aGlzLnBsYWNlbWVudCxcbiAgICAgICAgICAgICAgICAgIHRoaXMuY29udGFpbmVyID09PSAnYm9keScpIDpcbiAgICAgICAgICAgICAgdGhpcy5fZ2V0Rmlyc3RQbGFjZW1lbnQodGhpcy5wbGFjZW1lbnQpKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9nZXRGaXJzdFBsYWNlbWVudChwbGFjZW1lbnQ6IFBsYWNlbWVudEFycmF5KTogUGxhY2VtZW50IHtcbiAgICByZXR1cm4gQXJyYXkuaXNBcnJheShwbGFjZW1lbnQpID8gcGxhY2VtZW50WzBdIDogcGxhY2VtZW50LnNwbGl0KCcgJylbMF0gYXMgUGxhY2VtZW50O1xuICB9XG5cbiAgcHJpdmF0ZSBfcmVzZXRDb250YWluZXIoKSB7XG4gICAgY29uc3QgcmVuZGVyZXIgPSB0aGlzLl9yZW5kZXJlcjtcbiAgICBpZiAodGhpcy5fbWVudUVsZW1lbnQpIHtcbiAgICAgIGNvbnN0IGRyb3Bkb3duRWxlbWVudCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICAgIGNvbnN0IGRyb3Bkb3duTWVudUVsZW1lbnQgPSB0aGlzLl9tZW51RWxlbWVudC5uYXRpdmVFbGVtZW50O1xuXG4gICAgICByZW5kZXJlci5hcHBlbmRDaGlsZChkcm9wZG93bkVsZW1lbnQsIGRyb3Bkb3duTWVudUVsZW1lbnQpO1xuICAgICAgcmVuZGVyZXIucmVtb3ZlU3R5bGUoZHJvcGRvd25NZW51RWxlbWVudCwgJ3Bvc2l0aW9uJyk7XG4gICAgICByZW5kZXJlci5yZW1vdmVTdHlsZShkcm9wZG93bk1lbnVFbGVtZW50LCAndHJhbnNmb3JtJyk7XG4gICAgfVxuICAgIGlmICh0aGlzLl9ib2R5Q29udGFpbmVyKSB7XG4gICAgICByZW5kZXJlci5yZW1vdmVDaGlsZCh0aGlzLl9kb2N1bWVudC5ib2R5LCB0aGlzLl9ib2R5Q29udGFpbmVyKTtcbiAgICAgIHRoaXMuX2JvZHlDb250YWluZXIgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2FwcGx5Q29udGFpbmVyKGNvbnRhaW5lcjogbnVsbCB8ICdib2R5JyA9IG51bGwpIHtcbiAgICB0aGlzLl9yZXNldENvbnRhaW5lcigpO1xuICAgIGlmIChjb250YWluZXIgPT09ICdib2R5Jykge1xuICAgICAgY29uc3QgcmVuZGVyZXIgPSB0aGlzLl9yZW5kZXJlcjtcbiAgICAgIGNvbnN0IGRyb3Bkb3duTWVudUVsZW1lbnQgPSB0aGlzLl9tZW51RWxlbWVudC5uYXRpdmVFbGVtZW50O1xuICAgICAgY29uc3QgYm9keUNvbnRhaW5lciA9IHRoaXMuX2JvZHlDb250YWluZXIgPSB0aGlzLl9ib2R5Q29udGFpbmVyIHx8IHJlbmRlcmVyLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG4gICAgICAvLyBPdmVycmlkZSBzb21lIHN0eWxlcyB0byBoYXZlIHRoZSBwb3NpdGlvbm5pbmcgd29ya2luZ1xuICAgICAgcmVuZGVyZXIuc2V0U3R5bGUoYm9keUNvbnRhaW5lciwgJ3Bvc2l0aW9uJywgJ2Fic29sdXRlJyk7XG4gICAgICByZW5kZXJlci5zZXRTdHlsZShkcm9wZG93bk1lbnVFbGVtZW50LCAncG9zaXRpb24nLCAnc3RhdGljJyk7XG4gICAgICByZW5kZXJlci5zZXRTdHlsZShib2R5Q29udGFpbmVyLCAnei1pbmRleCcsICcxMDUwJyk7XG5cbiAgICAgIHJlbmRlcmVyLmFwcGVuZENoaWxkKGJvZHlDb250YWluZXIsIGRyb3Bkb3duTWVudUVsZW1lbnQpO1xuICAgICAgcmVuZGVyZXIuYXBwZW5kQ2hpbGQodGhpcy5fZG9jdW1lbnQuYm9keSwgYm9keUNvbnRhaW5lcik7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfYXBwbHlQbGFjZW1lbnRDbGFzc2VzKHBsYWNlbWVudD86IFBsYWNlbWVudCkge1xuICAgIGlmICh0aGlzLl9tZW51KSB7XG4gICAgICBpZiAoIXBsYWNlbWVudCkge1xuICAgICAgICBwbGFjZW1lbnQgPSB0aGlzLl9nZXRGaXJzdFBsYWNlbWVudCh0aGlzLnBsYWNlbWVudCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJlbmRlcmVyID0gdGhpcy5fcmVuZGVyZXI7XG4gICAgICBjb25zdCBkcm9wZG93bkVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG5cbiAgICAgIC8vIHJlbW92ZSB0aGUgY3VycmVudCBwbGFjZW1lbnQgY2xhc3Nlc1xuICAgICAgcmVuZGVyZXIucmVtb3ZlQ2xhc3MoZHJvcGRvd25FbGVtZW50LCAnZHJvcHVwJyk7XG4gICAgICByZW5kZXJlci5yZW1vdmVDbGFzcyhkcm9wZG93bkVsZW1lbnQsICdkcm9wZG93bicpO1xuICAgICAgdGhpcy5fbWVudS5wbGFjZW1lbnQgPSBwbGFjZW1lbnQ7XG5cbiAgICAgIC8qXG4gICAgICAqIGFwcGx5IHRoZSBuZXcgcGxhY2VtZW50XG4gICAgICAqIGluIGNhc2Ugb2YgdG9wIHVzZSB1cC1hcnJvdyBvciBkb3duLWFycm93IG90aGVyd2lzZVxuICAgICAgKi9cbiAgICAgIGNvbnN0IGRyb3Bkb3duQ2xhc3MgPSBwbGFjZW1lbnQuc2VhcmNoKCdedG9wJykgIT09IC0xID8gJ2Ryb3B1cCcgOiAnZHJvcGRvd24nO1xuICAgICAgcmVuZGVyZXIuYWRkQ2xhc3MoZHJvcGRvd25FbGVtZW50LCBkcm9wZG93bkNsYXNzKTtcblxuICAgICAgY29uc3QgYm9keUNvbnRhaW5lciA9IHRoaXMuX2JvZHlDb250YWluZXI7XG4gICAgICBpZiAoYm9keUNvbnRhaW5lcikge1xuICAgICAgICByZW5kZXJlci5yZW1vdmVDbGFzcyhib2R5Q29udGFpbmVyLCAnZHJvcHVwJyk7XG4gICAgICAgIHJlbmRlcmVyLnJlbW92ZUNsYXNzKGJvZHlDb250YWluZXIsICdkcm9wZG93bicpO1xuICAgICAgICByZW5kZXJlci5hZGRDbGFzcyhib2R5Q29udGFpbmVyLCBkcm9wZG93bkNsYXNzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==