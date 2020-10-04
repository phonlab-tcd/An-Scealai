/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * Options available when opening new modal windows with `NgbModal.open()` method.
 * @record
 */
export function NgbModalOptions() { }
if (false) {
    /**
     * `aria-labelledby` attribute value to set on the modal window.
     *
     * \@since 2.2.0
     * @type {?|undefined}
     */
    NgbModalOptions.prototype.ariaLabelledBy;
    /**
     * If `true`, the backdrop element will be created for a given modal.
     *
     * Alternatively, specify `'static'` for a backdrop which doesn't close the modal on click.
     *
     * Default value is `true`.
     * @type {?|undefined}
     */
    NgbModalOptions.prototype.backdrop;
    /**
     * Callback right before the modal will be dismissed.
     *
     * If this function returns:
     * * `false`
     * * a promise resolved with `false`
     * * a promise that is rejected
     *
     * then the modal won't be dismissed.
     * @type {?|undefined}
     */
    NgbModalOptions.prototype.beforeDismiss;
    /**
     * If `true`, the modal will be centered vertically.
     *
     * Default value is `false`.
     *
     * \@since 1.1.0
     * @type {?|undefined}
     */
    NgbModalOptions.prototype.centered;
    /**
     * A selector specifying the element all new modal windows should be appended to.
     *
     * If not specified, will be `body`.
     * @type {?|undefined}
     */
    NgbModalOptions.prototype.container;
    /**
     * The `Injector` to use for modal content.
     * @type {?|undefined}
     */
    NgbModalOptions.prototype.injector;
    /**
     * If `true`, the modal will be closed when `Escape` key is pressed
     *
     * Default value is `true`.
     * @type {?|undefined}
     */
    NgbModalOptions.prototype.keyboard;
    /**
     * Size of a new modal window.
     * @type {?|undefined}
     */
    NgbModalOptions.prototype.size;
    /**
     * A custom class to append to the modal window.
     * @type {?|undefined}
     */
    NgbModalOptions.prototype.windowClass;
    /**
     * A custom class to append to the modal backdrop.
     *
     * \@since 1.1.0
     * @type {?|undefined}
     */
    NgbModalOptions.prototype.backdropClass;
}
/**
 * A configuration service for the [`NgbModal`](#/components/modal/api#NgbModal) service.
 *
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all modals used in the application.
 *
 * \@since 3.1.0
 */
export class NgbModalConfig {
    constructor() {
        this.backdrop = true;
        this.keyboard = true;
    }
}
NgbModalConfig.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] }
];
/** @nocollapse */ NgbModalConfig.ngInjectableDef = i0.defineInjectable({ factory: function NgbModalConfig_Factory() { return new NgbModalConfig(); }, token: NgbModalConfig, providedIn: "root" });
if (false) {
    /** @type {?} */
    NgbModalConfig.prototype.backdrop;
    /** @type {?} */
    NgbModalConfig.prototype.keyboard;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kYWwtY29uZmlnLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvIiwic291cmNlcyI6WyJtb2RhbC9tb2RhbC1jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBQyxVQUFVLEVBQVcsTUFBTSxlQUFlLENBQUM7Ozs7OztBQUtuRCxxQ0F5RUM7Ozs7Ozs7O0lBbkVDLHlDQUF3Qjs7Ozs7Ozs7O0lBU3hCLG1DQUE4Qjs7Ozs7Ozs7Ozs7O0lBWTlCLHdDQUFpRDs7Ozs7Ozs7O0lBU2pELG1DQUFtQjs7Ozs7OztJQU9uQixvQ0FBbUI7Ozs7O0lBS25CLG1DQUFvQjs7Ozs7OztJQU9wQixtQ0FBbUI7Ozs7O0lBS25CLCtCQUFtQjs7Ozs7SUFLbkIsc0NBQXFCOzs7Ozs7O0lBT3JCLHdDQUF1Qjs7Ozs7Ozs7OztBQVl6QixNQUFNLE9BQU8sY0FBYztJQUQzQjtRQUVFLGFBQVEsR0FBdUIsSUFBSSxDQUFDO1FBQ3BDLGFBQVEsR0FBRyxJQUFJLENBQUM7S0FDakI7OztZQUpBLFVBQVUsU0FBQyxFQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUM7Ozs7O0lBRTlCLGtDQUFvQzs7SUFDcEMsa0NBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJbmplY3RhYmxlLCBJbmplY3Rvcn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbi8qKlxuICogT3B0aW9ucyBhdmFpbGFibGUgd2hlbiBvcGVuaW5nIG5ldyBtb2RhbCB3aW5kb3dzIHdpdGggYE5nYk1vZGFsLm9wZW4oKWAgbWV0aG9kLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIE5nYk1vZGFsT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBgYXJpYS1sYWJlbGxlZGJ5YCBhdHRyaWJ1dGUgdmFsdWUgdG8gc2V0IG9uIHRoZSBtb2RhbCB3aW5kb3cuXG4gICAqXG4gICAqIEBzaW5jZSAyLjIuMFxuICAgKi9cbiAgYXJpYUxhYmVsbGVkQnk/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIElmIGB0cnVlYCwgdGhlIGJhY2tkcm9wIGVsZW1lbnQgd2lsbCBiZSBjcmVhdGVkIGZvciBhIGdpdmVuIG1vZGFsLlxuICAgKlxuICAgKiBBbHRlcm5hdGl2ZWx5LCBzcGVjaWZ5IGAnc3RhdGljJ2AgZm9yIGEgYmFja2Ryb3Agd2hpY2ggZG9lc24ndCBjbG9zZSB0aGUgbW9kYWwgb24gY2xpY2suXG4gICAqXG4gICAqIERlZmF1bHQgdmFsdWUgaXMgYHRydWVgLlxuICAgKi9cbiAgYmFja2Ryb3A/OiBib29sZWFuIHwgJ3N0YXRpYyc7XG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIHJpZ2h0IGJlZm9yZSB0aGUgbW9kYWwgd2lsbCBiZSBkaXNtaXNzZWQuXG4gICAqXG4gICAqIElmIHRoaXMgZnVuY3Rpb24gcmV0dXJuczpcbiAgICogKiBgZmFsc2VgXG4gICAqICogYSBwcm9taXNlIHJlc29sdmVkIHdpdGggYGZhbHNlYFxuICAgKiAqIGEgcHJvbWlzZSB0aGF0IGlzIHJlamVjdGVkXG4gICAqXG4gICAqIHRoZW4gdGhlIG1vZGFsIHdvbid0IGJlIGRpc21pc3NlZC5cbiAgICovXG4gIGJlZm9yZURpc21pc3M/OiAoKSA9PiBib29sZWFuIHwgUHJvbWlzZTxib29sZWFuPjtcblxuICAvKipcbiAgICogSWYgYHRydWVgLCB0aGUgbW9kYWwgd2lsbCBiZSBjZW50ZXJlZCB2ZXJ0aWNhbGx5LlxuICAgKlxuICAgKiBEZWZhdWx0IHZhbHVlIGlzIGBmYWxzZWAuXG4gICAqXG4gICAqIEBzaW5jZSAxLjEuMFxuICAgKi9cbiAgY2VudGVyZWQ/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBBIHNlbGVjdG9yIHNwZWNpZnlpbmcgdGhlIGVsZW1lbnQgYWxsIG5ldyBtb2RhbCB3aW5kb3dzIHNob3VsZCBiZSBhcHBlbmRlZCB0by5cbiAgICpcbiAgICogSWYgbm90IHNwZWNpZmllZCwgd2lsbCBiZSBgYm9keWAuXG4gICAqL1xuICBjb250YWluZXI/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBgSW5qZWN0b3JgIHRvIHVzZSBmb3IgbW9kYWwgY29udGVudC5cbiAgICovXG4gIGluamVjdG9yPzogSW5qZWN0b3I7XG5cbiAgLyoqXG4gICAqIElmIGB0cnVlYCwgdGhlIG1vZGFsIHdpbGwgYmUgY2xvc2VkIHdoZW4gYEVzY2FwZWAga2V5IGlzIHByZXNzZWRcbiAgICpcbiAgICogRGVmYXVsdCB2YWx1ZSBpcyBgdHJ1ZWAuXG4gICAqL1xuICBrZXlib2FyZD86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFNpemUgb2YgYSBuZXcgbW9kYWwgd2luZG93LlxuICAgKi9cbiAgc2l6ZT86ICdzbScgfCAnbGcnO1xuXG4gIC8qKlxuICAgKiBBIGN1c3RvbSBjbGFzcyB0byBhcHBlbmQgdG8gdGhlIG1vZGFsIHdpbmRvdy5cbiAgICovXG4gIHdpbmRvd0NsYXNzPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBIGN1c3RvbSBjbGFzcyB0byBhcHBlbmQgdG8gdGhlIG1vZGFsIGJhY2tkcm9wLlxuICAgKlxuICAgKiBAc2luY2UgMS4xLjBcbiAgICovXG4gIGJhY2tkcm9wQ2xhc3M/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogQSBjb25maWd1cmF0aW9uIHNlcnZpY2UgZm9yIHRoZSBbYE5nYk1vZGFsYF0oIy9jb21wb25lbnRzL21vZGFsL2FwaSNOZ2JNb2RhbCkgc2VydmljZS5cbiAqXG4gKiBZb3UgY2FuIGluamVjdCB0aGlzIHNlcnZpY2UsIHR5cGljYWxseSBpbiB5b3VyIHJvb3QgY29tcG9uZW50LCBhbmQgY3VzdG9taXplIHRoZSB2YWx1ZXMgb2YgaXRzIHByb3BlcnRpZXMgaW5cbiAqIG9yZGVyIHRvIHByb3ZpZGUgZGVmYXVsdCB2YWx1ZXMgZm9yIGFsbCBtb2RhbHMgdXNlZCBpbiB0aGUgYXBwbGljYXRpb24uXG4qXG4qIEBzaW5jZSAzLjEuMFxuKi9cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiAncm9vdCd9KVxuZXhwb3J0IGNsYXNzIE5nYk1vZGFsQ29uZmlnIGltcGxlbWVudHMgTmdiTW9kYWxPcHRpb25zIHtcbiAgYmFja2Ryb3A6IGJvb2xlYW4gfCAnc3RhdGljJyA9IHRydWU7XG4gIGtleWJvYXJkID0gdHJ1ZTtcbn1cbiJdfQ==