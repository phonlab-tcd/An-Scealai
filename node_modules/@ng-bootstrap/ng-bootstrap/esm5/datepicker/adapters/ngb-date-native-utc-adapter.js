/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { NgbDateNativeAdapter } from './ngb-date-native-adapter';
/**
 * Same as [`NgbDateNativeAdapter`](#/components/datepicker/api#NgbDateNativeAdapter), but with UTC dates.
 *
 * \@since 3.2.0
 */
var NgbDateNativeUTCAdapter = /** @class */ (function (_super) {
    tslib_1.__extends(NgbDateNativeUTCAdapter, _super);
    function NgbDateNativeUTCAdapter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @param {?} date
     * @return {?}
     */
    NgbDateNativeUTCAdapter.prototype._fromNativeDate = /**
     * @param {?} date
     * @return {?}
     */
    function (date) {
        return { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1, day: date.getUTCDate() };
    };
    /**
     * @param {?} date
     * @return {?}
     */
    NgbDateNativeUTCAdapter.prototype._toNativeDate = /**
     * @param {?} date
     * @return {?}
     */
    function (date) {
        /** @type {?} */
        var jsDate = new Date(Date.UTC(date.year, date.month - 1, date.day));
        // avoid 30 -> 1930 conversion
        jsDate.setUTCFullYear(date.year);
        return jsDate;
    };
    NgbDateNativeUTCAdapter.decorators = [
        { type: Injectable }
    ];
    return NgbDateNativeUTCAdapter;
}(NgbDateNativeAdapter));
export { NgbDateNativeUTCAdapter };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdiLWRhdGUtbmF0aXZlLXV0Yy1hZGFwdGVyLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvIiwic291cmNlcyI6WyJkYXRlcGlja2VyL2FkYXB0ZXJzL25nYi1kYXRlLW5hdGl2ZS11dGMtYWRhcHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFekMsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sMkJBQTJCLENBQUM7Ozs7OztBQU8vRDtJQUM2QyxtREFBb0I7SUFEakU7O0lBWUEsQ0FBQzs7Ozs7SUFWVyxpREFBZTs7OztJQUF6QixVQUEwQixJQUFVO1FBQ2xDLE9BQU8sRUFBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLGNBQWMsRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLEVBQUMsQ0FBQztJQUM5RixDQUFDOzs7OztJQUVTLCtDQUFhOzs7O0lBQXZCLFVBQXdCLElBQW1COztZQUNuQyxNQUFNLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN0RSw4QkFBOEI7UUFDOUIsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDakMsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQzs7Z0JBWEYsVUFBVTs7SUFZWCw4QkFBQztDQUFBLEFBWkQsQ0FDNkMsb0JBQW9CLEdBV2hFO1NBWFksdUJBQXVCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TmdiRGF0ZVN0cnVjdH0gZnJvbSAnLi4vbmdiLWRhdGUtc3RydWN0JztcbmltcG9ydCB7TmdiRGF0ZU5hdGl2ZUFkYXB0ZXJ9IGZyb20gJy4vbmdiLWRhdGUtbmF0aXZlLWFkYXB0ZXInO1xuXG4vKipcbiAqIFNhbWUgYXMgW2BOZ2JEYXRlTmF0aXZlQWRhcHRlcmBdKCMvY29tcG9uZW50cy9kYXRlcGlja2VyL2FwaSNOZ2JEYXRlTmF0aXZlQWRhcHRlciksIGJ1dCB3aXRoIFVUQyBkYXRlcy5cbiAqXG4gKiBAc2luY2UgMy4yLjBcbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIE5nYkRhdGVOYXRpdmVVVENBZGFwdGVyIGV4dGVuZHMgTmdiRGF0ZU5hdGl2ZUFkYXB0ZXIge1xuICBwcm90ZWN0ZWQgX2Zyb21OYXRpdmVEYXRlKGRhdGU6IERhdGUpOiBOZ2JEYXRlU3RydWN0IHtcbiAgICByZXR1cm4ge3llYXI6IGRhdGUuZ2V0VVRDRnVsbFllYXIoKSwgbW9udGg6IGRhdGUuZ2V0VVRDTW9udGgoKSArIDEsIGRheTogZGF0ZS5nZXRVVENEYXRlKCl9O1xuICB9XG5cbiAgcHJvdGVjdGVkIF90b05hdGl2ZURhdGUoZGF0ZTogTmdiRGF0ZVN0cnVjdCk6IERhdGUge1xuICAgIGNvbnN0IGpzRGF0ZSA9IG5ldyBEYXRlKERhdGUuVVRDKGRhdGUueWVhciwgZGF0ZS5tb250aCAtIDEsIGRhdGUuZGF5KSk7XG4gICAgLy8gYXZvaWQgMzAgLT4gMTkzMCBjb252ZXJzaW9uXG4gICAganNEYXRlLnNldFVUQ0Z1bGxZZWFyKGRhdGUueWVhcik7XG4gICAgcmV0dXJuIGpzRGF0ZTtcbiAgfVxufVxuIl19