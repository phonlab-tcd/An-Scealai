/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { ChangeDetectorRef, ComponentFactoryResolver, Directive, ElementRef, EventEmitter, forwardRef, Inject, Input, NgZone, Output, Renderer2, TemplateRef, ViewContainerRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ngbAutoClose } from '../util/autoclose';
import { ngbFocusTrap } from '../util/focus-trap';
import { positionElements } from '../util/positioning';
import { NgbDateAdapter } from './adapters/ngb-date-adapter';
import { NgbDatepicker } from './datepicker';
import { NgbDatepickerService } from './datepicker-service';
import { NgbCalendar } from './ngb-calendar';
import { NgbDate } from './ngb-date';
import { NgbDateParserFormatter } from './ngb-date-parser-formatter';
/** @type {?} */
var NGB_DATEPICKER_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(function () { return NgbInputDatepicker; }),
    multi: true
};
/** @type {?} */
var NGB_DATEPICKER_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(function () { return NgbInputDatepicker; }),
    multi: true
};
/**
 * A directive that allows to stick a datepicker popup to an input field.
 *
 * Manages interaction with the input field itself, does value formatting and provides forms integration.
 */
var NgbInputDatepicker = /** @class */ (function () {
    function NgbInputDatepicker(_parserFormatter, _elRef, _vcRef, _renderer, _cfr, _ngZone, _service, _calendar, _dateAdapter, _document, _changeDetector) {
        var _this = this;
        this._parserFormatter = _parserFormatter;
        this._elRef = _elRef;
        this._vcRef = _vcRef;
        this._renderer = _renderer;
        this._cfr = _cfr;
        this._ngZone = _ngZone;
        this._service = _service;
        this._calendar = _calendar;
        this._dateAdapter = _dateAdapter;
        this._document = _document;
        this._changeDetector = _changeDetector;
        this._cRef = null;
        this._disabled = false;
        /**
         * Indicates whether the datepicker popup should be closed automatically after date selection / outside click or not.
         *
         * * `true` - the popup will close on both date selection and outside click.
         * * `false` - the popup can only be closed manually via `close()` or `toggle()` methods.
         * * `"inside"` - the popup will close on date selection, but not outside clicks.
         * * `"outside"` - the popup will close only on the outside click and not on date selection/inside clicks.
         *
         * \@since 3.0.0
         */
        this.autoClose = true;
        /**
         * The preferred placement of the datepicker popup.
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
        this.placement = ['bottom-left', 'bottom-right', 'top-left', 'top-right'];
        /**
         * An event emitted when user selects a date using keyboard or mouse.
         *
         * The payload of the event is currently selected `NgbDate`.
         *
         * \@since 1.1.1
         */
        this.dateSelect = new EventEmitter();
        /**
         * Event emitted right after the navigation happens and displayed month changes.
         *
         * See [`NgbDatepickerNavigateEvent`](#/components/datepicker/api#NgbDatepickerNavigateEvent) for the payload info.
         */
        this.navigate = new EventEmitter();
        /**
         * An event fired after closing datepicker window.
         *
         * \@since 4.2.0
         */
        this.closed = new EventEmitter();
        this._onChange = function (_) { };
        this._onTouched = function () { };
        this._validatorChange = function () { };
        this._zoneSubscription = _ngZone.onStable.subscribe(function () { return _this._updatePopupPosition(); });
    }
    Object.defineProperty(NgbInputDatepicker.prototype, "disabled", {
        get: /**
         * @return {?}
         */
        function () {
            return this._disabled;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._disabled = value === '' || (value && value !== 'false');
            if (this.isOpen()) {
                this._cRef.instance.setDisabledState(this._disabled);
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} fn
     * @return {?}
     */
    NgbInputDatepicker.prototype.registerOnChange = /**
     * @param {?} fn
     * @return {?}
     */
    function (fn) { this._onChange = fn; };
    /**
     * @param {?} fn
     * @return {?}
     */
    NgbInputDatepicker.prototype.registerOnTouched = /**
     * @param {?} fn
     * @return {?}
     */
    function (fn) { this._onTouched = fn; };
    /**
     * @param {?} fn
     * @return {?}
     */
    NgbInputDatepicker.prototype.registerOnValidatorChange = /**
     * @param {?} fn
     * @return {?}
     */
    function (fn) { this._validatorChange = fn; };
    /**
     * @param {?} isDisabled
     * @return {?}
     */
    NgbInputDatepicker.prototype.setDisabledState = /**
     * @param {?} isDisabled
     * @return {?}
     */
    function (isDisabled) { this.disabled = isDisabled; };
    /**
     * @param {?} c
     * @return {?}
     */
    NgbInputDatepicker.prototype.validate = /**
     * @param {?} c
     * @return {?}
     */
    function (c) {
        /** @type {?} */
        var value = c.value;
        if (value === null || value === undefined) {
            return null;
        }
        /** @type {?} */
        var ngbDate = this._fromDateStruct(this._dateAdapter.fromModel(value));
        if (!this._calendar.isValid(ngbDate)) {
            return { 'ngbDate': { invalid: c.value } };
        }
        if (this.minDate && ngbDate.before(NgbDate.from(this.minDate))) {
            return { 'ngbDate': { requiredBefore: this.minDate } };
        }
        if (this.maxDate && ngbDate.after(NgbDate.from(this.maxDate))) {
            return { 'ngbDate': { requiredAfter: this.maxDate } };
        }
    };
    /**
     * @param {?} value
     * @return {?}
     */
    NgbInputDatepicker.prototype.writeValue = /**
     * @param {?} value
     * @return {?}
     */
    function (value) {
        this._model = this._fromDateStruct(this._dateAdapter.fromModel(value));
        this._writeModelValue(this._model);
    };
    /**
     * @param {?} value
     * @param {?=} updateView
     * @return {?}
     */
    NgbInputDatepicker.prototype.manualDateChange = /**
     * @param {?} value
     * @param {?=} updateView
     * @return {?}
     */
    function (value, updateView) {
        if (updateView === void 0) { updateView = false; }
        /** @type {?} */
        var inputValueChanged = value !== this._inputValue;
        if (inputValueChanged) {
            this._inputValue = value;
            this._model = this._fromDateStruct(this._parserFormatter.parse(value));
        }
        if (inputValueChanged || !updateView) {
            this._onChange(this._model ? this._dateAdapter.toModel(this._model) : (value === '' ? null : value));
        }
        if (updateView && this._model) {
            this._writeModelValue(this._model);
        }
    };
    /**
     * @return {?}
     */
    NgbInputDatepicker.prototype.isOpen = /**
     * @return {?}
     */
    function () { return !!this._cRef; };
    /**
     * Opens the datepicker popup.
     *
     * If the related form control contains a valid date, the corresponding month will be opened.
     */
    /**
     * Opens the datepicker popup.
     *
     * If the related form control contains a valid date, the corresponding month will be opened.
     * @return {?}
     */
    NgbInputDatepicker.prototype.open = /**
     * Opens the datepicker popup.
     *
     * If the related form control contains a valid date, the corresponding month will be opened.
     * @return {?}
     */
    function () {
        var _this = this;
        if (!this.isOpen()) {
            /** @type {?} */
            var cf = this._cfr.resolveComponentFactory(NgbDatepicker);
            this._cRef = this._vcRef.createComponent(cf);
            this._applyPopupStyling(this._cRef.location.nativeElement);
            this._applyDatepickerInputs(this._cRef.instance);
            this._subscribeForDatepickerOutputs(this._cRef.instance);
            this._cRef.instance.ngOnInit();
            this._cRef.instance.writeValue(this._dateAdapter.toModel(this._model));
            // date selection event handling
            this._cRef.instance.registerOnChange(function (selectedDate) {
                _this.writeValue(selectedDate);
                _this._onChange(selectedDate);
                _this._onTouched();
            });
            this._cRef.changeDetectorRef.detectChanges();
            this._cRef.instance.setDisabledState(this.disabled);
            if (this.container === 'body') {
                window.document.querySelector(this.container).appendChild(this._cRef.location.nativeElement);
            }
            // focus handling
            ngbFocusTrap(this._cRef.location.nativeElement, this.closed, true);
            this._cRef.instance.focus();
            ngbAutoClose(this._ngZone, this._document, this.autoClose, function () { return _this.close(); }, this.closed, [], [this._elRef.nativeElement, this._cRef.location.nativeElement]);
        }
    };
    /**
     * Closes the datepicker popup.
     */
    /**
     * Closes the datepicker popup.
     * @return {?}
     */
    NgbInputDatepicker.prototype.close = /**
     * Closes the datepicker popup.
     * @return {?}
     */
    function () {
        if (this.isOpen()) {
            this._vcRef.remove(this._vcRef.indexOf(this._cRef.hostView));
            this._cRef = null;
            this.closed.emit();
            this._changeDetector.markForCheck();
        }
    };
    /**
     * Toggles the datepicker popup.
     */
    /**
     * Toggles the datepicker popup.
     * @return {?}
     */
    NgbInputDatepicker.prototype.toggle = /**
     * Toggles the datepicker popup.
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
     * Navigates to the provided date.
     *
     * With the default calendar we use ISO 8601: 'month' is 1=Jan ... 12=Dec.
     * If nothing or invalid date provided calendar will open current month.
     *
     * Use the `[startDate]` input as an alternative.
     */
    /**
     * Navigates to the provided date.
     *
     * With the default calendar we use ISO 8601: 'month' is 1=Jan ... 12=Dec.
     * If nothing or invalid date provided calendar will open current month.
     *
     * Use the `[startDate]` input as an alternative.
     * @param {?=} date
     * @return {?}
     */
    NgbInputDatepicker.prototype.navigateTo = /**
     * Navigates to the provided date.
     *
     * With the default calendar we use ISO 8601: 'month' is 1=Jan ... 12=Dec.
     * If nothing or invalid date provided calendar will open current month.
     *
     * Use the `[startDate]` input as an alternative.
     * @param {?=} date
     * @return {?}
     */
    function (date) {
        if (this.isOpen()) {
            this._cRef.instance.navigateTo(date);
        }
    };
    /**
     * @return {?}
     */
    NgbInputDatepicker.prototype.onBlur = /**
     * @return {?}
     */
    function () { this._onTouched(); };
    /**
     * @param {?} changes
     * @return {?}
     */
    NgbInputDatepicker.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        if (changes['minDate'] || changes['maxDate']) {
            this._validatorChange();
        }
    };
    /**
     * @return {?}
     */
    NgbInputDatepicker.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this.close();
        this._zoneSubscription.unsubscribe();
    };
    /**
     * @param {?} datepickerInstance
     * @return {?}
     */
    NgbInputDatepicker.prototype._applyDatepickerInputs = /**
     * @param {?} datepickerInstance
     * @return {?}
     */
    function (datepickerInstance) {
        var _this = this;
        ['dayTemplate', 'dayTemplateData', 'displayMonths', 'firstDayOfWeek', 'footerTemplate', 'markDisabled', 'minDate',
            'maxDate', 'navigation', 'outsideDays', 'showNavigation', 'showWeekdays', 'showWeekNumbers']
            .forEach(function (optionName) {
            if (_this[optionName] !== undefined) {
                datepickerInstance[optionName] = _this[optionName];
            }
        });
        datepickerInstance.startDate = this.startDate || this._model;
    };
    /**
     * @param {?} nativeElement
     * @return {?}
     */
    NgbInputDatepicker.prototype._applyPopupStyling = /**
     * @param {?} nativeElement
     * @return {?}
     */
    function (nativeElement) {
        this._renderer.addClass(nativeElement, 'dropdown-menu');
        this._renderer.addClass(nativeElement, 'show');
        if (this.container === 'body') {
            this._renderer.addClass(nativeElement, 'ngb-dp-body');
        }
    };
    /**
     * @param {?} datepickerInstance
     * @return {?}
     */
    NgbInputDatepicker.prototype._subscribeForDatepickerOutputs = /**
     * @param {?} datepickerInstance
     * @return {?}
     */
    function (datepickerInstance) {
        var _this = this;
        datepickerInstance.navigate.subscribe(function (navigateEvent) { return _this.navigate.emit(navigateEvent); });
        datepickerInstance.select.subscribe(function (date) {
            _this.dateSelect.emit(date);
            if (_this.autoClose === true || _this.autoClose === 'inside') {
                _this.close();
            }
        });
    };
    /**
     * @param {?} model
     * @return {?}
     */
    NgbInputDatepicker.prototype._writeModelValue = /**
     * @param {?} model
     * @return {?}
     */
    function (model) {
        /** @type {?} */
        var value = this._parserFormatter.format(model);
        this._inputValue = value;
        this._renderer.setProperty(this._elRef.nativeElement, 'value', value);
        if (this.isOpen()) {
            this._cRef.instance.writeValue(this._dateAdapter.toModel(model));
            this._onTouched();
        }
    };
    /**
     * @param {?} date
     * @return {?}
     */
    NgbInputDatepicker.prototype._fromDateStruct = /**
     * @param {?} date
     * @return {?}
     */
    function (date) {
        /** @type {?} */
        var ngbDate = date ? new NgbDate(date.year, date.month, date.day) : null;
        return this._calendar.isValid(ngbDate) ? ngbDate : null;
    };
    /**
     * @return {?}
     */
    NgbInputDatepicker.prototype._updatePopupPosition = /**
     * @return {?}
     */
    function () {
        if (!this._cRef) {
            return;
        }
        /** @type {?} */
        var hostElement;
        if (typeof this.positionTarget === 'string') {
            hostElement = window.document.querySelector(this.positionTarget);
        }
        else if (this.positionTarget instanceof HTMLElement) {
            hostElement = this.positionTarget;
        }
        else {
            hostElement = this._elRef.nativeElement;
        }
        if (this.positionTarget && !hostElement) {
            throw new Error('ngbDatepicker could not find element declared in [positionTarget] to position against.');
        }
        positionElements(hostElement, this._cRef.location.nativeElement, this.placement, this.container === 'body');
    };
    NgbInputDatepicker.decorators = [
        { type: Directive, args: [{
                    selector: 'input[ngbDatepicker]',
                    exportAs: 'ngbDatepicker',
                    host: {
                        '(input)': 'manualDateChange($event.target.value)',
                        '(change)': 'manualDateChange($event.target.value, true)',
                        '(blur)': 'onBlur()',
                        '[disabled]': 'disabled'
                    },
                    providers: [NGB_DATEPICKER_VALUE_ACCESSOR, NGB_DATEPICKER_VALIDATOR, NgbDatepickerService]
                },] }
    ];
    /** @nocollapse */
    NgbInputDatepicker.ctorParameters = function () { return [
        { type: NgbDateParserFormatter },
        { type: ElementRef },
        { type: ViewContainerRef },
        { type: Renderer2 },
        { type: ComponentFactoryResolver },
        { type: NgZone },
        { type: NgbDatepickerService },
        { type: NgbCalendar },
        { type: NgbDateAdapter },
        { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] },
        { type: ChangeDetectorRef }
    ]; };
    NgbInputDatepicker.propDecorators = {
        autoClose: [{ type: Input }],
        dayTemplate: [{ type: Input }],
        dayTemplateData: [{ type: Input }],
        displayMonths: [{ type: Input }],
        firstDayOfWeek: [{ type: Input }],
        footerTemplate: [{ type: Input }],
        markDisabled: [{ type: Input }],
        minDate: [{ type: Input }],
        maxDate: [{ type: Input }],
        navigation: [{ type: Input }],
        outsideDays: [{ type: Input }],
        placement: [{ type: Input }],
        showWeekdays: [{ type: Input }],
        showWeekNumbers: [{ type: Input }],
        startDate: [{ type: Input }],
        container: [{ type: Input }],
        positionTarget: [{ type: Input }],
        dateSelect: [{ type: Output }],
        navigate: [{ type: Output }],
        closed: [{ type: Output }],
        disabled: [{ type: Input }]
    };
    return NgbInputDatepicker;
}());
export { NgbInputDatepicker };
if (false) {
    /** @type {?} */
    NgbInputDatepicker.prototype._cRef;
    /** @type {?} */
    NgbInputDatepicker.prototype._disabled;
    /** @type {?} */
    NgbInputDatepicker.prototype._model;
    /** @type {?} */
    NgbInputDatepicker.prototype._inputValue;
    /** @type {?} */
    NgbInputDatepicker.prototype._zoneSubscription;
    /**
     * Indicates whether the datepicker popup should be closed automatically after date selection / outside click or not.
     *
     * * `true` - the popup will close on both date selection and outside click.
     * * `false` - the popup can only be closed manually via `close()` or `toggle()` methods.
     * * `"inside"` - the popup will close on date selection, but not outside clicks.
     * * `"outside"` - the popup will close only on the outside click and not on date selection/inside clicks.
     *
     * \@since 3.0.0
     * @type {?}
     */
    NgbInputDatepicker.prototype.autoClose;
    /**
     * The reference to a custom template for the day.
     *
     * Allows to completely override the way a day 'cell' in the calendar is displayed.
     *
     * See [`DayTemplateContext`](#/components/datepicker/api#DayTemplateContext) for the data you get inside.
     * @type {?}
     */
    NgbInputDatepicker.prototype.dayTemplate;
    /**
     * The callback to pass any arbitrary data to the template cell via the
     * [`DayTemplateContext`](#/components/datepicker/api#DayTemplateContext)'s `data` parameter.
     *
     * `current` is the month that is currently displayed by the datepicker.
     *
     * \@since 3.3.0
     * @type {?}
     */
    NgbInputDatepicker.prototype.dayTemplateData;
    /**
     * The number of months to display.
     * @type {?}
     */
    NgbInputDatepicker.prototype.displayMonths;
    /**
     * The first day of the week.
     *
     * With default calendar we use ISO 8601: 'weekday' is 1=Mon ... 7=Sun.
     * @type {?}
     */
    NgbInputDatepicker.prototype.firstDayOfWeek;
    /**
     * The reference to the custom template for the datepicker footer.
     *
     * \@since 3.3.0
     * @type {?}
     */
    NgbInputDatepicker.prototype.footerTemplate;
    /**
     * The callback to mark some dates as disabled.
     *
     * It is called for each new date when navigating to a different month.
     *
     * `current` is the month that is currently displayed by the datepicker.
     * @type {?}
     */
    NgbInputDatepicker.prototype.markDisabled;
    /**
     * The earliest date that can be displayed or selected. Also used for form validation.
     *
     * If not provided, 'year' select box will display 10 years before the current month.
     * @type {?}
     */
    NgbInputDatepicker.prototype.minDate;
    /**
     * The latest date that can be displayed or selected. Also used for form validation.
     *
     * If not provided, 'year' select box will display 10 years after the current month.
     * @type {?}
     */
    NgbInputDatepicker.prototype.maxDate;
    /**
     * Navigation type.
     *
     * * `"select"` - select boxes for month and navigation arrows
     * * `"arrows"` - only navigation arrows
     * * `"none"` - no navigation visible at all
     * @type {?}
     */
    NgbInputDatepicker.prototype.navigation;
    /**
     * The way of displaying days that don't belong to the current month.
     *
     * * `"visible"` - days are visible
     * * `"hidden"` - days are hidden, white space preserved
     * * `"collapsed"` - days are collapsed, so the datepicker height might change between months
     *
     * For the 2+ months view, days in between months are never shown.
     * @type {?}
     */
    NgbInputDatepicker.prototype.outsideDays;
    /**
     * The preferred placement of the datepicker popup.
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
    NgbInputDatepicker.prototype.placement;
    /**
     * If `true`, weekdays will be displayed.
     * @type {?}
     */
    NgbInputDatepicker.prototype.showWeekdays;
    /**
     * If `true`, week numbers will be displayed.
     * @type {?}
     */
    NgbInputDatepicker.prototype.showWeekNumbers;
    /**
     * The date to open calendar with.
     *
     * With the default calendar we use ISO 8601: 'month' is 1=Jan ... 12=Dec.
     * If nothing or invalid date is provided, calendar will open with current month.
     *
     * You could use `navigateTo(date)` method as an alternative.
     * @type {?}
     */
    NgbInputDatepicker.prototype.startDate;
    /**
     * A selector specifying the element the datepicker popup should be appended to.
     *
     * Currently only supports `"body"`.
     * @type {?}
     */
    NgbInputDatepicker.prototype.container;
    /**
     * A css selector or html element specifying the element the datepicker popup should be positioned against.
     *
     * By default the input is used as a target.
     *
     * \@since 4.2.0
     * @type {?}
     */
    NgbInputDatepicker.prototype.positionTarget;
    /**
     * An event emitted when user selects a date using keyboard or mouse.
     *
     * The payload of the event is currently selected `NgbDate`.
     *
     * \@since 1.1.1
     * @type {?}
     */
    NgbInputDatepicker.prototype.dateSelect;
    /**
     * Event emitted right after the navigation happens and displayed month changes.
     *
     * See [`NgbDatepickerNavigateEvent`](#/components/datepicker/api#NgbDatepickerNavigateEvent) for the payload info.
     * @type {?}
     */
    NgbInputDatepicker.prototype.navigate;
    /**
     * An event fired after closing datepicker window.
     *
     * \@since 4.2.0
     * @type {?}
     */
    NgbInputDatepicker.prototype.closed;
    /** @type {?} */
    NgbInputDatepicker.prototype._onChange;
    /** @type {?} */
    NgbInputDatepicker.prototype._onTouched;
    /** @type {?} */
    NgbInputDatepicker.prototype._validatorChange;
    /** @type {?} */
    NgbInputDatepicker.prototype._parserFormatter;
    /** @type {?} */
    NgbInputDatepicker.prototype._elRef;
    /** @type {?} */
    NgbInputDatepicker.prototype._vcRef;
    /** @type {?} */
    NgbInputDatepicker.prototype._renderer;
    /** @type {?} */
    NgbInputDatepicker.prototype._cfr;
    /** @type {?} */
    NgbInputDatepicker.prototype._ngZone;
    /** @type {?} */
    NgbInputDatepicker.prototype._service;
    /** @type {?} */
    NgbInputDatepicker.prototype._calendar;
    /** @type {?} */
    NgbInputDatepicker.prototype._dateAdapter;
    /** @type {?} */
    NgbInputDatepicker.prototype._document;
    /** @type {?} */
    NgbInputDatepicker.prototype._changeDetector;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci1pbnB1dC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwLyIsInNvdXJjZXMiOlsiZGF0ZXBpY2tlci9kYXRlcGlja2VyLWlucHV0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQ0wsaUJBQWlCLEVBQ2pCLHdCQUF3QixFQUV4QixTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFDWixVQUFVLEVBQ1YsTUFBTSxFQUNOLEtBQUssRUFDTCxNQUFNLEVBR04sTUFBTSxFQUNOLFNBQVMsRUFFVCxXQUFXLEVBQ1gsZ0JBQWdCLEVBQ2pCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QyxPQUFPLEVBQXdDLGFBQWEsRUFBRSxpQkFBaUIsRUFBWSxNQUFNLGdCQUFnQixDQUFDO0FBRWxILE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUMvQyxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDaEQsT0FBTyxFQUFpQixnQkFBZ0IsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBRXJFLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSw2QkFBNkIsQ0FBQztBQUMzRCxPQUFPLEVBQUMsYUFBYSxFQUE2QixNQUFNLGNBQWMsQ0FBQztBQUV2RSxPQUFPLEVBQUMsb0JBQW9CLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUMxRCxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDM0MsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLFlBQVksQ0FBQztBQUNuQyxPQUFPLEVBQUMsc0JBQXNCLEVBQUMsTUFBTSw2QkFBNkIsQ0FBQzs7SUFHN0QsNkJBQTZCLEdBQUc7SUFDcEMsT0FBTyxFQUFFLGlCQUFpQjtJQUMxQixXQUFXLEVBQUUsVUFBVSxDQUFDLGNBQU0sT0FBQSxr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Ozs7Ozs7SUFVdEQsNkNBQXlGOzs7OztJQUt6RiwyQ0FBK0I7Ozs7Ozs7SUFPL0IsNENBQWdDOzs7Ozs7O0lBT2hDLDRDQUEwQzs7Ozs7Ozs7O0lBUzFDLDBDQUEwRjs7Ozs7OztJQU8xRixxQ0FBZ0M7Ozs7Ozs7SUFPaEMscUNBQWdDOzs7Ozs7Ozs7SUFTaEMsd0NBQWtEOzs7Ozs7Ozs7OztJQVdsRCx5Q0FBeUQ7Ozs7Ozs7Ozs7Ozs7OztJQWV6RCx1Q0FBOEY7Ozs7O0lBSzlGLDBDQUErQjs7Ozs7SUFLL0IsNkNBQWtDOzs7Ozs7Ozs7O0lBVWxDLHVDQUFnRTs7Ozs7OztJQU9oRSx1Q0FBMkI7Ozs7Ozs7OztJQVMzQiw0Q0FBOEM7Ozs7Ozs7OztJQVM5Qyx3Q0FBbUQ7Ozs7Ozs7SUFPbkQsc0NBQW9FOzs7Ozs7O0lBT3BFLG9DQUE0Qzs7SUFjNUMsdUNBQW1DOztJQUNuQyx3Q0FBOEI7O0lBQzlCLDhDQUFvQzs7SUFJaEMsOENBQWdEOztJQUFFLG9DQUE0Qzs7SUFDOUYsb0NBQWdDOztJQUFFLHVDQUE0Qjs7SUFBRSxrQ0FBc0M7O0lBQ3RHLHFDQUF1Qjs7SUFBRSxzQ0FBc0M7O0lBQUUsdUNBQThCOztJQUMvRiwwQ0FBeUM7O0lBQUUsdUNBQXdDOztJQUNuRiw2Q0FBMEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxuICBDb21wb25lbnRSZWYsXG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBmb3J3YXJkUmVmLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPdXRwdXQsXG4gIFJlbmRlcmVyMixcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgVGVtcGxhdGVSZWYsXG4gIFZpZXdDb250YWluZXJSZWZcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0RPQ1VNRU5UfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtBYnN0cmFjdENvbnRyb2wsIENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxJREFUT1JTLCBOR19WQUxVRV9BQ0NFU1NPUiwgVmFsaWRhdG9yfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbmltcG9ydCB7bmdiQXV0b0Nsb3NlfSBmcm9tICcuLi91dGlsL2F1dG9jbG9zZSc7XG5pbXBvcnQge25nYkZvY3VzVHJhcH0gZnJvbSAnLi4vdXRpbC9mb2N1cy10cmFwJztcbmltcG9ydCB7UGxhY2VtZW50QXJyYXksIHBvc2l0aW9uRWxlbWVudHN9IGZyb20gJy4uL3V0aWwvcG9zaXRpb25pbmcnO1xuXG5pbXBvcnQge05nYkRhdGVBZGFwdGVyfSBmcm9tICcuL2FkYXB0ZXJzL25nYi1kYXRlLWFkYXB0ZXInO1xuaW1wb3J0IHtOZ2JEYXRlcGlja2VyLCBOZ2JEYXRlcGlja2VyTmF2aWdhdGVFdmVudH0gZnJvbSAnLi9kYXRlcGlja2VyJztcbmltcG9ydCB7RGF5VGVtcGxhdGVDb250ZXh0fSBmcm9tICcuL2RhdGVwaWNrZXItZGF5LXRlbXBsYXRlLWNvbnRleHQnO1xuaW1wb3J0IHtOZ2JEYXRlcGlja2VyU2VydmljZX0gZnJvbSAnLi9kYXRlcGlja2VyLXNlcnZpY2UnO1xuaW1wb3J0IHtOZ2JDYWxlbmRhcn0gZnJvbSAnLi9uZ2ItY2FsZW5kYXInO1xuaW1wb3J0IHtOZ2JEYXRlfSBmcm9tICcuL25nYi1kYXRlJztcbmltcG9ydCB7TmdiRGF0ZVBhcnNlckZvcm1hdHRlcn0gZnJvbSAnLi9uZ2ItZGF0ZS1wYXJzZXItZm9ybWF0dGVyJztcbmltcG9ydCB7TmdiRGF0ZVN0cnVjdH0gZnJvbSAnLi9uZ2ItZGF0ZS1zdHJ1Y3QnO1xuXG5jb25zdCBOR0JfREFURVBJQ0tFUl9WQUxVRV9BQ0NFU1NPUiA9IHtcbiAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE5nYklucHV0RGF0ZXBpY2tlciksXG4gIG11bHRpOiB0cnVlXG59O1xuXG5jb25zdCBOR0JfREFURVBJQ0tFUl9WQUxJREFUT1IgPSB7XG4gIHByb3ZpZGU6IE5HX1ZBTElEQVRPUlMsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE5nYklucHV0RGF0ZXBpY2tlciksXG4gIG11bHRpOiB0cnVlXG59O1xuXG4vKipcbiAqIEEgZGlyZWN0aXZlIHRoYXQgYWxsb3dzIHRvIHN0aWNrIGEgZGF0ZXBpY2tlciBwb3B1cCB0byBhbiBpbnB1dCBmaWVsZC5cbiAqXG4gKiBNYW5hZ2VzIGludGVyYWN0aW9uIHdpdGggdGhlIGlucHV0IGZpZWxkIGl0c2VsZiwgZG9lcyB2YWx1ZSBmb3JtYXR0aW5nIGFuZCBwcm92aWRlcyBmb3JtcyBpbnRlZ3JhdGlvbi5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnaW5wdXRbbmdiRGF0ZXBpY2tlcl0nLFxuICBleHBvcnRBczogJ25nYkRhdGVwaWNrZXInLFxuICBob3N0OiB7XG4gICAgJyhpbnB1dCknOiAnbWFudWFsRGF0ZUNoYW5nZSgkZXZlbnQudGFyZ2V0LnZhbHVlKScsXG4gICAgJyhjaGFuZ2UpJzogJ21hbnVhbERhdGVDaGFuZ2UoJGV2ZW50LnRhcmdldC52YWx1ZSwgdHJ1ZSknLFxuICAgICcoYmx1ciknOiAnb25CbHVyKCknLFxuICAgICdbZGlzYWJsZWRdJzogJ2Rpc2FibGVkJ1xuICB9LFxuICBwcm92aWRlcnM6IFtOR0JfREFURVBJQ0tFUl9WQUxVRV9BQ0NFU1NPUiwgTkdCX0RBVEVQSUNLRVJfVkFMSURBVE9SLCBOZ2JEYXRlcGlja2VyU2VydmljZV1cbn0pXG5leHBvcnQgY2xhc3MgTmdiSW5wdXREYXRlcGlja2VyIGltcGxlbWVudHMgT25DaGFuZ2VzLFxuICAgIE9uRGVzdHJveSwgQ29udHJvbFZhbHVlQWNjZXNzb3IsIFZhbGlkYXRvciB7XG4gIHByaXZhdGUgX2NSZWY6IENvbXBvbmVudFJlZjxOZ2JEYXRlcGlja2VyPiA9IG51bGw7XG4gIHByaXZhdGUgX2Rpc2FibGVkID0gZmFsc2U7XG4gIHByaXZhdGUgX21vZGVsOiBOZ2JEYXRlO1xuICBwcml2YXRlIF9pbnB1dFZhbHVlOiBzdHJpbmc7XG4gIHByaXZhdGUgX3pvbmVTdWJzY3JpcHRpb246IGFueTtcblxuICAvKipcbiAgICogSW5kaWNhdGVzIHdoZXRoZXIgdGhlIGRhdGVwaWNrZXIgcG9wdXAgc2hvdWxkIGJlIGNsb3NlZCBhdXRvbWF0aWNhbGx5IGFmdGVyIGRhdGUgc2VsZWN0aW9uIC8gb3V0c2lkZSBjbGljayBvciBub3QuXG4gICAqXG4gICAqICogYHRydWVgIC0gdGhlIHBvcHVwIHdpbGwgY2xvc2Ugb24gYm90aCBkYXRlIHNlbGVjdGlvbiBhbmQgb3V0c2lkZSBjbGljay5cbiAgICogKiBgZmFsc2VgIC0gdGhlIHBvcHVwIGNhbiBvbmx5IGJlIGNsb3NlZCBtYW51YWxseSB2aWEgYGNsb3NlKClgIG9yIGB0b2dnbGUoKWAgbWV0aG9kcy5cbiAgICogKiBgXCJpbnNpZGVcImAgLSB0aGUgcG9wdXAgd2lsbCBjbG9zZSBvbiBkYXRlIHNlbGVjdGlvbiwgYnV0IG5vdCBvdXRzaWRlIGNsaWNrcy5cbiAgICogKiBgXCJvdXRzaWRlXCJgIC0gdGhlIHBvcHVwIHdpbGwgY2xvc2Ugb25seSBvbiB0aGUgb3V0c2lkZSBjbGljayBhbmQgbm90IG9uIGRhdGUgc2VsZWN0aW9uL2luc2lkZSBjbGlja3MuXG4gICAqXG4gICAqIEBzaW5jZSAzLjAuMFxuICAgKi9cbiAgQElucHV0KCkgYXV0b0Nsb3NlOiBib29sZWFuIHwgJ2luc2lkZScgfCAnb3V0c2lkZScgPSB0cnVlO1xuXG4gIC8qKlxuICAgKiBUaGUgcmVmZXJlbmNlIHRvIGEgY3VzdG9tIHRlbXBsYXRlIGZvciB0aGUgZGF5LlxuICAgKlxuICAgKiBBbGxvd3MgdG8gY29tcGxldGVseSBvdmVycmlkZSB0aGUgd2F5IGEgZGF5ICdjZWxsJyBpbiB0aGUgY2FsZW5kYXIgaXMgZGlzcGxheWVkLlxuICAgKlxuICAgKiBTZWUgW2BEYXlUZW1wbGF0ZUNvbnRleHRgXSgjL2NvbXBvbmVudHMvZGF0ZXBpY2tlci9hcGkjRGF5VGVtcGxhdGVDb250ZXh0KSBmb3IgdGhlIGRhdGEgeW91IGdldCBpbnNpZGUuXG4gICAqL1xuICBASW5wdXQoKSBkYXlUZW1wbGF0ZTogVGVtcGxhdGVSZWY8RGF5VGVtcGxhdGVDb250ZXh0PjtcblxuICAvKipcbiAgICogVGhlIGNhbGxiYWNrIHRvIHBhc3MgYW55IGFyYml0cmFyeSBkYXRhIHRvIHRoZSB0ZW1wbGF0ZSBjZWxsIHZpYSB0aGVcbiAgICogW2BEYXlUZW1wbGF0ZUNvbnRleHRgXSgjL2NvbXBvbmVudHMvZGF0ZXBpY2tlci9hcGkjRGF5VGVtcGxhdGVDb250ZXh0KSdzIGBkYXRhYCBwYXJhbWV0ZXIuXG4gICAqXG4gICAqIGBjdXJyZW50YCBpcyB0aGUgbW9udGggdGhhdCBpcyBjdXJyZW50bHkgZGlzcGxheWVkIGJ5IHRoZSBkYXRlcGlja2VyLlxuICAgKlxuICAgKiBAc2luY2UgMy4zLjBcbiAgICovXG4gIEBJbnB1dCgpIGRheVRlbXBsYXRlRGF0YTogKGRhdGU6IE5nYkRhdGUsIGN1cnJlbnQ6IHt5ZWFyOiBudW1iZXIsIG1vbnRoOiBudW1iZXJ9KSA9PiBhbnk7XG5cbiAgLyoqXG4gICAqIFRoZSBudW1iZXIgb2YgbW9udGhzIHRvIGRpc3BsYXkuXG4gICAqL1xuICBASW5wdXQoKSBkaXNwbGF5TW9udGhzOiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFRoZSBmaXJzdCBkYXkgb2YgdGhlIHdlZWsuXG4gICAqXG4gICAqIFdpdGggZGVmYXVsdCBjYWxlbmRhciB3ZSB1c2UgSVNPIDg2MDE6ICd3ZWVrZGF5JyBpcyAxPU1vbiAuLi4gNz1TdW4uXG4gICAqL1xuICBASW5wdXQoKSBmaXJzdERheU9mV2VlazogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUaGUgcmVmZXJlbmNlIHRvIHRoZSBjdXN0b20gdGVtcGxhdGUgZm9yIHRoZSBkYXRlcGlja2VyIGZvb3Rlci5cbiAgICpcbiAgICogQHNpbmNlIDMuMy4wXG4gICAqL1xuICBASW5wdXQoKSBmb290ZXJUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAvKipcbiAgICogVGhlIGNhbGxiYWNrIHRvIG1hcmsgc29tZSBkYXRlcyBhcyBkaXNhYmxlZC5cbiAgICpcbiAgICogSXQgaXMgY2FsbGVkIGZvciBlYWNoIG5ldyBkYXRlIHdoZW4gbmF2aWdhdGluZyB0byBhIGRpZmZlcmVudCBtb250aC5cbiAgICpcbiAgICogYGN1cnJlbnRgIGlzIHRoZSBtb250aCB0aGF0IGlzIGN1cnJlbnRseSBkaXNwbGF5ZWQgYnkgdGhlIGRhdGVwaWNrZXIuXG4gICAqL1xuICBASW5wdXQoKSBtYXJrRGlzYWJsZWQ6IChkYXRlOiBOZ2JEYXRlLCBjdXJyZW50OiB7eWVhcjogbnVtYmVyLCBtb250aDogbnVtYmVyfSkgPT4gYm9vbGVhbjtcblxuICAvKipcbiAgICogVGhlIGVhcmxpZXN0IGRhdGUgdGhhdCBjYW4gYmUgZGlzcGxheWVkIG9yIHNlbGVjdGVkLiBBbHNvIHVzZWQgZm9yIGZvcm0gdmFsaWRhdGlvbi5cbiAgICpcbiAgICogSWYgbm90IHByb3ZpZGVkLCAneWVhcicgc2VsZWN0IGJveCB3aWxsIGRpc3BsYXkgMTAgeWVhcnMgYmVmb3JlIHRoZSBjdXJyZW50IG1vbnRoLlxuICAgKi9cbiAgQElucHV0KCkgbWluRGF0ZTogTmdiRGF0ZVN0cnVjdDtcblxuICAvKipcbiAgICogVGhlIGxhdGVzdCBkYXRlIHRoYXQgY2FuIGJlIGRpc3BsYXllZCBvciBzZWxlY3RlZC4gQWxzbyB1c2VkIGZvciBmb3JtIHZhbGlkYXRpb24uXG4gICAqXG4gICAqIElmIG5vdCBwcm92aWRlZCwgJ3llYXInIHNlbGVjdCBib3ggd2lsbCBkaXNwbGF5IDEwIHllYXJzIGFmdGVyIHRoZSBjdXJyZW50IG1vbnRoLlxuICAgKi9cbiAgQElucHV0KCkgbWF4RGF0ZTogTmdiRGF0ZVN0cnVjdDtcblxuICAvKipcbiAgICogTmF2aWdhdGlvbiB0eXBlLlxuICAgKlxuICAgKiAqIGBcInNlbGVjdFwiYCAtIHNlbGVjdCBib3hlcyBmb3IgbW9udGggYW5kIG5hdmlnYXRpb24gYXJyb3dzXG4gICAqICogYFwiYXJyb3dzXCJgIC0gb25seSBuYXZpZ2F0aW9uIGFycm93c1xuICAgKiAqIGBcIm5vbmVcImAgLSBubyBuYXZpZ2F0aW9uIHZpc2libGUgYXQgYWxsXG4gICAqL1xuICBASW5wdXQoKSBuYXZpZ2F0aW9uOiAnc2VsZWN0JyB8ICdhcnJvd3MnIHwgJ25vbmUnO1xuXG4gIC8qKlxuICAgKiBUaGUgd2F5IG9mIGRpc3BsYXlpbmcgZGF5cyB0aGF0IGRvbid0IGJlbG9uZyB0byB0aGUgY3VycmVudCBtb250aC5cbiAgICpcbiAgICogKiBgXCJ2aXNpYmxlXCJgIC0gZGF5cyBhcmUgdmlzaWJsZVxuICAgKiAqIGBcImhpZGRlblwiYCAtIGRheXMgYXJlIGhpZGRlbiwgd2hpdGUgc3BhY2UgcHJlc2VydmVkXG4gICAqICogYFwiY29sbGFwc2VkXCJgIC0gZGF5cyBhcmUgY29sbGFwc2VkLCBzbyB0aGUgZGF0ZXBpY2tlciBoZWlnaHQgbWlnaHQgY2hhbmdlIGJldHdlZW4gbW9udGhzXG4gICAqXG4gICAqIEZvciB0aGUgMisgbW9udGhzIHZpZXcsIGRheXMgaW4gYmV0d2VlbiBtb250aHMgYXJlIG5ldmVyIHNob3duLlxuICAgKi9cbiAgQElucHV0KCkgb3V0c2lkZURheXM6ICd2aXNpYmxlJyB8ICdjb2xsYXBzZWQnIHwgJ2hpZGRlbic7XG5cbiAgLyoqXG4gICAqIFRoZSBwcmVmZXJyZWQgcGxhY2VtZW50IG9mIHRoZSBkYXRlcGlja2VyIHBvcHVwLlxuICAgKlxuICAgKiBQb3NzaWJsZSB2YWx1ZXMgYXJlIGBcInRvcFwiYCwgYFwidG9wLWxlZnRcImAsIGBcInRvcC1yaWdodFwiYCwgYFwiYm90dG9tXCJgLCBgXCJib3R0b20tbGVmdFwiYCxcbiAgICogYFwiYm90dG9tLXJpZ2h0XCJgLCBgXCJsZWZ0XCJgLCBgXCJsZWZ0LXRvcFwiYCwgYFwibGVmdC1ib3R0b21cImAsIGBcInJpZ2h0XCJgLCBgXCJyaWdodC10b3BcImAsXG4gICAqIGBcInJpZ2h0LWJvdHRvbVwiYFxuICAgKlxuICAgKiBBY2NlcHRzIGFuIGFycmF5IG9mIHN0cmluZ3Mgb3IgYSBzdHJpbmcgd2l0aCBzcGFjZSBzZXBhcmF0ZWQgcG9zc2libGUgdmFsdWVzLlxuICAgKlxuICAgKiBUaGUgZGVmYXVsdCBvcmRlciBvZiBwcmVmZXJlbmNlIGlzIGBcImJvdHRvbS1sZWZ0IGJvdHRvbS1yaWdodCB0b3AtbGVmdCB0b3AtcmlnaHRcImBcbiAgICpcbiAgICogUGxlYXNlIHNlZSB0aGUgW3Bvc2l0aW9uaW5nIG92ZXJ2aWV3XSgjL3Bvc2l0aW9uaW5nKSBmb3IgbW9yZSBkZXRhaWxzLlxuICAgKi9cbiAgQElucHV0KCkgcGxhY2VtZW50OiBQbGFjZW1lbnRBcnJheSA9IFsnYm90dG9tLWxlZnQnLCAnYm90dG9tLXJpZ2h0JywgJ3RvcC1sZWZ0JywgJ3RvcC1yaWdodCddO1xuXG4gIC8qKlxuICAgKiBJZiBgdHJ1ZWAsIHdlZWtkYXlzIHdpbGwgYmUgZGlzcGxheWVkLlxuICAgKi9cbiAgQElucHV0KCkgc2hvd1dlZWtkYXlzOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBJZiBgdHJ1ZWAsIHdlZWsgbnVtYmVycyB3aWxsIGJlIGRpc3BsYXllZC5cbiAgICovXG4gIEBJbnB1dCgpIHNob3dXZWVrTnVtYmVyczogYm9vbGVhbjtcblxuICAvKipcbiAgICogVGhlIGRhdGUgdG8gb3BlbiBjYWxlbmRhciB3aXRoLlxuICAgKlxuICAgKiBXaXRoIHRoZSBkZWZhdWx0IGNhbGVuZGFyIHdlIHVzZSBJU08gODYwMTogJ21vbnRoJyBpcyAxPUphbiAuLi4gMTI9RGVjLlxuICAgKiBJZiBub3RoaW5nIG9yIGludmFsaWQgZGF0ZSBpcyBwcm92aWRlZCwgY2FsZW5kYXIgd2lsbCBvcGVuIHdpdGggY3VycmVudCBtb250aC5cbiAgICpcbiAgICogWW91IGNvdWxkIHVzZSBgbmF2aWdhdGVUbyhkYXRlKWAgbWV0aG9kIGFzIGFuIGFsdGVybmF0aXZlLlxuICAgKi9cbiAgQElucHV0KCkgc3RhcnREYXRlOiB7eWVhcjogbnVtYmVyLCBtb250aDogbnVtYmVyLCBkYXk/OiBudW1iZXJ9O1xuXG4gIC8qKlxuICAgKiBBIHNlbGVjdG9yIHNwZWNpZnlpbmcgdGhlIGVsZW1lbnQgdGhlIGRhdGVwaWNrZXIgcG9wdXAgc2hvdWxkIGJlIGFwcGVuZGVkIHRvLlxuICAgKlxuICAgKiBDdXJyZW50bHkgb25seSBzdXBwb3J0cyBgXCJib2R5XCJgLlxuICAgKi9cbiAgQElucHV0KCkgY29udGFpbmVyOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEEgY3NzIHNlbGVjdG9yIG9yIGh0bWwgZWxlbWVudCBzcGVjaWZ5aW5nIHRoZSBlbGVtZW50IHRoZSBkYXRlcGlja2VyIHBvcHVwIHNob3VsZCBiZSBwb3NpdGlvbmVkIGFnYWluc3QuXG4gICAqXG4gICAqIEJ5IGRlZmF1bHQgdGhlIGlucHV0IGlzIHVzZWQgYXMgYSB0YXJnZXQuXG4gICAqXG4gICAqIEBzaW5jZSA0LjIuMFxuICAgKi9cbiAgQElucHV0KCkgcG9zaXRpb25UYXJnZXQ6IHN0cmluZyB8IEhUTUxFbGVtZW50O1xuXG4gIC8qKlxuICAgKiBBbiBldmVudCBlbWl0dGVkIHdoZW4gdXNlciBzZWxlY3RzIGEgZGF0ZSB1c2luZyBrZXlib2FyZCBvciBtb3VzZS5cbiAgICpcbiAgICogVGhlIHBheWxvYWQgb2YgdGhlIGV2ZW50IGlzIGN1cnJlbnRseSBzZWxlY3RlZCBgTmdiRGF0ZWAuXG4gICAqXG4gICAqIEBzaW5jZSAxLjEuMVxuICAgKi9cbiAgQE91dHB1dCgpIGRhdGVTZWxlY3QgPSBuZXcgRXZlbnRFbWl0dGVyPE5nYkRhdGU+KCk7XG5cbiAgLyoqXG4gICAqIEV2ZW50IGVtaXR0ZWQgcmlnaHQgYWZ0ZXIgdGhlIG5hdmlnYXRpb24gaGFwcGVucyBhbmQgZGlzcGxheWVkIG1vbnRoIGNoYW5nZXMuXG4gICAqXG4gICAqIFNlZSBbYE5nYkRhdGVwaWNrZXJOYXZpZ2F0ZUV2ZW50YF0oIy9jb21wb25lbnRzL2RhdGVwaWNrZXIvYXBpI05nYkRhdGVwaWNrZXJOYXZpZ2F0ZUV2ZW50KSBmb3IgdGhlIHBheWxvYWQgaW5mby5cbiAgICovXG4gIEBPdXRwdXQoKSBuYXZpZ2F0ZSA9IG5ldyBFdmVudEVtaXR0ZXI8TmdiRGF0ZXBpY2tlck5hdmlnYXRlRXZlbnQ+KCk7XG5cbiAgLyoqXG4gICAqIEFuIGV2ZW50IGZpcmVkIGFmdGVyIGNsb3NpbmcgZGF0ZXBpY2tlciB3aW5kb3cuXG4gICAqXG4gICAqIEBzaW5jZSA0LjIuMFxuICAgKi9cbiAgQE91dHB1dCgpIGNsb3NlZCA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcblxuICBASW5wdXQoKVxuICBnZXQgZGlzYWJsZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Rpc2FibGVkO1xuICB9XG4gIHNldCBkaXNhYmxlZCh2YWx1ZTogYW55KSB7XG4gICAgdGhpcy5fZGlzYWJsZWQgPSB2YWx1ZSA9PT0gJycgfHwgKHZhbHVlICYmIHZhbHVlICE9PSAnZmFsc2UnKTtcblxuICAgIGlmICh0aGlzLmlzT3BlbigpKSB7XG4gICAgICB0aGlzLl9jUmVmLmluc3RhbmNlLnNldERpc2FibGVkU3RhdGUodGhpcy5fZGlzYWJsZWQpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX29uQ2hhbmdlID0gKF86IGFueSkgPT4ge307XG4gIHByaXZhdGUgX29uVG91Y2hlZCA9ICgpID0+IHt9O1xuICBwcml2YXRlIF92YWxpZGF0b3JDaGFuZ2UgPSAoKSA9PiB7fTtcblxuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSBfcGFyc2VyRm9ybWF0dGVyOiBOZ2JEYXRlUGFyc2VyRm9ybWF0dGVyLCBwcml2YXRlIF9lbFJlZjogRWxlbWVudFJlZjxIVE1MSW5wdXRFbGVtZW50PixcbiAgICAgIHByaXZhdGUgX3ZjUmVmOiBWaWV3Q29udGFpbmVyUmVmLCBwcml2YXRlIF9yZW5kZXJlcjogUmVuZGVyZXIyLCBwcml2YXRlIF9jZnI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbiAgICAgIHByaXZhdGUgX25nWm9uZTogTmdab25lLCBwcml2YXRlIF9zZXJ2aWNlOiBOZ2JEYXRlcGlja2VyU2VydmljZSwgcHJpdmF0ZSBfY2FsZW5kYXI6IE5nYkNhbGVuZGFyLFxuICAgICAgcHJpdmF0ZSBfZGF0ZUFkYXB0ZXI6IE5nYkRhdGVBZGFwdGVyPGFueT4sIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgX2RvY3VtZW50OiBhbnksXG4gICAgICBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvcjogQ2hhbmdlRGV0ZWN0b3JSZWYpIHtcbiAgICB0aGlzLl96b25lU3Vic2NyaXB0aW9uID0gX25nWm9uZS5vblN0YWJsZS5zdWJzY3JpYmUoKCkgPT4gdGhpcy5fdXBkYXRlUG9wdXBQb3NpdGlvbigpKTtcbiAgfVxuXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46ICh2YWx1ZTogYW55KSA9PiBhbnkpOiB2b2lkIHsgdGhpcy5fb25DaGFuZ2UgPSBmbjsgfVxuXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiAoKSA9PiBhbnkpOiB2b2lkIHsgdGhpcy5fb25Ub3VjaGVkID0gZm47IH1cblxuICByZWdpc3Rlck9uVmFsaWRhdG9yQ2hhbmdlKGZuOiAoKSA9PiB2b2lkKTogdm9pZCB7IHRoaXMuX3ZhbGlkYXRvckNoYW5nZSA9IGZuOyB9XG5cbiAgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKTogdm9pZCB7IHRoaXMuZGlzYWJsZWQgPSBpc0Rpc2FibGVkOyB9XG5cbiAgdmFsaWRhdGUoYzogQWJzdHJhY3RDb250cm9sKToge1trZXk6IHN0cmluZ106IGFueX0ge1xuICAgIGNvbnN0IHZhbHVlID0gYy52YWx1ZTtcblxuICAgIGlmICh2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBuZ2JEYXRlID0gdGhpcy5fZnJvbURhdGVTdHJ1Y3QodGhpcy5fZGF0ZUFkYXB0ZXIuZnJvbU1vZGVsKHZhbHVlKSk7XG5cbiAgICBpZiAoIXRoaXMuX2NhbGVuZGFyLmlzVmFsaWQobmdiRGF0ZSkpIHtcbiAgICAgIHJldHVybiB7J25nYkRhdGUnOiB7aW52YWxpZDogYy52YWx1ZX19O1xuICAgIH1cblxuICAgIGlmICh0aGlzLm1pbkRhdGUgJiYgbmdiRGF0ZS5iZWZvcmUoTmdiRGF0ZS5mcm9tKHRoaXMubWluRGF0ZSkpKSB7XG4gICAgICByZXR1cm4geyduZ2JEYXRlJzoge3JlcXVpcmVkQmVmb3JlOiB0aGlzLm1pbkRhdGV9fTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5tYXhEYXRlICYmIG5nYkRhdGUuYWZ0ZXIoTmdiRGF0ZS5mcm9tKHRoaXMubWF4RGF0ZSkpKSB7XG4gICAgICByZXR1cm4geyduZ2JEYXRlJzoge3JlcXVpcmVkQWZ0ZXI6IHRoaXMubWF4RGF0ZX19O1xuICAgIH1cbiAgfVxuXG4gIHdyaXRlVmFsdWUodmFsdWUpIHtcbiAgICB0aGlzLl9tb2RlbCA9IHRoaXMuX2Zyb21EYXRlU3RydWN0KHRoaXMuX2RhdGVBZGFwdGVyLmZyb21Nb2RlbCh2YWx1ZSkpO1xuICAgIHRoaXMuX3dyaXRlTW9kZWxWYWx1ZSh0aGlzLl9tb2RlbCk7XG4gIH1cblxuICBtYW51YWxEYXRlQ2hhbmdlKHZhbHVlOiBzdHJpbmcsIHVwZGF0ZVZpZXcgPSBmYWxzZSkge1xuICAgIGNvbnN0IGlucHV0VmFsdWVDaGFuZ2VkID0gdmFsdWUgIT09IHRoaXMuX2lucHV0VmFsdWU7XG4gICAgaWYgKGlucHV0VmFsdWVDaGFuZ2VkKSB7XG4gICAgICB0aGlzLl9pbnB1dFZhbHVlID0gdmFsdWU7XG4gICAgICB0aGlzLl9tb2RlbCA9IHRoaXMuX2Zyb21EYXRlU3RydWN0KHRoaXMuX3BhcnNlckZvcm1hdHRlci5wYXJzZSh2YWx1ZSkpO1xuICAgIH1cbiAgICBpZiAoaW5wdXRWYWx1ZUNoYW5nZWQgfHwgIXVwZGF0ZVZpZXcpIHtcbiAgICAgIHRoaXMuX29uQ2hhbmdlKHRoaXMuX21vZGVsID8gdGhpcy5fZGF0ZUFkYXB0ZXIudG9Nb2RlbCh0aGlzLl9tb2RlbCkgOiAodmFsdWUgPT09ICcnID8gbnVsbCA6IHZhbHVlKSk7XG4gICAgfVxuICAgIGlmICh1cGRhdGVWaWV3ICYmIHRoaXMuX21vZGVsKSB7XG4gICAgICB0aGlzLl93cml0ZU1vZGVsVmFsdWUodGhpcy5fbW9kZWwpO1xuICAgIH1cbiAgfVxuXG4gIGlzT3BlbigpIHsgcmV0dXJuICEhdGhpcy5fY1JlZjsgfVxuXG4gIC8qKlxuICAgKiBPcGVucyB0aGUgZGF0ZXBpY2tlciBwb3B1cC5cbiAgICpcbiAgICogSWYgdGhlIHJlbGF0ZWQgZm9ybSBjb250cm9sIGNvbnRhaW5zIGEgdmFsaWQgZGF0ZSwgdGhlIGNvcnJlc3BvbmRpbmcgbW9udGggd2lsbCBiZSBvcGVuZWQuXG4gICAqL1xuICBvcGVuKCkge1xuICAgIGlmICghdGhpcy5pc09wZW4oKSkge1xuICAgICAgY29uc3QgY2YgPSB0aGlzLl9jZnIucmVzb2x2ZUNvbXBvbmVudEZhY3RvcnkoTmdiRGF0ZXBpY2tlcik7XG4gICAgICB0aGlzLl9jUmVmID0gdGhpcy5fdmNSZWYuY3JlYXRlQ29tcG9uZW50KGNmKTtcblxuICAgICAgdGhpcy5fYXBwbHlQb3B1cFN0eWxpbmcodGhpcy5fY1JlZi5sb2NhdGlvbi5uYXRpdmVFbGVtZW50KTtcbiAgICAgIHRoaXMuX2FwcGx5RGF0ZXBpY2tlcklucHV0cyh0aGlzLl9jUmVmLmluc3RhbmNlKTtcbiAgICAgIHRoaXMuX3N1YnNjcmliZUZvckRhdGVwaWNrZXJPdXRwdXRzKHRoaXMuX2NSZWYuaW5zdGFuY2UpO1xuICAgICAgdGhpcy5fY1JlZi5pbnN0YW5jZS5uZ09uSW5pdCgpO1xuICAgICAgdGhpcy5fY1JlZi5pbnN0YW5jZS53cml0ZVZhbHVlKHRoaXMuX2RhdGVBZGFwdGVyLnRvTW9kZWwodGhpcy5fbW9kZWwpKTtcblxuICAgICAgLy8gZGF0ZSBzZWxlY3Rpb24gZXZlbnQgaGFuZGxpbmdcbiAgICAgIHRoaXMuX2NSZWYuaW5zdGFuY2UucmVnaXN0ZXJPbkNoYW5nZSgoc2VsZWN0ZWREYXRlKSA9PiB7XG4gICAgICAgIHRoaXMud3JpdGVWYWx1ZShzZWxlY3RlZERhdGUpO1xuICAgICAgICB0aGlzLl9vbkNoYW5nZShzZWxlY3RlZERhdGUpO1xuICAgICAgICB0aGlzLl9vblRvdWNoZWQoKTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLl9jUmVmLmNoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcblxuICAgICAgdGhpcy5fY1JlZi5pbnN0YW5jZS5zZXREaXNhYmxlZFN0YXRlKHRoaXMuZGlzYWJsZWQpO1xuXG4gICAgICBpZiAodGhpcy5jb250YWluZXIgPT09ICdib2R5Jykge1xuICAgICAgICB3aW5kb3cuZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLmNvbnRhaW5lcikuYXBwZW5kQ2hpbGQodGhpcy5fY1JlZi5sb2NhdGlvbi5uYXRpdmVFbGVtZW50KTtcbiAgICAgIH1cblxuICAgICAgLy8gZm9jdXMgaGFuZGxpbmdcbiAgICAgIG5nYkZvY3VzVHJhcCh0aGlzLl9jUmVmLmxvY2F0aW9uLm5hdGl2ZUVsZW1lbnQsIHRoaXMuY2xvc2VkLCB0cnVlKTtcbiAgICAgIHRoaXMuX2NSZWYuaW5zdGFuY2UuZm9jdXMoKTtcblxuICAgICAgbmdiQXV0b0Nsb3NlKFxuICAgICAgICAgIHRoaXMuX25nWm9uZSwgdGhpcy5fZG9jdW1lbnQsIHRoaXMuYXV0b0Nsb3NlLCAoKSA9PiB0aGlzLmNsb3NlKCksIHRoaXMuY2xvc2VkLCBbXSxcbiAgICAgICAgICBbdGhpcy5fZWxSZWYubmF0aXZlRWxlbWVudCwgdGhpcy5fY1JlZi5sb2NhdGlvbi5uYXRpdmVFbGVtZW50XSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENsb3NlcyB0aGUgZGF0ZXBpY2tlciBwb3B1cC5cbiAgICovXG4gIGNsb3NlKCkge1xuICAgIGlmICh0aGlzLmlzT3BlbigpKSB7XG4gICAgICB0aGlzLl92Y1JlZi5yZW1vdmUodGhpcy5fdmNSZWYuaW5kZXhPZih0aGlzLl9jUmVmLmhvc3RWaWV3KSk7XG4gICAgICB0aGlzLl9jUmVmID0gbnVsbDtcbiAgICAgIHRoaXMuY2xvc2VkLmVtaXQoKTtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUb2dnbGVzIHRoZSBkYXRlcGlja2VyIHBvcHVwLlxuICAgKi9cbiAgdG9nZ2xlKCkge1xuICAgIGlmICh0aGlzLmlzT3BlbigpKSB7XG4gICAgICB0aGlzLmNsb3NlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub3BlbigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBOYXZpZ2F0ZXMgdG8gdGhlIHByb3ZpZGVkIGRhdGUuXG4gICAqXG4gICAqIFdpdGggdGhlIGRlZmF1bHQgY2FsZW5kYXIgd2UgdXNlIElTTyA4NjAxOiAnbW9udGgnIGlzIDE9SmFuIC4uLiAxMj1EZWMuXG4gICAqIElmIG5vdGhpbmcgb3IgaW52YWxpZCBkYXRlIHByb3ZpZGVkIGNhbGVuZGFyIHdpbGwgb3BlbiBjdXJyZW50IG1vbnRoLlxuICAgKlxuICAgKiBVc2UgdGhlIGBbc3RhcnREYXRlXWAgaW5wdXQgYXMgYW4gYWx0ZXJuYXRpdmUuXG4gICAqL1xuICBuYXZpZ2F0ZVRvKGRhdGU/OiB7eWVhcjogbnVtYmVyLCBtb250aDogbnVtYmVyLCBkYXk/OiBudW1iZXJ9KSB7XG4gICAgaWYgKHRoaXMuaXNPcGVuKCkpIHtcbiAgICAgIHRoaXMuX2NSZWYuaW5zdGFuY2UubmF2aWdhdGVUbyhkYXRlKTtcbiAgICB9XG4gIH1cblxuICBvbkJsdXIoKSB7IHRoaXMuX29uVG91Y2hlZCgpOyB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmIChjaGFuZ2VzWydtaW5EYXRlJ10gfHwgY2hhbmdlc1snbWF4RGF0ZSddKSB7XG4gICAgICB0aGlzLl92YWxpZGF0b3JDaGFuZ2UoKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLmNsb3NlKCk7XG4gICAgdGhpcy5fem9uZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBfYXBwbHlEYXRlcGlja2VySW5wdXRzKGRhdGVwaWNrZXJJbnN0YW5jZTogTmdiRGF0ZXBpY2tlcik6IHZvaWQge1xuICAgIFsnZGF5VGVtcGxhdGUnLCAnZGF5VGVtcGxhdGVEYXRhJywgJ2Rpc3BsYXlNb250aHMnLCAnZmlyc3REYXlPZldlZWsnLCAnZm9vdGVyVGVtcGxhdGUnLCAnbWFya0Rpc2FibGVkJywgJ21pbkRhdGUnLFxuICAgICAnbWF4RGF0ZScsICduYXZpZ2F0aW9uJywgJ291dHNpZGVEYXlzJywgJ3Nob3dOYXZpZ2F0aW9uJywgJ3Nob3dXZWVrZGF5cycsICdzaG93V2Vla051bWJlcnMnXVxuICAgICAgICAuZm9yRWFjaCgob3B0aW9uTmFtZTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgaWYgKHRoaXNbb3B0aW9uTmFtZV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgZGF0ZXBpY2tlckluc3RhbmNlW29wdGlvbk5hbWVdID0gdGhpc1tvcHRpb25OYW1lXTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIGRhdGVwaWNrZXJJbnN0YW5jZS5zdGFydERhdGUgPSB0aGlzLnN0YXJ0RGF0ZSB8fCB0aGlzLl9tb2RlbDtcbiAgfVxuXG4gIHByaXZhdGUgX2FwcGx5UG9wdXBTdHlsaW5nKG5hdGl2ZUVsZW1lbnQ6IGFueSkge1xuICAgIHRoaXMuX3JlbmRlcmVyLmFkZENsYXNzKG5hdGl2ZUVsZW1lbnQsICdkcm9wZG93bi1tZW51Jyk7XG4gICAgdGhpcy5fcmVuZGVyZXIuYWRkQ2xhc3MobmF0aXZlRWxlbWVudCwgJ3Nob3cnKTtcblxuICAgIGlmICh0aGlzLmNvbnRhaW5lciA9PT0gJ2JvZHknKSB7XG4gICAgICB0aGlzLl9yZW5kZXJlci5hZGRDbGFzcyhuYXRpdmVFbGVtZW50LCAnbmdiLWRwLWJvZHknKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9zdWJzY3JpYmVGb3JEYXRlcGlja2VyT3V0cHV0cyhkYXRlcGlja2VySW5zdGFuY2U6IE5nYkRhdGVwaWNrZXIpIHtcbiAgICBkYXRlcGlja2VySW5zdGFuY2UubmF2aWdhdGUuc3Vic2NyaWJlKG5hdmlnYXRlRXZlbnQgPT4gdGhpcy5uYXZpZ2F0ZS5lbWl0KG5hdmlnYXRlRXZlbnQpKTtcbiAgICBkYXRlcGlja2VySW5zdGFuY2Uuc2VsZWN0LnN1YnNjcmliZShkYXRlID0+IHtcbiAgICAgIHRoaXMuZGF0ZVNlbGVjdC5lbWl0KGRhdGUpO1xuICAgICAgaWYgKHRoaXMuYXV0b0Nsb3NlID09PSB0cnVlIHx8IHRoaXMuYXV0b0Nsb3NlID09PSAnaW5zaWRlJykge1xuICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF93cml0ZU1vZGVsVmFsdWUobW9kZWw6IE5nYkRhdGUpIHtcbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuX3BhcnNlckZvcm1hdHRlci5mb3JtYXQobW9kZWwpO1xuICAgIHRoaXMuX2lucHV0VmFsdWUgPSB2YWx1ZTtcbiAgICB0aGlzLl9yZW5kZXJlci5zZXRQcm9wZXJ0eSh0aGlzLl9lbFJlZi5uYXRpdmVFbGVtZW50LCAndmFsdWUnLCB2YWx1ZSk7XG4gICAgaWYgKHRoaXMuaXNPcGVuKCkpIHtcbiAgICAgIHRoaXMuX2NSZWYuaW5zdGFuY2Uud3JpdGVWYWx1ZSh0aGlzLl9kYXRlQWRhcHRlci50b01vZGVsKG1vZGVsKSk7XG4gICAgICB0aGlzLl9vblRvdWNoZWQoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9mcm9tRGF0ZVN0cnVjdChkYXRlOiBOZ2JEYXRlU3RydWN0KTogTmdiRGF0ZSB7XG4gICAgY29uc3QgbmdiRGF0ZSA9IGRhdGUgPyBuZXcgTmdiRGF0ZShkYXRlLnllYXIsIGRhdGUubW9udGgsIGRhdGUuZGF5KSA6IG51bGw7XG4gICAgcmV0dXJuIHRoaXMuX2NhbGVuZGFyLmlzVmFsaWQobmdiRGF0ZSkgPyBuZ2JEYXRlIDogbnVsbDtcbiAgfVxuXG4gIHByaXZhdGUgX3VwZGF0ZVBvcHVwUG9zaXRpb24oKSB7XG4gICAgaWYgKCF0aGlzLl9jUmVmKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IGhvc3RFbGVtZW50OiBIVE1MRWxlbWVudDtcbiAgICBpZiAodHlwZW9mIHRoaXMucG9zaXRpb25UYXJnZXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICBob3N0RWxlbWVudCA9IHdpbmRvdy5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRoaXMucG9zaXRpb25UYXJnZXQpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5wb3NpdGlvblRhcmdldCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICBob3N0RWxlbWVudCA9IHRoaXMucG9zaXRpb25UYXJnZXQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGhvc3RFbGVtZW50ID0gdGhpcy5fZWxSZWYubmF0aXZlRWxlbWVudDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wb3NpdGlvblRhcmdldCAmJiAhaG9zdEVsZW1lbnQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignbmdiRGF0ZXBpY2tlciBjb3VsZCBub3QgZmluZCBlbGVtZW50IGRlY2xhcmVkIGluIFtwb3NpdGlvblRhcmdldF0gdG8gcG9zaXRpb24gYWdhaW5zdC4nKTtcbiAgICB9XG5cbiAgICBwb3NpdGlvbkVsZW1lbnRzKGhvc3RFbGVtZW50LCB0aGlzLl9jUmVmLmxvY2F0aW9uLm5hdGl2ZUVsZW1lbnQsIHRoaXMucGxhY2VtZW50LCB0aGlzLmNvbnRhaW5lciA9PT0gJ2JvZHknKTtcbiAgfVxufVxuIl19