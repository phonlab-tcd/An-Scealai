/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { toString } from '../util/util';
/**
 * The context for the typeahead result template in case you want to override the default one.
 * @record
 */
export function ResultTemplateContext() { }
if (false) {
    /**
     * Your typeahead result item.
     * @type {?}
     */
    ResultTemplateContext.prototype.result;
    /**
     * Search term from the `<input>` used to get current result.
     * @type {?}
     */
    ResultTemplateContext.prototype.term;
}
var NgbTypeaheadWindow = /** @class */ (function () {
    function NgbTypeaheadWindow() {
        this.activeIdx = 0;
        /**
         * Flag indicating if the first row should be active initially
         */
        this.focusFirst = true;
        /**
         * A function used to format a given result before display. This function should return a formatted string without any
         * HTML markup
         */
        this.formatter = toString;
        /**
         * Event raised when user selects a particular result row
         */
        this.selectEvent = new EventEmitter();
        this.activeChangeEvent = new EventEmitter();
    }
    /**
     * @return {?}
     */
    NgbTypeaheadWindow.prototype.hasActive = /**
     * @return {?}
     */
    function () { return this.activeIdx > -1 && this.activeIdx < this.results.length; };
    /**
     * @return {?}
     */
    NgbTypeaheadWindow.prototype.getActive = /**
     * @return {?}
     */
    function () { return this.results[this.activeIdx]; };
    /**
     * @param {?} activeIdx
     * @return {?}
     */
    NgbTypeaheadWindow.prototype.markActive = /**
     * @param {?} activeIdx
     * @return {?}
     */
    function (activeIdx) {
        this.activeIdx = activeIdx;
        this._activeChanged();
    };
    /**
     * @return {?}
     */
    NgbTypeaheadWindow.prototype.next = /**
     * @return {?}
     */
    function () {
        if (this.activeIdx === this.results.length - 1) {
            this.activeIdx = this.focusFirst ? (this.activeIdx + 1) % this.results.length : -1;
        }
        else {
            this.activeIdx++;
        }
        this._activeChanged();
    };
    /**
     * @return {?}
     */
    NgbTypeaheadWindow.prototype.prev = /**
     * @return {?}
     */
    function () {
        if (this.activeIdx < 0) {
            this.activeIdx = this.results.length - 1;
        }
        else if (this.activeIdx === 0) {
            this.activeIdx = this.focusFirst ? this.results.length - 1 : -1;
        }
        else {
            this.activeIdx--;
        }
        this._activeChanged();
    };
    /**
     * @return {?}
     */
    NgbTypeaheadWindow.prototype.resetActive = /**
     * @return {?}
     */
    function () {
        this.activeIdx = this.focusFirst ? 0 : -1;
        this._activeChanged();
    };
    /**
     * @param {?} item
     * @return {?}
     */
    NgbTypeaheadWindow.prototype.select = /**
     * @param {?} item
     * @return {?}
     */
    function (item) { this.selectEvent.emit(item); };
    /**
     * @return {?}
     */
    NgbTypeaheadWindow.prototype.ngOnInit = /**
     * @return {?}
     */
    function () { this.resetActive(); };
    /**
     * @return {?}
     */
    NgbTypeaheadWindow.prototype._activeChanged = /**
     * @return {?}
     */
    function () {
        this.activeChangeEvent.emit(this.activeIdx >= 0 ? this.id + '-' + this.activeIdx : undefined);
    };
    NgbTypeaheadWindow.decorators = [
        { type: Component, args: [{
                    selector: 'ngb-typeahead-window',
                    exportAs: 'ngbTypeaheadWindow',
                    host: { '(mousedown)': '$event.preventDefault()', 'class': 'dropdown-menu show', 'role': 'listbox', '[id]': 'id' },
                    template: "\n    <ng-template #rt let-result=\"result\" let-term=\"term\" let-formatter=\"formatter\">\n      <ngb-highlight [result]=\"formatter(result)\" [term]=\"term\"></ngb-highlight>\n    </ng-template>\n    <ng-template ngFor [ngForOf]=\"results\" let-result let-idx=\"index\">\n      <button type=\"button\" class=\"dropdown-item\" role=\"option\"\n        [id]=\"id + '-' + idx\"\n        [class.active]=\"idx === activeIdx\"\n        (mouseenter)=\"markActive(idx)\"\n        (click)=\"select(result)\">\n          <ng-template [ngTemplateOutlet]=\"resultTemplate || rt\"\n          [ngTemplateOutletContext]=\"{result: result, term: term, formatter: formatter}\"></ng-template>\n      </button>\n    </ng-template>\n  "
                }] }
    ];
    NgbTypeaheadWindow.propDecorators = {
        id: [{ type: Input }],
        focusFirst: [{ type: Input }],
        results: [{ type: Input }],
        term: [{ type: Input }],
        formatter: [{ type: Input }],
        resultTemplate: [{ type: Input }],
        selectEvent: [{ type: Output, args: ['select',] }],
        activeChangeEvent: [{ type: Output, args: ['activeChange',] }]
    };
    return NgbTypeaheadWindow;
}());
export { NgbTypeaheadWindow };
if (false) {
    /** @type {?} */
    NgbTypeaheadWindow.prototype.activeIdx;
    /**
     *  The id for the typeahead window. The id should be unique and the same
     *  as the associated typeahead's id.
     * @type {?}
     */
    NgbTypeaheadWindow.prototype.id;
    /**
     * Flag indicating if the first row should be active initially
     * @type {?}
     */
    NgbTypeaheadWindow.prototype.focusFirst;
    /**
     * Typeahead match results to be displayed
     * @type {?}
     */
    NgbTypeaheadWindow.prototype.results;
    /**
     * Search term used to get current results
     * @type {?}
     */
    NgbTypeaheadWindow.prototype.term;
    /**
     * A function used to format a given result before display. This function should return a formatted string without any
     * HTML markup
     * @type {?}
     */
    NgbTypeaheadWindow.prototype.formatter;
    /**
     * A template to override a matching result default display
     * @type {?}
     */
    NgbTypeaheadWindow.prototype.resultTemplate;
    /**
     * Event raised when user selects a particular result row
     * @type {?}
     */
    NgbTypeaheadWindow.prototype.selectEvent;
    /** @type {?} */
    NgbTypeaheadWindow.prototype.activeChangeEvent;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZWFoZWFkLXdpbmRvdy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwLyIsInNvdXJjZXMiOlsidHlwZWFoZWFkL3R5cGVhaGVhZC13aW5kb3cudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsV0FBVyxFQUFTLE1BQU0sZUFBZSxDQUFDO0FBRTFGLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxjQUFjLENBQUM7Ozs7O0FBS3RDLDJDQVVDOzs7Ozs7SUFOQyx1Q0FBWTs7Ozs7SUFLWixxQ0FBYTs7QUFHZjtJQUFBO1FBcUJFLGNBQVMsR0FBRyxDQUFDLENBQUM7Ozs7UUFXTCxlQUFVLEdBQUcsSUFBSSxDQUFDOzs7OztRQWdCbEIsY0FBUyxHQUFHLFFBQVEsQ0FBQzs7OztRQVVaLGdCQUFXLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUUzQixzQkFBaUIsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO0lBMkNqRSxDQUFDOzs7O0lBekNDLHNDQUFTOzs7SUFBVCxjQUFjLE9BQU8sSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzs7OztJQUVuRixzQ0FBUzs7O0lBQVQsY0FBYyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7Ozs7SUFFcEQsdUNBQVU7Ozs7SUFBVixVQUFXLFNBQWlCO1FBQzFCLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQzNCLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUN4QixDQUFDOzs7O0lBRUQsaUNBQUk7OztJQUFKO1FBQ0UsSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUM5QyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDcEY7YUFBTTtZQUNMLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztTQUNsQjtRQUNELElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUN4QixDQUFDOzs7O0lBRUQsaUNBQUk7OztJQUFKO1FBQ0UsSUFBSSxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsRUFBRTtZQUN0QixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztTQUMxQzthQUFNLElBQUksSUFBSSxDQUFDLFNBQVMsS0FBSyxDQUFDLEVBQUU7WUFDL0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2pFO2FBQU07WUFDTCxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7U0FDbEI7UUFDRCxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDeEIsQ0FBQzs7OztJQUVELHdDQUFXOzs7SUFBWDtRQUNFLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxQyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDeEIsQ0FBQzs7Ozs7SUFFRCxtQ0FBTTs7OztJQUFOLFVBQU8sSUFBSSxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzs7OztJQUU3QyxxQ0FBUTs7O0lBQVIsY0FBYSxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDOzs7O0lBRTFCLDJDQUFjOzs7SUFBdEI7UUFDRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNoRyxDQUFDOztnQkF0R0YsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxzQkFBc0I7b0JBQ2hDLFFBQVEsRUFBRSxvQkFBb0I7b0JBQzlCLElBQUksRUFBRSxFQUFDLGFBQWEsRUFBRSx5QkFBeUIsRUFBRSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFDO29CQUNoSCxRQUFRLEVBQUUsZ3RCQWNUO2lCQUNGOzs7cUJBUUUsS0FBSzs2QkFLTCxLQUFLOzBCQUtMLEtBQUs7dUJBS0wsS0FBSzs0QkFNTCxLQUFLO2lDQUtMLEtBQUs7OEJBS0wsTUFBTSxTQUFDLFFBQVE7b0NBRWYsTUFBTSxTQUFDLGNBQWM7O0lBMkN4Qix5QkFBQztDQUFBLEFBdkdELElBdUdDO1NBbkZZLGtCQUFrQjs7O0lBQzdCLHVDQUFjOzs7Ozs7SUFNZCxnQ0FBb0I7Ozs7O0lBS3BCLHdDQUEyQjs7Ozs7SUFLM0IscUNBQWlCOzs7OztJQUtqQixrQ0FBc0I7Ozs7OztJQU10Qix1Q0FBOEI7Ozs7O0lBSzlCLDRDQUE0RDs7Ozs7SUFLNUQseUNBQW1EOztJQUVuRCwrQ0FBK0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NvbXBvbmVudCwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBUZW1wbGF0ZVJlZiwgT25Jbml0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHt0b1N0cmluZ30gZnJvbSAnLi4vdXRpbC91dGlsJztcblxuLyoqXG4gKiBUaGUgY29udGV4dCBmb3IgdGhlIHR5cGVhaGVhZCByZXN1bHQgdGVtcGxhdGUgaW4gY2FzZSB5b3Ugd2FudCB0byBvdmVycmlkZSB0aGUgZGVmYXVsdCBvbmUuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUmVzdWx0VGVtcGxhdGVDb250ZXh0IHtcbiAgLyoqXG4gICAqIFlvdXIgdHlwZWFoZWFkIHJlc3VsdCBpdGVtLlxuICAgKi9cbiAgcmVzdWx0OiBhbnk7XG5cbiAgLyoqXG4gICAqIFNlYXJjaCB0ZXJtIGZyb20gdGhlIGA8aW5wdXQ+YCB1c2VkIHRvIGdldCBjdXJyZW50IHJlc3VsdC5cbiAgICovXG4gIHRlcm06IHN0cmluZztcbn1cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbmdiLXR5cGVhaGVhZC13aW5kb3cnLFxuICBleHBvcnRBczogJ25nYlR5cGVhaGVhZFdpbmRvdycsXG4gIGhvc3Q6IHsnKG1vdXNlZG93biknOiAnJGV2ZW50LnByZXZlbnREZWZhdWx0KCknLCAnY2xhc3MnOiAnZHJvcGRvd24tbWVudSBzaG93JywgJ3JvbGUnOiAnbGlzdGJveCcsICdbaWRdJzogJ2lkJ30sXG4gIHRlbXBsYXRlOiBgXG4gICAgPG5nLXRlbXBsYXRlICNydCBsZXQtcmVzdWx0PVwicmVzdWx0XCIgbGV0LXRlcm09XCJ0ZXJtXCIgbGV0LWZvcm1hdHRlcj1cImZvcm1hdHRlclwiPlxuICAgICAgPG5nYi1oaWdobGlnaHQgW3Jlc3VsdF09XCJmb3JtYXR0ZXIocmVzdWx0KVwiIFt0ZXJtXT1cInRlcm1cIj48L25nYi1oaWdobGlnaHQ+XG4gICAgPC9uZy10ZW1wbGF0ZT5cbiAgICA8bmctdGVtcGxhdGUgbmdGb3IgW25nRm9yT2ZdPVwicmVzdWx0c1wiIGxldC1yZXN1bHQgbGV0LWlkeD1cImluZGV4XCI+XG4gICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImRyb3Bkb3duLWl0ZW1cIiByb2xlPVwib3B0aW9uXCJcbiAgICAgICAgW2lkXT1cImlkICsgJy0nICsgaWR4XCJcbiAgICAgICAgW2NsYXNzLmFjdGl2ZV09XCJpZHggPT09IGFjdGl2ZUlkeFwiXG4gICAgICAgIChtb3VzZWVudGVyKT1cIm1hcmtBY3RpdmUoaWR4KVwiXG4gICAgICAgIChjbGljayk9XCJzZWxlY3QocmVzdWx0KVwiPlxuICAgICAgICAgIDxuZy10ZW1wbGF0ZSBbbmdUZW1wbGF0ZU91dGxldF09XCJyZXN1bHRUZW1wbGF0ZSB8fCBydFwiXG4gICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cIntyZXN1bHQ6IHJlc3VsdCwgdGVybTogdGVybSwgZm9ybWF0dGVyOiBmb3JtYXR0ZXJ9XCI+PC9uZy10ZW1wbGF0ZT5cbiAgICAgIDwvYnV0dG9uPlxuICAgIDwvbmctdGVtcGxhdGU+XG4gIGBcbn0pXG5leHBvcnQgY2xhc3MgTmdiVHlwZWFoZWFkV2luZG93IGltcGxlbWVudHMgT25Jbml0IHtcbiAgYWN0aXZlSWR4ID0gMDtcblxuICAvKipcbiAgICogIFRoZSBpZCBmb3IgdGhlIHR5cGVhaGVhZCB3aW5kb3cuIFRoZSBpZCBzaG91bGQgYmUgdW5pcXVlIGFuZCB0aGUgc2FtZVxuICAgKiAgYXMgdGhlIGFzc29jaWF0ZWQgdHlwZWFoZWFkJ3MgaWQuXG4gICAqL1xuICBASW5wdXQoKSBpZDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBGbGFnIGluZGljYXRpbmcgaWYgdGhlIGZpcnN0IHJvdyBzaG91bGQgYmUgYWN0aXZlIGluaXRpYWxseVxuICAgKi9cbiAgQElucHV0KCkgZm9jdXNGaXJzdCA9IHRydWU7XG5cbiAgLyoqXG4gICAqIFR5cGVhaGVhZCBtYXRjaCByZXN1bHRzIHRvIGJlIGRpc3BsYXllZFxuICAgKi9cbiAgQElucHV0KCkgcmVzdWx0cztcblxuICAvKipcbiAgICogU2VhcmNoIHRlcm0gdXNlZCB0byBnZXQgY3VycmVudCByZXN1bHRzXG4gICAqL1xuICBASW5wdXQoKSB0ZXJtOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEEgZnVuY3Rpb24gdXNlZCB0byBmb3JtYXQgYSBnaXZlbiByZXN1bHQgYmVmb3JlIGRpc3BsYXkuIFRoaXMgZnVuY3Rpb24gc2hvdWxkIHJldHVybiBhIGZvcm1hdHRlZCBzdHJpbmcgd2l0aG91dCBhbnlcbiAgICogSFRNTCBtYXJrdXBcbiAgICovXG4gIEBJbnB1dCgpIGZvcm1hdHRlciA9IHRvU3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBIHRlbXBsYXRlIHRvIG92ZXJyaWRlIGEgbWF0Y2hpbmcgcmVzdWx0IGRlZmF1bHQgZGlzcGxheVxuICAgKi9cbiAgQElucHV0KCkgcmVzdWx0VGVtcGxhdGU6IFRlbXBsYXRlUmVmPFJlc3VsdFRlbXBsYXRlQ29udGV4dD47XG5cbiAgLyoqXG4gICAqIEV2ZW50IHJhaXNlZCB3aGVuIHVzZXIgc2VsZWN0cyBhIHBhcnRpY3VsYXIgcmVzdWx0IHJvd1xuICAgKi9cbiAgQE91dHB1dCgnc2VsZWN0Jykgc2VsZWN0RXZlbnQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgQE91dHB1dCgnYWN0aXZlQ2hhbmdlJykgYWN0aXZlQ2hhbmdlRXZlbnQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgaGFzQWN0aXZlKCkgeyByZXR1cm4gdGhpcy5hY3RpdmVJZHggPiAtMSAmJiB0aGlzLmFjdGl2ZUlkeCA8IHRoaXMucmVzdWx0cy5sZW5ndGg7IH1cblxuICBnZXRBY3RpdmUoKSB7IHJldHVybiB0aGlzLnJlc3VsdHNbdGhpcy5hY3RpdmVJZHhdOyB9XG5cbiAgbWFya0FjdGl2ZShhY3RpdmVJZHg6IG51bWJlcikge1xuICAgIHRoaXMuYWN0aXZlSWR4ID0gYWN0aXZlSWR4O1xuICAgIHRoaXMuX2FjdGl2ZUNoYW5nZWQoKTtcbiAgfVxuXG4gIG5leHQoKSB7XG4gICAgaWYgKHRoaXMuYWN0aXZlSWR4ID09PSB0aGlzLnJlc3VsdHMubGVuZ3RoIC0gMSkge1xuICAgICAgdGhpcy5hY3RpdmVJZHggPSB0aGlzLmZvY3VzRmlyc3QgPyAodGhpcy5hY3RpdmVJZHggKyAxKSAlIHRoaXMucmVzdWx0cy5sZW5ndGggOiAtMTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5hY3RpdmVJZHgrKztcbiAgICB9XG4gICAgdGhpcy5fYWN0aXZlQ2hhbmdlZCgpO1xuICB9XG5cbiAgcHJldigpIHtcbiAgICBpZiAodGhpcy5hY3RpdmVJZHggPCAwKSB7XG4gICAgICB0aGlzLmFjdGl2ZUlkeCA9IHRoaXMucmVzdWx0cy5sZW5ndGggLSAxO1xuICAgIH0gZWxzZSBpZiAodGhpcy5hY3RpdmVJZHggPT09IDApIHtcbiAgICAgIHRoaXMuYWN0aXZlSWR4ID0gdGhpcy5mb2N1c0ZpcnN0ID8gdGhpcy5yZXN1bHRzLmxlbmd0aCAtIDEgOiAtMTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5hY3RpdmVJZHgtLTtcbiAgICB9XG4gICAgdGhpcy5fYWN0aXZlQ2hhbmdlZCgpO1xuICB9XG5cbiAgcmVzZXRBY3RpdmUoKSB7XG4gICAgdGhpcy5hY3RpdmVJZHggPSB0aGlzLmZvY3VzRmlyc3QgPyAwIDogLTE7XG4gICAgdGhpcy5fYWN0aXZlQ2hhbmdlZCgpO1xuICB9XG5cbiAgc2VsZWN0KGl0ZW0pIHsgdGhpcy5zZWxlY3RFdmVudC5lbWl0KGl0ZW0pOyB9XG5cbiAgbmdPbkluaXQoKSB7IHRoaXMucmVzZXRBY3RpdmUoKTsgfVxuXG4gIHByaXZhdGUgX2FjdGl2ZUNoYW5nZWQoKSB7XG4gICAgdGhpcy5hY3RpdmVDaGFuZ2VFdmVudC5lbWl0KHRoaXMuYWN0aXZlSWR4ID49IDAgPyB0aGlzLmlkICsgJy0nICsgdGhpcy5hY3RpdmVJZHggOiB1bmRlZmluZWQpO1xuICB9XG59XG4iXX0=