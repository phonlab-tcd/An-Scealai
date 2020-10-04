/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { ChangeDetectorRef, Component, forwardRef, Input, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { isInteger, isNumber, padNumber, toInteger } from '../util/util';
import { NgbTime } from './ngb-time';
import { NgbTimepickerConfig } from './timepicker-config';
import { NgbTimeAdapter } from './ngb-time-adapter';
/** @type {?} */
const NGB_TIMEPICKER_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NgbTimepicker),
    multi: true
};
/**
 * A directive that helps with wth picking hours, minutes and seconds.
 */
export class NgbTimepicker {
    /**
     * @param {?} _config
     * @param {?} _ngbTimeAdapter
     * @param {?} _cd
     */
    constructor(_config, _ngbTimeAdapter, _cd) {
        this._config = _config;
        this._ngbTimeAdapter = _ngbTimeAdapter;
        this._cd = _cd;
        this.onChange = (_) => { };
        this.onTouched = () => { };
        this.meridian = _config.meridian;
        this.spinners = _config.spinners;
        this.seconds = _config.seconds;
        this.hourStep = _config.hourStep;
        this.minuteStep = _config.minuteStep;
        this.secondStep = _config.secondStep;
        this.disabled = _config.disabled;
        this.readonlyInputs = _config.readonlyInputs;
        this.size = _config.size;
    }
    /**
     * The number of hours to add/subtract when clicking hour spinners.
     * @param {?} step
     * @return {?}
     */
    set hourStep(step) {
        this._hourStep = isInteger(step) ? step : this._config.hourStep;
    }
    /**
     * @return {?}
     */
    get hourStep() { return this._hourStep; }
    /**
     * The number of minutes to add/subtract when clicking minute spinners.
     * @param {?} step
     * @return {?}
     */
    set minuteStep(step) {
        this._minuteStep = isInteger(step) ? step : this._config.minuteStep;
    }
    /**
     * @return {?}
     */
    get minuteStep() { return this._minuteStep; }
    /**
     * The number of seconds to add/subtract when clicking second spinners.
     * @param {?} step
     * @return {?}
     */
    set secondStep(step) {
        this._secondStep = isInteger(step) ? step : this._config.secondStep;
    }
    /**
     * @return {?}
     */
    get secondStep() { return this._secondStep; }
    /**
     * @param {?} value
     * @return {?}
     */
    writeValue(value) {
        /** @type {?} */
        const structValue = this._ngbTimeAdapter.fromModel(value);
        this.model = structValue ? new NgbTime(structValue.hour, structValue.minute, structValue.second) : new NgbTime();
        if (!this.seconds && (!structValue || !isNumber(structValue.second))) {
            this.model.second = 0;
        }
        this._cd.markForCheck();
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnChange(fn) { this.onChange = fn; }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnTouched(fn) { this.onTouched = fn; }
    /**
     * @param {?} isDisabled
     * @return {?}
     */
    setDisabledState(isDisabled) { this.disabled = isDisabled; }
    /**
     * @param {?} step
     * @return {?}
     */
    changeHour(step) {
        this.model.changeHour(step);
        this.propagateModelChange();
    }
    /**
     * @param {?} step
     * @return {?}
     */
    changeMinute(step) {
        this.model.changeMinute(step);
        this.propagateModelChange();
    }
    /**
     * @param {?} step
     * @return {?}
     */
    changeSecond(step) {
        this.model.changeSecond(step);
        this.propagateModelChange();
    }
    /**
     * @param {?} newVal
     * @return {?}
     */
    updateHour(newVal) {
        /** @type {?} */
        const isPM = this.model.hour >= 12;
        /** @type {?} */
        const enteredHour = toInteger(newVal);
        if (this.meridian && (isPM && enteredHour < 12 || !isPM && enteredHour === 12)) {
            this.model.updateHour(enteredHour + 12);
        }
        else {
            this.model.updateHour(enteredHour);
        }
        this.propagateModelChange();
    }
    /**
     * @param {?} newVal
     * @return {?}
     */
    updateMinute(newVal) {
        this.model.updateMinute(toInteger(newVal));
        this.propagateModelChange();
    }
    /**
     * @param {?} newVal
     * @return {?}
     */
    updateSecond(newVal) {
        this.model.updateSecond(toInteger(newVal));
        this.propagateModelChange();
    }
    /**
     * @return {?}
     */
    toggleMeridian() {
        if (this.meridian) {
            this.changeHour(12);
        }
    }
    /**
     * @param {?} value
     * @return {?}
     */
    formatHour(value) {
        if (isNumber(value)) {
            if (this.meridian) {
                return padNumber(value % 12 === 0 ? 12 : value % 12);
            }
            else {
                return padNumber(value % 24);
            }
        }
        else {
            return padNumber(NaN);
        }
    }
    /**
     * @param {?} value
     * @return {?}
     */
    formatMinSec(value) { return padNumber(value); }
    /**
     * @return {?}
     */
    get isSmallSize() { return this.size === 'small'; }
    /**
     * @return {?}
     */
    get isLargeSize() { return this.size === 'large'; }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes['seconds'] && !this.seconds && this.model && !isNumber(this.model.second)) {
            this.model.second = 0;
            this.propagateModelChange(false);
        }
    }
    /**
     * @param {?=} touched
     * @return {?}
     */
    propagateModelChange(touched = true) {
        if (touched) {
            this.onTouched();
        }
        if (this.model.isValid(this.seconds)) {
            this.onChange(this._ngbTimeAdapter.toModel({ hour: this.model.hour, minute: this.model.minute, second: this.model.second }));
        }
        else {
            this.onChange(this._ngbTimeAdapter.toModel(null));
        }
    }
}
NgbTimepicker.decorators = [
    { type: Component, args: [{
                selector: 'ngb-timepicker',
                encapsulation: ViewEncapsulation.None,
                template: `
    <fieldset [disabled]="disabled" [class.disabled]="disabled">
      <div class="ngb-tp">
        <div class="ngb-tp-input-container ngb-tp-hour">
          <button *ngIf="spinners" tabindex="-1" type="button" (click)="changeHour(hourStep)"
            class="btn btn-link" [class.btn-sm]="isSmallSize" [class.btn-lg]="isLargeSize" [class.disabled]="disabled"
            [disabled]="disabled">
            <span class="chevron ngb-tp-chevron"></span>
            <span class="sr-only" i18n="@@ngb.timepicker.increment-hours">Increment hours</span>
          </button>
          <input type="text" class="ngb-tp-input form-control" [class.form-control-sm]="isSmallSize" [class.form-control-lg]="isLargeSize"
            maxlength="2" placeholder="HH" i18n-placeholder="@@ngb.timepicker.HH"
            [value]="formatHour(model?.hour)" (change)="updateHour($event.target.value)"
            [readOnly]="readonlyInputs" [disabled]="disabled" aria-label="Hours" i18n-aria-label="@@ngb.timepicker.hours"
            (keydown.ArrowUp)="changeHour(hourStep); $event.preventDefault()"
            (keydown.ArrowDown)="changeHour(-hourStep); $event.preventDefault()">
          <button *ngIf="spinners" tabindex="-1" type="button" (click)="changeHour(-hourStep)"
            class="btn btn-link" [class.btn-sm]="isSmallSize" [class.btn-lg]="isLargeSize" [class.disabled]="disabled"
            [disabled]="disabled">
            <span class="chevron ngb-tp-chevron bottom"></span>
            <span class="sr-only" i18n="@@ngb.timepicker.decrement-hours">Decrement hours</span>
          </button>
        </div>
        <div class="ngb-tp-spacer">:</div>
        <div class="ngb-tp-input-container ngb-tp-minute">
          <button *ngIf="spinners" tabindex="-1" type="button" (click)="changeMinute(minuteStep)"
            class="btn btn-link" [class.btn-sm]="isSmallSize" [class.btn-lg]="isLargeSize" [class.disabled]="disabled"
            [disabled]="disabled">
            <span class="chevron ngb-tp-chevron"></span>
            <span class="sr-only" i18n="@@ngb.timepicker.increment-minutes">Increment minutes</span>
          </button>
          <input type="text" class="ngb-tp-input form-control" [class.form-control-sm]="isSmallSize" [class.form-control-lg]="isLargeSize"
            maxlength="2" placeholder="MM" i18n-placeholder="@@ngb.timepicker.MM"
            [value]="formatMinSec(model?.minute)" (change)="updateMinute($event.target.value)"
            [readOnly]="readonlyInputs" [disabled]="disabled" aria-label="Minutes" i18n-aria-label="@@ngb.timepicker.minutes"
            (keydown.ArrowUp)="changeMinute(minuteStep); $event.preventDefault()"
            (keydown.ArrowDown)="changeMinute(-minuteStep); $event.preventDefault()">
          <button *ngIf="spinners" tabindex="-1" type="button" (click)="changeMinute(-minuteStep)"
            class="btn btn-link" [class.btn-sm]="isSmallSize" [class.btn-lg]="isLargeSize"  [class.disabled]="disabled"
            [disabled]="disabled">
            <span class="chevron ngb-tp-chevron bottom"></span>
            <span class="sr-only"  i18n="@@ngb.timepicker.decrement-minutes">Decrement minutes</span>
          </button>
        </div>
        <div *ngIf="seconds" class="ngb-tp-spacer">:</div>
        <div *ngIf="seconds" class="ngb-tp-input-container ngb-tp-second">
          <button *ngIf="spinners" tabindex="-1" type="button" (click)="changeSecond(secondStep)"
            class="btn btn-link" [class.btn-sm]="isSmallSize" [class.btn-lg]="isLargeSize" [class.disabled]="disabled"
            [disabled]="disabled">
            <span class="chevron ngb-tp-chevron"></span>
            <span class="sr-only" i18n="@@ngb.timepicker.increment-seconds">Increment seconds</span>
          </button>
          <input type="text" class="ngb-tp-input form-control" [class.form-control-sm]="isSmallSize" [class.form-control-lg]="isLargeSize"
            maxlength="2" placeholder="SS" i18n-placeholder="@@ngb.timepicker.SS"
            [value]="formatMinSec(model?.second)" (change)="updateSecond($event.target.value)"
            [readOnly]="readonlyInputs" [disabled]="disabled" aria-label="Seconds" i18n-aria-label="@@ngb.timepicker.seconds"
            (keydown.ArrowUp)="changeSecond(secondStep); $event.preventDefault()"
            (keydown.ArrowDown)="changeSecond(-secondStep); $event.preventDefault()">
          <button *ngIf="spinners" tabindex="-1" type="button" (click)="changeSecond(-secondStep)"
            class="btn btn-link" [class.btn-sm]="isSmallSize" [class.btn-lg]="isLargeSize"  [class.disabled]="disabled"
            [disabled]="disabled">
            <span class="chevron ngb-tp-chevron bottom"></span>
            <span class="sr-only" i18n="@@ngb.timepicker.decrement-seconds">Decrement seconds</span>
          </button>
        </div>
        <div *ngIf="meridian" class="ngb-tp-spacer"></div>
        <div *ngIf="meridian" class="ngb-tp-meridian">
          <button type="button" class="btn btn-outline-primary" [class.btn-sm]="isSmallSize" [class.btn-lg]="isLargeSize"
            [disabled]="disabled" [class.disabled]="disabled"
                  (click)="toggleMeridian()">
            <ng-container *ngIf="model?.hour >= 12; else am" i18n="@@ngb.timepicker.PM">PM</ng-container>
            <ng-template #am i18n="@@ngb.timepicker.AM">AM</ng-template>
          </button>
        </div>
      </div>
    </fieldset>
  `,
                providers: [NGB_TIMEPICKER_VALUE_ACCESSOR],
                styles: ["ngb-timepicker{font-size:1rem}.ngb-tp{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center}.ngb-tp-input-container{width:4em}.ngb-tp-chevron::before{border-style:solid;border-width:.29em .29em 0 0;content:'';display:inline-block;height:.69em;left:.05em;position:relative;top:.15em;-webkit-transform:rotate(-45deg);transform:rotate(-45deg);vertical-align:middle;width:.69em}.ngb-tp-chevron.bottom:before{top:-.3em;-webkit-transform:rotate(135deg);transform:rotate(135deg)}.ngb-tp-input{text-align:center}.ngb-tp-hour,.ngb-tp-meridian,.ngb-tp-minute,.ngb-tp-second{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;-ms-flex-align:center;align-items:center;-ms-flex-pack:distribute;justify-content:space-around}.ngb-tp-spacer{width:1em;text-align:center}"]
            }] }
];
/** @nocollapse */
NgbTimepicker.ctorParameters = () => [
    { type: NgbTimepickerConfig },
    { type: NgbTimeAdapter },
    { type: ChangeDetectorRef }
];
NgbTimepicker.propDecorators = {
    meridian: [{ type: Input }],
    spinners: [{ type: Input }],
    seconds: [{ type: Input }],
    hourStep: [{ type: Input }],
    minuteStep: [{ type: Input }],
    secondStep: [{ type: Input }],
    readonlyInputs: [{ type: Input }],
    size: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    NgbTimepicker.prototype.disabled;
    /** @type {?} */
    NgbTimepicker.prototype.model;
    /** @type {?} */
    NgbTimepicker.prototype._hourStep;
    /** @type {?} */
    NgbTimepicker.prototype._minuteStep;
    /** @type {?} */
    NgbTimepicker.prototype._secondStep;
    /**
     * Whether to display 12H or 24H mode.
     * @type {?}
     */
    NgbTimepicker.prototype.meridian;
    /**
     * If `true`, the spinners above and below inputs are visible.
     * @type {?}
     */
    NgbTimepicker.prototype.spinners;
    /**
     * If `true`, it is possible to select seconds.
     * @type {?}
     */
    NgbTimepicker.prototype.seconds;
    /**
     * If `true`, the timepicker is readonly and can't be changed.
     * @type {?}
     */
    NgbTimepicker.prototype.readonlyInputs;
    /**
     * The size of inputs and buttons.
     * @type {?}
     */
    NgbTimepicker.prototype.size;
    /** @type {?} */
    NgbTimepicker.prototype.onChange;
    /** @type {?} */
    NgbTimepicker.prototype.onTouched;
    /** @type {?} */
    NgbTimepicker.prototype._config;
    /** @type {?} */
    NgbTimepicker.prototype._ngbTimeAdapter;
    /** @type {?} */
    NgbTimepicker.prototype._cd;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZXBpY2tlci5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwLyIsInNvdXJjZXMiOlsidGltZXBpY2tlci90aW1lcGlja2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQ0wsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsS0FBSyxFQUdMLGlCQUFpQixFQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQXVCLGlCQUFpQixFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFdkUsT0FBTyxFQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUN2RSxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQ25DLE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ3hELE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQzs7TUFFNUMsNkJBQTZCLEdBQUc7SUFDcEMsT0FBTyxFQUFFLGlCQUFpQjtJQUMxQixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLGFBQWEsQ0FBQztJQUM1QyxLQUFLLEVBQUUsSUFBSTtDQUNaOzs7O0FBd0ZELE1BQU0sT0FBTyxhQUFhOzs7Ozs7SUFnRXhCLFlBQ3FCLE9BQTRCLEVBQVUsZUFBb0MsRUFDbkYsR0FBc0I7UUFEYixZQUFPLEdBQVAsT0FBTyxDQUFxQjtRQUFVLG9CQUFlLEdBQWYsZUFBZSxDQUFxQjtRQUNuRixRQUFHLEdBQUgsR0FBRyxDQUFtQjtRQVlsQyxhQUFRLEdBQUcsQ0FBQyxDQUFNLEVBQUUsRUFBRSxHQUFFLENBQUMsQ0FBQztRQUMxQixjQUFTLEdBQUcsR0FBRyxFQUFFLEdBQUUsQ0FBQyxDQUFDO1FBWm5CLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQztRQUNqQyxJQUFJ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Qix1Q0FBaUM7Ozs7O0lBS2pDLDZCQUE0Qzs7SUFnQjVDLGlDQUEwQjs7SUFDMUIsa0NBQXFCOztJQWRqQixnQ0FBNkM7O0lBQUUsd0NBQTRDOztJQUMzRiw0QkFBOEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBmb3J3YXJkUmVmLFxuICBJbnB1dCxcbiAgT25DaGFuZ2VzLFxuICBTaW1wbGVDaGFuZ2VzLFxuICBWaWV3RW5jYXBzdWxhdGlvblxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q29udHJvbFZhbHVlQWNjZXNzb3IsIE5HX1ZBTFVFX0FDQ0VTU09SfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbmltcG9ydCB7aXNJbnRlZ2VyLCBpc051bWJlciwgcGFkTnVtYmVyLCB0b0ludGVnZXJ9IGZyb20gJy4uL3V0aWwvdXRpbCc7XG5pbXBvcnQge05nYlRpbWV9IGZyb20gJy4vbmdiLXRpbWUnO1xuaW1wb3J0IHtOZ2JUaW1lcGlja2VyQ29uZmlnfSBmcm9tICcuL3RpbWVwaWNrZXItY29uZmlnJztcbmltcG9ydCB7TmdiVGltZUFkYXB0ZXJ9IGZyb20gJy4vbmdiLXRpbWUtYWRhcHRlcic7XG5cbmNvbnN0IE5HQl9USU1FUElDS0VSX1ZBTFVFX0FDQ0VTU09SID0ge1xuICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTmdiVGltZXBpY2tlciksXG4gIG11bHRpOiB0cnVlXG59O1xuXG4vKipcbiAqIEEgZGlyZWN0aXZlIHRoYXQgaGVscHMgd2l0aCB3dGggcGlja2luZyBob3VycywgbWludXRlcyBhbmQgc2Vjb25kcy5cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbmdiLXRpbWVwaWNrZXInLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBzdHlsZVVybHM6IFsnLi90aW1lcGlja2VyLnNjc3MnXSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZmllbGRzZXQgW2Rpc2FibGVkXT1cImRpc2FibGVkXCIgW2NsYXNzLmRpc2FibGVkXT1cImRpc2FibGVkXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwibmdiLXRwXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJuZ2ItdHAtaW5wdXQtY29udGFpbmVyIG5nYi10cC1ob3VyXCI+XG4gICAgICAgICAgPGJ1dHRvbiAqbmdJZj1cInNwaW5uZXJzXCIgdGFiaW5kZXg9XCItMVwiIHR5cGU9XCJidXR0b25cIiAoY2xpY2spPVwiY2hhbmdlSG91cihob3VyU3RlcClcIlxuICAgICAgICAgICAgY2xhc3M9XCJidG4gYnRuLWxpbmtcIiBbY2xhc3MuYnRuLXNtXT1cImlzU21hbGxTaXplXCIgW2NsYXNzLmJ0bi1sZ109XCJpc0xhcmdlU2l6ZVwiIFtjbGFzcy5kaXNhYmxlZF09XCJkaXNhYmxlZFwiXG4gICAgICAgICAgICBbZGlzYWJsZWRdPVwiZGlzYWJsZWRcIj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY2hldnJvbiBuZ2ItdHAtY2hldnJvblwiPjwvc3Bhbj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic3Itb25seVwiIGkxOG49XCJAQG5nYi50aW1lcGlja2VyLmluY3JlbWVudC1ob3Vyc1wiPkluY3JlbWVudCBob3Vyczwvc3Bhbj5cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cIm5nYi10cC1pbnB1dCBmb3JtLWNvbnRyb2xcIiBbY2xhc3MuZm9ybS1jb250cm9sLXNtXT1cImlzU21hbGxTaXplXCIgW2NsYXNzLmZvcm0tY29udHJvbC1sZ109XCJpc0xhcmdlU2l6ZVwiXG4gICAgICAgICAgICBtYXhsZW5ndGg9XCIyXCIgcGxhY2Vob2xkZXI9XCJISFwiIGkxOG4tcGxhY2Vob2xkZXI9XCJAQG5nYi50aW1lcGlja2VyLkhIXCJcbiAgICAgICAgICAgIFt2YWx1ZV09XCJmb3JtYXRIb3VyKG1vZGVsPy5ob3VyKVwiIChjaGFuZ2UpPVwidXBkYXRlSG91cigkZXZlbnQudGFyZ2V0LnZhbHVlKVwiXG4gICAgICAgICAgICBbcmVhZE9ubHldPVwicmVhZG9ubHlJbnB1dHNcIiBbZGlzYWJsZWRdPVwiZGlzYWJsZWRcIiBhcmlhLWxhYmVsPVwiSG91cnNcIiBpMThuLWFyaWEtbGFiZWw9XCJAQG5nYi50aW1lcGlja2VyLmhvdXJzXCJcbiAgICAgICAgICAgIChrZXlkb3duLkFycm93VXApPVwiY2hhbmdlSG91cihob3VyU3RlcCk7ICRldmVudC5wcmV2ZW50RGVmYXVsdCgpXCJcbiAgICAgICAgICAgIChrZXlkb3duLkFycm93RG93bik9XCJjaGFuZ2VIb3VyKC1ob3VyU3RlcCk7ICRldmVudC5wcmV2ZW50RGVmYXVsdCgpXCI+XG4gICAgICAgICAgPGJ1dHRvbiAqbmdJZj1cInNwaW5uZXJzXCIgdGFiaW5kZXg9XCItMVwiIHR5cGU9XCJidXR0b25cIiAoY2xpY2spPVwiY2hhbmdlSG91cigtaG91clN0ZXApXCJcbiAgICAgICAgICAgIGNsYXNzPVwiYnRuIGJ0bi1saW5rXCIgW2NsYXNzLmJ0bi1zbV09XCJpc1NtYWxsU2l6ZVwiIFtjbGFzcy5idG4tbGddPVwiaXNMYXJnZVNpemVcIiBbY2xhc3MuZGlzYWJsZWRdPVwiZGlzYWJsZWRcIlxuICAgICAgICAgICAgW2Rpc2FibGVkXT1cImRpc2FibGVkXCI+XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cImNoZXZyb24gbmdiLXRwLWNoZXZyb24gYm90dG9tXCI+PC9zcGFuPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzci1vbmx5XCIgaTE4bj1cIkBAbmdiLnRpbWVwaWNrZXIuZGVjcmVtZW50LWhvdXJzXCI+RGVjcmVtZW50IGhvdXJzPC9zcGFuPlxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cIm5nYi10cC1zcGFjZXJcIj46PC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJuZ2ItdHAtaW5wdXQtY29udGFpbmVyIG5nYi10cC1taW51dGVcIj5cbiAgICAgICAgICA8YnV0dG9uICpuZ0lmPVwic3Bpbm5lcnNcIiB0YWJpbmRleD1cIi0xXCIgdHlwZT1cImJ1dHRvblwiIChjbGljayk9XCJjaGFuZ2VNaW51dGUobWludXRlU3RlcClcIlxuICAgICAgICAgICAgY2xhc3M9XCJidG4gYnRuLWxpbmtcIiBbY2xhc3MuYnRuLXNtXT1cImlzU21hbGxTaXplXCIgW2NsYXNzLmJ0bi1sZ109XCJpc0xhcmdlU2l6ZVwiIFtjbGFzcy5kaXNhYmxlZF09XCJkaXNhYmxlZFwiXG4gICAgICAgICAgICBbZGlzYWJsZWRdPVwiZGlzYWJsZWRcIj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY2hldnJvbiBuZ2ItdHAtY2hldnJvblwiPjwvc3Bhbj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic3Itb25seVwiIGkxOG49XCJAQG5nYi50aW1lcGlja2VyLmluY3JlbWVudC1taW51dGVzXCI+SW5jcmVtZW50IG1pbnV0ZXM8L3NwYW4+XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJuZ2ItdHAtaW5wdXQgZm9ybS1jb250cm9sXCIgW2NsYXNzLmZvcm0tY29udHJvbC1zbV09XCJpc1NtYWxsU2l6ZVwiIFtjbGFzcy5mb3JtLWNvbnRyb2wtbGddPVwiaXNMYXJnZVNpemVcIlxuICAgICAgICAgICAgbWF4bGVuZ3RoPVwiMlwiIHBsYWNlaG9sZGVyPVwiTU1cIiBpMThuLXBsYWNlaG9sZGVyPVwiQEBuZ2IudGltZXBpY2tlci5NTVwiXG4gICAgICAgICAgICBbdmFsdWVdPVwiZm9ybWF0TWluU2VjKG1vZGVsPy5taW51dGUpXCIgKGNoYW5nZSk9XCJ1cGRhdGVNaW51dGUoJGV2ZW50LnRhcmdldC52YWx1ZSlcIlxuICAgICAgICAgICAgW3JlYWRPbmx5XT1cInJlYWRvbmx5SW5wdXRzXCIgW2Rpc2FibGVkXT1cImRpc2FibGVkXCIgYXJpYS1sYWJlbD1cIk1pbnV0ZXNcIiBpMThuLWFyaWEtbGFiZWw9XCJAQG5nYi50aW1lcGlja2VyLm1pbnV0ZXNcIlxuICAgICAgICAgICAgKGtleWRvd24uQXJyb3dVcCk9XCJjaGFuZ2VNaW51dGUobWludXRlU3RlcCk7ICRldmVudC5wcmV2ZW50RGVmYXVsdCgpXCJcbiAgICAgICAgICAgIChrZXlkb3duLkFycm93RG93bik9XCJjaGFuZ2VNaW51dGUoLW1pbnV0ZVN0ZXApOyAkZXZlbnQucHJldmVudERlZmF1bHQoKVwiPlxuICAgICAgICAgIDxidXR0b24gKm5nSWY9XCJzcGlubmVyc1wiIHRhYmluZGV4PVwiLTFcIiB0eXBlPVwiYnV0dG9uXCIgKGNsaWNrKT1cImNoYW5nZU1pbnV0ZSgtbWludXRlU3RlcClcIlxuICAgICAgICAgICAgY2xhc3M9XCJidG4gYnRuLWxpbmtcIiBbY2xhc3MuYnRuLXNtXT1cImlzU21hbGxTaXplXCIgW2NsYXNzLmJ0bi1sZ109XCJpc0xhcmdlU2l6ZVwiICBbY2xhc3MuZGlzYWJsZWRdPVwiZGlzYWJsZWRcIlxuICAgICAgICAgICAgW2Rpc2FibGVkXT1cImRpc2FibGVkXCI+XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cImNoZXZyb24gbmdiLXRwLWNoZXZyb24gYm90dG9tXCI+PC9zcGFuPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzci1vbmx5XCIgIGkxOG49XCJAQG5nYi50aW1lcGlja2VyLmRlY3JlbWVudC1taW51dGVzXCI+RGVjcmVtZW50IG1pbnV0ZXM8L3NwYW4+XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2ICpuZ0lmPVwic2Vjb25kc1wiIGNsYXNzPVwibmdiLXRwLXNwYWNlclwiPjo8L2Rpdj5cbiAgICAgICAgPGRpdiAqbmdJZj1cInNlY29uZHNcIiBjbGFzcz1cIm5nYi10cC1pbnB1dC1jb250YWluZXIgbmdiLXRwLXNlY29uZFwiPlxuICAgICAgICAgIDxidXR0b24gKm5nSWY9XCJzcGlubmVyc1wiIHRhYmluZGV4PVwiLTFcIiB0eXBlPVwiYnV0dG9uXCIgKGNsaWNrKT1cImNoYW5nZVNlY29uZChzZWNvbmRTdGVwKVwiXG4gICAgICAgICAgICBjbGFzcz1cImJ0biBidG4tbGlua1wiIFtjbGFzcy5idG4tc21dPVwiaXNTbWFsbFNpemVcIiBbY2xhc3MuYnRuLWxnXT1cImlzTGFyZ2VTaXplXCIgW2NsYXNzLmRpc2FibGVkXT1cImRpc2FibGVkXCJcbiAgICAgICAgICAgIFtkaXNhYmxlZF09XCJkaXNhYmxlZFwiPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJjaGV2cm9uIG5nYi10cC1jaGV2cm9uXCI+PC9zcGFuPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzci1vbmx5XCIgaTE4bj1cIkBAbmdiLnRpbWVwaWNrZXIuaW5jcmVtZW50LXNlY29uZHNcIj5JbmNyZW1lbnQgc2Vjb25kczwvc3Bhbj5cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cIm5nYi10cC1pbnB1dCBmb3JtLWNvbnRyb2xcIiBbY2xhc3MuZm9ybS1jb250cm9sLXNtXT1cImlzU21hbGxTaXplXCIgW2NsYXNzLmZvcm0tY29udHJvbC1sZ109XCJpc0xhcmdlU2l6ZVwiXG4gICAgICAgICAgICBtYXhsZW5ndGg9XCIyXCIgcGxhY2Vob2xkZXI9XCJTU1wiIGkxOG4tcGxhY2Vob2xkZXI9XCJAQG5nYi50aW1lcGlja2VyLlNTXCJcbiAgICAgICAgICAgIFt2YWx1ZV09XCJmb3JtYXRNaW5TZWMobW9kZWw/LnNlY29uZClcIiAoY2hhbmdlKT1cInVwZGF0ZVNlY29uZCgkZXZlbnQudGFyZ2V0LnZhbHVlKVwiXG4gICAgICAgICAgICBbcmVhZE9ubHldPVwicmVhZG9ubHlJbnB1dHNcIiBbZGlzYWJsZWRdPVwiZGlzYWJsZWRcIiBhcmlhLWxhYmVsPVwiU2Vjb25kc1wiIGkxOG4tYXJpYS1sYWJlbD1cIkBAbmdiLnRpbWVwaWNrZXIuc2Vjb25kc1wiXG4gICAgICAgICAgICAoa2V5ZG93bi5BcnJvd1VwKT1cImNoYW5nZVNlY29uZChzZWNvbmRTdGVwKTsgJGV2ZW50LnByZXZlbnREZWZhdWx0KClcIlxuICAgICAgICAgICAgKGtleWRvd24uQXJyb3dEb3duKT1cImNoYW5nZVNlY29uZCgtc2Vjb25kU3RlcCk7ICRldmVudC5wcmV2ZW50RGVmYXVsdCgpXCI+XG4gICAgICAgICAgPGJ1dHRvbiAqbmdJZj1cInNwaW5uZXJzXCIgdGFiaW5kZXg9XCItMVwiIHR5cGU9XCJidXR0b25cIiAoY2xpY2spPVwiY2hhbmdlU2Vjb25kKC1zZWNvbmRTdGVwKVwiXG4gICAgICAgICAgICBjbGFzcz1cImJ0biBidG4tbGlua1wiIFtjbGFzcy5idG4tc21dPVwiaXNTbWFsbFNpemVcIiBbY2xhc3MuYnRuLWxnXT1cImlzTGFyZ2VTaXplXCIgIFtjbGFzcy5kaXNhYmxlZF09XCJkaXNhYmxlZFwiXG4gICAgICAgICAgICBbZGlzYWJsZWRdPVwiZGlzYWJsZWRcIj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY2hldnJvbiBuZ2ItdHAtY2hldnJvbiBib3R0b21cIj48L3NwYW4+XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cInNyLW9ubHlcIiBpMThuPVwiQEBuZ2IudGltZXBpY2tlci5kZWNyZW1lbnQtc2Vjb25kc1wiPkRlY3JlbWVudCBzZWNvbmRzPC9zcGFuPlxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiAqbmdJZj1cIm1lcmlkaWFuXCIgY2xhc3M9XCJuZ2ItdHAtc3BhY2VyXCI+PC9kaXY+XG4gICAgICAgIDxkaXYgKm5nSWY9XCJtZXJpZGlhblwiIGNsYXNzPVwibmdiLXRwLW1lcmlkaWFuXCI+XG4gICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLW91dGxpbmUtcHJpbWFyeVwiIFtjbGFzcy5idG4tc21dPVwiaXNTbWFsbFNpemVcIiBbY2xhc3MuYnRuLWxnXT1cImlzTGFyZ2VTaXplXCJcbiAgICAgICAgICAgIFtkaXNhYmxlZF09XCJkaXNhYmxlZFwiIFtjbGFzcy5kaXNhYmxlZF09XCJkaXNhYmxlZFwiXG4gICAgICAgICAgICAgICAgICAoY2xpY2spPVwidG9nZ2xlTWVyaWRpYW4oKVwiPlxuICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cIm1vZGVsPy5ob3VyID49IDEyOyBlbHNlIGFtXCIgaTE4bj1cIkBAbmdiLnRpbWVwaWNrZXIuUE1cIj5QTTwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgPG5nLXRlbXBsYXRlICNhbSBpMThuPVwiQEBuZ2IudGltZXBpY2tlci5BTVwiPkFNPC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2ZpZWxkc2V0PlxuICBgLFxuICBwcm92aWRlcnM6IFtOR0JfVElNRVBJQ0tFUl9WQUxVRV9BQ0NFU1NPUl1cbn0pXG5leHBvcnQgY2xhc3MgTmdiVGltZXBpY2tlciBpbXBsZW1lbnRzIENvbnRyb2xWYWx1ZUFjY2Vzc29yLFxuICAgIE9uQ2hhbmdlcyB7XG4gIGRpc2FibGVkOiBib29sZWFuO1xuICBtb2RlbDogTmdiVGltZTtcblxuICBwcml2YXRlIF9ob3VyU3RlcDogbnVtYmVyO1xuICBwcml2YXRlIF9taW51dGVTdGVwOiBudW1iZXI7XG4gIHByaXZhdGUgX3NlY29uZFN0ZXA6IG51bWJlcjtcblxuICAvKipcbiAgICogV2hldGhlciB0byBkaXNwbGF5IDEySCBvciAyNEggbW9kZS5cbiAgICovXG4gIEBJbnB1dCgpIG1lcmlkaWFuOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBJZiBgdHJ1ZWAsIHRoZSBzcGlubmVycyBhYm92ZSBhbmQgYmVsb3cgaW5wdXRzIGFyZSB2aXNpYmxlLlxuICAgKi9cbiAgQElucHV0KCkgc3Bpbm5lcnM6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIElmIGB0cnVlYCwgaXQgaXMgcG9zc2libGUgdG8gc2VsZWN0IHNlY29uZHMuXG4gICAqL1xuICBASW5wdXQoKSBzZWNvbmRzOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIGhvdXJzIHRvIGFkZC9zdWJ0cmFjdCB3aGVuIGNsaWNraW5nIGhvdXIgc3Bpbm5lcnMuXG4gICAqL1xuICBASW5wdXQoKVxuICBzZXQgaG91clN0ZXAoc3RlcDogbnVtYmVyKSB7XG4gICAgdGhpcy5faG91clN0ZXAgPSBpc0ludGVnZXIoc3RlcCkgPyBzdGVwIDogdGhpcy5fY29uZmlnLmhvdXJTdGVwO1xuICB9XG5cbiAgZ2V0IGhvdXJTdGVwKCk6IG51bWJlciB7IHJldHVybiB0aGlzLl9ob3VyU3RlcDsgfVxuXG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIG1pbnV0ZXMgdG8gYWRkL3N1YnRyYWN0IHdoZW4gY2xpY2tpbmcgbWludXRlIHNwaW5uZXJzLlxuICAgKi9cbiAgQElucHV0KClcbiAgc2V0IG1pbnV0ZVN0ZXAoc3RlcDogbnVtYmVyKSB7XG4gICAgdGhpcy5fbWludXRlU3RlcCA9IGlzSW50ZWdlcihzdGVwKSA/IHN0ZXAgOiB0aGlzLl9jb25maWcubWludXRlU3RlcDtcbiAgfVxuXG4gIGdldCBtaW51dGVTdGVwKCk6IG51bWJlciB7IHJldHVybiB0aGlzLl9taW51dGVTdGVwOyB9XG5cbiAgLyoqXG4gICAqIFRoZSBudW1iZXIgb2Ygc2Vjb25kcyB0byBhZGQvc3VidHJhY3Qgd2hlbiBjbGlja2luZyBzZWNvbmQgc3Bpbm5lcnMuXG4gICAqL1xuICBASW5wdXQoKVxuICBzZXQgc2Vjb25kU3RlcChzdGVwOiBudW1iZXIpIHtcbiAgICB0aGlzLl9zZWNvbmRTdGVwID0gaXNJbnRlZ2VyKHN0ZXApID8gc3RlcCA6IHRoaXMuX2NvbmZpZy5zZWNvbmRTdGVwO1xuICB9XG5cbiAgZ2V0IHNlY29uZFN0ZXAoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuX3NlY29uZFN0ZXA7IH1cblxuICAvKipcbiAgICogSWYgYHRydWVgLCB0aGUgdGltZXBpY2tlciBpcyByZWFkb25seSBhbmQgY2FuJ3QgYmUgY2hhbmdlZC5cbiAgICovXG4gIEBJbnB1dCgpIHJlYWRvbmx5SW5wdXRzOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBUaGUgc2l6ZSBvZiBpbnB1dHMgYW5kIGJ1dHRvbnMuXG4gICAqL1xuICBASW5wdXQoKSBzaXplOiAnc21hbGwnIHwgJ21lZGl1bScgfCAnbGFyZ2UnO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSByZWFkb25seSBfY29uZmlnOiBOZ2JUaW1lcGlja2VyQ29uZmlnLCBwcml2YXRlIF9uZ2JUaW1lQWRhcHRlcjogTmdiVGltZUFkYXB0ZXI8YW55PixcbiAgICAgIHByaXZhdGUgX2NkOiBDaGFuZ2VEZXRlY3RvclJlZikge1xuICAgIHRoaXMubWVyaWRpYW4gPSBfY29uZmlnLm1lcmlkaWFuO1xuICAgIHRoaXMuc3Bpbm5lcnMgPSBfY29uZmlnLnNwaW5uZXJzO1xuICAgIHRoaXMuc2Vjb25kcyA9IF9jb25maWcuc2Vjb25kcztcbiAgICB0aGlzLmhvdXJTdGVwID0gX2NvbmZpZy5ob3VyU3RlcDtcbiAgICB0aGlzLm1pbnV0ZVN0ZXAgPSBfY29uZmlnLm1pbnV0ZVN0ZXA7XG4gICAgdGhpcy5zZWNvbmRTdGVwID0gX2NvbmZpZy5zZWNvbmRTdGVwO1xuICAgIHRoaXMuZGlzYWJsZWQgPSBfY29uZmlnLmRpc2FibGVkO1xuICAgIHRoaXMucmVhZG9ubHlJbnB1dHMgPSBfY29uZmlnLnJlYWRvbmx5SW5wdXRzO1xuICAgIHRoaXMuc2l6ZSA9IF9jb25maWcuc2l6ZTtcbiAgfVxuXG4gIG9uQ2hhbmdlID0gKF86IGFueSkgPT4ge307XG4gIG9uVG91Y2hlZCA9ICgpID0+IHt9O1xuXG4gIHdyaXRlVmFsdWUodmFsdWUpIHtcbiAgICBjb25zdCBzdHJ1Y3RWYWx1ZSA9IHRoaXMuX25nYlRpbWVBZGFwdGVyLmZyb21Nb2RlbCh2YWx1ZSk7XG4gICAgdGhpcy5tb2RlbCA9IHN0cnVjdFZhbHVlID8gbmV3IE5nYlRpbWUoc3RydWN0VmFsdWUuaG91ciwgc3RydWN0VmFsdWUubWludXRlLCBzdHJ1Y3RWYWx1ZS5zZWNvbmQpIDogbmV3IE5nYlRpbWUoKTtcbiAgICBpZiAoIXRoaXMuc2Vjb25kcyAmJiAoIXN0cnVjdFZhbHVlIHx8ICFpc051bWJlcihzdHJ1Y3RWYWx1ZS5zZWNvbmQpKSkge1xuICAgICAgdGhpcy5tb2RlbC5zZWNvbmQgPSAwO1xuICAgIH1cbiAgICB0aGlzLl9jZC5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46ICh2YWx1ZTogYW55KSA9PiBhbnkpOiB2b2lkIHsgdGhpcy5vbkNoYW5nZSA9IGZuOyB9XG5cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46ICgpID0+IGFueSk6IHZvaWQgeyB0aGlzLm9uVG91Y2hlZCA9IGZuOyB9XG5cbiAgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKSB7IHRoaXMuZGlzYWJsZWQgPSBpc0Rpc2FibGVkOyB9XG5cbiAgY2hhbmdlSG91cihzdGVwOiBudW1iZXIpIHtcbiAgICB0aGlzLm1vZGVsLmNoYW5nZUhvdXIoc3RlcCk7XG4gICAgdGhpcy5wcm9wYWdhdGVNb2RlbENoYW5nZSgpO1xuICB9XG5cbiAgY2hhbmdlTWludXRlKHN0ZXA6IG51bWJlcikge1xuICAgIHRoaXMubW9kZWwuY2hhbmdlTWludXRlKHN0ZXApO1xuICAgIHRoaXMucHJvcGFnYXRlTW9kZWxDaGFuZ2UoKTtcbiAgfVxuXG4gIGNoYW5nZVNlY29uZChzdGVwOiBudW1iZXIpIHtcbiAgICB0aGlzLm1vZGVsLmNoYW5nZVNlY29uZChzdGVwKTtcbiAgICB0aGlzLnByb3BhZ2F0ZU1vZGVsQ2hhbmdlKCk7XG4gIH1cblxuICB1cGRhdGVIb3VyKG5ld1ZhbDogc3RyaW5nKSB7XG4gICAgY29uc3QgaXNQTSA9IHRoaXMubW9kZWwuaG91ciA+PSAxMjtcbiAgICBjb25zdCBlbnRlcmVkSG91ciA9IHRvSW50ZWdlcihuZXdWYWwpO1xuICAgIGlmICh0aGlzLm1lcmlkaWFuICYmIChpc1BNICYmIGVudGVyZWRIb3VyIDwgMTIgfHwgIWlzUE0gJiYgZW50ZXJlZEhvdXIgPT09IDEyKSkge1xuICAgICAgdGhpcy5tb2RlbC51cGRhdGVIb3VyKGVudGVyZWRIb3VyICsgMTIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm1vZGVsLnVwZGF0ZUhvdXIoZW50ZXJlZEhvdXIpO1xuICAgIH1cbiAgICB0aGlzLnByb3BhZ2F0ZU1vZGVsQ2hhbmdlKCk7XG4gIH1cblxuICB1cGRhdGVNaW51dGUobmV3VmFsOiBzdHJpbmcpIHtcbiAgICB0aGlzLm1vZGVsLnVwZGF0ZU1pbnV0ZSh0b0ludGVnZXIobmV3VmFsKSk7XG4gICAgdGhpcy5wcm9wYWdhdGVNb2RlbENoYW5nZSgpO1xuICB9XG5cbiAgdXBkYXRlU2Vjb25kKG5ld1ZhbDogc3RyaW5nKSB7XG4gICAgdGhpcy5tb2RlbC51cGRhdGVTZWNvbmQodG9JbnRlZ2VyKG5ld1ZhbCkpO1xuICAgIHRoaXMucHJvcGFnYXRlTW9kZWxDaGFuZ2UoKTtcbiAgfVxuXG4gIHRvZ2dsZU1lcmlkaWFuKCkge1xuICAgIGlmICh0aGlzLm1lcmlkaWFuKSB7XG4gICAgICB0aGlzLmNoYW5nZUhvdXIoMTIpO1xuICAgIH1cbiAgfVxuXG4gIGZvcm1hdEhvdXIodmFsdWU6IG51bWJlcikge1xuICAgIGlmIChpc051bWJlcih2YWx1ZSkpIHtcbiAgICAgIGlmICh0aGlzLm1lcmlkaWFuKSB7XG4gICAgICAgIHJldHVybiBwYWROdW1iZXIodmFsdWUgJSAxMiA9PT0gMCA/IDEyIDogdmFsdWUgJSAxMik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gcGFkTnVtYmVyKHZhbHVlICUgMjQpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcGFkTnVtYmVyKE5hTik7XG4gICAgfVxuICB9XG5cbiAgZm9ybWF0TWluU2VjKHZhbHVlOiBudW1iZXIpIHsgcmV0dXJuIHBhZE51bWJlcih2YWx1ZSk7IH1cblxuICBnZXQgaXNTbWFsbFNpemUoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLnNpemUgPT09ICdzbWFsbCc7IH1cblxuICBnZXQgaXNMYXJnZVNpemUoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLnNpemUgPT09ICdsYXJnZSc7IH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgaWYgKGNoYW5nZXNbJ3NlY29uZHMnXSAmJiAhdGhpcy5zZWNvbmRzICYmIHRoaXMubW9kZWwgJiYgIWlzTnVtYmVyKHRoaXMubW9kZWwuc2Vjb25kKSkge1xuICAgICAgdGhpcy5tb2RlbC5zZWNvbmQgPSAwO1xuICAgICAgdGhpcy5wcm9wYWdhdGVNb2RlbENoYW5nZShmYWxzZSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBwcm9wYWdhdGVNb2RlbENoYW5nZSh0b3VjaGVkID0gdHJ1ZSkge1xuICAgIGlmICh0b3VjaGVkKSB7XG4gICAgICB0aGlzLm9uVG91Y2hlZCgpO1xuICAgIH1cbiAgICBpZiAodGhpcy5tb2RlbC5pc1ZhbGlkKHRoaXMuc2Vjb25kcykpIHtcbiAgICAgIHRoaXMub25DaGFuZ2UoXG4gICAgICAgICAgdGhpcy5fbmdiVGltZUFkYXB0ZXIudG9Nb2RlbCh7aG91cjogdGhpcy5tb2RlbC5ob3VyLCBtaW51dGU6IHRoaXMubW9kZWwubWludXRlLCBzZWNvbmQ6IHRoaXMubW9kZWwuc2Vjb25kfSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm9uQ2hhbmdlKHRoaXMuX25nYlRpbWVBZGFwdGVyLnRvTW9kZWwobnVsbCkpO1xuICAgIH1cbiAgfVxufVxuIl19