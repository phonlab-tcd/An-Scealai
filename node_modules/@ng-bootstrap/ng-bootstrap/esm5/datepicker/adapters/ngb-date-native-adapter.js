/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { NgbDateAdapter } from './ngb-date-adapter';
import { isInteger } from '../../util/util';
/**
 * [`NgbDateAdapter`](#/components/datepicker/api#NgbDateAdapter) implementation that uses
 * native javascript dates as a user date model.
 */
var NgbDateNativeAdapter = /** @class */ (function (_super) {
    tslib_1.__extends(NgbDateNativeAdapter, _super);
    function NgbDateNativeAdapter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Converts a native `Date` to a `NgbDateStruct`.
     */
    /**
     * Converts a native `Date` to a `NgbDateStruct`.
     * @param {?} date
     * @return {?}
     */
    NgbDateNativeAdapter.prototype.fromModel = /**
     * Converts a native `Date` to a `NgbDateStruct`.
     * @param {?} date
     * @return {?}
     */
    function (date) {
        return (date instanceof Date && !isNaN(date.getTime())) ? this._fromNativeDate(date) : null;
    };
    /**
     * Converts a `NgbDateStruct` to a native `Date`.
     */
    /**
     * Converts a `NgbDateStruct` to a native `Date`.
     * @param {?} date
     * @return {?}
     */
    NgbDateNativeAdapter.prototype.toModel = /**
     * Converts a `NgbDateStruct` to a native `Date`.
     * @param {?} date
     * @return {?}
     */
    function (date) {
        return date && isInteger(date.year) && isInteger(date.month) && isInteger(date.day) ? this._toNativeDate(date) :
            null;
    };
    /**
     * @param {?} date
     * @return {?}
     */
    NgbDateNativeAdapter.prototype._fromNativeDate = /**
     * @param {?} date
     * @return {?}
     */
    function (date) {
        return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
    };
    /**
     * @param {?} date
     * @return {?}
     */
    NgbDateNativeAdapter.prototype._toNativeDate = /**
     * @param {?} date
     * @return {?}
     */
    function (date) {
        /** @type {?} */
        var jsDate = new Date(date.year, date.month - 1, date.day, 12);
        // avoid 30 -> 1930 conversion
        jsDate.setFullYear(date.year);
        return jsDate;
    };
    NgbDateNativeAdapter.decorators = [
        { type: Injectable }
    ];
    return NgbDateNativeAdapter;
}(NgbDateAdapter));
export { NgbDateNativeAdapter };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdiLWRhdGUtbmF0aXZlLWFkYXB0ZXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC8iLCJzb3VyY2VzIjpbImRhdGVwaWNrZXIvYWRhcHRlcnMvbmdiLWRhdGUtbmF0aXZlLWFkYXB0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUVsRCxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0saUJBQWlCLENBQUM7Ozs7O0FBTTFDO0lBQzBDLGdEQUFvQjtJQUQ5RDs7SUEyQkEsQ0FBQztJQXpCQzs7T0FFRzs7Ozs7O0lBQ0gsd0NBQVM7Ozs7O0lBQVQsVUFBVSxJQUFVO1FBQ2xCLE9BQU8sQ0FBQyxJQUFJLFlBQVksSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUM5RixDQUFDO0lBRUQ7O09BRUc7Ozs7OztJQUNILHNDQUFPOzs7OztJQUFQLFVBQVEsSUFBbUI7UUFDekIsT0FBTyxJQUFJLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUMxQixJQUFJLENBQUM7SUFDN0YsQ0FBQzs7Ozs7SUFFUyw4Q0FBZTs7OztJQUF6QixVQUEwQixJQUFVO1FBQ2xDLE9BQU8sRUFBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUMsQ0FBQztJQUNyRixDQUFDOzs7OztJQUVTLDRDQUFhOzs7O0lBQXZCLFVBQXdCLElBQW1COztZQUNuQyxNQUFNLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQztRQUNoRSw4QkFBOEI7UUFDOUIsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDOUIsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQzs7Z0JBMUJGLFVBQVU7O0lBMkJYLDJCQUFDO0NBQUEsQUEzQkQsQ0FDMEMsY0FBYyxHQTBCdkQ7U0ExQlksb0JBQW9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TmdiRGF0ZUFkYXB0ZXJ9IGZyb20gJy4vbmdiLWRhdGUtYWRhcHRlcic7XG5pbXBvcnQge05nYkRhdGVTdHJ1Y3R9IGZyb20gJy4uL25nYi1kYXRlLXN0cnVjdCc7XG5pbXBvcnQge2lzSW50ZWdlcn0gZnJvbSAnLi4vLi4vdXRpbC91dGlsJztcblxuLyoqXG4gKiBbYE5nYkRhdGVBZGFwdGVyYF0oIy9jb21wb25lbnRzL2RhdGVwaWNrZXIvYXBpI05nYkRhdGVBZGFwdGVyKSBpbXBsZW1lbnRhdGlvbiB0aGF0IHVzZXNcbiAqIG5hdGl2ZSBqYXZhc2NyaXB0IGRhdGVzIGFzIGEgdXNlciBkYXRlIG1vZGVsLlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTmdiRGF0ZU5hdGl2ZUFkYXB0ZXIgZXh0ZW5kcyBOZ2JEYXRlQWRhcHRlcjxEYXRlPiB7XG4gIC8qKlxuICAgKiBDb252ZXJ0cyBhIG5hdGl2ZSBgRGF0ZWAgdG8gYSBgTmdiRGF0ZVN0cnVjdGAuXG4gICAqL1xuICBmcm9tTW9kZWwoZGF0ZTogRGF0ZSk6IE5nYkRhdGVTdHJ1Y3Qge1xuICAgIHJldHVybiAoZGF0ZSBpbnN0YW5jZW9mIERhdGUgJiYgIWlzTmFOKGRhdGUuZ2V0VGltZSgpKSkgPyB0aGlzLl9mcm9tTmF0aXZlRGF0ZShkYXRlKSA6IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogQ29udmVydHMgYSBgTmdiRGF0ZVN0cnVjdGAgdG8gYSBuYXRpdmUgYERhdGVgLlxuICAgKi9cbiAgdG9Nb2RlbChkYXRlOiBOZ2JEYXRlU3RydWN0KTogRGF0ZSB7XG4gICAgcmV0dXJuIGRhdGUgJiYgaXNJbnRlZ2VyKGRhdGUueWVhcikgJiYgaXNJbnRlZ2VyKGRhdGUubW9udGgpICYmIGlzSW50ZWdlcihkYXRlLmRheSkgPyB0aGlzLl90b05hdGl2ZURhdGUoZGF0ZSkgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbnVsbDtcbiAgfVxuXG4gIHByb3RlY3RlZCBfZnJvbU5hdGl2ZURhdGUoZGF0ZTogRGF0ZSk6IE5nYkRhdGVTdHJ1Y3Qge1xuICAgIHJldHVybiB7eWVhcjogZGF0ZS5nZXRGdWxsWWVhcigpLCBtb250aDogZGF0ZS5nZXRNb250aCgpICsgMSwgZGF5OiBkYXRlLmdldERhdGUoKX07XG4gIH1cblxuICBwcm90ZWN0ZWQgX3RvTmF0aXZlRGF0ZShkYXRlOiBOZ2JEYXRlU3RydWN0KTogRGF0ZSB7XG4gICAgY29uc3QganNEYXRlID0gbmV3IERhdGUoZGF0ZS55ZWFyLCBkYXRlLm1vbnRoIC0gMSwgZGF0ZS5kYXksIDEyKTtcbiAgICAvLyBhdm9pZCAzMCAtPiAxOTMwIGNvbnZlcnNpb25cbiAgICBqc0RhdGUuc2V0RnVsbFllYXIoZGF0ZS55ZWFyKTtcbiAgICByZXR1cm4ganNEYXRlO1xuICB9XG59XG4iXX0=