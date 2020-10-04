/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, Input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { regExpEscape, toString } from '../util/util';
/**
 * A component that helps with text highlighting.
 *
 * If splits the `result` text into parts that contain the searched `term` and generates the HTML markup to simplify
 * highlighting:
 *
 * Ex. `result="Alaska"` and `term="as"` will produce `Al<span class="ngb-highlight">as</span>ka`.
 */
var NgbHighlight = /** @class */ (function () {
    function NgbHighlight() {
        /**
         * The CSS class for `<span>` elements wrapping the `term` inside the `result`.
         */
        this.highlightClass = 'ngb-highlight';
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    NgbHighlight.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        /** @type {?} */
        var resultStr = toString(this.result);
        if (!resultStr) {
            this.parts = [resultStr];
            return;
        }
        /** @type {?} */
        var resultTerms = Array.isArray(this.term) ? this.term.map(function (x) { return toString(x); }) : [toString(this.term)];
        resultTerms = resultTerms.filter(function (x) { return x; });
        if (!resultTerms.length) {
            this.parts = [resultStr];
            return;
        }
        /** @type {?} */
        var regexStr = "(" + resultTerms.map(function (x) { return regExpEscape(x); }).join('|') + ")";
        this.parts = resultStr.split(new RegExp(regexStr, 'gmi'));
    };
    NgbHighlight.decorators = [
        { type: Component, args: [{
                    selector: 'ngb-highlight',
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    template: "<ng-template ngFor [ngForOf]=\"parts\" let-part let-isOdd=\"odd\">" +
                        "<span *ngIf=\"isOdd; else even\" [class]=\"highlightClass\">{{part}}</span><ng-template #even>{{part}}</ng-template>" +
                        "</ng-template>",
                    styles: [".ngb-highlight{font-weight:700}"]
                }] }
    ];
    NgbHighlight.propDecorators = {
        highlightClass: [{ type: Input }],
        result: [{ type: Input }],
        term: [{ type: Input }]
    };
    return NgbHighlight;
}());
export { NgbHighlight };
if (false) {
    /** @type {?} */
    NgbHighlight.prototype.parts;
    /**
     * The CSS class for `<span>` elements wrapping the `term` inside the `result`.
     * @type {?}
     */
    NgbHighlight.prototype.highlightClass;
    /**
     * The text highlighting is added to.
     *
     * If the `term` is found inside this text, it will be highlighted.
     * If the `term` contains array then all the items from it will be highlighted inside the text.
     * @type {?}
     */
    NgbHighlight.prototype.result;
    /**
     * The term or array of terms to be highlighted.
     * Since version `v4.2.0` term could be a `string[]`
     * @type {?}
     */
    NgbHighlight.prototype.term;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGlnaGxpZ2h0LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvIiwic291cmNlcyI6WyJ0eXBlYWhlYWQvaGlnaGxpZ2h0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUMsU0FBUyxFQUFFLEtBQUssRUFBYSx1QkFBdUIsRUFBaUIsaUJBQWlCLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDckgsT0FBTyxFQUFDLFlBQVksRUFBRSxRQUFRLEVBQUMsTUFBTSxjQUFjLENBQUM7Ozs7Ozs7OztBQVVwRDtJQUFBOzs7O1FBZVcsbUJBQWMsR0FBRyxlQUFlLENBQUM7SUFpQzVDLENBQUM7Ozs7O0lBakJDLGtDQUFXOzs7O0lBQVgsVUFBWSxPQUFzQjs7WUFDMUIsU0FBUyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDZCxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDekIsT0FBTztTQUNSOztZQUNHLFdBQVcsR0FBYSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQVgsQ0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUU5RyxXQUFXLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsRUFBRCxDQUFDLENBQUMsQ0FBQztRQUN6QyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRTtZQUN2QixJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDekIsT0FBTztTQUNSOztZQUVLLFFBQVEsR0FBRyxNQUFJLFdBQVcsQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQWYsQ0FBZSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFHO1FBQ3ZFLElBQUksQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLE1BQU0sQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUM1RCxDQUFDOztnQkEvQ0YsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxlQUFlO29CQUN6QixlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtvQkFDL0MsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7b0JBQ3JDLFFBQVEsRUFBRSxvRUFBZ0U7d0JBQ3RFLHNIQUFrSDt3QkFDbEgsZ0JBQWdCOztpQkFFckI7OztpQ0FPRSxLQUFLO3lCQVFMLEtBQUs7dUJBTUwsS0FBSzs7SUFtQlIsbUJBQUM7Q0FBQSxBQWhERCxJQWdEQztTQXZDWSxZQUFZOzs7SUFDdkIsNkJBQWdCOzs7OztJQUtoQixzQ0FBMEM7Ozs7Ozs7O0lBUTFDLDhCQUF3Qjs7Ozs7O0lBTXhCLDRCQUFpQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29tcG9uZW50LCBJbnB1dCwgT25DaGFuZ2VzLCBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgU2ltcGxlQ2hhbmdlcywgVmlld0VuY2Fwc3VsYXRpb259IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtyZWdFeHBFc2NhcGUsIHRvU3RyaW5nfSBmcm9tICcuLi91dGlsL3V0aWwnO1xuXG4vKipcbiAqIEEgY29tcG9uZW50IHRoYXQgaGVscHMgd2l0aCB0ZXh0IGhpZ2hsaWdodGluZy5cbiAqXG4gKiBJZiBzcGxpdHMgdGhlIGByZXN1bHRgIHRleHQgaW50byBwYXJ0cyB0aGF0IGNvbnRhaW4gdGhlIHNlYXJjaGVkIGB0ZXJtYCBhbmQgZ2VuZXJhdGVzIHRoZSBIVE1MIG1hcmt1cCB0byBzaW1wbGlmeVxuICogaGlnaGxpZ2h0aW5nOlxuICpcbiAqIEV4LiBgcmVzdWx0PVwiQWxhc2thXCJgIGFuZCBgdGVybT1cImFzXCJgIHdpbGwgcHJvZHVjZSBgQWw8c3BhbiBjbGFzcz1cIm5nYi1oaWdobGlnaHRcIj5hczwvc3Bhbj5rYWAuXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ25nYi1oaWdobGlnaHQnLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgdGVtcGxhdGU6IGA8bmctdGVtcGxhdGUgbmdGb3IgW25nRm9yT2ZdPVwicGFydHNcIiBsZXQtcGFydCBsZXQtaXNPZGQ9XCJvZGRcIj5gICtcbiAgICAgIGA8c3BhbiAqbmdJZj1cImlzT2RkOyBlbHNlIGV2ZW5cIiBbY2xhc3NdPVwiaGlnaGxpZ2h0Q2xhc3NcIj57e3BhcnR9fTwvc3Bhbj48bmctdGVtcGxhdGUgI2V2ZW4+e3twYXJ0fX08L25nLXRlbXBsYXRlPmAgK1xuICAgICAgYDwvbmctdGVtcGxhdGU+YCwgIC8vIHRlbXBsYXRlIG5lZWRzIHRvIGJlIGZvcm1hdHRlZCBpbiBhIGNlcnRhaW4gd2F5IHNvIHdlIGRvbid0IGFkZCBlbXB0eSB0ZXh0IG5vZGVzXG4gIHN0eWxlVXJsczogWycuL2hpZ2hsaWdodC5zY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgTmdiSGlnaGxpZ2h0IGltcGxlbWVudHMgT25DaGFuZ2VzIHtcbiAgcGFydHM6IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBUaGUgQ1NTIGNsYXNzIGZvciBgPHNwYW4+YCBlbGVtZW50cyB3cmFwcGluZyB0aGUgYHRlcm1gIGluc2lkZSB0aGUgYHJlc3VsdGAuXG4gICAqL1xuICBASW5wdXQoKSBoaWdobGlnaHRDbGFzcyA9ICduZ2ItaGlnaGxpZ2h0JztcblxuICAvKipcbiAgICogVGhlIHRleHQgaGlnaGxpZ2h0aW5nIGlzIGFkZGVkIHRvLlxuICAgKlxuICAgKiBJZiB0aGUgYHRlcm1gIGlzIGZvdW5kIGluc2lkZSB0aGlzIHRleHQsIGl0IHdpbGwgYmUgaGlnaGxpZ2h0ZWQuXG4gICAqIElmIHRoZSBgdGVybWAgY29udGFpbnMgYXJyYXkgdGhlbiBhbGwgdGhlIGl0ZW1zIGZyb20gaXQgd2lsbCBiZSBoaWdobGlnaHRlZCBpbnNpZGUgdGhlIHRleHQuXG4gICAqL1xuICBASW5wdXQoKSByZXN1bHQ6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHRlcm0gb3IgYXJyYXkgb2YgdGVybXMgdG8gYmUgaGlnaGxpZ2h0ZWQuXG4gICAqIFNpbmNlIHZlcnNpb24gYHY0LjIuMGAgdGVybSBjb3VsZCBiZSBhIGBzdHJpbmdbXWBcbiAgICovXG4gIEBJbnB1dCgpIHRlcm06IHN0cmluZyB8IHN0cmluZ1tdO1xuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBjb25zdCByZXN1bHRTdHIgPSB0b1N0cmluZyh0aGlzLnJlc3VsdCk7XG4gICAgaWYgKCFyZXN1bHRTdHIpIHtcbiAgICAgIHRoaXMucGFydHMgPSBbcmVzdWx0U3RyXTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbGV0IHJlc3VsdFRlcm1zOiBzdHJpbmdbXSA9IEFycmF5LmlzQXJyYXkodGhpcy50ZXJtKSA/IHRoaXMudGVybS5tYXAoeCA9PiB0b1N0cmluZyh4KSkgOiBbdG9TdHJpbmcodGhpcy50ZXJtKV07XG5cbiAgICByZXN1bHRUZXJtcyA9IHJlc3VsdFRlcm1zLmZpbHRlcih4ID0+IHgpO1xuICAgIGlmICghcmVzdWx0VGVybXMubGVuZ3RoKSB7XG4gICAgICB0aGlzLnBhcnRzID0gW3Jlc3VsdFN0cl07XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcmVnZXhTdHIgPSBgKCR7cmVzdWx0VGVybXMubWFwKHggPT4gcmVnRXhwRXNjYXBlKHgpKS5qb2luKCd8Jyl9KWA7XG4gICAgdGhpcy5wYXJ0cyA9IHJlc3VsdFN0ci5zcGxpdChuZXcgUmVnRXhwKHJlZ2V4U3RyLCAnZ21pJykpO1xuICB9XG59XG4iXX0=