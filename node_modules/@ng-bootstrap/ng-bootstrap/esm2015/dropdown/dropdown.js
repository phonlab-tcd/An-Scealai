/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { ChangeDetectorRef, ContentChild, ContentChildren, Directive, ElementRef, EventEmitter, forwardRef, Inject, Input, NgZone, Output, QueryList, Renderer2, Optional } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Subject } from 'rxjs';
import { positionElements } from '../util/positioning';
import { ngbAutoClose } from '../util/autoclose';
import { Key } from '../util/key';
import { NgbDropdownConfig } from './dropdown-config';
export class NgbNavbar {
}
NgbNavbar.decorators = [
    { type: Directive, args: [{ selector: '.navbar' },] }
];
/**
 * A directive you should put put on a dropdown item to enable keyboard navigation.
 * Arrow keys will move focus between items marked with this directive.
 *
 * \@since 4.1.0
 */
export class NgbDropdownItem {
    /**
     * @param {?} elementRef
     */
    constructor(elementRef) {
        this.elementRef = elementRef;
        this._disabled = false;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set disabled(value) {
        this._disabled = (/** @type {?} */ (value)) === '' || value === true; // accept an empty attribute as true
    }
    /**
     * @return {?}
     */
    get disabled() { return this._disabled; }
}
NgbDropdownItem.decorators = [
    { type: Directive, args: [{ selector: '[ngbDropdownItem]', host: { 'class': 'dropdown-item', '[class.disabled]': 'disabled' } },] }
];
/** @nocollapse */
NgbDropdownItem.ctorParameters = () => [
    { type: ElementRef }
];
NgbDropdownItem.propDecorators = {
    disabled: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    NgbDropdownItem.prototype._disabled;
    /** @type {?} */
    NgbDropdownItem.prototype.elementRef;
}
/**
 * A directive that wraps dropdown menu content and dropdown items.
 */
export class NgbDropdownMenu {
    /**
     * @param {?} dropdown
     */
    constructor(dropdown) {
        this.dropdown = dropdown;
        this.placement = 'bottom';
        this.isOpen = false;
    }
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
NgbDropdownMenu.ctorParameters = () => [
    { type: NgbDropdown, decorators: [{ type: Inject, args: [forwardRef(() => NgbDropdown),] }] }
];
NgbDropdownMenu.propDecorators = {
    menuItems: [{ type: ContentChildren, args: [NgbDropdownItem,] }]
};
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
export class NgbDropdownAnchor {
    /**
     * @param {?} dropdown
     * @param {?} _elementRef
     */
    constructor(dropdown, _elementRef) {
        this.dropdown = dropdown;
        this._elementRef = _elementRef;
        this.anchorEl = _elementRef.nativeElement;
    }
    /**
     * @return {?}
     */
    getNativeElement() { return this._elementRef.nativeElement; }
}
NgbDropdownAnchor.decorators = [
    { type: Directive, args: [{
                selector: '[ngbDropdownAnchor]',
                host: { 'class': 'dropdown-toggle', 'aria-haspopup': 'true', '[attr.aria-expanded]': 'dropdown.isOpen()' }
            },] }
];
/** @nocollapse */
NgbDropdownAnchor.ctorParameters = () => [
    { type: NgbDropdown, decorators: [{ type: Inject, args: [forwardRef(() => NgbDropdown),] }] },
    { type: ElementRef }
];
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
export class NgbDropdownToggle extends NgbDropdownAnchor {
    /**
     * @param {?} dropdown
     * @param {?} elementRef
     */
    constructor(dropdown, elementRef) {
        super(dropdown, elementRef);
    }
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
                providers: [{ provide: NgbDropdownAnchor, useExisting: forwardRef(() => NgbDropdownToggle) }]
            },] }
];
/** @nocollapse */
NgbDropdownToggle.ctorParameters = () => [
    { type: NgbDropdown, decorators: [{ type: Inject, args: [forwardRef(() => NgbDropdown),] }] },
    { type: ElementRef }
];
/**
 * A directive that provides contextual overlays for displaying lists of links and more.
 */
export class NgbDropdown {
    /**
     * @param {?} _changeDetector
     * @param {?} config
     * @param {?} _document
     * @param {?} _ngZone
     * @param {?} _elementRef
     * @param {?} _renderer
     * @param {?} ngbNavbar
     */
    constructor(_changeDetector, config, _document, _ngZone, _elementRef, _renderer, ngbNavbar) {
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
        this._zoneSubscription = _ngZone.onStable.subscribe(() => { this._positionMenu(); });
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this._applyPlacementClasses();
        if (this._open) {
            this._setCloseHandlers();
        }
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes.container && this._open) {
            this._applyContainer(this.container);
        }
        if (changes.placement && !changes.placement.isFirstChange) {
            this._applyPlacementClasses();
        }
    }
    /**
     * Checks if the dropdown menu is open.
     * @return {?}
     */
    isOpen() { return this._open; }
    /**
     * Opens the dropdown menu.
     * @return {?}
     */
    open() {
        if (!this._open) {
            this._open = true;
            this._applyContainer(this.container);
            this.openChange.emit(true);
            this._setCloseHandlers();
        }
    }
    /**
     * @return {?}
     */
    _setCloseHandlers() {
        ngbAutoClose(this._ngZone, this._document, this.autoClose, () => this.close(), this._closed$, this._menu ? [this._menuElement.nativeElement] : [], this._anchor ? [this._anchor.getNativeElement()] : [], '.dropdown-item,.dropdown-divider');
    }
    /**
     * Closes the dropdown menu.
     * @return {?}
     */
    close() {
        if (this._open) {
            this._open = false;
            this._resetContainer();
            this._closed$.next();
            this.openChange.emit(false);
            this._changeDetector.markForCheck();
        }
    }
    /**
     * Toggles the dropdown menu.
     * @return {?}
     */
    toggle() {
        if (this.isOpen()) {
            this.close();
        }
        else {
            this.open();
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._resetContainer();
        this._closed$.next();
        this._zoneSubscription.unsubscribe();
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onKeyDown(event) {
        // tslint:disable-next-line:deprecation
        /** @type {?} */
        const key = event.which;
        /** @type {?} */
        const itemElements = this._getMenuElements();
        /** @type {?} */
        let position = -1;
        /** @type {?} */
        let isEventFromItems = false;
        /** @type {?} */
        const isEventFromToggle = this._isEventFromToggle(event);
        if (!isEventFromToggle && itemElements.length) {
            itemElements.forEach((itemElement, index) => {
                if (itemElement.contains((/** @type {?} */ (event.target)))) {
                    isEventFromItems = true;
                }
                if (itemElement === this._document.activeElement) {
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
    }
    /**
     * @return {?}
     */
    _isDropup() { return this._elementRef.nativeElement.classList.contains('dropup'); }
    /**
     * @param {?} event
     * @return {?}
     */
    _isEventFromToggle(event) {
        return this._anchor.getNativeElement().contains((/** @type {?} */ (event.target)));
    }
    /**
     * @return {?}
     */
    _getMenuElements() {
        if (this._menu == null) {
            return [];
        }
        return this._menu.menuItems.filter(item => !item.disabled).map(item => item.elementRef.nativeElement);
    }
    /**
     * @return {?}
     */
    _positionMenu() {
        if (this.isOpen() && this._menu) {
            this._applyPlacementClasses(this.display === 'dynamic' ?
                positionElements(this._anchor.anchorEl, this._bodyContainer || this._menuElement.nativeElement, this.placement, this.container === 'body') :
                this._getFirstPlacement(this.placement));
        }
    }
    /**
     * @param {?} placement
     * @return {?}
     */
    _getFirstPlacement(placement) {
        return Array.isArray(placement) ? placement[0] : (/** @type {?} */ (placement.split(' ')[0]));
    }
    /**
     * @return {?}
     */
    _resetContainer() {
        /** @type {?} */
        const renderer = this._renderer;
        if (this._menuElement) {
            /** @type {?} */
            const dropdownElement = this._elementRef.nativeElement;
            /** @type {?} */
            const dropdownMenuElement = this._menuElement.nativeElement;
            renderer.appendChild(dropdownElement, dropdownMenuElement);
            renderer.removeStyle(dropdownMenuElement, 'position');
            renderer.removeStyle(dropdownMenuElement, 'transform');
        }
        if (this._bodyContainer) {
            renderer.removeChild(this._document.body, this._bodyContainer);
            this._bodyContainer = null;
        }
    }
    /**
     * @param {?=} container
     * @return {?}
     */
    _applyContainer(container = null) {
        this._resetContainer();
        if (container === 'body') {
            /** @type {?} */
            const renderer = this._renderer;
            /** @type {?} */
            const dropdownMenuElement = this._menuElement.nativeElement;
            /** @type {?} */
            const bodyContainer = this._bodyContainer = this._bodyContainer || renderer.createElement('div');
            // Override some styles to have the positionning working
            renderer.setStyle(bodyContainer, 'position', 'absolute');
            renderer.setStyle(dropdownMenuElement, 'position', 'static');
            renderer.setStyle(bodyContainer, 'z-index', '1050');
            renderer.appendChild(bodyContainer, dropdownMenuElement);
            renderer.appendChild(this._document.body, bodyContainer);
        }
    }
    /**
     * @param {?=} placement
     * @return {?}
     */
    _applyPlacementClasses(placement) {
        if (this._menu) {
            if (!placement) {
                placement = this._getFirstPlacement(this.placement);
            }
            /** @type {?} */
            const renderer = this._renderer;
            /** @type {?} */
            const dropdownElement = this._elementRef.nativeElement;
            // remove the current placement classes
            renderer.removeClass(dropdownElement, 'dropup');
            renderer.removeClass(dropdownElement, 'dropdown');
            this._menu.placement = placement;
            /*
                  * apply the new placement
                  * in case of top use up-arrow or down-arrow otherwise
                  */
            /** @type {?} */
            const dropdownClass = placement.search('^top') !== -1 ? 'dropup' : 'dropdown';
            renderer.addClass(dropdownElement, dropdownClass);
            /** @type {?} */
            const bodyContainer = this._bodyContainer;
            if (bodyContainer) {
                renderer.removeClass(bodyContainer, 'dropup');
                renderer.removeClass(bodyContainer, 'dropdown');
                renderer.addClass(bodyContainer, dropdownClass);
            }
        }
    }
}
NgbDropdown.decorators = [
    { type: Directive, args: [{ selector: '[ngbDropdown]', exportAs: 'ngbDropdown', host: { '[class.show]': 'isOpen()' } },] }
];
/** @nocollapse */
NgbDropdown.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: NgbDropdownConfig },
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] },
    { type: NgZone },
    { type: ElementRef },
    { type: Renderer2 },
    { type: NgbNavbar, decorators: [{ type: Optional }] }
];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJvcGRvd24uanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC8iLCJzb3VyY2VzIjpbImRyb3Bkb3duL2Ryb3Bkb3duLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQ0wsaUJBQWlCLEVBQ2pCLFlBQVksRUFDWixlQUFlLEVBQ2YsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osVUFBVSxFQUNWLE1BQU0sRUFDTixLQUFLLEVBQ0wsTUFBTSxFQUdOLE1BQU0sRUFDTixTQUFTLEVBQ1QsU0FBUyxFQUVULFFBQVEsRUFDVCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDekMsT0FBTyxFQUFDLE9BQU8sRUFBZSxNQUFNLE1BQU0sQ0FBQztBQUUzQyxPQUFPLEVBQTRCLGdCQUFnQixFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDaEYsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQy9DLE9BQU8sRUFBQyxHQUFHLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFFaEMsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFHcEQsTUFBTSxPQUFPLFNBQVM7OztZQURyQixTQUFTLFNBQUMsRUFBQyxRQUFRLEVBQUUsU0FBUyxFQUFDOzs7Ozs7OztBQVdoQyxNQUFNLE9BQU8sZUFBZTs7OztJQVUxQixZQUFtQixVQUFtQztRQUFuQyxlQUFVLEdBQVYsVUFBVSxDQUF5QjtRQVQ5QyxjQUFTLEdBQUcsS0FBSyxDQUFDO0lBUytCLENBQUM7Ozs7O0lBUDFELElBQ0ksUUFBUSxDQUFDLEtBQWM7UUFDekIsSUFBSSxDQUFDLFNBQVMsR0FBRyxtQkFBSyxLQUFLLEVBQUEsS0FBSyxFQUFFLElBQUksS0FBSyxLQUFLLElBQUksQ0FBQyxDQUFFLG9DQUFvQztJQUM3RixDQUFDOzs7O0lBRUQsSUFBSSxRQUFR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Ozs7Ozs7Ozs7SUFVcEUsZ0NBQW1EOzs7OztJQUtuRCw0QkFBNkI7Ozs7Ozs7Ozs7Ozs7OztJQWU3QixnQ0FBbUM7Ozs7Ozs7O0lBUW5DLGdDQUFrQzs7Ozs7OztJQU9sQyw4QkFBdUM7Ozs7Ozs7OztJQVN2QyxpQ0FBbUQ7O0lBRy9DLHNDQUEwQzs7SUFBNkIsZ0NBQXdDOztJQUMvRyw4QkFBdUI7O0lBQUUsa0NBQTRDOztJQUFFLGdDQUE0QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb250ZW50Q2hpbGQsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIGZvcndhcmRSZWYsXG4gIEluamVjdCxcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE91dHB1dCxcbiAgUXVlcnlMaXN0LFxuICBSZW5kZXJlcjIsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIE9wdGlvbmFsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7U3ViamVjdCwgU3Vic2NyaXB0aW9ufSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHtQbGFjZW1lbnQsIFBsYWNlbWVudEFycmF5LCBwb3NpdGlvbkVsZW1lbnRzfSBmcm9tICcuLi91dGlsL3Bvc2l0aW9uaW5nJztcbmltcG9ydCB7bmdiQXV0b0Nsb3NlfSBmcm9tICcuLi91dGlsL2F1dG9jbG9zZSc7XG5pbXBvcnQge0tleX0gZnJvbSAnLi4vdXRpbC9rZXknO1xuXG5pbXBvcnQge05nYkRyb3Bkb3duQ29uZmlnfSBmcm9tICcuL2Ryb3Bkb3duLWNvbmZpZyc7XG5cbkBEaXJlY3RpdmUoe3NlbGVjdG9yOiAnLm5hdmJhcid9KVxuZXhwb3J0IGNsYXNzIE5nYk5hdmJhciB7XG59XG5cbi8qKlxuICogQSBkaXJlY3RpdmUgeW91IHNob3VsZCBwdXQgcHV0IG9uIGEgZHJvcGRvd24gaXRlbSB0byBlbmFibGUga2V5Ym9hcmQgbmF2aWdhdGlvbi5cbiAqIEFycm93IGtleXMgd2lsbCBtb3ZlIGZvY3VzIGJldHdlZW4gaXRlbXMgbWFya2VkIHdpdGggdGhpcyBkaXJlY3RpdmUuXG4gKlxuICogQHNpbmNlIDQuMS4wXG4gKi9cbkBEaXJlY3RpdmUoe3NlbGVjdG9yOiAnW25nYkRyb3Bkb3duSXRlbV0nLCBob3N0OiB7J2NsYXNzJzogJ2Ryb3Bkb3duLWl0ZW0nLCAnW2NsYXNzLmRpc2FibGVkXSc6ICdkaXNhYmxlZCd9fSlcbmV4cG9ydCBjbGFzcyBOZ2JEcm9wZG93bkl0ZW0ge1xuICBwcml2YXRlIF9kaXNhYmxlZCA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpXG4gIHNldCBkaXNhYmxlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX2Rpc2FibGVkID0gPGFueT52YWx1ZSA9PT0gJycgfHwgdmFsdWUgPT09IHRydWU7ICAvLyBhY2NlcHQgYW4gZW1wdHkgYXR0cmlidXRlIGFzIHRydWVcbiAgfVxuXG4gIGdldCBkaXNhYmxlZCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2Rpc2FibGVkOyB9XG5cbiAgY29uc3RydWN0b3IocHVibGljIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+KSB7fVxufVxuXG4vKipcbiAqIEEgZGlyZWN0aXZlIHRoYXQgd3JhcHMgZHJvcGRvd24gbWVudSBjb250ZW50IGFuZCBkcm9wZG93biBpdGVtcy5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW25nYkRyb3Bkb3duTWVudV0nLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5kcm9wZG93bi1tZW51XSc6ICd0cnVlJyxcbiAgICAnW2NsYXNzLnNob3ddJzogJ2Ryb3Bkb3duLmlzT3BlbigpJyxcbiAgICAnW2F0dHIueC1wbGFjZW1lbnRdJzogJ3BsYWNlbWVudCcsXG4gICAgJyhrZXlkb3duLkFycm93VXApJzogJ2Ryb3Bkb3duLm9uS2V5RG93bigkZXZlbnQpJyxcbiAgICAnKGtleWRvd24uQXJyb3dEb3duKSc6ICdkcm9wZG93bi5vbktleURvd24oJGV2ZW50KScsXG4gICAgJyhrZXlkb3duLkhvbWUpJzogJ2Ryb3Bkb3duLm9uS2V5RG93bigkZXZlbnQpJyxcbiAgICAnKGtleWRvd24uRW5kKSc6ICdkcm9wZG93bi5vbktleURvd24oJGV2ZW50KScsXG4gICAgJyhrZXlkb3duLkVudGVyKSc6ICdkcm9wZG93bi5vbktleURvd24oJGV2ZW50KScsXG4gICAgJyhrZXlkb3duLlNwYWNlKSc6ICdkcm9wZG93bi5vbktleURvd24oJGV2ZW50KSdcbiAgfVxufSlcbmV4cG9ydCBjbGFzcyBOZ2JEcm9wZG93bk1lbnUge1xuICBwbGFjZW1lbnQ6IFBsYWNlbWVudCA9ICdib3R0b20nO1xuICBpc09wZW4gPSBmYWxzZTtcblxuICBAQ29udGVudENoaWxkcmVuKE5nYkRyb3Bkb3duSXRlbSkgbWVudUl0ZW1zOiBRdWVyeUxpc3Q8TmdiRHJvcGRvd25JdGVtPjtcblxuICBjb25zdHJ1Y3RvcihASW5qZWN0KGZvcndhcmRSZWYoKCkgPT4gTmdiRHJvcGRvd24pKSBwdWJsaWMgZHJvcGRvd246IE5nYkRyb3Bkb3duKSB7fVxufVxuXG4vKipcbiAqIEEgZGlyZWN0aXZlIHRvIG1hcmsgYW4gZWxlbWVudCB0byB3aGljaCBkcm9wZG93biBtZW51IHdpbGwgYmUgYW5jaG9yZWQuXG4gKlxuICogVGhpcyBpcyBhIHNpbXBsZSB2ZXJzaW9uIG9mIHRoZSBgTmdiRHJvcGRvd25Ub2dnbGVgIGRpcmVjdGl2ZS5cbiAqIEl0IHBsYXlzIHRoZSBzYW1lIHJvbGUsIGJ1dCBkb2Vzbid0IGxpc3RlbiB0byBjbGljayBldmVudHMgdG8gdG9nZ2xlIGRyb3Bkb3duIG1lbnUgdGh1cyBlbmFibGluZyBzdXBwb3J0XG4gKiBmb3IgZXZlbnRzIG90aGVyIHRoYW4gY2xpY2suXG4gKlxuICogQHNpbmNlIDEuMS4wXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tuZ2JEcm9wZG93bkFuY2hvcl0nLFxuICBob3N0OiB7J2NsYXNzJzogJ2Ryb3Bkb3duLXRvZ2dsZScsICdhcmlhLWhhc3BvcHVwJzogJ3RydWUnLCAnW2F0dHIuYXJpYS1leHBhbmRlZF0nOiAnZHJvcGRvd24uaXNPcGVuKCknfVxufSlcbmV4cG9ydCBjbGFzcyBOZ2JEcm9wZG93bkFuY2hvciB7XG4gIGFuY2hvckVsO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgQEluamVjdChmb3J3YXJkUmVmKCgpID0+IE5nYkRyb3Bkb3duKSkgcHVibGljIGRyb3Bkb3duOiBOZ2JEcm9wZG93bixcbiAgICAgIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+KSB7XG4gICAgdGhpcy5hbmNob3JFbCA9IF9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gIH1cblxuICBnZXROYXRpdmVFbGVtZW50KCkgeyByZXR1cm4gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50OyB9XG59XG5cbi8qKlxuICogQSBkaXJlY3RpdmUgdG8gbWFyayBhbiBlbGVtZW50IHRoYXQgd2lsbCB0b2dnbGUgZHJvcGRvd24gdmlhIHRoZSBgY2xpY2tgIGV2ZW50LlxuICpcbiAqIFlvdSBjYW4gYWxzbyB1c2UgYE5nYkRyb3Bkb3duQW5jaG9yYCBhcyBhbiBhbHRlcm5hdGl2ZS5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW25nYkRyb3Bkb3duVG9nZ2xlXScsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnZHJvcGRvd24tdG9nZ2xlJyxcbiAgICAnYXJpYS1oYXNwb3B1cCc6ICd0cnVlJyxcbiAgICAnW2F0dHIuYXJpYS1leHBhbmRlZF0nOiAnZHJvcGRvd24uaXNPcGVuKCknLFxuICAgICcoY2xpY2spJzogJ2Ryb3Bkb3duLnRvZ2dsZSgpJyxcbiAgICAnKGtleWRvd24uQXJyb3dVcCknOiAnZHJvcGRvd24ub25LZXlEb3duKCRldmVudCknLFxuICAgICcoa2V5ZG93bi5BcnJvd0Rvd24pJzogJ2Ryb3Bkb3duLm9uS2V5RG93bigkZXZlbnQpJyxcbiAgICAnKGtleWRvd24uSG9tZSknOiAnZHJvcGRvd24ub25LZXlEb3duKCRldmVudCknLFxuICAgICcoa2V5ZG93bi5FbmQpJzogJ2Ryb3Bkb3duLm9uS2V5RG93bigkZXZlbnQpJ1xuICB9LFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogTmdiRHJvcGRvd25BbmNob3IsIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE5nYkRyb3Bkb3duVG9nZ2xlKX1dXG59KVxuZXhwb3J0IGNsYXNzIE5nYkRyb3Bkb3duVG9nZ2xlIGV4dGVuZHMgTmdiRHJvcGRvd25BbmNob3Ige1xuICBjb25zdHJ1Y3RvcihASW5qZWN0KGZvcndhcmRSZWYoKCkgPT4gTmdiRHJvcGRvd24pKSBkcm9wZG93bjogTmdiRHJvcGRvd24sIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+KSB7XG4gICAgc3VwZXIoZHJvcGRvd24sIGVsZW1lbnRSZWYpO1xuICB9XG59XG5cbi8qKlxuICogQSBkaXJlY3RpdmUgdGhhdCBwcm92aWRlcyBjb250ZXh0dWFsIG92ZXJsYXlzIGZvciBkaXNwbGF5aW5nIGxpc3RzIG9mIGxpbmtzIGFuZCBtb3JlLlxuICovXG5ARGlyZWN0aXZlKHtzZWxlY3RvcjogJ1tuZ2JEcm9wZG93bl0nLCBleHBvcnRBczogJ25nYkRyb3Bkb3duJywgaG9zdDogeydbY2xhc3Muc2hvd10nOiAnaXNPcGVuKCknfX0pXG5leHBvcnQgY2xhc3MgTmdiRHJvcGRvd24gaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgX2Nsb3NlZCQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuICBwcml2YXRlIF96b25lU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gIHByaXZhdGUgX2JvZHlDb250YWluZXI6IEhUTUxFbGVtZW50O1xuXG4gIEBDb250ZW50Q2hpbGQoTmdiRHJvcGRvd25NZW51KSBwcml2YXRlIF9tZW51OiBOZ2JEcm9wZG93bk1lbnU7XG4gIEBDb250ZW50Q2hpbGQoTmdiRHJvcGRvd25NZW51LCB7cmVhZDogRWxlbWVudFJlZn0pIHByaXZhdGUgX21lbnVFbGVtZW50OiBFbGVtZW50UmVmO1xuXG4gIEBDb250ZW50Q2hpbGQoTmdiRHJvcGRvd25BbmNob3IpIHByaXZhdGUgX2FuY2hvcjogTmdiRHJvcGRvd25BbmNob3I7XG5cbiAgLyoqXG4gICAqIEluZGljYXRlcyB3aGV0aGVyIHRoZSBkcm9wZG93biBzaG91bGQgYmUgY2xvc2VkIHdoZW4gY2xpY2tpbmcgb25lIG9mIGRyb3Bkb3duIGl0ZW1zIG9yIHByZXNzaW5nIEVTQy5cbiAgICpcbiAgICogKiBgdHJ1ZWAgLSB0aGUgZHJvcGRvd24gd2lsbCBjbG9zZSBvbiBib3RoIG91dHNpZGUgYW5kIGluc2lkZSAobWVudSkgY2xpY2tzLlxuICAgKiAqIGBmYWxzZWAgLSB0aGUgZHJvcGRvd24gY2FuIG9ubHkgYmUgY2xvc2VkIG1hbnVhbGx5IHZpYSBgY2xvc2UoKWAgb3IgYHRvZ2dsZSgpYCBtZXRob2RzLlxuICAgKiAqIGBcImluc2lkZVwiYCAtIHRoZSBkcm9wZG93biB3aWxsIGNsb3NlIG9uIGluc2lkZSBtZW51IGNsaWNrcywgYnV0IG5vdCBvdXRzaWRlIGNsaWNrcy5cbiAgICogKiBgXCJvdXRzaWRlXCJgIC0gdGhlIGRyb3Bkb3duIHdpbGwgY2xvc2Ugb25seSBvbiB0aGUgb3V0c2lkZSBjbGlja3MgYW5kIG5vdCBvbiBtZW51IGNsaWNrcy5cbiAgICovXG4gIEBJbnB1dCgpIGF1dG9DbG9zZTogYm9vbGVhbiB8ICdvdXRzaWRlJyB8ICdpbnNpZGUnO1xuXG4gIC8qKlxuICAgKiBEZWZpbmVzIHdoZXRoZXIgb3Igbm90IHRoZSBkcm9wZG93biBtZW51IGlzIG9wZW5lZCBpbml0aWFsbHkuXG4gICAqL1xuICBASW5wdXQoJ29wZW4nKSBfb3BlbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBUaGUgcHJlZmVycmVkIHBsYWNlbWVudCBvZiB0aGUgZHJvcGRvd24uXG4gICAqXG4gICAqIFBvc3NpYmxlIHZhbHVlcyBhcmUgYFwidG9wXCJgLCBgXCJ0b3AtbGVmdFwiYCwgYFwidG9wLXJpZ2h0XCJgLCBgXCJib3R0b21cImAsIGBcImJvdHRvbS1sZWZ0XCJgLFxuICAgKiBgXCJib3R0b20tcmlnaHRcImAsIGBcImxlZnRcImAsIGBcImxlZnQtdG9wXCJgLCBgXCJsZWZ0LWJvdHRvbVwiYCwgYFwicmlnaHRcImAsIGBcInJpZ2h0LXRvcFwiYCxcbiAgICogYFwicmlnaHQtYm90dG9tXCJgXG4gICAqXG4gICAqIEFjY2VwdHMgYW4gYXJyYXkgb2Ygc3RyaW5ncyBvciBhIHN0cmluZyB3aXRoIHNwYWNlIHNlcGFyYXRlZCBwb3NzaWJsZSB2YWx1ZXMuXG4gICAqXG4gICAqIFRoZSBkZWZhdWx0IG9yZGVyIG9mIHByZWZlcmVuY2UgaXMgYFwiYm90dG9tLWxlZnQgYm90dG9tLXJpZ2h0IHRvcC1sZWZ0IHRvcC1yaWdodFwiYFxuICAgKlxuICAgKiBQbGVhc2Ugc2VlIHRoZSBbcG9zaXRpb25pbmcgb3ZlcnZpZXddKCMvcG9zaXRpb25pbmcpIGZvciBtb3JlIGRldGFpbHMuXG4gICAqL1xuICBASW5wdXQoKSBwbGFjZW1lbnQ6IFBsYWNlbWVudEFycmF5O1xuXG4gIC8qKlxuICAqIEEgc2VsZWN0b3Igc3BlY2lmeWluZyB0aGUgZWxlbWVudCB0aGUgZHJvcGRvd24gc2hvdWxkIGJlIGFwcGVuZGVkIHRvLlxuICAqIEN1cnJlbnRseSBvbmx5IHN1cHBvcnRzIFwiYm9keVwiLlxuICAqXG4gICogQHNpbmNlIDQuMS4wXG4gICovXG4gIEBJbnB1dCgpIGNvbnRhaW5lcjogbnVsbCB8ICdib2R5JztcblxuICAvKipcbiAgICogRW5hYmxlIG9yIGRpc2FibGUgdGhlIGR5bmFtaWMgcG9zaXRpb25pbmdcbiAgICpcbiAgICogQHNpbmNlIDQuMi4wXG4gICAqL1xuICBASW5wdXQoKSBkaXNwbGF5OiAnZHluYW1pYycgfCAnc3RhdGljJztcblxuICAvKipcbiAgICogQW4gZXZlbnQgZmlyZWQgd2hlbiB0aGUgZHJvcGRvd24gaXMgb3BlbmVkIG9yIGNsb3NlZC5cbiAgICpcbiAgICogVGhlIGV2ZW50IHBheWxvYWQgaXMgYSBgYm9vbGVhbmA6XG4gICAqICogYHRydWVgIC0gdGhlIGRyb3Bkb3duIHdhcyBvcGVuZWRcbiAgICogKiBgZmFsc2VgIC0gdGhlIGRyb3Bkb3duIHdhcyBjbG9zZWRcbiAgICovXG4gIEBPdXRwdXQoKSBvcGVuQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3I6IENoYW5nZURldGVjdG9yUmVmLCBjb25maWc6IE5nYkRyb3Bkb3duQ29uZmlnLCBASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIF9kb2N1bWVudDogYW55LFxuICAgICAgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUsIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LCBwcml2YXRlIF9yZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgICAgQE9wdGlvbmFsKCkgbmdiTmF2YmFyOiBOZ2JOYXZiYXIpIHtcbiAgICB0aGlzLnBsYWNlbWVudCA9IGNvbmZpZy5wbGFjZW1lbnQ7XG4gICAgdGhpcy5jb250YWluZXIgPSBjb25maWcuY29udGFpbmVyO1xuICAgIHRoaXMuYXV0b0Nsb3NlID0gY29uZmlnLmF1dG9DbG9zZTtcblxuICAgIHRoaXMuZGlzcGxheSA9IG5nYk5hdmJhciA/ICdzdGF0aWMnIDogJ2R5bmFtaWMnO1xuXG4gICAgdGhpcy5fem9uZVN1YnNjcmlwdGlvbiA9IF9uZ1pvbmUub25TdGFibGUuc3Vic2NyaWJlKCgpID0+IHsgdGhpcy5fcG9zaXRpb25NZW51KCk7IH0pO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5fYXBwbHlQbGFjZW1lbnRDbGFzc2VzKCk7XG4gICAgaWYgKHRoaXMuX29wZW4pIHtcbiAgICAgIHRoaXMuX3NldENsb3NlSGFuZGxlcnMoKTtcbiAgICB9XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKGNoYW5nZXMuY29udGFpbmVyICYmIHRoaXMuX29wZW4pIHtcbiAgICAgIHRoaXMuX2FwcGx5Q29udGFpbmVyKHRoaXMuY29udGFpbmVyKTtcbiAgICB9XG5cbiAgICBpZiAoY2hhbmdlcy5wbGFjZW1lbnQgJiYgIWNoYW5nZXMucGxhY2VtZW50LmlzRmlyc3RDaGFuZ2UpIHtcbiAgICAgIHRoaXMuX2FwcGx5UGxhY2VtZW50Q2xhc3NlcygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgdGhlIGRyb3Bkb3duIG1lbnUgaXMgb3Blbi5cbiAgICovXG4gIGlzT3BlbigpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX29wZW47IH1cblxuICAvKipcbiAgICogT3BlbnMgdGhlIGRyb3Bkb3duIG1lbnUuXG4gICAqL1xuICBvcGVuKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5fb3Blbikge1xuICAgICAgdGhpcy5fb3BlbiA9IHRydWU7XG4gICAgICB0aGlzLl9hcHBseUNvbnRhaW5lcih0aGlzLmNvbnRhaW5lcik7XG4gICAgICB0aGlzLm9wZW5DaGFuZ2UuZW1pdCh0cnVlKTtcbiAgICAgIHRoaXMuX3NldENsb3NlSGFuZGxlcnMoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9zZXRDbG9zZUhhbmRsZXJzKCkge1xuICAgIG5nYkF1dG9DbG9zZShcbiAgICAgICAgdGhpcy5fbmdab25lLCB0aGlzLl9kb2N1bWVudCwgdGhpcy5hdXRvQ2xvc2UsICgpID0+IHRoaXMuY2xvc2UoKSwgdGhpcy5fY2xvc2VkJCxcbiAgICAgICAgdGhpcy5fbWVudSA/IFt0aGlzLl9tZW51RWxlbWVudC5uYXRpdmVFbGVtZW50XSA6IFtdLCB0aGlzLl9hbmNob3IgPyBbdGhpcy5fYW5jaG9yLmdldE5hdGl2ZUVsZW1lbnQoKV0gOiBbXSxcbiAgICAgICAgJy5kcm9wZG93bi1pdGVtLC5kcm9wZG93bi1kaXZpZGVyJyk7XG4gIH1cblxuICAvKipcbiAgICogQ2xvc2VzIHRoZSBkcm9wZG93biBtZW51LlxuICAgKi9cbiAgY2xvc2UoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX29wZW4pIHtcbiAgICAgIHRoaXMuX29wZW4gPSBmYWxzZTtcbiAgICAgIHRoaXMuX3Jlc2V0Q29udGFpbmVyKCk7XG4gICAgICB0aGlzLl9jbG9zZWQkLm5leHQoKTtcbiAgICAgIHRoaXMub3BlbkNoYW5nZS5lbWl0KGZhbHNlKTtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUb2dnbGVzIHRoZSBkcm9wZG93biBtZW51LlxuICAgKi9cbiAgdG9nZ2xlKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmlzT3BlbigpKSB7XG4gICAgICB0aGlzLmNsb3NlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub3BlbigpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX3Jlc2V0Q29udGFpbmVyKCk7XG5cbiAgICB0aGlzLl9jbG9zZWQkLm5leHQoKTtcbiAgICB0aGlzLl96b25lU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICBvbktleURvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6ZGVwcmVjYXRpb25cbiAgICBjb25zdCBrZXkgPSBldmVudC53aGljaDtcbiAgICBjb25zdCBpdGVtRWxlbWVudHMgPSB0aGlzLl9nZXRNZW51RWxlbWVudHMoKTtcblxuICAgIGxldCBwb3NpdGlvbiA9IC0xO1xuICAgIGxldCBpc0V2ZW50RnJvbUl0ZW1zID0gZmFsc2U7XG4gICAgY29uc3QgaXNFdmVudEZyb21Ub2dnbGUgPSB0aGlzLl9pc0V2ZW50RnJvbVRvZ2dsZShldmVudCk7XG5cbiAgICBpZiAoIWlzRXZlbnRGcm9tVG9nZ2xlICYmIGl0ZW1FbGVtZW50cy5sZW5ndGgpIHtcbiAgICAgIGl0ZW1FbGVtZW50cy5mb3JFYWNoKChpdGVtRWxlbWVudCwgaW5kZXgpID0+IHtcbiAgICAgICAgaWYgKGl0ZW1FbGVtZW50LmNvbnRhaW5zKGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudCkpIHtcbiAgICAgICAgICBpc0V2ZW50RnJvbUl0ZW1zID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXRlbUVsZW1lbnQgPT09IHRoaXMuX2RvY3VtZW50LmFjdGl2ZUVsZW1lbnQpIHtcbiAgICAgICAgICBwb3NpdGlvbiA9IGluZGV4O1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBjbG9zaW5nIG9uIEVudGVyIC8gU3BhY2VcbiAgICBpZiAoa2V5ID09PSBLZXkuU3BhY2UgfHwga2V5ID09PSBLZXkuRW50ZXIpIHtcbiAgICAgIGlmIChpc0V2ZW50RnJvbUl0ZW1zICYmICh0aGlzLmF1dG9DbG9zZSA9PT0gdHJ1ZSB8fCB0aGlzLmF1dG9DbG9zZSA9PT0gJ2luc2lkZScpKSB7XG4gICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBvcGVuaW5nIC8gbmF2aWdhdGluZ1xuICAgIGlmIChpc0V2ZW50RnJvbVRvZ2dsZSB8fCBpc0V2ZW50RnJvbUl0ZW1zKSB7XG4gICAgICB0aGlzLm9wZW4oKTtcblxuICAgICAgaWYgKGl0ZW1FbGVtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgc3dpdGNoIChrZXkpIHtcbiAgICAgICAgICBjYXNlIEtleS5BcnJvd0Rvd246XG4gICAgICAgICAgICBwb3NpdGlvbiA9IE1hdGgubWluKHBvc2l0aW9uICsgMSwgaXRlbUVsZW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBLZXkuQXJyb3dVcDpcbiAgICAgICAgICAgIGlmICh0aGlzLl9pc0Ryb3B1cCgpICYmIHBvc2l0aW9uID09PSAtMSkge1xuICAgICAgICAgICAgICBwb3NpdGlvbiA9IGl0ZW1FbGVtZW50cy5sZW5ndGggLSAxO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBvc2l0aW9uID0gTWF0aC5tYXgocG9zaXRpb24gLSAxLCAwKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgS2V5LkhvbWU6XG4gICAgICAgICAgICBwb3NpdGlvbiA9IDA7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIEtleS5FbmQ6XG4gICAgICAgICAgICBwb3NpdGlvbiA9IGl0ZW1FbGVtZW50cy5sZW5ndGggLSAxO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaXRlbUVsZW1lbnRzW3Bvc2l0aW9uXS5mb2N1cygpO1xuICAgICAgfVxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9pc0Ryb3B1cCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2Ryb3B1cCcpOyB9XG5cbiAgcHJpdmF0ZSBfaXNFdmVudEZyb21Ub2dnbGUoZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICByZXR1cm4gdGhpcy5fYW5jaG9yLmdldE5hdGl2ZUVsZW1lbnQoKS5jb250YWlucyhldmVudC50YXJnZXQgYXMgSFRNTEVsZW1lbnQpO1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0TWVudUVsZW1lbnRzKCk6IEhUTUxFbGVtZW50W10ge1xuICAgIGlmICh0aGlzLl9tZW51ID09IG51bGwpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX21lbnUubWVudUl0ZW1zLmZpbHRlcihpdGVtID0+ICFpdGVtLmRpc2FibGVkKS5tYXAoaXRlbSA9PiBpdGVtLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCk7XG4gIH1cblxuICBwcml2YXRlIF9wb3NpdGlvbk1lbnUoKSB7XG4gICAgaWYgKHRoaXMuaXNPcGVuKCkgJiYgdGhpcy5fbWVudSkge1xuICAgICAgdGhpcy5fYXBwbHlQbGFjZW1lbnRDbGFzc2VzKFxuICAgICAgICAgIHRoaXMuZGlzcGxheSA9PT0gJ2R5bmFtaWMnID9cbiAgICAgICAgICAgICAgcG9zaXRpb25FbGVtZW50cyhcbiAgICAgICAgICAgICAgICAgIHRoaXMuX2FuY2hvci5hbmNob3JFbCwgdGhpcy5fYm9keUNvbnRhaW5lciB8fCB0aGlzLl9tZW51RWxlbWVudC5uYXRpdmVFbGVtZW50LCB0aGlzLnBsYWNlbWVudCxcbiAgICAgICAgICAgICAgICAgIHRoaXMuY29udGFpbmVyID09PSAnYm9keScpIDpcbiAgICAgICAgICAgICAgdGhpcy5fZ2V0Rmlyc3RQbGFjZW1lbnQodGhpcy5wbGFjZW1lbnQpKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9nZXRGaXJzdFBsYWNlbWVudChwbGFjZW1lbnQ6IFBsYWNlbWVudEFycmF5KTogUGxhY2VtZW50IHtcbiAgICByZXR1cm4gQXJyYXkuaXNBcnJheShwbGFjZW1lbnQpID8gcGxhY2VtZW50WzBdIDogcGxhY2VtZW50LnNwbGl0KCcgJylbMF0gYXMgUGxhY2VtZW50O1xuICB9XG5cbiAgcHJpdmF0ZSBfcmVzZXRDb250YWluZXIoKSB7XG4gICAgY29uc3QgcmVuZGVyZXIgPSB0aGlzLl9yZW5kZXJlcjtcbiAgICBpZiAodGhpcy5fbWVudUVsZW1lbnQpIHtcbiAgICAgIGNvbnN0IGRyb3Bkb3duRWxlbWVudCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICAgIGNvbnN0IGRyb3Bkb3duTWVudUVsZW1lbnQgPSB0aGlzLl9tZW51RWxlbWVudC5uYXRpdmVFbGVtZW50O1xuXG4gICAgICByZW5kZXJlci5hcHBlbmRDaGlsZChkcm9wZG93bkVsZW1lbnQsIGRyb3Bkb3duTWVudUVsZW1lbnQpO1xuICAgICAgcmVuZGVyZXIucmVtb3ZlU3R5bGUoZHJvcGRvd25NZW51RWxlbWVudCwgJ3Bvc2l0aW9uJyk7XG4gICAgICByZW5kZXJlci5yZW1vdmVTdHlsZShkcm9wZG93bk1lbnVFbGVtZW50LCAndHJhbnNmb3JtJyk7XG4gICAgfVxuICAgIGlmICh0aGlzLl9ib2R5Q29udGFpbmVyKSB7XG4gICAgICByZW5kZXJlci5yZW1vdmVDaGlsZCh0aGlzLl9kb2N1bWVudC5ib2R5LCB0aGlzLl9ib2R5Q29udGFpbmVyKTtcbiAgICAgIHRoaXMuX2JvZHlDb250YWluZXIgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2FwcGx5Q29udGFpbmVyKGNvbnRhaW5lcjogbnVsbCB8ICdib2R5JyA9IG51bGwpIHtcbiAgICB0aGlzLl9yZXNldENvbnRhaW5lcigpO1xuICAgIGlmIChjb250YWluZXIgPT09ICdib2R5Jykge1xuICAgICAgY29uc3QgcmVuZGVyZXIgPSB0aGlzLl9yZW5kZXJlcjtcbiAgICAgIGNvbnN0IGRyb3Bkb3duTWVudUVsZW1lbnQgPSB0aGlzLl9tZW51RWxlbWVudC5uYXRpdmVFbGVtZW50O1xuICAgICAgY29uc3QgYm9keUNvbnRhaW5lciA9IHRoaXMuX2JvZHlDb250YWluZXIgPSB0aGlzLl9ib2R5Q29udGFpbmVyIHx8IHJlbmRlcmVyLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG4gICAgICAvLyBPdmVycmlkZSBzb21lIHN0eWxlcyB0byBoYXZlIHRoZSBwb3NpdGlvbm5pbmcgd29ya2luZ1xuICAgICAgcmVuZGVyZXIuc2V0U3R5bGUoYm9keUNvbnRhaW5lciwgJ3Bvc2l0aW9uJywgJ2Fic29sdXRlJyk7XG4gICAgICByZW5kZXJlci5zZXRTdHlsZShkcm9wZG93bk1lbnVFbGVtZW50LCAncG9zaXRpb24nLCAnc3RhdGljJyk7XG4gICAgICByZW5kZXJlci5zZXRTdHlsZShib2R5Q29udGFpbmVyLCAnei1pbmRleCcsICcxMDUwJyk7XG5cbiAgICAgIHJlbmRlcmVyLmFwcGVuZENoaWxkKGJvZHlDb250YWluZXIsIGRyb3Bkb3duTWVudUVsZW1lbnQpO1xuICAgICAgcmVuZGVyZXIuYXBwZW5kQ2hpbGQodGhpcy5fZG9jdW1lbnQuYm9keSwgYm9keUNvbnRhaW5lcik7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfYXBwbHlQbGFjZW1lbnRDbGFzc2VzKHBsYWNlbWVudD86IFBsYWNlbWVudCkge1xuICAgIGlmICh0aGlzLl9tZW51KSB7XG4gICAgICBpZiAoIXBsYWNlbWVudCkge1xuICAgICAgICBwbGFjZW1lbnQgPSB0aGlzLl9nZXRGaXJzdFBsYWNlbWVudCh0aGlzLnBsYWNlbWVudCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJlbmRlcmVyID0gdGhpcy5fcmVuZGVyZXI7XG4gICAgICBjb25zdCBkcm9wZG93bkVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG5cbiAgICAgIC8vIHJlbW92ZSB0aGUgY3VycmVudCBwbGFjZW1lbnQgY2xhc3Nlc1xuICAgICAgcmVuZGVyZXIucmVtb3ZlQ2xhc3MoZHJvcGRvd25FbGVtZW50LCAnZHJvcHVwJyk7XG4gICAgICByZW5kZXJlci5yZW1vdmVDbGFzcyhkcm9wZG93bkVsZW1lbnQsICdkcm9wZG93bicpO1xuICAgICAgdGhpcy5fbWVudS5wbGFjZW1lbnQgPSBwbGFjZW1lbnQ7XG5cbiAgICAgIC8qXG4gICAgICAqIGFwcGx5IHRoZSBuZXcgcGxhY2VtZW50XG4gICAgICAqIGluIGNhc2Ugb2YgdG9wIHVzZSB1cC1hcnJvdyBvciBkb3duLWFycm93IG90aGVyd2lzZVxuICAgICAgKi9cbiAgICAgIGNvbnN0IGRyb3Bkb3duQ2xhc3MgPSBwbGFjZW1lbnQuc2VhcmNoKCdedG9wJykgIT09IC0xID8gJ2Ryb3B1cCcgOiAnZHJvcGRvd24nO1xuICAgICAgcmVuZGVyZXIuYWRkQ2xhc3MoZHJvcGRvd25FbGVtZW50LCBkcm9wZG93bkNsYXNzKTtcblxuICAgICAgY29uc3QgYm9keUNvbnRhaW5lciA9IHRoaXMuX2JvZHlDb250YWluZXI7XG4gICAgICBpZiAoYm9keUNvbnRhaW5lcikge1xuICAgICAgICByZW5kZXJlci5yZW1vdmVDbGFzcyhib2R5Q29udGFpbmVyLCAnZHJvcHVwJyk7XG4gICAgICAgIHJlbmRlcmVyLnJlbW92ZUNsYXNzKGJvZHlDb250YWluZXIsICdkcm9wZG93bicpO1xuICAgICAgICByZW5kZXJlci5hZGRDbGFzcyhib2R5Q29udGFpbmVyLCBkcm9wZG93bkNsYXNzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==