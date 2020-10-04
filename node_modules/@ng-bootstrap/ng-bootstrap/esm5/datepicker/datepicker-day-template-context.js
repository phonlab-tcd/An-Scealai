/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * The context for the datepicker 'day' template.
 *
 * You can override the way dates are displayed in the datepicker via the `[dayTemplate]` input.
 * @record
 */
export function DayTemplateContext() { }
if (false) {
    /**
     * The date that corresponds to the template. Same as the `date` parameter.
     *
     * Can be used for convenience as a default template key, ex. `let-d`.
     *
     * \@since 3.3.0
     * @type {?}
     */
    DayTemplateContext.prototype.$implicit;
    /**
     * The month currently displayed by the datepicker.
     * @type {?}
     */
    DayTemplateContext.prototype.currentMonth;
    /**
     * Any data you pass using the `[dayTemplateData]` input in the datepicker.
     *
     * \@since 3.3.0
     * @type {?|undefined}
     */
    DayTemplateContext.prototype.data;
    /**
     * The date that corresponds to the template.
     * @type {?}
     */
    DayTemplateContext.prototype.date;
    /**
     * `True` if the current date is disabled.
     * @type {?}
     */
    DayTemplateContext.prototype.disabled;
    /**
     * `True` if the current date is focused.
     * @type {?}
     */
    DayTemplateContext.prototype.focused;
    /**
     * `True` if the current date is selected.
     * @type {?}
     */
    DayTemplateContext.prototype.selected;
    /**
     * `True` if the current date is today (equal to `NgbCalendar.getToday()`).
     *
     * \@since 4.1.0
     * @type {?}
     */
    DayTemplateContext.prototype.today;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci1kYXktdGVtcGxhdGUtY29udGV4dC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwLyIsInNvdXJjZXMiOlsiZGF0ZXBpY2tlci9kYXRlcGlja2VyLWRheS10ZW1wbGF0ZS1jb250ZXh0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFNQSx3Q0FnREM7Ozs7Ozs7Ozs7SUF4Q0MsdUNBQW1COzs7OztJQUtuQiwwQ0FBcUI7Ozs7Ozs7SUFPckIsa0NBQVc7Ozs7O0lBS1gsa0NBQWM7Ozs7O0lBS2Qsc0NBQWtCOzs7OztJQUtsQixxQ0FBaUI7Ozs7O0lBS2pCLHNDQUFrQjs7Ozs7OztJQU9sQixtQ0FBZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7TmdiRGF0ZX0gZnJvbSAnLi9uZ2ItZGF0ZSc7XG4vKipcbiAqIFRoZSBjb250ZXh0IGZvciB0aGUgZGF0ZXBpY2tlciAnZGF5JyB0ZW1wbGF0ZS5cbiAqXG4gKiBZb3UgY2FuIG92ZXJyaWRlIHRoZSB3YXkgZGF0ZXMgYXJlIGRpc3BsYXllZCBpbiB0aGUgZGF0ZXBpY2tlciB2aWEgdGhlIGBbZGF5VGVtcGxhdGVdYCBpbnB1dC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBEYXlUZW1wbGF0ZUNvbnRleHQge1xuICAvKipcbiAgICogVGhlIGRhdGUgdGhhdCBjb3JyZXNwb25kcyB0byB0aGUgdGVtcGxhdGUuIFNhbWUgYXMgdGhlIGBkYXRlYCBwYXJhbWV0ZXIuXG4gICAqXG4gICAqIENhbiBiZSB1c2VkIGZvciBjb252ZW5pZW5jZSBhcyBhIGRlZmF1bHQgdGVtcGxhdGUga2V5LCBleC4gYGxldC1kYC5cbiAgICpcbiAgICogQHNpbmNlIDMuMy4wXG4gICAqL1xuICAkaW1wbGljaXQ6IE5nYkRhdGU7XG5cbiAgLyoqXG4gICAqIFRoZSBtb250aCBjdXJyZW50bHkgZGlzcGxheWVkIGJ5IHRoZSBkYXRlcGlja2VyLlxuICAgKi9cbiAgY3VycmVudE1vbnRoOiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIEFueSBkYXRhIHlvdSBwYXNzIHVzaW5nIHRoZSBgW2RheVRlbXBsYXRlRGF0YV1gIGlucHV0IGluIHRoZSBkYXRlcGlja2VyLlxuICAgKlxuICAgKiBAc2luY2UgMy4zLjBcbiAgICovXG4gIGRhdGE/OiBhbnk7XG5cbiAgLyoqXG4gICAqIFRoZSBkYXRlIHRoYXQgY29ycmVzcG9uZHMgdG8gdGhlIHRlbXBsYXRlLlxuICAgKi9cbiAgZGF0ZTogTmdiRGF0ZTtcblxuICAvKipcbiAgICogYFRydWVgIGlmIHRoZSBjdXJyZW50IGRhdGUgaXMgZGlzYWJsZWQuXG4gICAqL1xuICBkaXNhYmxlZDogYm9vbGVhbjtcblxuICAvKipcbiAgICogYFRydWVgIGlmIHRoZSBjdXJyZW50IGRhdGUgaXMgZm9jdXNlZC5cbiAgICovXG4gIGZvY3VzZWQ6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIGBUcnVlYCBpZiB0aGUgY3VycmVudCBkYXRlIGlzIHNlbGVjdGVkLlxuICAgKi9cbiAgc2VsZWN0ZWQ6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIGBUcnVlYCBpZiB0aGUgY3VycmVudCBkYXRlIGlzIHRvZGF5IChlcXVhbCB0byBgTmdiQ2FsZW5kYXIuZ2V0VG9kYXkoKWApLlxuICAgKlxuICAgKiBAc2luY2UgNC4xLjBcbiAgICovXG4gIHRvZGF5OiBib29sZWFuO1xufVxuIl19