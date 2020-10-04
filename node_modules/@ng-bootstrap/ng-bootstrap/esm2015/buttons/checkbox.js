/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { ChangeDetectorRef, Directive, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgbButtonLabel } from './label';
/** @type {?} */
const NGB_CHECKBOX_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NgbCheckBox),
    multi: true
};
/**
 * Allows to easily create Bootstrap-style checkbox buttons.
 *
 * Integrates with forms, so the value of a checked button is bound to the underlying form control
 * either in a reactive or template-driven way.
 */
export class NgbCheckBox {
    /**
     * @param {?} _label
     * @param {?} _cd
     */
    constructor(_label, _cd) {
        this._label = _label;
        this._cd = _cd;
        /**
         * If `true`, the checkbox button will be disabled
         */
        this.disabled = false;
        /**
         * The form control value when the checkbox is checked.
         */
        this.valueChecked = true;
        /**
         * The form control value when the checkbox is unchecked.
         */
        this.valueUnChecked = false;
        this.onChange = (_) => { };
        this.onTouched = () => { };
    }
    /**
     * @param {?} isFocused
     * @return {?}
     */
    set focused(isFocused) {
        this._label.focused = isFocused;
        if (!isFocused) {
            this.onTouched();
        }
    }
    /**
     * @param {?} $event
     * @return {?}
     */
    onInputChange($event) {
        /** @type {?} */
        const modelToPropagate = $event.target.checked ? this.valueChecked : this.valueUnChecked;
        this.onChange(modelToPropagate);
        this.onTouched();
        this.writeValue(modelToPropagate);
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
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
        this._label.disabled = isDisabled;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    writeValue(value) {
        this.checked = value === this.valueChecked;
        this._label.active = this.checked;
        // label won't be updated, if it is inside the OnPush component when [ngModel] changes
        this._cd.markForCheck();
    }
}
NgbCheckBox.decorators = [
    { type: Directive, args: [{
                selector: '[ngbButton][type=checkbox]',
                host: {
                    'autocomplete': 'off',
                    '[checked]': 'checked',
                    '[disabled]': 'disabled',
                    '(change)': 'onInputChange($event)',
                    '(focus)': 'focused = true',
                    '(blur)': 'focused = false'
                },
                providers: [NGB_CHECKBOX_VALUE_ACCESSOR]
            },] }
];
/** @nocollapse */
NgbCheckBox.ctorParameters = () => [
    { type: NgbButtonLabel },
    { type: ChangeDetectorRef }
];
NgbCheckBox.propDecorators = {
    disabled: [{ type: Input }],
    valueChecked: [{ type: Input }],
    valueUnChecked: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    NgbCheckBox.prototype.checked;
    /**
     * If `true`, the checkbox button will be disabled
     * @type {?}
     */
    NgbCheckBox.prototype.disabled;
    /**
     * The form control value when the checkbox is checked.
     * @type {?}
     */
    NgbCheckBox.prototype.valueChecked;
    /**
     * The form control value when the checkbox is unchecked.
     * @type {?}
     */
    NgbCheckBox.prototype.valueUnChecked;
    /** @type {?} */
    NgbCheckBox.prototype.onChange;
    /** @type {?} */
    NgbCheckBox.prototype.onTouched;
    /** @type {?} */
    NgbCheckBox.prototype._label;
    /** @type {?} */
    NgbCheckBox.prototype._cd;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tib3guanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC8iLCJzb3VyY2VzIjpbImJ1dHRvbnMvY2hlY2tib3gudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBQyxpQkFBaUIsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUM5RSxPQUFPLEVBQXVCLGlCQUFpQixFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFdkUsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLFNBQVMsQ0FBQzs7TUFFakMsMkJBQTJCLEdBQUc7SUFDbEMsT0FBTyxFQUFFLGlCQUFpQjtJQUMxQixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQztJQUMxQyxLQUFLLEVBQUUsSUFBSTtDQUNaOzs7Ozs7O0FBcUJELE1BQU0sT0FBTyxXQUFXOzs7OztJQTRCdEIsWUFBb0IsTUFBc0IsRUFBVSxHQUFzQjtRQUF0RCxXQUFNLEdBQU4sTUFBTSxDQUFnQjtRQUFVLFFBQUcsR0FBSCxHQUFHLENBQW1COzs7O1FBdEJqRSxhQUFRLEdBQUcsS0FBSyxDQUFDOzs7O1FBS2pCLGlCQUFZLEdBQUcsSUFBSSxDQUFDOzs7O1FBS3BCLG1CQUFjLEdBQUcsS0FBSyxDQUFDO1FBRWhDLGFBQVEsR0FBRyxDQUFDLENBQU0sRUFBRSxFQUFFLEdBQUUsQ0FBQyxDQUFDO1FBQzFCLGNBQVMsR0FBRyxHQUFHLEVBQUUsR0FBRSxDQUFDLENBQUM7SUFTd0QsQ0FBQzs7Ozs7SUFQOUUsSUFBSSxPQUFPLENBQUMsU0FBa0I7UUFDNUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDZCxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7U0FDbEI7SUFDSCxDQUFDOzs7OztJQUlELGFBQWEsQ0FBQyxNQUFNOztjQUNaLGdCQUFnQixHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYztRQUN4RixJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDaEMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztJQUNwQyxDQUFDOzs7OztJQUVELGdCQUFnQixDQUFDLEVBQXVCLElBQVUsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDOzs7OztJQUV2RSxpQkFBaUIsQ0FBQyxFQUFhLElBQVUsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDOzs7OztJQUUvRCxnQkFBZ0IsQ0FBQyxVQUFtQjtRQUNsQyxJQUFJLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQztRQUMzQixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsR0FBRyxVQUFVLENBQUM7SUFDcEMsQ0FBQzs7Ozs7SUFFRCxVQUFVLENBQUMsS0FBSztRQUNkLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxLQUFLLElBQUksQ0FBQyxZQUFZLENBQUM7UUFDM0MsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUVsQyxzRkFBc0Y7UUFDdEYsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUMxQixDQUFDOzs7WUFoRUYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSw0QkFBNEI7Z0JBQ3RDLElBQUksRUFBRTtvQkFDSixjQUFjLEVBQUUsS0FBSztvQkFDckIsV0FBVyxFQUFFLFNBQVM7b0JBQ3RCLFlBQVksRUFBRSxVQUFVO29CQUN4QixVQUFVLEVBQUUsdUJBQXVCO29CQUNuQyxTQUFTLEVBQUUsZ0JBQWdCO29CQUMzQixRQUFRLEVBQUUsaUJBQWlCO2lCQUM1QjtnQkFDRCxTQUFTLEVBQUUsQ0FBQywyQkFBMkIsQ0FBQzthQUN6Qzs7OztZQTFCTyxjQUFjO1lBSGQsaUJBQWlCOzs7dUJBb0N0QixLQUFLOzJCQUtMLEtBQUs7NkJBS0wsS0FBSzs7OztJQWZOLDhCQUFROzs7OztJQUtSLCtCQUEwQjs7Ozs7SUFLMUIsbUNBQTZCOzs7OztJQUs3QixxQ0FBZ0M7O0lBRWhDLCtCQUEwQjs7SUFDMUIsZ0NBQXFCOztJQVNULDZCQUE4Qjs7SUFBRSwwQkFBOEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NoYW5nZURldGVjdG9yUmVmLCBEaXJlY3RpdmUsIGZvcndhcmRSZWYsIElucHV0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q29udHJvbFZhbHVlQWNjZXNzb3IsIE5HX1ZBTFVFX0FDQ0VTU09SfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbmltcG9ydCB7TmdiQnV0dG9uTGFiZWx9IGZyb20gJy4vbGFiZWwnO1xuXG5jb25zdCBOR0JfQ0hFQ0tCT1hfVkFMVUVfQUNDRVNTT1IgPSB7XG4gIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBOZ2JDaGVja0JveCksXG4gIG11bHRpOiB0cnVlXG59O1xuXG5cbi8qKlxuICogQWxsb3dzIHRvIGVhc2lseSBjcmVhdGUgQm9vdHN0cmFwLXN0eWxlIGNoZWNrYm94IGJ1dHRvbnMuXG4gKlxuICogSW50ZWdyYXRlcyB3aXRoIGZvcm1zLCBzbyB0aGUgdmFsdWUgb2YgYSBjaGVja2VkIGJ1dHRvbiBpcyBib3VuZCB0byB0aGUgdW5kZXJseWluZyBmb3JtIGNvbnRyb2xcbiAqIGVpdGhlciBpbiBhIHJlYWN0aXZlIG9yIHRlbXBsYXRlLWRyaXZlbiB3YXkuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tuZ2JCdXR0b25dW3R5cGU9Y2hlY2tib3hdJyxcbiAgaG9zdDoge1xuICAgICdhdXRvY29tcGxldGUnOiAnb2ZmJyxcbiAgICAnW2NoZWNrZWRdJzogJ2NoZWNrZWQnLFxuICAgICdbZGlzYWJsZWRdJzogJ2Rpc2FibGVkJyxcbiAgICAnKGNoYW5nZSknOiAnb25JbnB1dENoYW5nZSgkZXZlbnQpJyxcbiAgICAnKGZvY3VzKSc6ICdmb2N1c2VkID0gdHJ1ZScsXG4gICAgJyhibHVyKSc6ICdmb2N1c2VkID0gZmFsc2UnXG4gIH0sXG4gIHByb3ZpZGVyczogW05HQl9DSEVDS0JPWF9WQUxVRV9BQ0NFU1NPUl1cbn0pXG5leHBvcnQgY2xhc3MgTmdiQ2hlY2tCb3ggaW1wbGVtZW50cyBDb250cm9sVmFsdWVBY2Nlc3NvciB7XG4gIGNoZWNrZWQ7XG5cbiAgLyoqXG4gICAqIElmIGB0cnVlYCwgdGhlIGNoZWNrYm94IGJ1dHRvbiB3aWxsIGJlIGRpc2FibGVkXG4gICAqL1xuICBASW5wdXQoKSBkaXNhYmxlZCA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBUaGUgZm9ybSBjb250cm9sIHZhbHVlIHdoZW4gdGhlIGNoZWNrYm94IGlzIGNoZWNrZWQuXG4gICAqL1xuICBASW5wdXQoKSB2YWx1ZUNoZWNrZWQgPSB0cnVlO1xuXG4gIC8qKlxuICAgKiBUaGUgZm9ybSBjb250cm9sIHZhbHVlIHdoZW4gdGhlIGNoZWNrYm94IGlzIHVuY2hlY2tlZC5cbiAgICovXG4gIEBJbnB1dCgpIHZhbHVlVW5DaGVja2VkID0gZmFsc2U7XG5cbiAgb25DaGFuZ2UgPSAoXzogYW55KSA9PiB7fTtcbiAgb25Ub3VjaGVkID0gKCkgPT4ge307XG5cbiAgc2V0IGZvY3VzZWQoaXNGb2N1c2VkOiBib29sZWFuKSB7XG4gICAgdGhpcy5fbGFiZWwuZm9jdXNlZCA9IGlzRm9jdXNlZDtcbiAgICBpZiAoIWlzRm9jdXNlZCkge1xuICAgICAgdGhpcy5vblRvdWNoZWQoKTtcbiAgICB9XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9sYWJlbDogTmdiQnV0dG9uTGFiZWwsIHByaXZhdGUgX2NkOiBDaGFuZ2VEZXRlY3RvclJlZikge31cblxuICBvbklucHV0Q2hhbmdlKCRldmVudCkge1xuICAgIGNvbnN0IG1vZGVsVG9Qcm9wYWdhdGUgPSAkZXZlbnQudGFyZ2V0LmNoZWNrZWQgPyB0aGlzLnZhbHVlQ2hlY2tlZCA6IHRoaXMudmFsdWVVbkNoZWNrZWQ7XG4gICAgdGhpcy5vbkNoYW5nZShtb2RlbFRvUHJvcGFnYXRlKTtcbiAgICB0aGlzLm9uVG91Y2hlZCgpO1xuICAgIHRoaXMud3JpdGVWYWx1ZShtb2RlbFRvUHJvcGFnYXRlKTtcbiAgfVxuXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46ICh2YWx1ZTogYW55KSA9PiBhbnkpOiB2b2lkIHsgdGhpcy5vbkNoYW5nZSA9IGZuOyB9XG5cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46ICgpID0+IGFueSk6IHZvaWQgeyB0aGlzLm9uVG91Y2hlZCA9IGZuOyB9XG5cbiAgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5kaXNhYmxlZCA9IGlzRGlzYWJsZWQ7XG4gICAgdGhpcy5fbGFiZWwuZGlzYWJsZWQgPSBpc0Rpc2FibGVkO1xuICB9XG5cbiAgd3JpdGVWYWx1ZSh2YWx1ZSkge1xuICAgIHRoaXMuY2hlY2tlZCA9IHZhbHVlID09PSB0aGlzLnZhbHVlQ2hlY2tlZDtcbiAgICB0aGlzLl9sYWJlbC5hY3RpdmUgPSB0aGlzLmNoZWNrZWQ7XG5cbiAgICAvLyBsYWJlbCB3b24ndCBiZSB1cGRhdGVkLCBpZiBpdCBpcyBpbnNpZGUgdGhlIE9uUHVzaCBjb21wb25lbnQgd2hlbiBbbmdNb2RlbF0gY2hhbmdlc1xuICAgIHRoaXMuX2NkLm1hcmtGb3JDaGVjaygpO1xuICB9XG59XG4iXX0=