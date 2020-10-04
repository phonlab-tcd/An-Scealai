/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { ChangeDetectorRef, ComponentFactoryResolver, Directive, ElementRef, EventEmitter, forwardRef, Inject, Injector, Input, NgZone, Output, Renderer2, TemplateRef, ViewContainerRef, ApplicationRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject, fromEvent, Subject } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Live } from '../util/accessibility/live';
import { ngbAutoClose } from '../util/autoclose';
import { Key } from '../util/key';
import { PopupService } from '../util/popup';
import { positionElements } from '../util/positioning';
import { isDefined, toString } from '../util/util';
import { NgbTypeaheadConfig } from './typeahead-config';
import { NgbTypeaheadWindow } from './typeahead-window';
/** @type {?} */
var NGB_TYPEAHEAD_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(function () { return NgbTypeahead; }),
    multi: true
};
/**
 * An event emitted right before an item is selected from the result list.
 * @record
 */
export function NgbTypeaheadSelectItemEvent() { }
if (false) {
    /**
     * The item from the result list about to be selected.
     * @type {?}
     */
    NgbTypeaheadSelectItemEvent.prototype.item;
    /**
     * Calling this function will prevent item selection from happening.
     * @type {?}
     */
    NgbTypeaheadSelectItemEvent.prototype.preventDefault;
}
/** @type {?} */
var nextWindowId = 0;
/**
 * A directive providing a simple way of creating powerful typeaheads from any text input.
 */
var NgbTypeahead = /** @class */ (function () {
    function NgbTypeahead(_elementRef, _viewContainerRef, _renderer, _injector, componentFactoryResolver, config, ngZone, _live, _document, _ngZone, _changeDetector, _applicationRef) {
        var _this = this;
        this._elementRef = _elementRef;
        this._viewContainerRef = _viewContainerRef;
        this._renderer = _renderer;
        this._injector = _injector;
        this._live = _live;
        this._document = _document;
        this._ngZone = _ngZone;
        this._changeDetector = _changeDetector;
        this._applicationRef = _applicationRef;
        this._closed$ = new Subject();
        /**
         * The value for the `autocomplete` attribute for the `<input>` element.
         *
         * Defaults to `"off"` to disable the native browser autocomplete, but you can override it if necessary.
         *
         * \@since 2.1.0
         */
        this.autocomplete = 'off';
        /**
         * The preferred placement of the typeahead.
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
         */
        this.placement = 'bottom-left';
        /**
         * An event emitted right before an item is selected from the result list.
         *
         * Event payload is of type [`NgbTypeaheadSelectItemEvent`](#/components/typeahead/api#NgbTypeaheadSelectItemEvent).
         */
        this.selectItem = new EventEmitter();
        this.popupId = "ngb-typeahead-" + nextWindowId++;
        this._onTouched = function () { };
        this._onChange = function (_) { };
        this.container = config.container;
        this.editable = config.editable;
        this.focusFirst = config.focusFirst;
        this.showHint = config.showHint;
        this.placement = config.placement;
        this._valueChanges = fromEvent(_elementRef.nativeElement, 'input')
            .pipe(map(function ($event) { return ((/** @type {?} */ ($event.target))).value; }));
        this._resubscribeTypeahead = new BehaviorSubject(null);
        this._popupService = new PopupService(NgbTypeaheadWindow, _injector, _viewContainerRef, _renderer, componentFactoryResolver, _applicationRef);
        this._zoneSubscription = ngZone.onStable.subscribe(function () {
            if (_this.isPopupOpen()) {
                positionElements(_this._elementRef.nativeElement, _this._windowRef.location.nativeElement, _this.placement, _this.container === 'body');
            }
        });
    }
    /**
     * @return {?}
     */
    NgbTypeahead.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        /** @type {?} */
        var inputValues$ = this._valueChanges.pipe(tap(function (value) {
            _this._inputValueBackup = _this.showHint ? value : null;
            if (_this.editable) {
                _this._onChange(value);
            }
        }));
        /** @type {?} */
        var results$ = inputValues$.pipe(this.ngbTypeahead);
        /** @type {?} */
        var processedResults$ = results$.pipe(tap(function () {
            if (!_this.editable) {
                _this._onChange(undefined);
            }
        }));
        /** @type {?} */
        var userInput$ = this._resubscribeTypeahead.pipe(switchMap(function () { return processedResults$; }));
        this._subscription = this._subscribeToUserInput(userInput$);
    };
    /**
     * @return {?}
     */
    NgbTypeahead.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this._closePopup();
        this._unsubscribeFromUserInput();
        this._zoneSubscription.unsubscribe();
    };
    /**
     * @param {?} fn
     * @return {?}
     */
    NgbTypeahead.prototype.registerOnChange = /**
     * @param {?} fn
     * @return {?}
     */
    function (fn) { this._onChange = fn; };
    /**
     * @param {?} fn
     * @return {?}
     */
    NgbTypeahead.prototype.registerOnTouched = /**
     * @param {?} fn
     * @return {?}
     */
    function (fn) { this._onTouched = fn; };
    /**
     * @param {?} value
     * @return {?}
     */
    NgbTypeahead.prototype.writeValue = /**
     * @param {?} value
     * @return {?}
     */
    function (value) {
        this._writeInputValue(this._formatItemForInput(value));
        if (this.showHint) {
            this._inputValueBackup = value;
        }
    };
    /**
     * @param {?} isDisabled
     * @return {?}
     */
    NgbTypeahead.prototype.setDisabledState = /**
     * @param {?} isDisabled
     * @return {?}
     */
    function (isDisabled) {
        this._renderer.setProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
    };
    /**
     * Dismisses typeahead popup window
     */
    /**
     * Dismisses typeahead popup window
     * @return {?}
     */
    NgbTypeahead.prototype.dismissPopup = /**
     * Dismisses typeahead popup window
     * @return {?}
     */
    function () {
        if (this.isPopupOpen()) {
            this._resubscribeTypeahead.next(null);
            this._closePopup();
            if (this.showHint && this._inputValueBackup !== null) {
                this._writeInputValue(this._inputValueBackup);
            }
            this._changeDetector.markForCheck();
        }
    };
    /**
     * Returns true if the typeahead popup window is displayed
     */
    /**
     * Returns true if the typeahead popup window is displayed
     * @return {?}
     */
    NgbTypeahead.prototype.isPopupOpen = /**
     * Returns true if the typeahead popup window is displayed
     * @return {?}
     */
    function () { return this._windowRef != null; };
    /**
     * @return {?}
     */
    NgbTypeahead.prototype.handleBlur = /**
     * @return {?}
     */
    function () {
        this._resubscribeTypeahead.next(null);
        this._onTouched();
    };
    /**
     * @param {?} event
     * @return {?}
     */
    NgbTypeahead.prototype.handleKeyDown = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        if (!this.isPopupOpen()) {
            return;
        }
        // tslint:disable-next-line:deprecation
        switch (event.which) {
            case Key.ArrowDown:
                event.preventDefault();
                this._windowRef.instance.next();
                this._showHint();
                break;
            case Key.ArrowUp:
                event.preventDefault();
                this._windowRef.instance.prev();
                this._showHint();
                break;
            case Key.Enter:
            case Key.Tab:
                /** @type {?} */
                var result = this._windowRef.instance.getActive();
                if (isDefined(result)) {
                    event.preventDefault();
                    event.stopPropagation();
                    this._selectResult(result);
                }
                this._closePopup();
                break;
        }
    };
    /**
     * @return {?}
     */
    NgbTypeahead.prototype._openPopup = /**
     * @return {?}
     */
    function () {
        var _this = this;
        if (!this.isPopupOpen()) {
            this._inputValueBackup = this._elementRef.nativeElement.value;
            this._windowRef = this._popupService.open();
            this._windowRef.instance.id = this.popupId;
            this._windowRef.instance.selectEvent.subscribe(function (result) { return _this._selectResultClosePopup(result); });
            this._windowRef.instance.activeChangeEvent.subscribe(function (activeId) { return _this.activeDescendant = activeId; });
            if (this.container === 'body') {
                window.document.querySelector(this.container).appendChild(this._windowRef.location.nativeElement);
            }
            this._changeDetector.markForCheck();
            ngbAutoClose(this._ngZone, this._document, 'outside', function () { return _this.dismissPopup(); }, this._closed$, [this._elementRef.nativeElement, this._windowRef.location.nativeElement]);
        }
    };
    /**
     * @return {?}
     */
    NgbTypeahead.prototype._closePopup = /**
     * @return {?}
     */
    function () {
        this._closed$.next();
        this._popupService.close();
        this._windowRef = null;
        this.activeDescendant = undefined;
    };
    /**
     * @param {?} result
     * @return {?}
     */
    NgbTypeahead.prototype._selectResult = /**
     * @param {?} result
     * @return {?}
     */
    function (result) {
        /** @type {?} */
        var defaultPrevented = false;
        this.selectItem.emit({ item: result, preventDefault: function () { defaultPrevented = true; } });
        this._resubscribeTypeahead.next(null);
        if (!defaultPrevented) {
            this.writeValue(result);
            this._onChange(result);
        }
    };
    /**
     * @param {?} result
     * @return {?}
     */
    NgbTypeahead.prototype._selectResultClosePopup = /**
     * @param {?} result
     * @return {?}
     */
    function (result) {
        this._selectResult(result);
        this._closePopup();
    };
    /**
     * @return {?}
     */
    NgbTypeahead.prototype._showHint = /**
     * @return {?}
     */
    function () {
        if (this.showHint && this._windowRef.instance.hasActive() && this._inputValueBackup != null) {
            /** @type {?} */
            var userInputLowerCase = this._inputValueBackup.toLowerCase();
            /** @type {?} */
            var formattedVal = this._formatItemForInput(this._windowRef.instance.getActive());
            if (userInputLowerCase === formattedVal.substr(0, this._inputValueBackup.length).toLowerCase()) {
                this._writeInputValue(this._inputValueBackup + formattedVal.substr(this._inputValueBackup.length));
                this._elementRef.nativeElement['setSelectionRange'].apply(this._elementRef.nativeElement, [this._inputValueBackup.length, formattedVal.length]);
            }
            else {
                this._writeInputValue(formattedVal);
            }
        }
    };
    /**
     * @param {?} item
     * @return {?}
     */
    NgbTypeahead.prototype._formatItemForInput = /**
     * @param {?} item
     * @return {?}
     */
    function (item) {
        return item != null && this.inputFormatter ? this.inputFormatter(item) : toString(item);
    };
    /**
     * @param {?} value
     * @return {?}
     */
    NgbTypeahead.prototype._writeInputValue = /**
     * @param {?} value
     * @return {?}
     */
    function (value) {
        this._renderer.setProperty(this._elementRef.nativeElement, 'value', toString(value));
    };
    /**
     * @param {?} userInput$
     * @return {?}
     */
    NgbTypeahead.prototype._subscribeToUserInput = /**
     * @param {?} userInput$
     * @return {?}
     */
    function (userInput$) {
        var _this = this;
        return userInput$.subscribe(function (results) {
            if (!results || results.length === 0) {
                _this._closePopup();
            }
            else {
                _this._openPopup();
                _this._windowRef.instance.focusFirst = _this.focusFirst;
                _this._windowRef.instance.results = results;
                _this._windowRef.instance.term = _this._elementRef.nativeElement.value;
                if (_this.resultFormatter) {
                    _this._windowRef.instance.formatter = _this.resultFormatter;
                }
                if (_this.resultTemplate) {
                    _this._windowRef.instance.resultTemplate = _this.resultTemplate;
                }
                _this._windowRef.instance.resetActive();
                // The observable stream we are subscribing to might have async steps
                // and if a component containing typeahead is using the OnPush strategy
                // the change detection turn wouldn't be invoked automatically.
                _this._windowRef.changeDetectorRef.detectChanges();
                _this._showHint();
            }
            // live announcer
            /** @type {?} */
            var count = results ? results.length : 0;
            _this._live.say(count === 0 ? 'No results available' : count + " result" + (count === 1 ? '' : 's') + " available");
        });
    };
    /**
     * @return {?}
     */
    NgbTypeahead.prototype._unsubscribeFromUserInput = /**
     * @return {?}
     */
    function () {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
        this._subscription = null;
    };
    NgbTypeahead.decorators = [
        { type: Directive, args: [{
                    selector: 'input[ngbTypeahead]',
                    exportAs: 'ngbTypeahead',
                    host: {
                        '(blur)': 'handleBlur()',
                        '[class.open]': 'isPopupOpen()',
                        '(keydown)': 'handleKeyDown($event)',
                        '[autocomplete]': 'autocomplete',
                        'autocapitalize': 'off',
                        'autocorrect': 'off',
                        'role': 'combobox',
                        'aria-multiline': 'false',
                        '[attr.aria-autocomplete]': 'showHint ? "both" : "list"',
                        '[attr.aria-activedescendant]': 'activeDescendant',
                        '[attr.aria-owns]': 'isPopupOpen() ? popupId : null',
                        '[attr.aria-expanded]': 'isPopupOpen()'
                    },
                    providers: [NGB_TYPEAHEAD_VALUE_ACCESSOR]
                },] }
    ];
    /** @nocollapse */
    NgbTypeahead.ctorParameters = function () { return [
        { type: ElementRef },
        { type: ViewContainerRef },
        { type: Renderer2 },
        { type: Injector },
        { type: ComponentFactoryResolver },
        { type: NgbTypeaheadConfig },
        { type: NgZone },
        { type: Live },
        { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] },
        { type: NgZone },
        { type: ChangeDetectorRef },
        { type: ApplicationRef }
    ]; };
    NgbTypeahead.propDecorators = {
        autocomplete: [{ type: Input }],
        container: [{ type: Input }],
        editable: [{ type: Input }],
        focusFirst: [{ type: Input }],
        inputFormatter: [{ type: Input }],
        ngbTypeahead: [{ type: Input }],
        resultFormatter: [{ type: Input }],
        resultTemplate: [{ type: Input }],
        showHint: [{ type: Input }],
        placement: [{ type: Input }],
        selectItem: [{ type: Output }]
    };
    return NgbTypeahead;
}());
export { NgbTypeahead };
if (false) {
    /** @type {?} */
    NgbTypeahead.prototype._popupService;
    /** @type {?} */
    NgbTypeahead.prototype._subscription;
    /** @type {?} */
    NgbTypeahead.prototype._closed$;
    /** @type {?} */
    NgbTypeahead.prototype._inputValueBackup;
    /** @type {?} */
    NgbTypeahead.prototype._valueChanges;
    /** @type {?} */
    NgbTypeahead.prototype._resubscribeTypeahead;
    /** @type {?} */
    NgbTypeahead.prototype._windowRef;
    /** @type {?} */
    NgbTypeahead.prototype._zoneSubscription;
    /**
     * The value for the `autocomplete` attribute for the `<input>` element.
     *
     * Defaults to `"off"` to disable the native browser autocomplete, but you can override it if necessary.
     *
     * \@since 2.1.0
     * @type {?}
     */
    NgbTypeahead.prototype.autocomplete;
    /**
     * A selector specifying the element the typeahead popup will be appended to.
     *
     * Currently only supports `"body"`.
     * @type {?}
     */
    NgbTypeahead.prototype.container;
    /**
     * If `true`, model values will not be restricted only to items selected from the popup.
     * @type {?}
     */
    NgbTypeahead.prototype.editable;
    /**
     * If `true`, the first item in the result list will always stay focused while typing.
     * @type {?}
     */
    NgbTypeahead.prototype.focusFirst;
    /**
     * The function that converts an item from the result list to a `string` to display in the `<input>` field.
     *
     * It is called when the user selects something in the popup or the model value changes, so the input needs to
     * be updated.
     * @type {?}
     */
    NgbTypeahead.prototype.inputFormatter;
    /**
     * The function that converts a stream of text values from the `<input>` element to the stream of the array of items
     * to display in the typeahead popup.
     *
     * If the resulting observable emits a non-empty array - the popup will be shown. If it emits an empty array - the
     * popup will be closed.
     *
     * See the [basic example](#/components/typeahead/examples#basic) for more details.
     *
     * Note that the `this` argument is `undefined` so you need to explicitly bind it to a desired "this" target.
     * @type {?}
     */
    NgbTypeahead.prototype.ngbTypeahead;
    /**
     * The function that converts an item from the result list to a `string` to display in the popup.
     *
     * Must be provided, if your `ngbTypeahead` returns something other than `Observable<string[]>`.
     *
     * Alternatively for more complex markup in the popup you should use `resultTemplate`.
     * @type {?}
     */
    NgbTypeahead.prototype.resultFormatter;
    /**
     * The template to override the way resulting items are displayed in the popup.
     *
     * See the [ResultTemplateContext](#/components/typeahead/api#ResultTemplateContext) for the template context.
     *
     * Also see the [template for results demo](#/components/typeahead/examples#template) for more details.
     * @type {?}
     */
    NgbTypeahead.prototype.resultTemplate;
    /**
     * If `true`, will show the hint in the `<input>` when an item in the result list matches.
     * @type {?}
     */
    NgbTypeahead.prototype.showHint;
    /**
     * The preferred placement of the typeahead.
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
    NgbTypeahead.prototype.placement;
    /**
     * An event emitted right before an item is selected from the result list.
     *
     * Event payload is of type [`NgbTypeaheadSelectItemEvent`](#/components/typeahead/api#NgbTypeaheadSelectItemEvent).
     * @type {?}
     */
    NgbTypeahead.prototype.selectItem;
    /** @type {?} */
    NgbTypeahead.prototype.activeDescendant;
    /** @type {?} */
    NgbTypeahead.prototype.popupId;
    /** @type {?} */
    NgbTypeahead.prototype._onTouched;
    /** @type {?} */
    NgbTypeahead.prototype._onChange;
    /** @type {?} */
    NgbTypeahead.prototype._elementRef;
    /** @type {?} */
    NgbTypeahead.prototype._viewContainerRef;
    /** @type {?} */
    NgbTypeahead.prototype._renderer;
    /** @type {?} */
    NgbTypeahead.prototype._injector;
    /** @type {?} */
    NgbTypeahead.prototype._live;
    /** @type {?} */
    NgbTypeahead.prototype._document;
    /** @type {?} */
    NgbTypeahead.prototype._ngZone;
    /** @type {?} */
    NgbTypeahead.prototype._changeDetector;
    /** @type {?} */
    NgbTypeahead.prototype._applicationRef;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZWFoZWFkLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvIiwic291cmNlcyI6WyJ0eXBlYWhlYWQvdHlwZWFoZWFkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQ0wsaUJBQWlCLEVBQ2pCLHdCQUF3QixFQUV4QixTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFDWixVQUFVLEVBQ1YsTUFBTSxFQUNOLFFBQVEsRUFDUixLQUFLLEVBQ0wsTUFBTSxFQUdOLE1BQU0sRUFDTixTQUFTLEVBQ1QsV0FBVyxFQUNYLGdCQUFnQixFQUNoQixjQUFjLEVBQ2YsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUF1QixpQkFBaUIsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ3ZFLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QyxPQUFPLEVBQUMsZUFBZSxFQUFFLFNBQVMsRUFBYyxPQUFPLEVBQWUsTUFBTSxNQUFNLENBQUM7QUFDbkYsT0FBTyxFQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFbkQsT0FBTyxFQUFDLElBQUksRUFBQyxNQUFNLDRCQUE0QixDQUFDO0FBQ2hELE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUMvQyxPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQ2hDLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFpQixnQkFBZ0IsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ3JFLE9BQU8sRUFBQyxTQUFTLEVBQUUsUUFBUSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBRWpELE9BQU8sRUFBQyxrQkFBa0IsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQ3RELE9BQU8sRUFBQyxrQkFBa0IsRUFBd0IsTUFBTSxvQkFBb0Is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QUV2QixxQ0FBd0Q7O0lBQ3hELHFDQUFvQzs7SUFDcEMsZ0NBQWlDOztJQUNqQyx5Q0FBa0M7O0lBQ2xDLHFDQUEwQzs7SUFDMUMsNkNBQW9EOztJQUNwRCxrQ0FBcUQ7O0lBQ3JELHlDQUErQjs7Ozs7Ozs7O0lBUy9CLG9DQUE4Qjs7Ozs7OztJQU85QixpQ0FBMkI7Ozs7O0lBSzNCLGdDQUEyQjs7Ozs7SUFLM0Isa0NBQTZCOzs7Ozs7OztJQVE3QixzQ0FBK0M7Ozs7Ozs7Ozs7Ozs7SUFhL0Msb0NBQXVFOzs7Ozs7Ozs7SUFTdkUsdUNBQWdEOzs7Ozs7Ozs7SUFTaEQsc0NBQTREOzs7OztJQUs1RCxnQ0FBMkI7Ozs7Ozs7Ozs7Ozs7OztJQWUzQixpQ0FBbUQ7Ozs7Ozs7SUFPbkQsa0NBQXVFOztJQUV2RSx3Q0FBeUI7O0lBQ3pCLCtCQUE0Qzs7SUFFNUMsa0NBQThCOztJQUM5QixpQ0FBbUM7O0lBRy9CLG1DQUFpRDs7SUFBRSx5Q0FBMkM7O0lBQzlGLGlDQUE0Qjs7SUFBRSxpQ0FBMkI7O0lBQ2IsNkJBQW1COztJQUFFLGlDQUF3Qzs7SUFDekcsK0JBQXVCOztJQUFFLHVDQUEwQzs7SUFBRSx1Q0FBdUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxuICBDb21wb25lbnRSZWYsXG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBmb3J3YXJkUmVmLFxuICBJbmplY3QsXG4gIEluamVjdG9yLFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3V0cHV0LFxuICBSZW5kZXJlcjIsXG4gIFRlbXBsYXRlUmVmLFxuICBWaWV3Q29udGFpbmVyUmVmLFxuICBBcHBsaWNhdGlvblJlZlxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q29udHJvbFZhbHVlQWNjZXNzb3IsIE5HX1ZBTFVFX0FDQ0VTU09SfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge0RPQ1VNRU5UfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtCZWhhdmlvclN1YmplY3QsIGZyb21FdmVudCwgT2JzZXJ2YWJsZSwgU3ViamVjdCwgU3Vic2NyaXB0aW9ufSBmcm9tICdyeGpzJztcbmltcG9ydCB7bWFwLCBzd2l0Y2hNYXAsIHRhcH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQge0xpdmV9IGZyb20gJy4uL3V0aWwvYWNjZXNzaWJpbGl0eS9saXZlJztcbmltcG9ydCB7bmdiQXV0b0Nsb3NlfSBmcm9tICcuLi91dGlsL2F1dG9jbG9zZSc7XG5pbXBvcnQge0tleX0gZnJvbSAnLi4vdXRpbC9rZXknO1xuaW1wb3J0IHtQb3B1cFNlcnZpY2V9IGZyb20gJy4uL3V0aWwvcG9wdXAnO1xuaW1wb3J0IHtQbGFjZW1lbnRBcnJheSwgcG9zaXRpb25FbGVtZW50c30gZnJvbSAnLi4vdXRpbC9wb3NpdGlvbmluZyc7XG5pbXBvcnQge2lzRGVmaW5lZCwgdG9TdHJpbmd9IGZyb20gJy4uL3V0aWwvdXRpbCc7XG5cbmltcG9ydCB7TmdiVHlwZWFoZWFkQ29uZmlnfSBmcm9tICcuL3R5cGVhaGVhZC1jb25maWcnO1xuaW1wb3J0IHtOZ2JUeXBlYWhlYWRXaW5kb3csIFJlc3VsdFRlbXBsYXRlQ29udGV4dH0gZnJvbSAnLi90eXBlYWhlYWQtd2luZG93JztcblxuXG5jb25zdCBOR0JfVFlQRUFIRUFEX1ZBTFVFX0FDQ0VTU09SID0ge1xuICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTmdiVHlwZWFoZWFkKSxcbiAgbXVsdGk6IHRydWVcbn07XG5cbi8qKlxuICogQW4gZXZlbnQgZW1pdHRlZCByaWdodCBiZWZvcmUgYW4gaXRlbSBpcyBzZWxlY3RlZCBmcm9tIHRoZSByZXN1bHQgbGlzdC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBOZ2JUeXBlYWhlYWRTZWxlY3RJdGVtRXZlbnQge1xuICAvKipcbiAgICogVGhlIGl0ZW0gZnJvbSB0aGUgcmVzdWx0IGxpc3QgYWJvdXQgdG8gYmUgc2VsZWN0ZWQuXG4gICAqL1xuICBpdGVtOiBhbnk7XG5cbiAgLyoqXG4gICAqIENhbGxpbmcgdGhpcyBmdW5jdGlvbiB3aWxsIHByZXZlbnQgaXRlbSBzZWxlY3Rpb24gZnJvbSBoYXBwZW5pbmcuXG4gICAqL1xuICBwcmV2ZW50RGVmYXVsdDogKCkgPT4gdm9pZDtcbn1cblxubGV0IG5leHRXaW5kb3dJZCA9IDA7XG5cbi8qKlxuICogQSBkaXJlY3RpdmUgcHJvdmlkaW5nIGEgc2ltcGxlIHdheSBvZiBjcmVhdGluZyBwb3dlcmZ1bCB0eXBlYWhlYWRzIGZyb20gYW55IHRleHQgaW5wdXQuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ2lucHV0W25nYlR5cGVhaGVhZF0nLFxuICBleHBvcnRBczogJ25nYlR5cGVhaGVhZCcsXG4gIGhvc3Q6IHtcbiAgICAnKGJsdXIpJzogJ2hhbmRsZUJsdXIoKScsXG4gICAgJ1tjbGFzcy5vcGVuXSc6ICdpc1BvcHVwT3BlbigpJyxcbiAgICAnKGtleWRvd24pJzogJ2hhbmRsZUtleURvd24oJGV2ZW50KScsXG4gICAgJ1thdXRvY29tcGxldGVdJzogJ2F1dG9jb21wbGV0ZScsXG4gICAgJ2F1dG9jYXBpdGFsaXplJzogJ29mZicsXG4gICAgJ2F1dG9jb3JyZWN0JzogJ29mZicsXG4gICAgJ3JvbGUnOiAnY29tYm9ib3gnLFxuICAgICdhcmlhLW11bHRpbGluZSc6ICdmYWxzZScsXG4gICAgJ1thdHRyLmFyaWEtYXV0b2NvbXBsZXRlXSc6ICdzaG93SGludCA/IFwiYm90aFwiIDogXCJsaXN0XCInLFxuICAgICdbYXR0ci5hcmlhLWFjdGl2ZWRlc2NlbmRhbnRdJzogJ2FjdGl2ZURlc2NlbmRhbnQnLFxuICAgICdbYXR0ci5hcmlhLW93bnNdJzogJ2lzUG9wdXBPcGVuKCkgPyBwb3B1cElkIDogbnVsbCcsXG4gICAgJ1thdHRyLmFyaWEtZXhwYW5kZWRdJzogJ2lzUG9wdXBPcGVuKCknXG4gIH0sXG4gIHByb3ZpZGVyczogW05HQl9UWVBFQUhFQURfVkFMVUVfQUNDRVNTT1JdXG59KVxuZXhwb3J0IGNsYXNzIE5nYlR5cGVhaGVhZCBpbXBsZW1lbnRzIENvbnRyb2xWYWx1ZUFjY2Vzc29yLFxuICAgIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBfcG9wdXBTZXJ2aWNlOiBQb3B1cFNlcnZpY2U8TmdiVHlwZWFoZWFkV2luZG93PjtcbiAgcHJpdmF0ZSBfc3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gIHByaXZhdGUgX2Nsb3NlZCQgPSBuZXcgU3ViamVjdCgpO1xuICBwcml2YXRlIF9pbnB1dFZhbHVlQmFja3VwOiBzdHJpbmc7XG4gIHByaXZhdGUgX3ZhbHVlQ2hhbmdlczogT2JzZXJ2YWJsZTxzdHJpbmc+O1xuICBwcml2YXRlIF9yZXN1YnNjcmliZVR5cGVhaGVhZDogQmVoYXZpb3JTdWJqZWN0PGFueT47XG4gIHByaXZhdGUgX3dpbmRvd1JlZjogQ29tcG9uZW50UmVmPE5nYlR5cGVhaGVhZFdpbmRvdz47XG4gIHByaXZhdGUgX3pvbmVTdWJzY3JpcHRpb246IGFueTtcblxuICAvKipcbiAgICogVGhlIHZhbHVlIGZvciB0aGUgYGF1dG9jb21wbGV0ZWAgYXR0cmlidXRlIGZvciB0aGUgYDxpbnB1dD5gIGVsZW1lbnQuXG4gICAqXG4gICAqIERlZmF1bHRzIHRvIGBcIm9mZlwiYCB0byBkaXNhYmxlIHRoZSBuYXRpdmUgYnJvd3NlciBhdXRvY29tcGxldGUsIGJ1dCB5b3UgY2FuIG92ZXJyaWRlIGl0IGlmIG5lY2Vzc2FyeS5cbiAgICpcbiAgICogQHNpbmNlIDIuMS4wXG4gICAqL1xuICBASW5wdXQoKSBhdXRvY29tcGxldGUgPSAnb2ZmJztcblxuICAvKipcbiAgICogQSBzZWxlY3RvciBzcGVjaWZ5aW5nIHRoZSBlbGVtZW50IHRoZSB0eXBlYWhlYWQgcG9wdXAgd2lsbCBiZSBhcHBlbmRlZCB0by5cbiAgICpcbiAgICogQ3VycmVudGx5IG9ubHkgc3VwcG9ydHMgYFwiYm9keVwiYC5cbiAgICovXG4gIEBJbnB1dCgpIGNvbnRhaW5lcjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBJZiBgdHJ1ZWAsIG1vZGVsIHZhbHVlcyB3aWxsIG5vdCBiZSByZXN0cmljdGVkIG9ubHkgdG8gaXRlbXMgc2VsZWN0ZWQgZnJvbSB0aGUgcG9wdXAuXG4gICAqL1xuICBASW5wdXQoKSBlZGl0YWJsZTogYm9vbGVhbjtcblxuICAvKipcbiAgICogSWYgYHRydWVgLCB0aGUgZmlyc3QgaXRlbSBpbiB0aGUgcmVzdWx0IGxpc3Qgd2lsbCBhbHdheXMgc3RheSBmb2N1c2VkIHdoaWxlIHR5cGluZy5cbiAgICovXG4gIEBJbnB1dCgpIGZvY3VzRmlyc3Q6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFRoZSBmdW5jdGlvbiB0aGF0IGNvbnZlcnRzIGFuIGl0ZW0gZnJvbSB0aGUgcmVzdWx0IGxpc3QgdG8gYSBgc3RyaW5nYCB0byBkaXNwbGF5IGluIHRoZSBgPGlucHV0PmAgZmllbGQuXG4gICAqXG4gICAqIEl0IGlzIGNhbGxlZCB3aGVuIHRoZSB1c2VyIHNlbGVjdHMgc29tZXRoaW5nIGluIHRoZSBwb3B1cCBvciB0aGUgbW9kZWwgdmFsdWUgY2hhbmdlcywgc28gdGhlIGlucHV0IG5lZWRzIHRvXG4gICAqIGJlIHVwZGF0ZWQuXG4gICAqL1xuICBASW5wdXQoKSBpbnB1dEZvcm1hdHRlcjogKGl0ZW06IGFueSkgPT4gc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgZnVuY3Rpb24gdGhhdCBjb252ZXJ0cyBhIHN0cmVhbSBvZiB0ZXh0IHZhbHVlcyBmcm9tIHRoZSBgPGlucHV0PmAgZWxlbWVudCB0byB0aGUgc3RyZWFtIG9mIHRoZSBhcnJheSBvZiBpdGVtc1xuICAgKiB0byBkaXNwbGF5IGluIHRoZSB0eXBlYWhlYWQgcG9wdXAuXG4gICAqXG4gICAqIElmIHRoZSByZXN1bHRpbmcgb2JzZXJ2YWJsZSBlbWl0cyBhIG5vbi1lbXB0eSBhcnJheSAtIHRoZSBwb3B1cCB3aWxsIGJlIHNob3duLiBJZiBpdCBlbWl0cyBhbiBlbXB0eSBhcnJheSAtIHRoZVxuICAgKiBwb3B1cCB3aWxsIGJlIGNsb3NlZC5cbiAgICpcbiAgICogU2VlIHRoZSBbYmFzaWMgZXhhbXBsZV0oIy9jb21wb25lbnRzL3R5cGVhaGVhZC9leGFtcGxlcyNiYXNpYykgZm9yIG1vcmUgZGV0YWlscy5cbiAgICpcbiAgICogTm90ZSB0aGF0IHRoZSBgdGhpc2AgYXJndW1lbnQgaXMgYHVuZGVmaW5lZGAgc28geW91IG5lZWQgdG8gZXhwbGljaXRseSBiaW5kIGl0IHRvIGEgZGVzaXJlZCBcInRoaXNcIiB0YXJnZXQuXG4gICAqL1xuICBASW5wdXQoKSBuZ2JUeXBlYWhlYWQ6ICh0ZXh0OiBPYnNlcnZhYmxlPHN0cmluZz4pID0+IE9ic2VydmFibGU8YW55W10+O1xuXG4gIC8qKlxuICAgKiBUaGUgZnVuY3Rpb24gdGhhdCBjb252ZXJ0cyBhbiBpdGVtIGZyb20gdGhlIHJlc3VsdCBsaXN0IHRvIGEgYHN0cmluZ2AgdG8gZGlzcGxheSBpbiB0aGUgcG9wdXAuXG4gICAqXG4gICAqIE11c3QgYmUgcHJvdmlkZWQsIGlmIHlvdXIgYG5nYlR5cGVhaGVhZGAgcmV0dXJucyBzb21ldGhpbmcgb3RoZXIgdGhhbiBgT2JzZXJ2YWJsZTxzdHJpbmdbXT5gLlxuICAgKlxuICAgKiBBbHRlcm5hdGl2ZWx5IGZvciBtb3JlIGNvbXBsZXggbWFya3VwIGluIHRoZSBwb3B1cCB5b3Ugc2hvdWxkIHVzZSBgcmVzdWx0VGVtcGxhdGVgLlxuICAgKi9cbiAgQElucHV0KCkgcmVzdWx0Rm9ybWF0dGVyOiAoaXRlbTogYW55KSA9PiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSB0ZW1wbGF0ZSB0byBvdmVycmlkZSB0aGUgd2F5IHJlc3VsdGluZyBpdGVtcyBhcmUgZGlzcGxheWVkIGluIHRoZSBwb3B1cC5cbiAgICpcbiAgICogU2VlIHRoZSBbUmVzdWx0VGVtcGxhdGVDb250ZXh0XSgjL2NvbXBvbmVudHMvdHlwZWFoZWFkL2FwaSNSZXN1bHRUZW1wbGF0ZUNvbnRleHQpIGZvciB0aGUgdGVtcGxhdGUgY29udGV4dC5cbiAgICpcbiAgICogQWxzbyBzZWUgdGhlIFt0ZW1wbGF0ZSBmb3IgcmVzdWx0cyBkZW1vXSgjL2NvbXBvbmVudHMvdHlwZWFoZWFkL2V4YW1wbGVzI3RlbXBsYXRlKSBmb3IgbW9yZSBkZXRhaWxzLlxuICAgKi9cbiAgQElucHV0KCkgcmVzdWx0VGVtcGxhdGU6IFRlbXBsYXRlUmVmPFJlc3VsdFRlbXBsYXRlQ29udGV4dD47XG5cbiAgLyoqXG4gICAqIElmIGB0cnVlYCwgd2lsbCBzaG93IHRoZSBoaW50IGluIHRoZSBgPGlucHV0PmAgd2hlbiBhbiBpdGVtIGluIHRoZSByZXN1bHQgbGlzdCBtYXRjaGVzLlxuICAgKi9cbiAgQElucHV0KCkgc2hvd0hpbnQ6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFRoZSBwcmVmZXJyZWQgcGxhY2VtZW50IG9mIHRoZSB0eXBlYWhlYWQuXG4gICAqXG4gICAqIFBvc3NpYmxlIHZhbHVlcyBhcmUgYFwidG9wXCJgLCBgXCJ0b3AtbGVmdFwiYCwgYFwidG9wLXJpZ2h0XCJgLCBgXCJib3R0b21cImAsIGBcImJvdHRvbS1sZWZ0XCJgLFxuICAgKiBgXCJib3R0b20tcmlnaHRcImAsIGBcImxlZnRcImAsIGBcImxlZnQtdG9wXCJgLCBgXCJsZWZ0LWJvdHRvbVwiYCwgYFwicmlnaHRcImAsIGBcInJpZ2h0LXRvcFwiYCxcbiAgICogYFwicmlnaHQtYm90dG9tXCJgXG4gICAqXG4gICAqIEFjY2VwdHMgYW4gYXJyYXkgb2Ygc3RyaW5ncyBvciBhIHN0cmluZyB3aXRoIHNwYWNlIHNlcGFyYXRlZCBwb3NzaWJsZSB2YWx1ZXMuXG4gICAqXG4gICAqIFRoZSBkZWZhdWx0IG9yZGVyIG9mIHByZWZlcmVuY2UgaXMgYFwiYm90dG9tLWxlZnQgYm90dG9tLXJpZ2h0IHRvcC1sZWZ0IHRvcC1yaWdodFwiYFxuICAgKlxuICAgKiBQbGVhc2Ugc2VlIHRoZSBbcG9zaXRpb25pbmcgb3ZlcnZpZXddKCMvcG9zaXRpb25pbmcpIGZvciBtb3JlIGRldGFpbHMuXG4gICAqL1xuICBASW5wdXQoKSBwbGFjZW1lbnQ6IFBsYWNlbWVudEFycmF5ID0gJ2JvdHRvbS1sZWZ0JztcblxuICAvKipcbiAgICogQW4gZXZlbnQgZW1pdHRlZCByaWdodCBiZWZvcmUgYW4gaXRlbSBpcyBzZWxlY3RlZCBmcm9tIHRoZSByZXN1bHQgbGlzdC5cbiAgICpcbiAgICogRXZlbnQgcGF5bG9hZCBpcyBvZiB0eXBlIFtgTmdiVHlwZWFoZWFkU2VsZWN0SXRlbUV2ZW50YF0oIy9jb21wb25lbnRzL3R5cGVhaGVhZC9hcGkjTmdiVHlwZWFoZWFkU2VsZWN0SXRlbUV2ZW50KS5cbiAgICovXG4gIEBPdXRwdXQoKSBzZWxlY3RJdGVtID0gbmV3IEV2ZW50RW1pdHRlcjxOZ2JUeXBlYWhlYWRTZWxlY3RJdGVtRXZlbnQ+KCk7XG5cbiAgYWN0aXZlRGVzY2VuZGFudDogc3RyaW5nO1xuICBwb3B1cElkID0gYG5nYi10eXBlYWhlYWQtJHtuZXh0V2luZG93SWQrK31gO1xuXG4gIHByaXZhdGUgX29uVG91Y2hlZCA9ICgpID0+IHt9O1xuICBwcml2YXRlIF9vbkNoYW5nZSA9IChfOiBhbnkpID0+IHt9O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MSW5wdXRFbGVtZW50PiwgcHJpdmF0ZSBfdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZixcbiAgICAgIHByaXZhdGUgX3JlbmRlcmVyOiBSZW5kZXJlcjIsIHByaXZhdGUgX2luamVjdG9yOiBJbmplY3RvciwgY29tcG9uZW50RmFjdG9yeVJlc29sdmVyOiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gICAgICBjb25maWc6IE5nYlR5cGVhaGVhZENvbmZpZywgbmdab25lOiBOZ1pvbmUsIHByaXZhdGUgX2xpdmU6IExpdmUsIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgX2RvY3VtZW50OiBhbnksXG4gICAgICBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSwgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3I6IENoYW5nZURldGVjdG9yUmVmLCBwcml2YXRlIF9hcHBsaWNhdGlvblJlZjogQXBwbGljYXRpb25SZWYpIHtcbiAgICB0aGlzLmNvbnRhaW5lciA9IGNvbmZpZy5jb250YWluZXI7XG4gICAgdGhpcy5lZGl0YWJsZSA9IGNvbmZpZy5lZGl0YWJsZTtcbiAgICB0aGlzLmZvY3VzRmlyc3QgPSBjb25maWcuZm9jdXNGaXJzdDtcbiAgICB0aGlzLnNob3dIaW50ID0gY29uZmlnLnNob3dIaW50O1xuICAgIHRoaXMucGxhY2VtZW50ID0gY29uZmlnLnBsYWNlbWVudDtcblxuICAgIHRoaXMuX3ZhbHVlQ2hhbmdlcyA9IGZyb21FdmVudDxFdmVudD4oX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgJ2lucHV0JylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnBpcGUobWFwKCRldmVudCA9PiAoJGV2ZW50LnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSkpO1xuXG4gICAgdGhpcy5fcmVzdWJzY3JpYmVUeXBlYWhlYWQgPSBuZXcgQmVoYXZpb3JTdWJqZWN0KG51bGwpO1xuXG4gICAgdGhpcy5fcG9wdXBTZXJ2aWNlID0gbmV3IFBvcHVwU2VydmljZTxOZ2JUeXBlYWhlYWRXaW5kb3c+KFxuICAgICAgICBOZ2JUeXBlYWhlYWRXaW5kb3csIF9pbmplY3RvciwgX3ZpZXdDb250YWluZXJSZWYsIF9yZW5kZXJlciwgY29tcG9uZW50RmFjdG9yeVJlc29sdmVyLCBfYXBwbGljYXRpb25SZWYpO1xuXG4gICAgdGhpcy5fem9uZVN1YnNjcmlwdGlvbiA9IG5nWm9uZS5vblN0YWJsZS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuaXNQb3B1cE9wZW4oKSkge1xuICAgICAgICBwb3NpdGlvbkVsZW1lbnRzKFxuICAgICAgICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCB0aGlzLl93aW5kb3dSZWYubG9jYXRpb24ubmF0aXZlRWxlbWVudCwgdGhpcy5wbGFjZW1lbnQsXG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lciA9PT0gJ2JvZHknKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIGNvbnN0IGlucHV0VmFsdWVzJCA9IHRoaXMuX3ZhbHVlQ2hhbmdlcy5waXBlKHRhcCh2YWx1ZSA9PiB7XG4gICAgICB0aGlzLl9pbnB1dFZhbHVlQmFja3VwID0gdGhpcy5zaG93SGludCA/IHZhbHVlIDogbnVsbDtcbiAgICAgIGlmICh0aGlzLmVkaXRhYmxlKSB7XG4gICAgICAgIHRoaXMuX29uQ2hhbmdlKHZhbHVlKTtcbiAgICAgIH1cbiAgICB9KSk7XG4gICAgY29uc3QgcmVzdWx0cyQgPSBpbnB1dFZhbHVlcyQucGlwZSh0aGlzLm5nYlR5cGVhaGVhZCk7XG4gICAgY29uc3QgcHJvY2Vzc2VkUmVzdWx0cyQgPSByZXN1bHRzJC5waXBlKHRhcCgoKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuZWRpdGFibGUpIHtcbiAgICAgICAgdGhpcy5fb25DaGFuZ2UodW5kZWZpbmVkKTtcbiAgICAgIH1cbiAgICB9KSk7XG4gICAgY29uc3QgdXNlcklucHV0JCA9IHRoaXMuX3Jlc3Vic2NyaWJlVHlwZWFoZWFkLnBpcGUoc3dpdGNoTWFwKCgpID0+IHByb2Nlc3NlZFJlc3VsdHMkKSk7XG4gICAgdGhpcy5fc3Vic2NyaXB0aW9uID0gdGhpcy5fc3Vic2NyaWJlVG9Vc2VySW5wdXQodXNlcklucHV0JCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLl9jbG9zZVBvcHVwKCk7XG4gICAgdGhpcy5fdW5zdWJzY3JpYmVGcm9tVXNlcklucHV0KCk7XG4gICAgdGhpcy5fem9uZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogKHZhbHVlOiBhbnkpID0+IGFueSk6IHZvaWQgeyB0aGlzLl9vbkNoYW5nZSA9IGZuOyB9XG5cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46ICgpID0+IGFueSk6IHZvaWQgeyB0aGlzLl9vblRvdWNoZWQgPSBmbjsgfVxuXG4gIHdyaXRlVmFsdWUodmFsdWUpIHtcbiAgICB0aGlzLl93cml0ZUlucHV0VmFsdWUodGhpcy5fZm9ybWF0SXRlbUZvcklucHV0KHZhbHVlKSk7XG4gICAgaWYgKHRoaXMuc2hvd0hpbnQpIHtcbiAgICAgIHRoaXMuX2lucHV0VmFsdWVCYWNrdXAgPSB2YWx1ZTtcbiAgICB9XG4gIH1cblxuICBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLl9yZW5kZXJlci5zZXRQcm9wZXJ0eSh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsICdkaXNhYmxlZCcsIGlzRGlzYWJsZWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc21pc3NlcyB0eXBlYWhlYWQgcG9wdXAgd2luZG93XG4gICAqL1xuICBkaXNtaXNzUG9wdXAoKSB7XG4gICAgaWYgKHRoaXMuaXNQb3B1cE9wZW4oKSkge1xuICAgICAgdGhpcy5fcmVzdWJzY3JpYmVUeXBlYWhlYWQubmV4dChudWxsKTtcbiAgICAgIHRoaXMuX2Nsb3NlUG9wdXAoKTtcbiAgICAgIGlmICh0aGlzLnNob3dIaW50ICYmIHRoaXMuX2lucHV0VmFsdWVCYWNrdXAgIT09IG51bGwpIHtcbiAgICAgICAgdGhpcy5fd3JpdGVJbnB1dFZhbHVlKHRoaXMuX2lucHV0VmFsdWVCYWNrdXApO1xuICAgICAgfVxuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3IubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgdHlwZWFoZWFkIHBvcHVwIHdpbmRvdyBpcyBkaXNwbGF5ZWRcbiAgICovXG4gIGlzUG9wdXBPcGVuKCkgeyByZXR1cm4gdGhpcy5fd2luZG93UmVmICE9IG51bGw7IH1cblxuICBoYW5kbGVCbHVyKCkge1xuICAgIHRoaXMuX3Jlc3Vic2NyaWJlVHlwZWFoZWFkLm5leHQobnVsbCk7XG4gICAgdGhpcy5fb25Ub3VjaGVkKCk7XG4gIH1cblxuICBoYW5kbGVLZXlEb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgaWYgKCF0aGlzLmlzUG9wdXBPcGVuKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6ZGVwcmVjYXRpb25cbiAgICBzd2l0Y2ggKGV2ZW50LndoaWNoKSB7XG4gICAgICBjYXNlIEtleS5BcnJvd0Rvd246XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHRoaXMuX3dpbmRvd1JlZi5pbnN0YW5jZS5uZXh0KCk7XG4gICAgICAgIHRoaXMuX3Nob3dIaW50KCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBLZXkuQXJyb3dVcDpcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdGhpcy5fd2luZG93UmVmLmluc3RhbmNlLnByZXYoKTtcbiAgICAgICAgdGhpcy5fc2hvd0hpbnQoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIEtleS5FbnRlcjpcbiAgICAgIGNhc2UgS2V5LlRhYjpcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy5fd2luZG93UmVmLmluc3RhbmNlLmdldEFjdGl2ZSgpO1xuICAgICAgICBpZiAoaXNEZWZpbmVkKHJlc3VsdCkpIHtcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgIHRoaXMuX3NlbGVjdFJlc3VsdChyZXN1bHQpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2Nsb3NlUG9wdXAoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfb3BlblBvcHVwKCkge1xuICAgIGlmICghdGhpcy5pc1BvcHVwT3BlbigpKSB7XG4gICAgICB0aGlzLl9pbnB1dFZhbHVlQmFja3VwID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnZhbHVlO1xuICAgICAgdGhpcy5fd2luZG93UmVmID0gdGhpcy5fcG9wdXBTZXJ2aWNlLm9wZW4oKTtcbiAgICAgIHRoaXMuX3dpbmRvd1JlZi5pbnN0YW5jZS5pZCA9IHRoaXMucG9wdXBJZDtcbiAgICAgIHRoaXMuX3dpbmRvd1JlZi5pbnN0YW5jZS5zZWxlY3RFdmVudC5zdWJzY3JpYmUoKHJlc3VsdDogYW55KSA9PiB0aGlzLl9zZWxlY3RSZXN1bHRDbG9zZVBvcHVwKHJlc3VsdCkpO1xuICAgICAgdGhpcy5fd2luZG93UmVmLmluc3RhbmNlLmFjdGl2ZUNoYW5nZUV2ZW50LnN1YnNjcmliZSgoYWN0aXZlSWQ6IHN0cmluZykgPT4gdGhpcy5hY3RpdmVEZXNjZW5kYW50ID0gYWN0aXZlSWQpO1xuXG4gICAgICBpZiAodGhpcy5jb250YWluZXIgPT09ICdib2R5Jykge1xuICAgICAgICB3aW5kb3cuZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLmNvbnRhaW5lcikuYXBwZW5kQ2hpbGQodGhpcy5fd2luZG93UmVmLmxvY2F0aW9uLm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3Rvci5tYXJrRm9yQ2hlY2soKTtcblxuICAgICAgbmdiQXV0b0Nsb3NlKFxuICAgICAgICAgIHRoaXMuX25nWm9uZSwgdGhpcy5fZG9jdW1lbnQsICdvdXRzaWRlJywgKCkgPT4gdGhpcy5kaXNtaXNzUG9wdXAoKSwgdGhpcy5fY2xvc2VkJCxcbiAgICAgICAgICBbdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCB0aGlzLl93aW5kb3dSZWYubG9jYXRpb24ubmF0aXZlRWxlbWVudF0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2Nsb3NlUG9wdXAoKSB7XG4gICAgdGhpcy5fY2xvc2VkJC5uZXh0KCk7XG4gICAgdGhpcy5fcG9wdXBTZXJ2aWNlLmNsb3NlKCk7XG4gICAgdGhpcy5fd2luZG93UmVmID0gbnVsbDtcbiAgICB0aGlzLmFjdGl2ZURlc2NlbmRhbnQgPSB1bmRlZmluZWQ7XG4gIH1cblxuICBwcml2YXRlIF9zZWxlY3RSZXN1bHQocmVzdWx0OiBhbnkpIHtcbiAgICBsZXQgZGVmYXVsdFByZXZlbnRlZCA9IGZhbHNlO1xuICAgIHRoaXMuc2VsZWN0SXRlbS5lbWl0KHtpdGVtOiByZXN1bHQsIHByZXZlbnREZWZhdWx0OiAoKSA9PiB7IGRlZmF1bHRQcmV2ZW50ZWQgPSB0cnVlOyB9fSk7XG4gICAgdGhpcy5fcmVzdWJzY3JpYmVUeXBlYWhlYWQubmV4dChudWxsKTtcblxuICAgIGlmICghZGVmYXVsdFByZXZlbnRlZCkge1xuICAgICAgdGhpcy53cml0ZVZhbHVlKHJlc3VsdCk7XG4gICAgICB0aGlzLl9vbkNoYW5nZShyZXN1bHQpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX3NlbGVjdFJlc3VsdENsb3NlUG9wdXAocmVzdWx0OiBhbnkpIHtcbiAgICB0aGlzLl9zZWxlY3RSZXN1bHQocmVzdWx0KTtcbiAgICB0aGlzLl9jbG9zZVBvcHVwKCk7XG4gIH1cblxuICBwcml2YXRlIF9zaG93SGludCgpIHtcbiAgICBpZiAodGhpcy5zaG93SGludCAmJiB0aGlzLl93aW5kb3dSZWYuaW5zdGFuY2UuaGFzQWN0aXZlKCkgJiYgdGhpcy5faW5wdXRWYWx1ZUJhY2t1cCAhPSBudWxsKSB7XG4gICAgICBjb25zdCB1c2VySW5wdXRMb3dlckNhc2UgPSB0aGlzLl9pbnB1dFZhbHVlQmFja3VwLnRvTG93ZXJDYXNlKCk7XG4gICAgICBjb25zdCBmb3JtYXR0ZWRWYWwgPSB0aGlzLl9mb3JtYXRJdGVtRm9ySW5wdXQodGhpcy5fd2luZG93UmVmLmluc3RhbmNlLmdldEFjdGl2ZSgpKTtcblxuICAgICAgaWYgKHVzZXJJbnB1dExvd2VyQ2FzZSA9PT0gZm9ybWF0dGVkVmFsLnN1YnN0cigwLCB0aGlzLl9pbnB1dFZhbHVlQmFja3VwLmxlbmd0aCkudG9Mb3dlckNhc2UoKSkge1xuICAgICAgICB0aGlzLl93cml0ZUlucHV0VmFsdWUodGhpcy5faW5wdXRWYWx1ZUJhY2t1cCArIGZvcm1hdHRlZFZhbC5zdWJzdHIodGhpcy5faW5wdXRWYWx1ZUJhY2t1cC5sZW5ndGgpKTtcbiAgICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50WydzZXRTZWxlY3Rpb25SYW5nZSddLmFwcGx5KFxuICAgICAgICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCBbdGhpcy5faW5wdXRWYWx1ZUJhY2t1cC5sZW5ndGgsIGZvcm1hdHRlZFZhbC5sZW5ndGhdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3dyaXRlSW5wdXRWYWx1ZShmb3JtYXR0ZWRWYWwpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2Zvcm1hdEl0ZW1Gb3JJbnB1dChpdGVtOiBhbnkpOiBzdHJpbmcge1xuICAgIHJldHVybiBpdGVtICE9IG51bGwgJiYgdGhpcy5pbnB1dEZvcm1hdHRlciA/IHRoaXMuaW5wdXRGb3JtYXR0ZXIoaXRlbSkgOiB0b1N0cmluZyhpdGVtKTtcbiAgfVxuXG4gIHByaXZhdGUgX3dyaXRlSW5wdXRWYWx1ZSh2YWx1ZTogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5fcmVuZGVyZXIuc2V0UHJvcGVydHkodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAndmFsdWUnLCB0b1N0cmluZyh2YWx1ZSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBfc3Vic2NyaWJlVG9Vc2VySW5wdXQodXNlcklucHV0JDogT2JzZXJ2YWJsZTxhbnlbXT4pOiBTdWJzY3JpcHRpb24ge1xuICAgIHJldHVybiB1c2VySW5wdXQkLnN1YnNjcmliZSgocmVzdWx0cykgPT4ge1xuICAgICAgaWYgKCFyZXN1bHRzIHx8IHJlc3VsdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRoaXMuX2Nsb3NlUG9wdXAoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX29wZW5Qb3B1cCgpO1xuICAgICAgICB0aGlzLl93aW5kb3dSZWYuaW5zdGFuY2UuZm9jdXNGaXJzdCA9IHRoaXMuZm9jdXNGaXJzdDtcbiAgICAgICAgdGhpcy5fd2luZG93UmVmLmluc3RhbmNlLnJlc3VsdHMgPSByZXN1bHRzO1xuICAgICAgICB0aGlzLl93aW5kb3dSZWYuaW5zdGFuY2UudGVybSA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC52YWx1ZTtcbiAgICAgICAgaWYgKHRoaXMucmVzdWx0Rm9ybWF0dGVyKSB7XG4gICAgICAgICAgdGhpcy5fd2luZG93UmVmLmluc3RhbmNlLmZvcm1hdHRlciA9IHRoaXMucmVzdWx0Rm9ybWF0dGVyO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnJlc3VsdFRlbXBsYXRlKSB7XG4gICAgICAgICAgdGhpcy5fd2luZG93UmVmLmluc3RhbmNlLnJlc3VsdFRlbXBsYXRlID0gdGhpcy5yZXN1bHRUZW1wbGF0ZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl93aW5kb3dSZWYuaW5zdGFuY2UucmVzZXRBY3RpdmUoKTtcblxuICAgICAgICAvLyBUaGUgb2JzZXJ2YWJsZSBzdHJlYW0gd2UgYXJlIHN1YnNjcmliaW5nIHRvIG1pZ2h0IGhhdmUgYXN5bmMgc3RlcHNcbiAgICAgICAgLy8gYW5kIGlmIGEgY29tcG9uZW50IGNvbnRhaW5pbmcgdHlwZWFoZWFkIGlzIHVzaW5nIHRoZSBPblB1c2ggc3RyYXRlZ3lcbiAgICAgICAgLy8gdGhlIGNoYW5nZSBkZXRlY3Rpb24gdHVybiB3b3VsZG4ndCBiZSBpbnZva2VkIGF1dG9tYXRpY2FsbHkuXG4gICAgICAgIHRoaXMuX3dpbmRvd1JlZi5jaGFuZ2VEZXRlY3RvclJlZi5kZXRlY3RDaGFuZ2VzKCk7XG5cbiAgICAgICAgdGhpcy5fc2hvd0hpbnQoKTtcbiAgICAgIH1cblxuICAgICAgLy8gbGl2ZSBhbm5vdW5jZXJcbiAgICAgIGNvbnN0IGNvdW50ID0gcmVzdWx0cyA/IHJlc3VsdHMubGVuZ3RoIDogMDtcbiAgICAgIHRoaXMuX2xpdmUuc2F5KGNvdW50ID09PSAwID8gJ05vIHJlc3VsdHMgYXZhaWxhYmxlJyA6IGAke2NvdW50fSByZXN1bHQke2NvdW50ID09PSAxID8gJycgOiAncyd9IGF2YWlsYWJsZWApO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfdW5zdWJzY3JpYmVGcm9tVXNlcklucHV0KCkge1xuICAgIGlmICh0aGlzLl9zdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgICB0aGlzLl9zdWJzY3JpcHRpb24gPSBudWxsO1xuICB9XG59XG4iXX0=