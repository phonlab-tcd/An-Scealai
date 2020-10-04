/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, Directive, Input, Output, EventEmitter, ChangeDetectionStrategy, Inject, Injector, Renderer2, ElementRef, ViewContainerRef, ComponentFactoryResolver, NgZone, ViewEncapsulation, ChangeDetectorRef, ApplicationRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { listenToTriggers } from '../util/triggers';
import { ngbAutoClose } from '../util/autoclose';
import { positionElements } from '../util/positioning';
import { PopupService } from '../util/popup';
import { NgbTooltipConfig } from './tooltip-config';
/** @type {?} */
var nextId = 0;
var NgbTooltipWindow = /** @class */ (function () {
    function NgbTooltipWindow() {
    }
    NgbTooltipWindow.decorators = [
        { type: Component, args: [{
                    selector: 'ngb-tooltip-window',
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    host: { '[class]': '"tooltip show" + (tooltipClass ? " " + tooltipClass : "")', 'role': 'tooltip', '[id]': 'id' },
                    template: "<div class=\"arrow\"></div><div class=\"tooltip-inner\"><ng-content></ng-content></div>",
                    styles: ["ngb-tooltip-window.bs-tooltip-bottom .arrow,ngb-tooltip-window.bs-tooltip-top .arrow{left:calc(50% - .4rem)}ngb-tooltip-window.bs-tooltip-bottom-left .arrow,ngb-tooltip-window.bs-tooltip-top-left .arrow{left:1em}ngb-tooltip-window.bs-tooltip-bottom-right .arrow,ngb-tooltip-window.bs-tooltip-top-right .arrow{left:auto;right:.8rem}ngb-tooltip-window.bs-tooltip-left .arrow,ngb-tooltip-window.bs-tooltip-right .arrow{top:calc(50% - .4rem)}ngb-tooltip-window.bs-tooltip-left-top .arrow,ngb-tooltip-window.bs-tooltip-right-top .arrow{top:.4rem}ngb-tooltip-window.bs-tooltip-left-bottom .arrow,ngb-tooltip-window.bs-tooltip-right-bottom .arrow{top:auto;bottom:.4rem}"]
                }] }
    ];
    NgbTooltipWindow.propDecorators = {
        id: [{ type: Input }],
        tooltipClass: [{ type: Input }]
    };
    return NgbTooltipWindow;
}());
export { NgbTooltipWindow };
if (false) {
    /** @type {?} */
    NgbTooltipWindow.prototype.id;
    /** @type {?} */
    NgbTooltipWindow.prototype.tooltipClass;
}
/**
 * A lightweight and extensible directive for fancy tooltip creation.
 */
var NgbTooltip = /** @class */ (function () {
    function NgbTooltip(_elementRef, _renderer, injector, componentFactoryResolver, viewContainerRef, config, _ngZone, _document, _changeDetector, _applicationRef) {
        var _this = this;
        this._elementRef = _elementRef;
        this._renderer = _renderer;
        this._ngZone = _ngZone;
        this._document = _document;
        this._changeDetector = _changeDetector;
        this._applicationRef = _applicationRef;
        /**
         * An event emitted when the tooltip is shown. Contains no payload.
         */
        this.shown = new EventEmitter();
        /**
         * An event emitted when the popover is hidden. Contains no payload.
         */
        this.hidden = new EventEmitter();
        this._ngbTooltipWindowId = "ngb-tooltip-" + nextId++;
        this.autoClose = config.autoClose;
        this.placement = config.placement;
        this.triggers = config.triggers;
        this.container = config.container;
        this.disableTooltip = config.disableTooltip;
        this.tooltipClass = config.tooltipClass;
        this.openDelay = config.openDelay;
        this.closeDelay = config.closeDelay;
        this._popupService = new PopupService(NgbTooltipWindow, injector, viewContainerRef, _renderer, componentFactoryResolver, _applicationRef);
        this._zoneSubscription = _ngZone.onStable.subscribe(function () {
            if (_this._windowRef) {
                positionElements(_this._elementRef.nativeElement, _this._windowRef.location.nativeElement, _this.placement, _this.container === 'body', 'bs-tooltip');
            }
        });
    }
    Object.defineProperty(NgbTooltip.prototype, "ngbTooltip", {
        get: /**
         * @return {?}
         */
        function () { return this._ngbTooltip; },
        /**
         * The string content or a `TemplateRef` for the content to be displayed in the tooltip.
         *
         * If the content if falsy, the tooltip won't open.
         */
        set: /**
         * The string content or a `TemplateRef` for the content to be displayed in the tooltip.
         *
         * If the content if falsy, the tooltip won't open.
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._ngbTooltip = value;
            if (!value && this._windowRef) {
                this.close();
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Opens the tooltip.
     *
     * This is considered to be a "manual" triggering.
     * The `context` is an optional value to be injected into the tooltip template when it is created.
     */
    /**
     * Opens the tooltip.
     *
     * This is considered to be a "manual" triggering.
     * The `context` is an optional value to be injected into the tooltip template when it is created.
     * @param {?=} context
     * @return {?}
     */
    NgbTooltip.prototype.open = /**
     * Opens the tooltip.
     *
     * This is considered to be a "manual" triggering.
     * The `context` is an optional value to be injected into the tooltip template when it is created.
     * @param {?=} context
     * @return {?}
     */
    function (context) {
        var _this = this;
        if (!this._windowRef && this._ngbTooltip && !this.disableTooltip) {
            this._windowRef = this._popupService.open(this._ngbTooltip, context);
            this._windowRef.instance.tooltipClass = this.tooltipClass;
            this._windowRef.instance.id = this._ngbTooltipWindowId;
            this._renderer.setAttribute(this._elementRef.nativeElement, 'aria-describedby', this._ngbTooltipWindowId);
            if (this.container === 'body') {
                this._document.querySelector(this.container).appendChild(this._windowRef.location.nativeElement);
            }
            // We need to detect changes, because we don't know where .open() might be called from.
            // Ex. opening tooltip from one of lifecycle hooks that run after the CD
            // (say from ngAfterViewInit) will result in 'ExpressionHasChanged' exception
            this._windowRef.changeDetectorRef.detectChanges();
            // We need to mark for check, because tooltip won't work inside the OnPush component.
            // Ex. when we use expression like `{{ tooltip.isOpen() : 'opened' : 'closed' }}`
            // inside the template of an OnPush component and we change the tooltip from
            // open -> closed, the expression in question won't be updated unless we explicitly
            // mark the parent component to be checked.
            this._windowRef.changeDetectorRef.markForCheck();
            ngbAutoClose(this._ngZone, this._document, this.autoClose, function () { return _this.close(); }, this.hidden, [this._windowRef.location.nativeElement]);
            this.shown.emit();
        }
    };
    /**
     * Closes the tooltip.
     *
     * This is considered to be a "manual" triggering of the tooltip.
     */
    /**
     * Closes the tooltip.
     *
     * This is considered to be a "manual" triggering of the tooltip.
     * @return {?}
     */
    NgbTooltip.prototype.close = /**
     * Closes the tooltip.
     *
     * This is considered to be a "manual" triggering of the tooltip.
     * @return {?}
     */
    function () {
        if (this._windowRef != null) {
            this._renderer.removeAttribute(this._elementRef.nativeElement, 'aria-describedby');
            this._popupService.close();
            this._windowRef = null;
            this.hidden.emit();
            this._changeDetector.markForCheck();
        }
    };
    /**
     * Toggles the tooltip.
     *
     * This is considered to be a "manual" triggering of the tooltip.
     */
    /**
     * Toggles the tooltip.
     *
     * This is considered to be a "manual" triggering of the tooltip.
     * @return {?}
     */
    NgbTooltip.prototype.toggle = /**
     * Toggles the tooltip.
     *
     * This is considered to be a "manual" triggering of the tooltip.
     * @return {?}
     */
    function () {
        if (this._windowRef) {
            this.close();
        }
        else {
            this.open();
        }
    };
    /**
     * Returns `true`, if the popover is currently shown.
     */
    /**
     * Returns `true`, if the popover is currently shown.
     * @return {?}
     */
    NgbTooltip.prototype.isOpen = /**
     * Returns `true`, if the popover is currently shown.
     * @return {?}
     */
    function () { return this._windowRef != null; };
    /**
     * @return {?}
     */
    NgbTooltip.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this._unregisterListenersFn = listenToTriggers(this._renderer, this._elementRef.nativeElement, this.triggers, this.isOpen.bind(this), this.open.bind(this), this.close.bind(this), +this.openDelay, +this.closeDelay);
    };
    /**
     * @return {?}
     */
    NgbTooltip.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this.close();
        // This check is needed as it might happen that ngOnDestroy is called before ngOnInit
        // under certain conditions, see: https://github.com/ng-bootstrap/ng-bootstrap/issues/2199
        if (this._unregisterListenersFn) {
            this._unregisterListenersFn();
        }
        this._zoneSubscription.unsubscribe();
    };
    NgbTooltip.decorators = [
        { type: Directive, args: [{ selector: '[ngbTooltip]', exportAs: 'ngbTooltip' },] }
    ];
    /** @nocollapse */
    NgbTooltip.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 },
        { type: Injector },
        { type: ComponentFactoryResolver },
        { type: ViewContainerRef },
        { type: NgbTooltipConfig },
        { type: NgZone },
        { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] },
        { type: ChangeDetectorRef },
        { type: ApplicationRef }
    ]; };
    NgbTooltip.propDecorators = {
        autoClose: [{ type: Input }],
        placement: [{ type: Input }],
        triggers: [{ type: Input }],
        container: [{ type: Input }],
        disableTooltip: [{ type: Input }],
        tooltipClass: [{ type: Input }],
        openDelay: [{ type: Input }],
        closeDelay: [{ type: Input }],
        shown: [{ type: Output }],
        hidden: [{ type: Output }],
        ngbTooltip: [{ type: Input }]
    };
    return NgbTooltip;
}());
export { NgbTooltip };
if (false) {
    /**
     * Indicates whether the tooltip should be closed on `Escape` key and inside/outside clicks:
     *
     * * `true` - closes on both outside and inside clicks as well as `Escape` presses
     * * `false` - disables the autoClose feature (NB: triggers still apply)
     * * `"inside"` - closes on inside clicks as well as Escape presses
     * * `"outside"` - closes on outside clicks (sometimes also achievable through triggers)
     * as well as `Escape` presses
     *
     * \@since 3.0.0
     * @type {?}
     */
    NgbTooltip.prototype.autoClose;
    /**
     * The preferred placement of the tooltip.
     *
     * Possible values are `"top"`, `"top-left"`, `"top-right"`, `"bottom"`, `"bottom-left"`,
     * `"bottom-right"`, `"left"`, `"left-top"`, `"left-bottom"`, `"right"`, `"right-top"`,
     * `"right-bottom"`
     *
     * Accepts an array of strings or a string with space separated possible values.
     *
     * The default order of preference is `"auto"` (same as the sequence above).
     *
     * Please see the [positioning overview](#/positioning) for more details.
     * @type {?}
     */
    NgbTooltip.prototype.placement;
    /**
     * Specifies events that should trigger the tooltip.
     *
     * Supports a space separated list of event names.
     * For more details see the [triggers demo](#/components/tooltip/examples#triggers).
     * @type {?}
     */
    NgbTooltip.prototype.triggers;
    /**
     * A selector specifying the element the tooltip should be appended to.
     *
     * Currently only supports `"body"`.
     * @type {?}
     */
    NgbTooltip.prototype.container;
    /**
     * If `true`, tooltip is disabled and won't be displayed.
     *
     * \@since 1.1.0
     * @type {?}
     */
    NgbTooltip.prototype.disableTooltip;
    /**
     * An optional class applied to the tooltip window element.
     *
     * \@since 3.2.0
     * @type {?}
     */
    NgbTooltip.prototype.tooltipClass;
    /**
     * The opening delay in ms. Works only for "non-manual" opening triggers defined by the `triggers` input.
     *
     * \@since 4.1.0
     * @type {?}
     */
    NgbTooltip.prototype.openDelay;
    /**
     * The closing delay in ms. Works only for "non-manual" opening triggers defined by the `triggers` input.
     *
     * \@since 4.1.0
     * @type {?}
     */
    NgbTooltip.prototype.closeDelay;
    /**
     * An event emitted when the tooltip is shown. Contains no payload.
     * @type {?}
     */
    NgbTooltip.prototype.shown;
    /**
     * An event emitted when the popover is hidden. Contains no payload.
     * @type {?}
     */
    NgbTooltip.prototype.hidden;
    /** @type {?} */
    NgbTooltip.prototype._ngbTooltip;
    /** @type {?} */
    NgbTooltip.prototype._ngbTooltipWindowId;
    /** @type {?} */
    NgbTooltip.prototype._popupService;
    /** @type {?} */
    NgbTooltip.prototype._windowRef;
    /** @type {?} */
    NgbTooltip.prototype._unregisterListenersFn;
    /** @type {?} */
    NgbTooltip.prototype._zoneSubscription;
    /** @type {?} */
    NgbTooltip.prototype._elementRef;
    /** @type {?} */
    NgbTooltip.prototype._renderer;
    /** @type {?} */
    NgbTooltip.prototype._ngZone;
    /** @type {?} */
    NgbTooltip.prototype._document;
    /** @type {?} */
    NgbTooltip.prototype._changeDetector;
    /** @type {?} */
    NgbTooltip.prototype._applicationRef;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHRpcC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwLyIsInNvdXJjZXMiOlsidG9vbHRpcC90b29sdGlwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULFNBQVMsRUFDVCxLQUFLLEVBQ0wsTUFBTSxFQUNOLFlBQVksRUFDWix1QkFBdUIsRUFHdkIsTUFBTSxFQUNOLFFBQVEsRUFDUixTQUFTLEVBRVQsVUFBVSxFQUVWLGdCQUFnQixFQUNoQix3QkFBd0IsRUFDeEIsTUFBTSxFQUNOLGlCQUFpQixFQUNqQixpQkFBaUIsRUFDakIsY0FBYyxFQUNmLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUV6QyxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQztBQUNsRCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDL0MsT0FBTyxFQUFDLGdCQUFnQixFQUFpQixNQUFNLHFCQUFxQixDQUFDO0FBQ3JFLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sa0JBQWtCLENBQUM7O0lBRTlDLE1BQU0sR0FBRyxDQUFDO0FBRWQ7SUFBQTtJQVdBLENBQUM7O2dCQVhBLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsb0JBQW9CO29CQUM5QixlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtvQkFDL0MsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7b0JBQ3JDLElBQUksRUFBRSxFQUFDLFNBQVMsRUFBRSwyREFBMkQsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUM7b0JBQy9HLFFBQVEsRUFBRSx5RkFBcUY7O2lCQUVoRzs7O3FCQUVFLEtBQUs7K0JBQ0wsS0FBSzs7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LFxuICBJbnB1dCxcbiAgT3V0cHV0LFxuICBFdmVudEVtaXR0ZXIsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBPbkluaXQsXG4gIE9uRGVzdHJveSxcbiAgSW5qZWN0LFxuICBJbmplY3RvcixcbiAgUmVuZGVyZXIyLFxuICBDb21wb25lbnRSZWYsXG4gIEVsZW1lbnRSZWYsXG4gIFRlbXBsYXRlUmVmLFxuICBWaWV3Q29udGFpbmVyUmVmLFxuICBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gIE5nWm9uZSxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBBcHBsaWNhdGlvblJlZlxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbmltcG9ydCB7bGlzdGVuVG9UcmlnZ2Vyc30gZnJvbSAnLi4vdXRpbC90cmlnZ2Vycyc7XG5pbXBvcnQge25nYkF1dG9DbG9zZX0gZnJvbSAnLi4vdXRpbC9hdXRvY2xvc2UnO1xuaW1wb3J0IHtwb3NpdGlvbkVsZW1lbnRzLCBQbGFjZW1lbnRBcnJheX0gZnJvbSAnLi4vdXRpbC9wb3NpdGlvbmluZyc7XG5pbXBvcnQge1BvcHVwU2VydmljZX0gZnJvbSAnLi4vdXRpbC9wb3B1cCc7XG5cbmltcG9ydCB7TmdiVG9vbHRpcENvbmZpZ30gZnJvbSAnLi90b29sdGlwLWNvbmZpZyc7XG5cbmxldCBuZXh0SWQgPSAwO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZ2ItdG9vbHRpcC13aW5kb3cnLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgaG9zdDogeydbY2xhc3NdJzogJ1widG9vbHRpcCBzaG93XCIgKyAodG9vbHRpcENsYXNzID8gXCIgXCIgKyB0b29sdGlwQ2xhc3MgOiBcIlwiKScsICdyb2xlJzogJ3Rvb2x0aXAnLCAnW2lkXSc6ICdpZCd9LFxuICB0ZW1wbGF0ZTogYDxkaXYgY2xhc3M9XCJhcnJvd1wiPjwvZGl2PjxkaXYgY2xhc3M9XCJ0b29sdGlwLWlubmVyXCI+PG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PjwvZGl2PmAsXG4gIHN0eWxlVXJsczogWycuL3Rvb2x0aXAuc2NzcyddXG59KVxuZXhwb3J0IGNsYXNzIE5nYlRvb2x0aXBXaW5kb3cge1xuICBASW5wdXQoKSBpZDogc3RyaW5nO1xuICBASW5wdXQoKSB0b29sdGlwQ2xhc3M6IHN0cmluZztcbn1cblxuLyoqXG4gKiBBIGxpZ2h0d2VpZ2h0IGFuZCBleHRlbnNpYmxlIGRpcmVjdGl2ZSBmb3IgZmFuY3kgdG9vbHRpcCBjcmVhdGlvbi5cbiAqL1xuQERpcmVjdGl2ZSh7c2VsZWN0b3I6ICdbbmdiVG9vbHRpcF0nLCBleHBvcnRBczogJ25nYlRvb2x0aXAnfSlcbmV4cG9ydCBjbGFzcyBOZ2JUb29sdGlwIGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuICAvKipcbiAgICogSW5kaWNhdGVzIHdoZXRoZXIgdGhlIHRvb2x0aXAgc2hvdWxkIGJlIGNsb3NlZCBvbiBgRXNjYXBlYCBrZXkgYW5kIGluc2lkZS9vdXRzaWRlIGNsaWNrczpcbiAgICpcbiAgICogKiBgdHJ1ZWAgLSBjbG9zZXMgb24gYm90aCBvdXRzaWRlIGFuZCBpbnNpZGUgY2xpY2tzIGFzIHdlbGwgYXMgYEVzY2FwZWAgcHJlc3Nlc1xuICAgKiAqIGBmYWxzZWAgLSBkaXNhYmxlcyB0aGUgYXV0b0Nsb3NlIGZlYXR1cmUgKE5COiB0cmlnZ2VycyBzdGlsbCBhcHBseSlcbiAgICogKiBgXCJpbnNpZGVcImAgLSBjbG9zZXMgb24gaW5zaWRlIGNsaWNrcyBhcyB3ZWxsIGFzIEVzY2FwZSBwcmVzc2VzXG4gICAqICogYFwib3V0c2lkZVwiYCAtIGNsb3NlcyBvbiBvdXRzaWRlIGNsaWNrcyAoc29tZXRpbWVzIGFsc28gYWNoaWV2YWJsZSB0aHJvdWdoIHRyaWdnZXJzKVxuICAgKiBhcyB3ZWxsIGFzIGBFc2NhcGVgIHByZXNzZXNcbiAgICpcbiAgICogQHNpbmNlIDMuMC4wXG4gICAqL1xuICBASW5wdXQoKSBhdXRvQ2xvc2U6IGJvb2xlYW4gfCAnaW5zaWRlJyB8ICdvdXRzaWRlJztcblxuICAvKipcbiAgICogVGhlIHByZWZlcnJlZCBwbGFjZW1lbnQgb2YgdGhlIHRvb2x0aXAuXG4gICAqXG4gICAqIFBvc3NpYmxlIHZhbHVlcyBhcmUgYFwidG9wXCJgLCBgXCJ0b3AtbGVmdFwiYCwgYFwidG9wLXJpZ2h0XCJgLCBgXCJib3R0b21cImAsIGBcImJvdHRvbS1sZWZ0XCJgLFxuICAgKiBgXCJib3R0b20tcmlnaHRcImAsIGBcImxlZnRcImAsIGBcImxlZnQtdG9wXCJgLCBgXCJsZWZ0LWJvdHRvbVwiYCwgYFwicmlnaHRcImAsIGBcInJpZ2h0LXRvcFwiYCxcbiAgICogYFwicmlnaHQtYm90dG9tXCJgXG4gICAqXG4gICAqIEFjY2VwdHMgYW4gYXJyYXkgb2Ygc3RyaW5ncyBvciBhIHN0cmluZyB3aXRoIHNwYWNlIHNlcGFyYXRlZCBwb3NzaWJsZSB2YWx1ZXMuXG4gICAqXG4gICAqIFRoZSBkZWZhdWx0IG9yZGVyIG9mIHByZWZlcmVuY2UgaXMgYFwiYXV0b1wiYCAoc2FtZSBhcyB0aGUgc2VxdWVuY2UgYWJvdmUpLlxuICAgKlxuICAgKiBQbGVhc2Ugc2VlIHRoZSBbcG9zaXRpb25pbmcgb3ZlcnZpZXddKCMvcG9zaXRpb25pbmcpIGZvciBtb3JlIGRldGFpbHMuXG4gICAqL1xuICBASW5wdXQoKSBwbGFjZW1lbnQ6IFBsYWNlbWVudEFycmF5O1xuXG4gIC8qKlxuICAgKiBTcGVjaWZpZXMgZXZlbnRzIHRoYXQgc2hvdWxkIHRyaWdnZXIgdGhlIHRvb2x0aXAuXG4gICAqXG4gICAqIFN1cHBvcnRzIGEgc3BhY2Ugc2VwYXJhdGVkIGxpc3Qgb2YgZXZlbnQgbmFtZXMuXG4gICAqIEZvciBtb3JlIGRldGFpbHMgc2VlIHRoZSBbdHJpZ2dlcnMgZGVtb10oIy9jb21wb25lbnRzL3Rvb2x0aXAvZXhhbXBsZXMjdHJpZ2dlcnMpLlxuICAgKi9cbiAgQElucHV0KCkgdHJpZ2dlcnM6IHN0cmluZztcblxuICAvKipcbiAgICogQSBzZWxlY3RvciBzcGVjaWZ5aW5nIHRoZSBlbGVtZW50IHRoZSB0b29sdGlwIHNob3VsZCBiZSBhcHBlbmRlZCB0by5cbiAgICpcbiAgICogQ3VycmVudGx5IG9ubHkgc3VwcG9ydHMgYFwiYm9keVwiYC5cbiAgICovXG4gIEBJbnB1dCgpIGNvbnRhaW5lcjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBJZiBgdHJ1ZWAsIHRvb2x0aXAgaXMgZGlzYWJsZWQgYW5kIHdvbid0IGJlIGRpc3BsYXllZC5cbiAgICpcbiAgICogQHNpbmNlIDEuMS4wXG4gICAqL1xuICBASW5wdXQoKSBkaXNhYmxlVG9vbHRpcDogYm9vbGVhbjtcblxuICAvKipcbiAgICogQW4gb3B0aW9uYWwgY2xhc3MgYXBwbGllZCB0byB0aGUgdG9vbHRpcCB3aW5kb3cgZWxlbWVudC5cbiAgICpcbiAgICogQHNpbmNlIDMuMi4wXG4gICAqL1xuICBASW5wdXQoKSB0b29sdGlwQ2xhc3M6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIG9wZW5pbmcgZGVsYXkgaW4gbXMuIFdvcmtzIG9ubHkgZm9yIFwibm9uLW1hbnVhbFwiIG9wZW5pbmcgdHJpZ2dlcnMgZGVmaW5lZCBieSB0aGUgYHRyaWdnZXJzYCBpbnB1dC5cbiAgICpcbiAgICogQHNpbmNlIDQuMS4wXG4gICAqL1xuICBASW5wdXQoKSBvcGVuRGVsYXk6IG51bWJlcjtcblxuICAvKipcbiAgICogVGhlIGNsb3NpbmcgZGVsYXkgaW4gbXMuIFdvcmtzIG9ubHkgZm9yIFwibm9uLW1hbnVhbFwiIG9wZW5pbmcgdHJpZ2dlcnMgZGVmaW5lZCBieSB0aGUgYHRyaWdnZXJzYCBpbnB1dC5cbiAgICpcbiAgICogQHNpbmNlIDQuMS4wXG4gICAqL1xuICBASW5wdXQoKSBjbG9zZURlbGF5OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIEFuIGV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgdG9vbHRpcCBpcyBzaG93bi4gQ29udGFpbnMgbm8gcGF5bG9hZC5cbiAgICovXG4gIEBPdXRwdXQoKSBzaG93biA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgLyoqXG4gICAqIEFuIGV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgcG9wb3ZlciBpcyBoaWRkZW4uIENvbnRhaW5zIG5vIHBheWxvYWQuXG4gICAqL1xuICBAT3V0cHV0KCkgaGlkZGVuID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIHByaXZhdGUgX25nYlRvb2x0aXA6IHN0cmluZyB8IFRlbXBsYXRlUmVmPGFueT47XG4gIHByaXZhdGUgX25nYlRvb2x0aXBXaW5kb3dJZCA9IGBuZ2ItdG9vbHRpcC0ke25leHRJZCsrfWA7XG4gIHByaXZhdGUgX3BvcHVwU2VydmljZTogUG9wdXBTZXJ2aWNlPE5nYlRvb2x0aXBXaW5kb3c+O1xuICBwcml2YXRlIF93aW5kb3dSZWY6IENvbXBvbmVudFJlZjxOZ2JUb29sdGlwV2luZG93PjtcbiAgcHJpdmF0ZSBfdW5yZWdpc3Rlckxpc3RlbmVyc0ZuO1xuICBwcml2YXRlIF96b25lU3Vic2NyaXB0aW9uOiBhbnk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PiwgcHJpdmF0ZSBfcmVuZGVyZXI6IFJlbmRlcmVyMiwgaW5qZWN0b3I6IEluamVjdG9yLFxuICAgICAgY29tcG9uZW50RmFjdG9yeVJlc29sdmVyOiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsIHZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYsIGNvbmZpZzogTmdiVG9vbHRpcENvbmZpZyxcbiAgICAgIHByaXZhdGUgX25nWm9uZTogTmdab25lLCBASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIF9kb2N1bWVudDogYW55LCBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvcjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgICBwcml2YXRlIF9hcHBsaWNhdGlvblJlZjogQXBwbGljYXRpb25SZWYpIHtcbiAgICB0aGlzLmF1dG9DbG9zZSA9IGNvbmZpZy5hdXRvQ2xvc2U7XG4gICAgdGhpcy5wbGFjZW1lbnQgPSBjb25maWcucGxhY2VtZW50O1xuICAgIHRoaXMudHJpZ2dlcnMgPSBjb25maWcudHJpZ2dlcnM7XG4gICAgdGhpcy5jb250YWluZXIgPSBjb25maWcuY29udGFpbmVyO1xuICAgIHRoaXMuZGlzYWJsZVRvb2x0aXAgPSBjb25maWcuZGlzYWJsZVRvb2x0aXA7XG4gICAgdGhpcy50b29sdGlwQ2xhc3MgPSBjb25maWcudG9vbHRpcENsYXNzO1xuICAgIHRoaXMub3BlbkRlbGF5ID0gY29uZmlnLm9wZW5EZWxheTtcbiAgICB0aGlzLmNsb3NlRGVsYXkgPSBjb25maWcuY2xvc2VEZWxheTtcbiAgICB0aGlzLl9wb3B1cFNlcnZpY2UgPSBuZXcgUG9wdXBTZXJ2aWNlPE5nYlRvb2x0aXBXaW5kb3c+KFxuICAgICAgICBOZ2JUb29sdGlwV2luZG93LCBpbmplY3Rvciwgdmlld0NvbnRhaW5lclJlZiwgX3JlbmRlcmVyLCBjb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsIF9hcHBsaWNhdGlvblJlZik7XG5cbiAgICB0aGlzLl96b25lU3Vic2NyaXB0aW9uID0gX25nWm9uZS5vblN0YWJsZS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuX3dpbmRvd1JlZikge1xuICAgICAgICBwb3NpdGlvbkVsZW1lbnRzKFxuICAgICAgICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCB0aGlzLl93aW5kb3dSZWYubG9jYXRpb24ubmF0aXZlRWxlbWVudCwgdGhpcy5wbGFjZW1lbnQsXG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lciA9PT0gJ2JvZHknLCAnYnMtdG9vbHRpcCcpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBzdHJpbmcgY29udGVudCBvciBhIGBUZW1wbGF0ZVJlZmAgZm9yIHRoZSBjb250ZW50IHRvIGJlIGRpc3BsYXllZCBpbiB0aGUgdG9vbHRpcC5cbiAgICpcbiAgICogSWYgdGhlIGNvbnRlbnQgaWYgZmFsc3ksIHRoZSB0b29sdGlwIHdvbid0IG9wZW4uXG4gICAqL1xuICBASW5wdXQoKVxuICBzZXQgbmdiVG9vbHRpcCh2YWx1ZTogc3RyaW5nIHwgVGVtcGxhdGVSZWY8YW55Pikge1xuICAgIHRoaXMuX25nYlRvb2x0aXAgPSB2YWx1ZTtcbiAgICBpZiAoIXZhbHVlICYmIHRoaXMuX3dpbmRvd1JlZikge1xuICAgICAgdGhpcy5jbG9zZSgpO1xuICAgIH1cbiAgfVxuXG4gIGdldCBuZ2JUb29sdGlwKCkgeyByZXR1cm4gdGhpcy5fbmdiVG9vbHRpcDsgfVxuXG4gIC8qKlxuICAgKiBPcGVucyB0aGUgdG9vbHRpcC5cbiAgICpcbiAgICogVGhpcyBpcyBjb25zaWRlcmVkIHRvIGJlIGEgXCJtYW51YWxcIiB0cmlnZ2VyaW5nLlxuICAgKiBUaGUgYGNvbnRleHRgIGlzIGFuIG9wdGlvbmFsIHZhbHVlIHRvIGJlIGluamVjdGVkIGludG8gdGhlIHRvb2x0aXAgdGVtcGxhdGUgd2hlbiBpdCBpcyBjcmVhdGVkLlxuICAgKi9cbiAgb3Blbihjb250ZXh0PzogYW55KSB7XG4gICAgaWYgKCF0aGlzLl93aW5kb3dSZWYgJiYgdGhpcy5fbmdiVG9vbHRpcCAmJiAhdGhpcy5kaXNhYmxlVG9vbHRpcCkge1xuICAgICAgdGhpcy5fd2luZG93UmVmID0gdGhpcy5fcG9wdXBTZXJ2aWNlLm9wZW4odGhpcy5fbmdiVG9vbHRpcCwgY29udGV4dCk7XG4gICAgICB0aGlzLl93aW5kb3dSZWYuaW5zdGFuY2UudG9vbHRpcENsYXNzID0gdGhpcy50b29sdGlwQ2xhc3M7XG4gICAgICB0aGlzLl93aW5kb3dSZWYuaW5zdGFuY2UuaWQgPSB0aGlzLl9uZ2JUb29sdGlwV2luZG93SWQ7XG5cbiAgICAgIHRoaXMuX3JlbmRlcmVyLnNldEF0dHJpYnV0ZSh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsICdhcmlhLWRlc2NyaWJlZGJ5JywgdGhpcy5fbmdiVG9vbHRpcFdpbmRvd0lkKTtcblxuICAgICAgaWYgKHRoaXMuY29udGFpbmVyID09PSAnYm9keScpIHtcbiAgICAgICAgdGhpcy5fZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLmNvbnRhaW5lcikuYXBwZW5kQ2hpbGQodGhpcy5fd2luZG93UmVmLmxvY2F0aW9uLm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgfVxuXG4gICAgICAvLyBXZSBuZWVkIHRvIGRldGVjdCBjaGFuZ2VzLCBiZWNhdXNlIHdlIGRvbid0IGtub3cgd2hlcmUgLm9wZW4oKSBtaWdodCBiZSBjYWxsZWQgZnJvbS5cbiAgICAgIC8vIEV4LiBvcGVuaW5nIHRvb2x0aXAgZnJvbSBvbmUgb2YgbGlmZWN5Y2xlIGhvb2tzIHRoYXQgcnVuIGFmdGVyIHRoZSBDRFxuICAgICAgLy8gKHNheSBmcm9tIG5nQWZ0ZXJWaWV3SW5pdCkgd2lsbCByZXN1bHQgaW4gJ0V4cHJlc3Npb25IYXNDaGFuZ2VkJyBleGNlcHRpb25cbiAgICAgIHRoaXMuX3dpbmRvd1JlZi5jaGFuZ2VEZXRlY3RvclJlZi5kZXRlY3RDaGFuZ2VzKCk7XG5cbiAgICAgIC8vIFdlIG5lZWQgdG8gbWFyayBmb3IgY2hlY2ssIGJlY2F1c2UgdG9vbHRpcCB3b24ndCB3b3JrIGluc2lkZSB0aGUgT25QdXNoIGNvbXBvbmVudC5cbiAgICAgIC8vIEV4LiB3aGVuIHdlIHVzZSBleHByZXNzaW9uIGxpa2UgYHt7IHRvb2x0aXAuaXNPcGVuKCkgOiAnb3BlbmVkJyA6ICdjbG9zZWQnIH19YFxuICAgICAgLy8gaW5zaWRlIHRoZSB0ZW1wbGF0ZSBvZiBhbiBPblB1c2ggY29tcG9uZW50IGFuZCB3ZSBjaGFuZ2UgdGhlIHRvb2x0aXAgZnJvbVxuICAgICAgLy8gb3BlbiAtPiBjbG9zZWQsIHRoZSBleHByZXNzaW9uIGluIHF1ZXN0aW9uIHdvbid0IGJlIHVwZGF0ZWQgdW5sZXNzIHdlIGV4cGxpY2l0bHlcbiAgICAgIC8vIG1hcmsgdGhlIHBhcmVudCBjb21wb25lbnQgdG8gYmUgY2hlY2tlZC5cbiAgICAgIHRoaXMuX3dpbmRvd1JlZi5jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcblxuICAgICAgbmdiQXV0b0Nsb3NlKFxuICAgICAgICAgIHRoaXMuX25nWm9uZSwgdGhpcy5fZG9jdW1lbnQsIHRoaXMuYXV0b0Nsb3NlLCAoKSA9PiB0aGlzLmNsb3NlKCksIHRoaXMuaGlkZGVuLFxuICAgICAgICAgIFt0aGlzLl93aW5kb3dSZWYubG9jYXRpb24ubmF0aXZlRWxlbWVudF0pO1xuXG4gICAgICB0aGlzLnNob3duLmVtaXQoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2xvc2VzIHRoZSB0b29sdGlwLlxuICAgKlxuICAgKiBUaGlzIGlzIGNvbnNpZGVyZWQgdG8gYmUgYSBcIm1hbnVhbFwiIHRyaWdnZXJpbmcgb2YgdGhlIHRvb2x0aXAuXG4gICAqL1xuICBjbG9zZSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fd2luZG93UmVmICE9IG51bGwpIHtcbiAgICAgIHRoaXMuX3JlbmRlcmVyLnJlbW92ZUF0dHJpYnV0ZSh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsICdhcmlhLWRlc2NyaWJlZGJ5Jyk7XG4gICAgICB0aGlzLl9wb3B1cFNlcnZpY2UuY2xvc2UoKTtcbiAgICAgIHRoaXMuX3dpbmRvd1JlZiA9IG51bGw7XG4gICAgICB0aGlzLmhpZGRlbi5lbWl0KCk7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3Rvci5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVG9nZ2xlcyB0aGUgdG9vbHRpcC5cbiAgICpcbiAgICogVGhpcyBpcyBjb25zaWRlcmVkIHRvIGJlIGEgXCJtYW51YWxcIiB0cmlnZ2VyaW5nIG9mIHRoZSB0b29sdGlwLlxuICAgKi9cbiAgdG9nZ2xlKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl93aW5kb3dSZWYpIHtcbiAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5vcGVuKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYHRydWVgLCBpZiB0aGUgcG9wb3ZlciBpcyBjdXJyZW50bHkgc2hvd24uXG4gICAqL1xuICBpc09wZW4oKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl93aW5kb3dSZWYgIT0gbnVsbDsgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuX3VucmVnaXN0ZXJMaXN0ZW5lcnNGbiA9IGxpc3RlblRvVHJpZ2dlcnMoXG4gICAgICAgIHRoaXMuX3JlbmRlcmVyLCB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsIHRoaXMudHJpZ2dlcnMsIHRoaXMuaXNPcGVuLmJpbmQodGhpcyksIHRoaXMub3Blbi5iaW5kKHRoaXMpLFxuICAgICAgICB0aGlzLmNsb3NlLmJpbmQodGhpcyksICt0aGlzLm9wZW5EZWxheSwgK3RoaXMuY2xvc2VEZWxheSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLmNsb3NlKCk7XG4gICAgLy8gVGhpcyBjaGVjayBpcyBuZWVkZWQgYXMgaXQgbWlnaHQgaGFwcGVuIHRoYXQgbmdPbkRlc3Ryb3kgaXMgY2FsbGVkIGJlZm9yZSBuZ09uSW5pdFxuICAgIC8vIHVuZGVyIGNlcnRhaW4gY29uZGl0aW9ucywgc2VlOiBodHRwczovL2dpdGh1Yi5jb20vbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC9pc3N1ZXMvMjE5OVxuICAgIGlmICh0aGlzLl91bnJlZ2lzdGVyTGlzdGVuZXJzRm4pIHtcbiAgICAgIHRoaXMuX3VucmVnaXN0ZXJMaXN0ZW5lcnNGbigpO1xuICAgIH1cbiAgICB0aGlzLl96b25lU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gIH1cbn1cbiJdfQ==