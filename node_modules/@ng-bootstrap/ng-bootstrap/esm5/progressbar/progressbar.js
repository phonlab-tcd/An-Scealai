/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { getValueInRange } from '../util/util';
import { NgbProgressbarConfig } from './progressbar-config';
/**
 * A directive that provides feedback on the progress of a workflow or an action.
 */
var NgbProgressbar = /** @class */ (function () {
    function NgbProgressbar(config) {
        /**
         * The current value for the progress bar.
         *
         * Should be in the `[0, max]` range.
         */
        this.value = 0;
        this.max = config.max;
        this.animated = config.animated;
        this.striped = config.striped;
        this.type = config.type;
        this.showValue = config.showValue;
        this.height = config.height;
    }
    /**
     * @return {?}
     */
    NgbProgressbar.prototype.getValue = /**
     * @return {?}
     */
    function () { return getValueInRange(this.value, this.max); };
    /**
     * @return {?}
     */
    NgbProgressbar.prototype.getPercentValue = /**
     * @return {?}
     */
    function () { return 100 * this.getValue() / this.max; };
    NgbProgressbar.decorators = [
        { type: Component, args: [{
                    selector: 'ngb-progressbar',
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    template: "\n    <div class=\"progress\" [style.height]=\"height\">\n      <div class=\"progress-bar{{type ? ' bg-' + type : ''}}{{animated ? ' progress-bar-animated' : ''}}{{striped ?\n    ' progress-bar-striped' : ''}}\" role=\"progressbar\" [style.width.%]=\"getPercentValue()\"\n    [attr.aria-valuenow]=\"getValue()\" aria-valuemin=\"0\" [attr.aria-valuemax]=\"max\">\n        <span *ngIf=\"showValue\" i18n=\"@@ngb.progressbar.value\">{{getPercentValue()}}%</span><ng-content></ng-content>\n      </div>\n    </div>\n  "
                }] }
    ];
    /** @nocollapse */
    NgbProgressbar.ctorParameters = function () { return [
        { type: NgbProgressbarConfig }
    ]; };
    NgbProgressbar.propDecorators = {
        max: [{ type: Input }],
        animated: [{ type: Input }],
        striped: [{ type: Input }],
        showValue: [{ type: Input }],
        type: [{ type: Input }],
        value: [{ type: Input }],
        height: [{ type: Input }]
    };
    return NgbProgressbar;
}());
export { NgbProgressbar };
if (false) {
    /**
     * The maximal value to be displayed in the progressbar.
     * @type {?}
     */
    NgbProgressbar.prototype.max;
    /**
     * If `true`, the stripes on the progressbar are animated.
     *
     * Takes effect only for browsers supporting CSS3 animations, and if `striped` is `true`.
     * @type {?}
     */
    NgbProgressbar.prototype.animated;
    /**
     * If `true`, the progress bars will be displayed as striped.
     * @type {?}
     */
    NgbProgressbar.prototype.striped;
    /**
     * If `true`, the current percentage will be shown in the `xx%` format.
     * @type {?}
     */
    NgbProgressbar.prototype.showValue;
    /**
     * The type of the progress bar.
     *
     * Currently Bootstrap supports `"success"`, `"info"`, `"warning"` or `"danger"`.
     * @type {?}
     */
    NgbProgressbar.prototype.type;
    /**
     * The current value for the progress bar.
     *
     * Should be in the `[0, max]` range.
     * @type {?}
     */
    NgbProgressbar.prototype.value;
    /**
     * THe height of the progress bar.
     *
     * Accepts any valid CSS height values, ex. `"2rem"`
     * @type {?}
     */
    NgbProgressbar.prototype.height;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZ3Jlc3NiYXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC8iLCJzb3VyY2VzIjpbInByb2dyZXNzYmFyL3Byb2dyZXNzYmFyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUMsU0FBUyxFQUFFLEtBQUssRUFBRSx1QkFBdUIsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN4RSxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQzdDLE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDOzs7O0FBSzFEO0lBeURFLHdCQUFZLE1BQTRCOzs7Ozs7UUFUL0IsVUFBSyxHQUFHLENBQUMsQ0FBQztRQVVqQixJQUFJLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDdEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQztRQUM5QixJQUFJLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDeEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUM5QixDQUFDOzs7O0lBRUQsaUNBQVE7OztJQUFSLGNBQWEsT0FBTyxlQUFlLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7O0lBRTVELHdDQUFlOzs7SUFBZixjQUFvQixPQUFPLEdBQUcsR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7O2dCQXBFL0QsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxpQkFBaUI7b0JBQzNCLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO29CQUMvQyxRQUFRLEVBQUUsb2dCQVFUO2lCQUNGOzs7O2dCQWpCTyxvQkFBb0I7OztzQkFzQnpCLEtBQUs7MkJBT0wsS0FBSzswQkFLTCxLQUFLOzRCQUtMLEtBQUs7dUJBT0wsS0FBSzt3QkFPTCxLQUFLO3lCQU9MLEtBQUs7O0lBY1IscUJBQUM7Q0FBQSxBQXJFRCxJQXFFQztTQXhEWSxjQUFjOzs7Ozs7SUFJekIsNkJBQXFCOzs7Ozs7O0lBT3JCLGtDQUEyQjs7Ozs7SUFLM0IsaUNBQTBCOzs7OztJQUsxQixtQ0FBNEI7Ozs7Ozs7SUFPNUIsOEJBQXNCOzs7Ozs7O0lBT3RCLCtCQUFtQjs7Ozs7OztJQU9uQixnQ0FBd0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NvbXBvbmVudCwgSW5wdXQsIENoYW5nZURldGVjdGlvblN0cmF0ZWd5fSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Z2V0VmFsdWVJblJhbmdlfSBmcm9tICcuLi91dGlsL3V0aWwnO1xuaW1wb3J0IHtOZ2JQcm9ncmVzc2JhckNvbmZpZ30gZnJvbSAnLi9wcm9ncmVzc2Jhci1jb25maWcnO1xuXG4vKipcbiAqIEEgZGlyZWN0aXZlIHRoYXQgcHJvdmlkZXMgZmVlZGJhY2sgb24gdGhlIHByb2dyZXNzIG9mIGEgd29ya2Zsb3cgb3IgYW4gYWN0aW9uLlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZ2ItcHJvZ3Jlc3NiYXInLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2IGNsYXNzPVwicHJvZ3Jlc3NcIiBbc3R5bGUuaGVpZ2h0XT1cImhlaWdodFwiPlxuICAgICAgPGRpdiBjbGFzcz1cInByb2dyZXNzLWJhcnt7dHlwZSA/ICcgYmctJyArIHR5cGUgOiAnJ319e3thbmltYXRlZCA/ICcgcHJvZ3Jlc3MtYmFyLWFuaW1hdGVkJyA6ICcnfX17e3N0cmlwZWQgP1xuICAgICcgcHJvZ3Jlc3MtYmFyLXN0cmlwZWQnIDogJyd9fVwiIHJvbGU9XCJwcm9ncmVzc2JhclwiIFtzdHlsZS53aWR0aC4lXT1cImdldFBlcmNlbnRWYWx1ZSgpXCJcbiAgICBbYXR0ci5hcmlhLXZhbHVlbm93XT1cImdldFZhbHVlKClcIiBhcmlhLXZhbHVlbWluPVwiMFwiIFthdHRyLmFyaWEtdmFsdWVtYXhdPVwibWF4XCI+XG4gICAgICAgIDxzcGFuICpuZ0lmPVwic2hvd1ZhbHVlXCIgaTE4bj1cIkBAbmdiLnByb2dyZXNzYmFyLnZhbHVlXCI+e3tnZXRQZXJjZW50VmFsdWUoKX19JTwvc3Bhbj48bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgYFxufSlcbmV4cG9ydCBjbGFzcyBOZ2JQcm9ncmVzc2JhciB7XG4gIC8qKlxuICAgKiBUaGUgbWF4aW1hbCB2YWx1ZSB0byBiZSBkaXNwbGF5ZWQgaW4gdGhlIHByb2dyZXNzYmFyLlxuICAgKi9cbiAgQElucHV0KCkgbWF4OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIElmIGB0cnVlYCwgdGhlIHN0cmlwZXMgb24gdGhlIHByb2dyZXNzYmFyIGFyZSBhbmltYXRlZC5cbiAgICpcbiAgICogVGFrZXMgZWZmZWN0IG9ubHkgZm9yIGJyb3dzZXJzIHN1cHBvcnRpbmcgQ1NTMyBhbmltYXRpb25zLCBhbmQgaWYgYHN0cmlwZWRgIGlzIGB0cnVlYC5cbiAgICovXG4gIEBJbnB1dCgpIGFuaW1hdGVkOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBJZiBgdHJ1ZWAsIHRoZSBwcm9ncmVzcyBiYXJzIHdpbGwgYmUgZGlzcGxheWVkIGFzIHN0cmlwZWQuXG4gICAqL1xuICBASW5wdXQoKSBzdHJpcGVkOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBJZiBgdHJ1ZWAsIHRoZSBjdXJyZW50IHBlcmNlbnRhZ2Ugd2lsbCBiZSBzaG93biBpbiB0aGUgYHh4JWAgZm9ybWF0LlxuICAgKi9cbiAgQElucHV0KCkgc2hvd1ZhbHVlOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBUaGUgdHlwZSBvZiB0aGUgcHJvZ3Jlc3MgYmFyLlxuICAgKlxuICAgKiBDdXJyZW50bHkgQm9vdHN0cmFwIHN1cHBvcnRzIGBcInN1Y2Nlc3NcImAsIGBcImluZm9cImAsIGBcIndhcm5pbmdcImAgb3IgYFwiZGFuZ2VyXCJgLlxuICAgKi9cbiAgQElucHV0KCkgdHlwZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgY3VycmVudCB2YWx1ZSBmb3IgdGhlIHByb2dyZXNzIGJhci5cbiAgICpcbiAgICogU2hvdWxkIGJlIGluIHRoZSBgWzAsIG1heF1gIHJhbmdlLlxuICAgKi9cbiAgQElucHV0KCkgdmFsdWUgPSAwO1xuXG4gIC8qKlxuICAgKiBUSGUgaGVpZ2h0IG9mIHRoZSBwcm9ncmVzcyBiYXIuXG4gICAqXG4gICAqIEFjY2VwdHMgYW55IHZhbGlkIENTUyBoZWlnaHQgdmFsdWVzLCBleC4gYFwiMnJlbVwiYFxuICAgKi9cbiAgQElucHV0KCkgaGVpZ2h0OiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBOZ2JQcm9ncmVzc2JhckNvbmZpZykge1xuICAgIHRoaXMubWF4ID0gY29uZmlnLm1heDtcbiAgICB0aGlzLmFuaW1hdGVkID0gY29uZmlnLmFuaW1hdGVkO1xuICAgIHRoaXMuc3RyaXBlZCA9IGNvbmZpZy5zdHJpcGVkO1xuICAgIHRoaXMudHlwZSA9IGNvbmZpZy50eXBlO1xuICAgIHRoaXMuc2hvd1ZhbHVlID0gY29uZmlnLnNob3dWYWx1ZTtcbiAgICB0aGlzLmhlaWdodCA9IGNvbmZpZy5oZWlnaHQ7XG4gIH1cblxuICBnZXRWYWx1ZSgpIHsgcmV0dXJuIGdldFZhbHVlSW5SYW5nZSh0aGlzLnZhbHVlLCB0aGlzLm1heCk7IH1cblxuICBnZXRQZXJjZW50VmFsdWUoKSB7IHJldHVybiAxMDAgKiB0aGlzLmdldFZhbHVlKCkgLyB0aGlzLm1heDsgfVxufVxuIl19