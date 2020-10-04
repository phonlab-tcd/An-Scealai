/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, Directive, EventEmitter, Inject, Input, NgZone, Output, PLATFORM_ID, QueryList, TemplateRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NgbCarouselConfig } from './carousel-config';
import { merge, Subject, timer } from 'rxjs';
import { filter, map, switchMap, takeUntil } from 'rxjs/operators';
/** @type {?} */
var nextId = 0;
/**
 * A directive that wraps the individual carousel slide.
 */
var NgbSlide = /** @class */ (function () {
    function NgbSlide(tplRef) {
        this.tplRef = tplRef;
        /**
         * Slide id that must be unique for the entire document.
         *
         * If not provided, will be generated in the `ngb-slide-xx` format.
         */
        this.id = "ngb-slide-" + nextId++;
    }
    NgbSlide.decorators = [
        { type: Directive, args: [{ selector: 'ng-template[ngbSlide]' },] }
    ];
    /** @nocollapse */
    NgbSlide.ctorParameters = function () { return [
        { type: TemplateRef }
    ]; };
    NgbSlide.propDecorators = {
        id: [{ type: Input }]
    };
    return NgbSlide;
}());
export { NgbSlide };
if (false) {
    /**
     * Slide id that must be unique for the entire document.
     *
     * If not provided, will be generated in the `ngb-slide-xx` format.
     * @type {?}
     */
    NgbSlide.prototype.id;
    /** @type {?} */
    NgbSlide.prototype.tplRef;
}
/**
 * Carousel is a component to easily create and control slideshows.
 *
 * Allows to set intervals, change the way user interacts with the slides and provides a programmatic API.
 */
var NgbCarousel = /** @class */ (function () {
    function NgbCarousel(config, _platformId, _ngZone, _cd) {
        this._platformId = _platformId;
        this._ngZone = _ngZone;
        this._cd = _cd;
        this._destroy$ = new Subject();
        this._start$ = new Subject();
        this._stop$ = new Subject();
        /**
         * An event emitted right after the slide transition is completed.
         *
         * See [`NgbSlideEvent`](#/components/carousel/api#NgbSlideEvent) for payload details.
         */
        this.slide = new EventEmitter();
        this.interval = config.interval;
        this.wrap = config.wrap;
        this.keyboard = config.keyboard;
        this.pauseOnHover = config.pauseOnHover;
        this.showNavigationArrows = config.showNavigationArrows;
        this.showNavigationIndicators = config.showNavigationIndicators;
    }
    /**
     * @return {?}
     */
    NgbCarousel.prototype.ngAfterContentInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        // setInterval() doesn't play well with SSR and protractor,
        // so we should run it in the browser and outside Angular
        if (isPlatformBrowser(this._platformId)) {
            this._ngZone.runOutsideAngular(function () {
                _this._start$
                    .pipe(map(function () { return _this.interval; }), filter(function (interval) { return interval > 0 && _this.slides.length > 0; }), switchMap(function (interval) { return timer(interval).pipe(takeUntil(merge(_this._stop$, _this._destroy$))); }))
                    .subscribe(function () { return _this._ngZone.run(function () { return _this.next(); }); });
                _this._start$.next();
            });
        }
        this.slides.changes.pipe(takeUntil(this._destroy$)).subscribe(function () { return _this._cd.markForCheck(); });
    };
    /**
     * @return {?}
     */
    NgbCarousel.prototype.ngAfterContentChecked = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var activeSlide = this._getSlideById(this.activeId);
        this.activeId = activeSlide ? activeSlide.id : (this.slides.length ? this.slides.first.id : null);
    };
    /**
     * @return {?}
     */
    NgbCarousel.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () { this._destroy$.next(); };
    /**
     * @param {?} changes
     * @return {?}
     */
    NgbCarousel.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        if ('interval' in changes && !changes['interval'].isFirstChange()) {
            this._start$.next();
        }
    };
    /**
     * Navigates to a slide with the specified identifier.
     */
    /**
     * Navigates to a slide with the specified identifier.
     * @param {?} slideId
     * @return {?}
     */
    NgbCarousel.prototype.select = /**
     * Navigates to a slide with the specified identifier.
     * @param {?} slideId
     * @return {?}
     */
    function (slideId) { this._cycleToSelected(slideId, this._getSlideEventDirection(this.activeId, slideId)); };
    /**
     * Navigates to the previous slide.
     */
    /**
     * Navigates to the previous slide.
     * @return {?}
     */
    NgbCarousel.prototype.prev = /**
     * Navigates to the previous slide.
     * @return {?}
     */
    function () { this._cycleToSelected(this._getPrevSlide(this.activeId), NgbSlideEventDirection.RIGHT); };
    /**
     * Navigates to the next slide.
     */
    /**
     * Navigates to the next slide.
     * @return {?}
     */
    NgbCarousel.prototype.next = /**
     * Navigates to the next slide.
     * @return {?}
     */
    function () { this._cycleToSelected(this._getNextSlide(this.activeId), NgbSlideEventDirection.LEFT); };
    /**
     * Pauses cycling through the slides.
     */
    /**
     * Pauses cycling through the slides.
     * @return {?}
     */
    NgbCarousel.prototype.pause = /**
     * Pauses cycling through the slides.
     * @return {?}
     */
    function () { this._stop$.next(); };
    /**
     * Restarts cycling through the slides from left to right.
     */
    /**
     * Restarts cycling through the slides from left to right.
     * @return {?}
     */
    NgbCarousel.prototype.cycle = /**
     * Restarts cycling through the slides from left to right.
     * @return {?}
     */
    function () { this._start$.next(); };
    /**
     * @param {?} slideIdx
     * @param {?} direction
     * @return {?}
     */
    NgbCarousel.prototype._cycleToSelected = /**
     * @param {?} slideIdx
     * @param {?} direction
     * @return {?}
     */
    function (slideIdx, direction) {
        /** @type {?} */
        var selectedSlide = this._getSlideById(slideIdx);
        if (selectedSlide && selectedSlide.id !== this.activeId) {
            this.slide.emit({ prev: this.activeId, current: selectedSlide.id, direction: direction });
            this._start$.next();
            this.activeId = selectedSlide.id;
        }
        // we get here after the interval fires or any external API call like next(), prev() or select()
        this._cd.markForCheck();
    };
    /**
     * @param {?} currentActiveSlideId
     * @param {?} nextActiveSlideId
     * @return {?}
     */
    NgbCarousel.prototype._getSlideEventDirection = /**
     * @param {?} currentActiveSlideId
     * @param {?} nextActiveSlideId
     * @return {?}
     */
    function (currentActiveSlideId, nextActiveSlideId) {
        /** @type {?} */
        var currentActiveSlideIdx = this._getSlideIdxById(currentActiveSlideId);
        /** @type {?} */
        var nextActiveSlideIdx = this._getSlideIdxById(nextActiveSlideId);
        return currentActiveSlideIdx > nextActiveSlideIdx ? NgbSlideEventDirection.RIGHT : NgbSlideEventDirection.LEFT;
    };
    /**
     * @param {?} slideId
     * @return {?}
     */
    NgbCarousel.prototype._getSlideById = /**
     * @param {?} slideId
     * @return {?}
     */
    function (slideId) { return this.slides.find(function (slide) { return slide.id === slideId; }); };
    /**
     * @param {?} slideId
     * @return {?}
     */
    NgbCarousel.prototype._getSlideIdxById = /**
     * @param {?} slideId
     * @return {?}
     */
    function (slideId) {
        return this.slides.toArray().indexOf(this._getSlideById(slideId));
    };
    /**
     * @param {?} currentSlideId
     * @return {?}
     */
    NgbCarousel.prototype._getNextSlide = /**
     * @param {?} currentSlideId
     * @return {?}
     */
    function (currentSlideId) {
        /** @type {?} */
        var slideArr = this.slides.toArray();
        /** @type {?} */
        var currentSlideIdx = this._getSlideIdxById(currentSlideId);
        /** @type {?} */
        var isLastSlide = currentSlideIdx === slideArr.length - 1;
        return isLastSlide ? (this.wrap ? slideArr[0].id : slideArr[slideArr.length - 1].id) :
            slideArr[currentSlideIdx + 1].id;
    };
    /**
     * @param {?} currentSlideId
     * @return {?}
     */
    NgbCarousel.prototype._getPrevSlide = /**
     * @param {?} currentSlideId
     * @return {?}
     */
    function (currentSlideId) {
        /** @type {?} */
        var slideArr = this.slides.toArray();
        /** @type {?} */
        var currentSlideIdx = this._getSlideIdxById(currentSlideId);
        /** @type {?} */
        var isFirstSlide = currentSlideIdx === 0;
        return isFirstSlide ? (this.wrap ? slideArr[slideArr.length - 1].id : slideArr[0].id) :
            slideArr[currentSlideIdx - 1].id;
    };
    NgbCarousel.decorators = [
        { type: Component, args: [{
                    selector: 'ngb-carousel',
                    exportAs: 'ngbCarousel',
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    host: {
                        'class': 'carousel slide',
                        '[style.display]': '"block"',
                        'tabIndex': '0',
                        '(mouseenter)': 'pauseOnHover && pause()',
                        '(mouseleave)': 'pauseOnHover && cycle()',
                        '(keydown.arrowLeft)': 'keyboard && prev()',
                        '(keydown.arrowRight)': 'keyboard && next()'
                    },
                    template: "\n    <ol class=\"carousel-indicators\" *ngIf=\"showNavigationIndicators\">\n      <li *ngFor=\"let slide of slides\" [id]=\"slide.id\" [class.active]=\"slide.id === activeId\"\n          (click)=\"select(slide.id); pauseOnHover && pause()\"></li>\n    </ol>\n    <div class=\"carousel-inner\">\n      <div *ngFor=\"let slide of slides\" class=\"carousel-item\" [class.active]=\"slide.id === activeId\">\n        <ng-template [ngTemplateOutlet]=\"slide.tplRef\"></ng-template>\n      </div>\n    </div>\n    <a class=\"carousel-control-prev\" role=\"button\" (click)=\"prev()\" *ngIf=\"showNavigationArrows\">\n      <span class=\"carousel-control-prev-icon\" aria-hidden=\"true\"></span>\n      <span class=\"sr-only\" i18n=\"@@ngb.carousel.previous\">Previous</span>\n    </a>\n    <a class=\"carousel-control-next\" role=\"button\" (click)=\"next()\" *ngIf=\"showNavigationArrows\">\n      <span class=\"carousel-control-next-icon\" aria-hidden=\"true\"></span>\n      <span class=\"sr-only\" i18n=\"@@ngb.carousel.next\">Next</span>\n    </a>\n  "
                }] }
    ];
    /** @nocollapse */
    NgbCarousel.ctorParameters = function () { return [
        { type: NgbCarouselConfig },
        { type: undefined, decorators: [{ type: Inject, args: [PLATFORM_ID,] }] },
        { type: NgZone },
        { type: ChangeDetectorRef }
    ]; };
    NgbCarousel.propDecorators = {
        slides: [{ type: ContentChildren, args: [NgbSlide,] }],
        activeId: [{ type: Input }],
        interval: [{ type: Input }],
        wrap: [{ type: Input }],
        keyboard: [{ type: Input }],
        pauseOnHover: [{ type: Input }],
        showNavigationArrows: [{ type: Input }],
        showNavigationIndicators: [{ type: Input }],
        slide: [{ type: Output }]
    };
    return NgbCarousel;
}());
export { NgbCarousel };
if (false) {
    /** @type {?} */
    NgbCarousel.prototype.slides;
    /** @type {?} */
    NgbCarousel.prototype._destroy$;
    /** @type {?} */
    NgbCarousel.prototype._start$;
    /** @type {?} */
    NgbCarousel.prototype._stop$;
    /**
     * The slide id that should be displayed **initially**.
     *
     * For subsequent interactions use methods `select()`, `next()`, etc. and the `(slide)` output.
     * @type {?}
     */
    NgbCarousel.prototype.activeId;
    /**
     * Time in milliseconds before the next slide is shown.
     * @type {?}
     */
    NgbCarousel.prototype.interval;
    /**
     * If `true`, will 'wrap' the carousel by switching from the last slide back to the first.
     * @type {?}
     */
    NgbCarousel.prototype.wrap;
    /**
     * If `true`, allows to interact with carousel using keyboard 'arrow left' and 'arrow right'.
     * @type {?}
     */
    NgbCarousel.prototype.keyboard;
    /**
     * If `true`, will pause slide switching when mouse cursor hovers the slide.
     *
     * \@since 2.2.0
     * @type {?}
     */
    NgbCarousel.prototype.pauseOnHover;
    /**
     * If `true`, 'previous' and 'next' navigation arrows will be visible on the slide.
     *
     * \@since 2.2.0
     * @type {?}
     */
    NgbCarousel.prototype.showNavigationArrows;
    /**
     * If `true`, navigation indicators at the bottom of the slide will be visible.
     *
     * \@since 2.2.0
     * @type {?}
     */
    NgbCarousel.prototype.showNavigationIndicators;
    /**
     * An event emitted right after the slide transition is completed.
     *
     * See [`NgbSlideEvent`](#/components/carousel/api#NgbSlideEvent) for payload details.
     * @type {?}
     */
    NgbCarousel.prototype.slide;
    /** @type {?} */
    NgbCarousel.prototype._platformId;
    /** @type {?} */
    NgbCarousel.prototype._ngZone;
    /** @type {?} */
    NgbCarousel.prototype._cd;
}
/**
 * A slide change event emitted right after the slide transition is completed.
 * @record
 */
export function NgbSlideEvent() { }
if (false) {
    /**
     * The previous slide id.
     * @type {?}
     */
    NgbSlideEvent.prototype.prev;
    /**
     * The current slide id.
     * @type {?}
     */
    NgbSlideEvent.prototype.current;
    /**
     * The slide event direction.
     *
     * Possible values are `'left' | 'right'`.
     * @type {?}
     */
    NgbSlideEvent.prototype.direction;
}
/** @enum {string} */
var NgbSlideEventDirection = {
    LEFT: (/** @type {?} */ ('left')),
    RIGHT: (/** @type {?} */ ('right')),
};
export { NgbSlideEventDirection };
/** @type {?} */
export var NGB_CAROUSEL_DIRECTIVES = [NgbCarousel, NgbSlide];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2Fyb3VzZWwuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC8iLCJzb3VyY2VzIjpbImNhcm91c2VsL2Nhcm91c2VsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBR0wsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsZUFBZSxFQUNmLFNBQVMsRUFDVCxZQUFZLEVBQ1osTUFBTSxFQUNOLEtBQUssRUFDTCxNQUFNLEVBR04sTUFBTSxFQUNOLFdBQVcsRUFDWCxTQUFTLEVBQ1QsV0FBVyxFQUNaLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBRWxELE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBRXBELE9BQU8sRUFBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUMzQyxPQUFPLEVBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7O0lBRTdELE1BQU0sR0FBRyxDQUFDOzs7O0FBS2Q7SUFRRSxrQkFBbUIsTUFBd0I7UUFBeEIsV0FBTSxHQUFOLE1BQU0sQ0FBa0I7Ozs7OztRQURsQyxPQUFFLEdBQUcsZUFBYSxNQUFNLEVBQUksQ0FBQztJQUNRLENBQUM7O2dCQVJoRCxTQUFTLFNBQUMsRUFBQyxRQUFRLEVBQUUsdUJBQXVCLEVBQUM7Ozs7Z0JBZDVDLFdBQVc7OztxQkFxQlYsS0FBSzs7SUFFUixlQUFDO0NBQUEsQUFURCxJQVNDO1NBUlksUUFBUTs7Ozs7Ozs7SUFNbkIsc0JBQXNDOztJQUMxQiwwQkFBK0I7Ozs7Ozs7QUFRN0M7SUEyRkUscUJBQ0ksTUFBeUIsRUFBK0IsV0FBVyxFQUFVLE9BQWUsRUFDcEYsR0FBc0I7UUFEMEIsZ0JBQVcsR0FBWCxXQUFXLENBQUE7UUFBVSxZ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O3dCQUNmLGNBQWMsRUFBRSx5QkFBeUI7d0JBQ3pDLGNBQWMsRUFBRSx5QkFBeUI7d0JBQ3pDLHFCQUFxQixFQUFFLG9CQUFvQjt3QkFDM0Msc0JBQXNCLEVBQUUsb0JBQW9CO3FCQUM3QztvQkFDRCxRQUFRLEVBQUUsNGhDQWtCVDtpQkFDRjs7OztnQkExRE8saUJBQWlCO2dEQXNIUyxNQUFNLFNBQUMsV0FBVztnQkFoSWxELE1BQU07Z0JBUE4saUJBQWlCOzs7eUJBOEVoQixlQUFlLFNBQUMsUUFBUTsyQkFXeEIsS0FBSzsyQkFLTCxLQUFLO3VCQUtMLEtBQUs7MkJBS0wsS0FBSzsrQkFPTCxLQUFLO3VDQU9MLEtBQUs7MkNBT0wsS0FBSzt3QkFPTCxNQUFNOztJQStHVCxrQkFBQztDQUFBLEFBeE1ELElBd01DO1NBdktZLFdBQVc7OztJQUV0Qiw2QkFBdUQ7O0lBRXZELGdDQUF3Qzs7SUFDeEMsOEJBQXNDOztJQUN0Qyw2QkFBcUM7Ozs7Ozs7SUFPckMsK0JBQTBCOzs7OztJQUsxQiwrQkFBMEI7Ozs7O0lBSzFCLDJCQUF1Qjs7Ozs7SUFLdkIsK0JBQTJCOzs7Ozs7O0lBTzNCLG1DQUErQjs7Ozs7OztJQU8vQiwyQ0FBdUM7Ozs7Ozs7SUFPdkMsK0NBQTJDOzs7Ozs7O0lBTzNDLDRCQUFvRDs7SUFHckIsa0NBQXdDOztJQUFFLDhCQUF1Qjs7SUFDNUYsMEJBQThCOzs7Ozs7QUFnSHBDLG1DQWlCQzs7Ozs7O0lBYkMsNkJBQWE7Ozs7O0lBS2IsZ0NBQWdCOzs7Ozs7O0lBT2hCLGtDQUFrQzs7OztJQU9sQyxNQUFPLG1CQUFLLE1BQU0sRUFBQTtJQUNsQixPQUFRLG1CQUFLLE9BQU8sRUFBQTs7OztBQUd0QixNQUFNLEtBQU8sdUJBQXVCLEdBQUcsQ0FBQyxXQUFXLEVBQUUsUUFBUSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50Q2hlY2tlZCxcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgRGlyZWN0aXZlLFxuICBFdmVudEVtaXR0ZXIsXG4gIEluamVjdCxcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25DaGFuZ2VzLFxuICBPbkRlc3Ryb3ksXG4gIE91dHB1dCxcbiAgUExBVEZPUk1fSUQsXG4gIFF1ZXJ5TGlzdCxcbiAgVGVtcGxhdGVSZWZcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge2lzUGxhdGZvcm1Ccm93c2VyfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG5pbXBvcnQge05nYkNhcm91c2VsQ29uZmlnfSBmcm9tICcuL2Nhcm91c2VsLWNvbmZpZyc7XG5cbmltcG9ydCB7bWVyZ2UsIFN1YmplY3QsIHRpbWVyfSBmcm9tICdyeGpzJztcbmltcG9ydCB7ZmlsdGVyLCBtYXAsIHN3aXRjaE1hcCwgdGFrZVVudGlsfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmxldCBuZXh0SWQgPSAwO1xuXG4vKipcbiAqIEEgZGlyZWN0aXZlIHRoYXQgd3JhcHMgdGhlIGluZGl2aWR1YWwgY2Fyb3VzZWwgc2xpZGUuXG4gKi9cbkBEaXJlY3RpdmUoe3NlbGVjdG9yOiAnbmctdGVtcGxhdGVbbmdiU2xpZGVdJ30pXG5leHBvcnQgY2xhc3MgTmdiU2xpZGUge1xuICAvKipcbiAgICogU2xpZGUgaWQgdGhhdCBtdXN0IGJlIHVuaXF1ZSBmb3IgdGhlIGVudGlyZSBkb2N1bWVudC5cbiAgICpcbiAgICogSWYgbm90IHByb3ZpZGVkLCB3aWxsIGJlIGdlbmVyYXRlZCBpbiB0aGUgYG5nYi1zbGlkZS14eGAgZm9ybWF0LlxuICAgKi9cbiAgQElucHV0KCkgaWQgPSBgbmdiLXNsaWRlLSR7bmV4dElkKyt9YDtcbiAgY29uc3RydWN0b3IocHVibGljIHRwbFJlZjogVGVtcGxhdGVSZWY8YW55Pikge31cbn1cblxuLyoqXG4gKiBDYXJvdXNlbCBpcyBhIGNvbXBvbmVudCB0byBlYXNpbHkgY3JlYXRlIGFuZCBjb250cm9sIHNsaWRlc2hvd3MuXG4gKlxuICogQWxsb3dzIHRvIHNldCBpbnRlcnZhbHMsIGNoYW5nZSB0aGUgd2F5IHVzZXIgaW50ZXJhY3RzIHdpdGggdGhlIHNsaWRlcyBhbmQgcHJvdmlkZXMgYSBwcm9ncmFtbWF0aWMgQVBJLlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZ2ItY2Fyb3VzZWwnLFxuICBleHBvcnRBczogJ25nYkNhcm91c2VsJyxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnY2Fyb3VzZWwgc2xpZGUnLFxuICAgICdbc3R5bGUuZGlzcGxheV0nOiAnXCJibG9ja1wiJyxcbiAgICAndGFiSW5kZXgnOiAnMCcsXG4gICAgJyhtb3VzZWVudGVyKSc6ICdwYXVzZU9uSG92ZXIgJiYgcGF1c2UoKScsXG4gICAgJyhtb3VzZWxlYXZlKSc6ICdwYXVzZU9uSG92ZXIgJiYgY3ljbGUoKScsXG4gICAgJyhrZXlkb3duLmFycm93TGVmdCknOiAna2V5Ym9hcmQgJiYgcHJldigpJyxcbiAgICAnKGtleWRvd24uYXJyb3dSaWdodCknOiAna2V5Ym9hcmQgJiYgbmV4dCgpJ1xuICB9LFxuICB0ZW1wbGF0ZTogYFxuICAgIDxvbCBjbGFzcz1cImNhcm91c2VsLWluZGljYXRvcnNcIiAqbmdJZj1cInNob3dOYXZpZ2F0aW9uSW5kaWNhdG9yc1wiPlxuICAgICAgPGxpICpuZ0Zvcj1cImxldCBzbGlkZSBvZiBzbGlkZXNcIiBbaWRdPVwic2xpZGUuaWRcIiBbY2xhc3MuYWN0aXZlXT1cInNsaWRlLmlkID09PSBhY3RpdmVJZFwiXG4gICAgICAgICAgKGNsaWNrKT1cInNlbGVjdChzbGlkZS5pZCk7IHBhdXNlT25Ib3ZlciAmJiBwYXVzZSgpXCI+PC9saT5cbiAgICA8L29sPlxuICAgIDxkaXYgY2xhc3M9XCJjYXJvdXNlbC1pbm5lclwiPlxuICAgICAgPGRpdiAqbmdGb3I9XCJsZXQgc2xpZGUgb2Ygc2xpZGVzXCIgY2xhc3M9XCJjYXJvdXNlbC1pdGVtXCIgW2NsYXNzLmFjdGl2ZV09XCJzbGlkZS5pZCA9PT0gYWN0aXZlSWRcIj5cbiAgICAgICAgPG5nLXRlbXBsYXRlIFtuZ1RlbXBsYXRlT3V0bGV0XT1cInNsaWRlLnRwbFJlZlwiPjwvbmctdGVtcGxhdGU+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgICA8YSBjbGFzcz1cImNhcm91c2VsLWNvbnRyb2wtcHJldlwiIHJvbGU9XCJidXR0b25cIiAoY2xpY2spPVwicHJldigpXCIgKm5nSWY9XCJzaG93TmF2aWdhdGlvbkFycm93c1wiPlxuICAgICAgPHNwYW4gY2xhc3M9XCJjYXJvdXNlbC1jb250cm9sLXByZXYtaWNvblwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj5cbiAgICAgIDxzcGFuIGNsYXNzPVwic3Itb25seVwiIGkxOG49XCJAQG5nYi5jYXJvdXNlbC5wcmV2aW91c1wiPlByZXZpb3VzPC9zcGFuPlxuICAgIDwvYT5cbiAgICA8YSBjbGFzcz1cImNhcm91c2VsLWNvbnRyb2wtbmV4dFwiIHJvbGU9XCJidXR0b25cIiAoY2xpY2spPVwibmV4dCgpXCIgKm5nSWY9XCJzaG93TmF2aWdhdGlvbkFycm93c1wiPlxuICAgICAgPHNwYW4gY2xhc3M9XCJjYXJvdXNlbC1jb250cm9sLW5leHQtaWNvblwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj5cbiAgICAgIDxzcGFuIGNsYXNzPVwic3Itb25seVwiIGkxOG49XCJAQG5nYi5jYXJvdXNlbC5uZXh0XCI+TmV4dDwvc3Bhbj5cbiAgICA8L2E+XG4gIGBcbn0pXG5leHBvcnQgY2xhc3MgTmdiQ2Fyb3VzZWwgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRDaGVja2VkLFxuICAgIEFmdGVyQ29udGVudEluaXQsIE9uQ2hhbmdlcywgT25EZXN0cm95IHtcbiAgQENvbnRlbnRDaGlsZHJlbihOZ2JTbGlkZSkgc2xpZGVzOiBRdWVyeUxpc3Q8TmdiU2xpZGU+O1xuXG4gIHByaXZhdGUgX2Rlc3Ryb3kkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcbiAgcHJpdmF0ZSBfc3RhcnQkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcbiAgcHJpdmF0ZSBfc3RvcCQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKlxuICAgKiBUaGUgc2xpZGUgaWQgdGhhdCBzaG91bGQgYmUgZGlzcGxheWVkICoqaW5pdGlhbGx5KiouXG4gICAqXG4gICAqIEZvciBzdWJzZXF1ZW50IGludGVyYWN0aW9ucyB1c2UgbWV0aG9kcyBgc2VsZWN0KClgLCBgbmV4dCgpYCwgZXRjLiBhbmQgdGhlIGAoc2xpZGUpYCBvdXRwdXQuXG4gICAqL1xuICBASW5wdXQoKSBhY3RpdmVJZDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaW1lIGluIG1pbGxpc2Vjb25kcyBiZWZvcmUgdGhlIG5leHQgc2xpZGUgaXMgc2hvd24uXG4gICAqL1xuICBASW5wdXQoKSBpbnRlcnZhbDogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBJZiBgdHJ1ZWAsIHdpbGwgJ3dyYXAnIHRoZSBjYXJvdXNlbCBieSBzd2l0Y2hpbmcgZnJvbSB0aGUgbGFzdCBzbGlkZSBiYWNrIHRvIHRoZSBmaXJzdC5cbiAgICovXG4gIEBJbnB1dCgpIHdyYXA6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIElmIGB0cnVlYCwgYWxsb3dzIHRvIGludGVyYWN0IHdpdGggY2Fyb3VzZWwgdXNpbmcga2V5Ym9hcmQgJ2Fycm93IGxlZnQnIGFuZCAnYXJyb3cgcmlnaHQnLlxuICAgKi9cbiAgQElucHV0KCkga2V5Ym9hcmQ6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIElmIGB0cnVlYCwgd2lsbCBwYXVzZSBzbGlkZSBzd2l0Y2hpbmcgd2hlbiBtb3VzZSBjdXJzb3IgaG92ZXJzIHRoZSBzbGlkZS5cbiAgICpcbiAgICogQHNpbmNlIDIuMi4wXG4gICAqL1xuICBASW5wdXQoKSBwYXVzZU9uSG92ZXI6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIElmIGB0cnVlYCwgJ3ByZXZpb3VzJyBhbmQgJ25leHQnIG5hdmlnYXRpb24gYXJyb3dzIHdpbGwgYmUgdmlzaWJsZSBvbiB0aGUgc2xpZGUuXG4gICAqXG4gICAqIEBzaW5jZSAyLjIuMFxuICAgKi9cbiAgQElucHV0KCkgc2hvd05hdmlnYXRpb25BcnJvd3M6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIElmIGB0cnVlYCwgbmF2aWdhdGlvbiBpbmRpY2F0b3JzIGF0IHRoZSBib3R0b20gb2YgdGhlIHNsaWRlIHdpbGwgYmUgdmlzaWJsZS5cbiAgICpcbiAgICogQHNpbmNlIDIuMi4wXG4gICAqL1xuICBASW5wdXQoKSBzaG93TmF2aWdhdGlvbkluZGljYXRvcnM6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEFuIGV2ZW50IGVtaXR0ZWQgcmlnaHQgYWZ0ZXIgdGhlIHNsaWRlIHRyYW5zaXRpb24gaXMgY29tcGxldGVkLlxuICAgKlxuICAgKiBTZWUgW2BOZ2JTbGlkZUV2ZW50YF0oIy9jb21wb25lbnRzL2Nhcm91c2VsL2FwaSNOZ2JTbGlkZUV2ZW50KSBmb3IgcGF5bG9hZCBkZXRhaWxzLlxuICAgKi9cbiAgQE91dHB1dCgpIHNsaWRlID0gbmV3IEV2ZW50RW1pdHRlcjxOZ2JTbGlkZUV2ZW50PigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgY29uZmlnOiBOZ2JDYXJvdXNlbENvbmZpZywgQEluamVjdChQTEFURk9STV9JRCkgcHJpdmF0ZSBfcGxhdGZvcm1JZCwgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUsXG4gICAgICBwcml2YXRlIF9jZDogQ2hhbmdlRGV0ZWN0b3JSZWYpIHtcbiAgICB0aGlzLmludGVydmFsID0gY29uZmlnLmludGVydmFsO1xuICAgIHRoaXMud3JhcCA9IGNvbmZpZy53cmFwO1xuICAgIHRoaXMua2V5Ym9hcmQgPSBjb25maWcua2V5Ym9hcmQ7XG4gICAgdGhpcy5wYXVzZU9uSG92ZXIgPSBjb25maWcucGF1c2VPbkhvdmVyO1xuICAgIHRoaXMuc2hvd05hdmlnYXRpb25BcnJvd3MgPSBjb25maWcuc2hvd05hdmlnYXRpb25BcnJvd3M7XG4gICAgdGhpcy5zaG93TmF2aWdhdGlvbkluZGljYXRvcnMgPSBjb25maWcuc2hvd05hdmlnYXRpb25JbmRpY2F0b3JzO1xuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIC8vIHNldEludGVydmFsKCkgZG9lc24ndCBwbGF5IHdlbGwgd2l0aCBTU1IgYW5kIHByb3RyYWN0b3IsXG4gICAgLy8gc28gd2Ugc2hvdWxkIHJ1biBpdCBpbiB0aGUgYnJvd3NlciBhbmQgb3V0c2lkZSBBbmd1bGFyXG4gICAgaWYgKGlzUGxhdGZvcm1Ccm93c2VyKHRoaXMuX3BsYXRmb3JtSWQpKSB7XG4gICAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICB0aGlzLl9zdGFydCRcbiAgICAgICAgICAgIC5waXBlKFxuICAgICAgICAgICAgICAgIG1hcCgoKSA9PiB0aGlzLmludGVydmFsKSwgZmlsdGVyKGludGVydmFsID0+IGludGVydmFsID4gMCAmJiB0aGlzLnNsaWRlcy5sZW5ndGggPiAwKSxcbiAgICAgICAgICAgICAgICBzd2l0Y2hNYXAoaW50ZXJ2YWwgPT4gdGltZXIoaW50ZXJ2YWwpLnBpcGUodGFrZVVudGlsKG1lcmdlKHRoaXMuX3N0b3AkLCB0aGlzLl9kZXN0cm95JCkpKSkpXG4gICAgICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHRoaXMuX25nWm9uZS5ydW4oKCkgPT4gdGhpcy5uZXh0KCkpKTtcblxuICAgICAgICB0aGlzLl9zdGFydCQubmV4dCgpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5zbGlkZXMuY2hhbmdlcy5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95JCkpLnN1YnNjcmliZSgoKSA9PiB0aGlzLl9jZC5tYXJrRm9yQ2hlY2soKSk7XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudENoZWNrZWQoKSB7XG4gICAgbGV0IGFjdGl2ZVNsaWRlID0gdGhpcy5fZ2V0U2xpZGVCeUlkKHRoaXMuYWN0aXZlSWQpO1xuICAgIHRoaXMuYWN0aXZlSWQgPSBhY3RpdmVTbGlkZSA/IGFjdGl2ZVNsaWRlLmlkIDogKHRoaXMuc2xpZGVzLmxlbmd0aCA/IHRoaXMuc2xpZGVzLmZpcnN0LmlkIDogbnVsbCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHsgdGhpcy5fZGVzdHJveSQubmV4dCgpOyB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlcykge1xuICAgIGlmICgnaW50ZXJ2YWwnIGluIGNoYW5nZXMgJiYgIWNoYW5nZXNbJ2ludGVydmFsJ10uaXNGaXJzdENoYW5nZSgpKSB7XG4gICAgICB0aGlzLl9zdGFydCQubmV4dCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBOYXZpZ2F0ZXMgdG8gYSBzbGlkZSB3aXRoIHRoZSBzcGVjaWZpZWQgaWRlbnRpZmllci5cbiAgICovXG4gIHNlbGVjdChzbGlkZUlkOiBzdHJpbmcpIHsgdGhpcy5fY3ljbGVUb1NlbGVjdGVkKHNsaWRlSWQsIHRoaXMuX2dldFNsaWRlRXZlbnREaXJlY3Rpb24odGhpcy5hY3RpdmVJZCwgc2xpZGVJZCkpOyB9XG5cbiAgLyoqXG4gICAqIE5hdmlnYXRlcyB0byB0aGUgcHJldmlvdXMgc2xpZGUuXG4gICAqL1xuICBwcmV2KCkgeyB0aGlzLl9jeWNsZVRvU2VsZWN0ZWQodGhpcy5fZ2V0UHJldlNsaWRlKHRoaXMuYWN0aXZlSWQpLCBOZ2JTbGlkZUV2ZW50RGlyZWN0aW9uLlJJR0hUKTsgfVxuXG4gIC8qKlxuICAgKiBOYXZpZ2F0ZXMgdG8gdGhlIG5leHQgc2xpZGUuXG4gICAqL1xuICBuZXh0KCkgeyB0aGlzLl9jeWNsZVRvU2VsZWN0ZWQodGhpcy5fZ2V0TmV4dFNsaWRlKHRoaXMuYWN0aXZlSWQpLCBOZ2JTbGlkZUV2ZW50RGlyZWN0aW9uLkxFRlQpOyB9XG5cbiAgLyoqXG4gICAqIFBhdXNlcyBjeWNsaW5nIHRocm91Z2ggdGhlIHNsaWRlcy5cbiAgICovXG4gIHBhdXNlKCkgeyB0aGlzLl9zdG9wJC5uZXh0KCk7IH1cblxuICAvKipcbiAgICogUmVzdGFydHMgY3ljbGluZyB0aHJvdWdoIHRoZSBzbGlkZXMgZnJvbSBsZWZ0IHRvIHJpZ2h0LlxuICAgKi9cbiAgY3ljbGUoKSB7IHRoaXMuX3N0YXJ0JC5uZXh0KCk7IH1cblxuICBwcml2YXRlIF9jeWNsZVRvU2VsZWN0ZWQoc2xpZGVJZHg6IHN0cmluZywgZGlyZWN0aW9uOiBOZ2JTbGlkZUV2ZW50RGlyZWN0aW9uKSB7XG4gICAgbGV0IHNlbGVjdGVkU2xpZGUgPSB0aGlzLl9nZXRTbGlkZUJ5SWQoc2xpZGVJZHgpO1xuICAgIGlmIChzZWxlY3RlZFNsaWRlICYmIHNlbGVjdGVkU2xpZGUuaWQgIT09IHRoaXMuYWN0aXZlSWQpIHtcbiAgICAgIHRoaXMuc2xpZGUuZW1pdCh7cHJldjogdGhpcy5hY3RpdmVJZCwgY3VycmVudDogc2VsZWN0ZWRTbGlkZS5pZCwgZGlyZWN0aW9uOiBkaXJlY3Rpb259KTtcbiAgICAgIHRoaXMuX3N0YXJ0JC5uZXh0KCk7XG4gICAgICB0aGlzLmFjdGl2ZUlkID0gc2VsZWN0ZWRTbGlkZS5pZDtcbiAgICB9XG5cbiAgICAvLyB3ZSBnZXQgaGVyZSBhZnRlciB0aGUgaW50ZXJ2YWwgZmlyZXMgb3IgYW55IGV4dGVybmFsIEFQSSBjYWxsIGxpa2UgbmV4dCgpLCBwcmV2KCkgb3Igc2VsZWN0KClcbiAgICB0aGlzLl9jZC5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIHByaXZhdGUgX2dldFNsaWRlRXZlbnREaXJlY3Rpb24oY3VycmVudEFjdGl2ZVNsaWRlSWQ6IHN0cmluZywgbmV4dEFjdGl2ZVNsaWRlSWQ6IHN0cmluZyk6IE5nYlNsaWRlRXZlbnREaXJlY3Rpb24ge1xuICAgIGNvbnN0IGN1cnJlbnRBY3RpdmVTbGlkZUlkeCA9IHRoaXMuX2dldFNsaWRlSWR4QnlJZChjdXJyZW50QWN0aXZlU2xpZGVJZCk7XG4gICAgY29uc3QgbmV4dEFjdGl2ZVNsaWRlSWR4ID0gdGhpcy5fZ2V0U2xpZGVJZHhCeUlkKG5leHRBY3RpdmVTbGlkZUlkKTtcblxuICAgIHJldHVybiBjdXJyZW50QWN0aXZlU2xpZGVJZHggPiBuZXh0QWN0aXZlU2xpZGVJZHggPyBOZ2JTbGlkZUV2ZW50RGlyZWN0aW9uLlJJR0hUIDogTmdiU2xpZGVFdmVudERpcmVjdGlvbi5MRUZUO1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0U2xpZGVCeUlkKHNsaWRlSWQ6IHN0cmluZyk6IE5nYlNsaWRlIHsgcmV0dXJuIHRoaXMuc2xpZGVzLmZpbmQoc2xpZGUgPT4gc2xpZGUuaWQgPT09IHNsaWRlSWQpOyB9XG5cbiAgcHJpdmF0ZSBfZ2V0U2xpZGVJZHhCeUlkKHNsaWRlSWQ6IHN0cmluZyk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuc2xpZGVzLnRvQXJyYXkoKS5pbmRleE9mKHRoaXMuX2dldFNsaWRlQnlJZChzbGlkZUlkKSk7XG4gIH1cblxuICBwcml2YXRlIF9nZXROZXh0U2xpZGUoY3VycmVudFNsaWRlSWQ6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3Qgc2xpZGVBcnIgPSB0aGlzLnNsaWRlcy50b0FycmF5KCk7XG4gICAgY29uc3QgY3VycmVudFNsaWRlSWR4ID0gdGhpcy5fZ2V0U2xpZGVJZHhCeUlkKGN1cnJlbnRTbGlkZUlkKTtcbiAgICBjb25zdCBpc0xhc3RTbGlkZSA9IGN1cnJlbnRTbGlkZUlkeCA9PT0gc2xpZGVBcnIubGVuZ3RoIC0gMTtcblxuICAgIHJldHVybiBpc0xhc3RTbGlkZSA/ICh0aGlzLndyYXAgPyBzbGlkZUFyclswXS5pZCA6IHNsaWRlQXJyW3NsaWRlQXJyLmxlbmd0aCAtIDFdLmlkKSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgc2xpZGVBcnJbY3VycmVudFNsaWRlSWR4ICsgMV0uaWQ7XG4gIH1cblxuICBwcml2YXRlIF9nZXRQcmV2U2xpZGUoY3VycmVudFNsaWRlSWQ6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3Qgc2xpZGVBcnIgPSB0aGlzLnNsaWRlcy50b0FycmF5KCk7XG4gICAgY29uc3QgY3VycmVudFNsaWRlSWR4ID0gdGhpcy5fZ2V0U2xpZGVJZHhCeUlkKGN1cnJlbnRTbGlkZUlkKTtcbiAgICBjb25zdCBpc0ZpcnN0U2xpZGUgPSBjdXJyZW50U2xpZGVJZHggPT09IDA7XG5cbiAgICByZXR1cm4gaXNGaXJzdFNsaWRlID8gKHRoaXMud3JhcCA/IHNsaWRlQXJyW3NsaWRlQXJyLmxlbmd0aCAtIDFdLmlkIDogc2xpZGVBcnJbMF0uaWQpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgc2xpZGVBcnJbY3VycmVudFNsaWRlSWR4IC0gMV0uaWQ7XG4gIH1cbn1cblxuLyoqXG4gKiBBIHNsaWRlIGNoYW5nZSBldmVudCBlbWl0dGVkIHJpZ2h0IGFmdGVyIHRoZSBzbGlkZSB0cmFuc2l0aW9uIGlzIGNvbXBsZXRlZC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBOZ2JTbGlkZUV2ZW50IHtcbiAgLyoqXG4gICAqIFRoZSBwcmV2aW91cyBzbGlkZSBpZC5cbiAgICovXG4gIHByZXY6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGN1cnJlbnQgc2xpZGUgaWQuXG4gICAqL1xuICBjdXJyZW50OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBzbGlkZSBldmVudCBkaXJlY3Rpb24uXG4gICAqXG4gICAqIFBvc3NpYmxlIHZhbHVlcyBhcmUgYCdsZWZ0JyB8ICdyaWdodCdgLlxuICAgKi9cbiAgZGlyZWN0aW9uOiBOZ2JTbGlkZUV2ZW50RGlyZWN0aW9uO1xufVxuXG4vKipcbiAqIERlZmluZXMgdGhlIGNhcm91c2VsIHNsaWRlIHRyYW5zaXRpb24gZGlyZWN0aW9uLlxuICovXG5leHBvcnQgZW51bSBOZ2JTbGlkZUV2ZW50RGlyZWN0aW9uIHtcbiAgTEVGVCA9IDxhbnk+J2xlZnQnLFxuICBSSUdIVCA9IDxhbnk+J3JpZ2h0J1xufVxuXG5leHBvcnQgY29uc3QgTkdCX0NBUk9VU0VMX0RJUkVDVElWRVMgPSBbTmdiQ2Fyb3VzZWwsIE5nYlNsaWRlXTtcbiJdfQ==