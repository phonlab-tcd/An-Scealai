/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Component, ContentChild, Directive, EventEmitter, Input, Output, ChangeDetectionStrategy, TemplateRef } from '@angular/core';
import { getValueInRange, isNumber } from '../util/util';
import { NgbPaginationConfig } from './pagination-config';
/**
 * A context for the
 * * `NgbPaginationFirst`
 * * `NgbPaginationPrevious`
 * * `NgbPaginationNext`
 * * `NgbPaginationLast`
 * * `NgbPaginationEllipsis`
 *
 * link templates in case you want to override one.
 *
 * \@since 4.1.0
 * @record
 */
export function NgbPaginationLinkContext() { }
if (false) {
    /**
     * The currently selected page number
     * @type {?}
     */
    NgbPaginationLinkContext.prototype.currentPage;
    /**
     * If `true`, the current link is disabled
     * @type {?}
     */
    NgbPaginationLinkContext.prototype.disabled;
}
/**
 * A context for the `NgbPaginationNumber` link template in case you want to override one.
 *
 * Extends `NgbPaginationLinkContext`.
 *
 * \@since 4.1.0
 * @record
 */
export function NgbPaginationNumberContext() { }
if (false) {
    /**
     * The page number, displayed by the current page link.
     * @type {?}
     */
    NgbPaginationNumberContext.prototype.$implicit;
}
/**
 * A directive to match the 'ellipsis' link template
 *
 * \@since 4.1.0
 */
var NgbPaginationEllipsis = /** @class */ (function () {
    function NgbPaginationEllipsis(templateRef) {
        this.templateRef = templateRef;
    }
    NgbPaginationEllipsis.decorators = [
        { type: Directive, args: [{ selector: 'ng-template[ngbPaginationEllipsis]' },] }
    ];
    /** @nocollapse */
    NgbPaginationEllipsis.ctorParameters = function () { return [
        { type: TemplateRef }
    ]; };
    return NgbPaginationEllipsis;
}());
export { NgbPaginationEllipsis };
if (false) {
    /** @type {?} */
    NgbPaginationEllipsis.prototype.templateRef;
}
/**
 * A directive to match the 'first' link template
 *
 * \@since 4.1.0
 */
var NgbPaginationFirst = /** @class */ (function () {
    function NgbPaginationFirst(templateRef) {
        this.templateRef = templateRef;
    }
    NgbPaginationFirst.decorators = [
        { type: Directive, args: [{ selector: 'ng-template[ngbPaginationFirst]' },] }
    ];
    /** @nocollapse */
    NgbPaginationFirst.ctorParameters = function () { return [
        { type: TemplateRef }
    ]; };
    return NgbPaginationFirst;
}());
export { NgbPaginationFirst };
if (false) {
    /** @type {?} */
    NgbPaginationFirst.prototype.templateRef;
}
/**
 * A directive to match the 'last' link template
 *
 * \@since 4.1.0
 */
var NgbPaginationLast = /** @class */ (function () {
    function NgbPaginationLast(templateRef) {
        this.templateRef = templateRef;
    }
    NgbPaginationLast.decorators = [
        { type: Directive, args: [{ selector: 'ng-template[ngbPaginationLast]' },] }
    ];
    /** @nocollapse */
    NgbPaginationLast.ctorParameters = function () { return [
        { type: TemplateRef }
    ]; };
    return NgbPaginationLast;
}());
export { NgbPaginationLast };
if (false) {
    /** @type {?} */
    NgbPaginationLast.prototype.templateRef;
}
/**
 * A directive to match the 'next' link template
 *
 * \@since 4.1.0
 */
var NgbPaginationNext = /** @class */ (function () {
    function NgbPaginationNext(templateRef) {
        this.templateRef = templateRef;
    }
    NgbPaginationNext.decorators = [
        { type: Directive, args: [{ selector: 'ng-template[ngbPaginationNext]' },] }
    ];
    /** @nocollapse */
    NgbPaginationNext.ctorParameters = function () { return [
        { type: TemplateRef }
    ]; };
    return NgbPaginationNext;
}());
export { NgbPaginationNext };
if (false) {
    /** @type {?} */
    NgbPaginationNext.prototype.templateRef;
}
/**
 * A directive to match the page 'number' link template
 *
 * \@since 4.1.0
 */
var NgbPaginationNumber = /** @class */ (function () {
    function NgbPaginationNumber(templateRef) {
        this.templateRef = templateRef;
    }
    NgbPaginationNumber.decorators = [
        { type: Directive, args: [{ selector: 'ng-template[ngbPaginationNumber]' },] }
    ];
    /** @nocollapse */
    NgbPaginationNumber.ctorParameters = function () { return [
        { type: TemplateRef }
    ]; };
    return NgbPaginationNumber;
}());
export { NgbPaginationNumber };
if (false) {
    /** @type {?} */
    NgbPaginationNumber.prototype.templateRef;
}
/**
 * A directive to match the 'previous' link template
 *
 * \@since 4.1.0
 */
var NgbPaginationPrevious = /** @class */ (function () {
    function NgbPaginationPrevious(templateRef) {
        this.templateRef = templateRef;
    }
    NgbPaginationPrevious.decorators = [
        { type: Directive, args: [{ selector: 'ng-template[ngbPaginationPrevious]' },] }
    ];
    /** @nocollapse */
    NgbPaginationPrevious.ctorParameters = function () { return [
        { type: TemplateRef }
    ]; };
    return NgbPaginationPrevious;
}());
export { NgbPaginationPrevious };
if (false) {
    /** @type {?} */
    NgbPaginationPrevious.prototype.templateRef;
}
/**
 * A component that displays page numbers and allows to customize them in several ways.
 */
var NgbPagination = /** @class */ (function () {
    function NgbPagination(config) {
        this.pageCount = 0;
        this.pages = [];
        /**
         *  The current page.
         *
         *  Page numbers start with `1`.
         */
        this.page = 1;
        /**
         *  An event fired when the page is changed. Will fire only if collection size is set and all values are valid.
         *
         *  Event payload is the number of the newly selected page.
         *
         *  Page numbers start with `1`.
         */
        this.pageChange = new EventEmitter(true);
        this.disabled = config.disabled;
        this.boundaryLinks = config.boundaryLinks;
        this.directionLinks = config.directionLinks;
        this.ellipses = config.ellipses;
        this.maxSize = config.maxSize;
        this.pageSize = config.pageSize;
        this.rotate = config.rotate;
        this.size = config.size;
    }
    /**
     * @return {?}
     */
    NgbPagination.prototype.hasPrevious = /**
     * @return {?}
     */
    function () { return this.page > 1; };
    /**
     * @return {?}
     */
    NgbPagination.prototype.hasNext = /**
     * @return {?}
     */
    function () { return this.page < this.pageCount; };
    /**
     * @return {?}
     */
    NgbPagination.prototype.nextDisabled = /**
     * @return {?}
     */
    function () { return !this.hasNext() || this.disabled; };
    /**
     * @return {?}
     */
    NgbPagination.prototype.previousDisabled = /**
     * @return {?}
     */
    function () { return !this.hasPrevious() || this.disabled; };
    /**
     * @param {?} pageNumber
     * @return {?}
     */
    NgbPagination.prototype.selectPage = /**
     * @param {?} pageNumber
     * @return {?}
     */
    function (pageNumber) { this._updatePages(pageNumber); };
    /**
     * @param {?} changes
     * @return {?}
     */
    NgbPagination.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) { this._updatePages(this.page); };
    /**
     * @param {?} pageNumber
     * @return {?}
     */
    NgbPagination.prototype.isEllipsis = /**
     * @param {?} pageNumber
     * @return {?}
     */
    function (pageNumber) { return pageNumber === -1; };
    /**
     * Appends ellipses and first/last page number to the displayed pages
     */
    /**
     * Appends ellipses and first/last page number to the displayed pages
     * @param {?} start
     * @param {?} end
     * @return {?}
     */
    NgbPagination.prototype._applyEllipses = /**
     * Appends ellipses and first/last page number to the displayed pages
     * @param {?} start
     * @param {?} end
     * @return {?}
     */
    function (start, end) {
        if (this.ellipses) {
            if (start > 0) {
                if (start > 1) {
                    this.pages.unshift(-1);
                }
                this.pages.unshift(1);
            }
            if (end < this.pageCount) {
                if (end < (this.pageCount - 1)) {
                    this.pages.push(-1);
                }
                this.pages.push(this.pageCount);
            }
        }
    };
    /**
     * Rotates page numbers based on maxSize items visible.
     * Currently selected page stays in the middle:
     *
     * Ex. for selected page = 6:
     * [5,*6*,7] for maxSize = 3
     * [4,5,*6*,7] for maxSize = 4
     */
    /**
     * Rotates page numbers based on maxSize items visible.
     * Currently selected page stays in the middle:
     *
     * Ex. for selected page = 6:
     * [5,*6*,7] for maxSize = 3
     * [4,5,*6*,7] for maxSize = 4
     * @return {?}
     */
    NgbPagination.prototype._applyRotation = /**
     * Rotates page numbers based on maxSize items visible.
     * Currently selected page stays in the middle:
     *
     * Ex. for selected page = 6:
     * [5,*6*,7] for maxSize = 3
     * [4,5,*6*,7] for maxSize = 4
     * @return {?}
     */
    function () {
        /** @type {?} */
        var start = 0;
        /** @type {?} */
        var end = this.pageCount;
        /** @type {?} */
        var leftOffset = Math.floor(this.maxSize / 2);
        /** @type {?} */
        var rightOffset = this.maxSize % 2 === 0 ? leftOffset - 1 : leftOffset;
        if (this.page <= leftOffset) {
            // very beginning, no rotation -> [0..maxSize]
            end = this.maxSize;
        }
        else if (this.pageCount - this.page < leftOffset) {
            // very end, no rotation -> [len-maxSize..len]
            start = this.pageCount - this.maxSize;
        }
        else {
            // rotate
            start = this.page - leftOffset - 1;
            end = this.page + rightOffset;
        }
        return [start, end];
    };
    /**
     * Paginates page numbers based on maxSize items per page.
     */
    /**
     * Paginates page numbers based on maxSize items per page.
     * @return {?}
     */
    NgbPagination.prototype._applyPagination = /**
     * Paginates page numbers based on maxSize items per page.
     * @return {?}
     */
    function () {
        /** @type {?} */
        var page = Math.ceil(this.page / this.maxSize) - 1;
        /** @type {?} */
        var start = page * this.maxSize;
        /** @type {?} */
        var end = start + this.maxSize;
        return [start, end];
    };
    /**
     * @param {?} newPageNo
     * @return {?}
     */
    NgbPagination.prototype._setPageInRange = /**
     * @param {?} newPageNo
     * @return {?}
     */
    function (newPageNo) {
        /** @type {?} */
        var prevPageNo = this.page;
        this.page = getValueInRange(newPageNo, this.pageCount, 1);
        if (this.page !== prevPageNo && isNumber(this.collectionSize)) {
            this.pageChange.emit(this.page);
        }
    };
    /**
     * @param {?} newPage
     * @return {?}
     */
    NgbPagination.prototype._updatePages = /**
     * @param {?} newPage
     * @return {?}
     */
    function (newPage) {
        var _a, _b;
        this.pageCount = Math.ceil(this.collectionSize / this.pageSize);
        if (!isNumber(this.pageCount)) {
            this.pageCount = 0;
        }
        // fill-in model needed to render pages
        this.pages.length = 0;
        for (var i = 1; i <= this.pageCount; i++) {
            this.pages.push(i);
        }
        // set page within 1..max range
        this._setPageInRange(newPage);
        // apply maxSize if necessary
        if (this.maxSize > 0 && this.pageCount > this.maxSize) {
            /** @type {?} */
            var start = 0;
            /** @type {?} */
            var end = this.pageCount;
            // either paginating or rotating page numbers
            if (this.rotate) {
                _a = tslib_1.__read(this._applyRotation(), 2), start = _a[0], end = _a[1];
            }
            else {
                _b = tslib_1.__read(this._applyPagination(), 2), start = _b[0], end = _b[1];
            }
            this.pages = this.pages.slice(start, end);
            // adding ellipses
            this._applyEllipses(start, end);
        }
    };
    NgbPagination.decorators = [
        { type: Component, args: [{
                    selector: 'ngb-pagination',
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    host: { 'role': 'navigation' },
                    template: "\n    <ng-template #first><span aria-hidden=\"true\" i18n=\"@@ngb.pagination.first\">&laquo;&laquo;</span></ng-template>\n    <ng-template #previous><span aria-hidden=\"true\" i18n=\"@@ngb.pagination.previous\">&laquo;</span></ng-template>\n    <ng-template #next><span aria-hidden=\"true\" i18n=\"@@ngb.pagination.next\">&raquo;</span></ng-template>\n    <ng-template #last><span aria-hidden=\"true\" i18n=\"@@ngb.pagination.last\">&raquo;&raquo;</span></ng-template>\n    <ng-template #ellipsis>...</ng-template>\n    <ng-template #defaultNumber let-page let-currentPage=\"currentPage\">\n      {{ page }}\n      <span *ngIf=\"page === currentPage\" class=\"sr-only\">(current)</span>\n    </ng-template>\n    <ul [class]=\"'pagination' + (size ? ' pagination-' + size : '')\">\n      <li *ngIf=\"boundaryLinks\" class=\"page-item\"\n        [class.disabled]=\"previousDisabled()\">\n        <a aria-label=\"First\" i18n-aria-label=\"@@ngb.pagination.first-aria\" class=\"page-link\" href\n          (click)=\"selectPage(1); $event.preventDefault()\" [attr.tabindex]=\"(hasPrevious() ? null : '-1')\">\n          <ng-template [ngTemplateOutlet]=\"tplFirst?.templateRef || first\"\n                       [ngTemplateOutletContext]=\"{disabled: previousDisabled(), currentPage: page}\"></ng-template>\n        </a>\n      </li>\n\n      <li *ngIf=\"directionLinks\" class=\"page-item\"\n        [class.disabled]=\"previousDisabled()\">\n        <a aria-label=\"Previous\" i18n-aria-label=\"@@ngb.pagination.previous-aria\" class=\"page-link\" href\n          (click)=\"selectPage(page-1); $event.preventDefault()\" [attr.tabindex]=\"(hasPrevious() ? null : '-1')\">\n          <ng-template [ngTemplateOutlet]=\"tplPrevious?.templateRef || previous\"\n                       [ngTemplateOutletContext]=\"{disabled: previousDisabled()}\"></ng-template>\n        </a>\n      </li>\n      <li *ngFor=\"let pageNumber of pages\" class=\"page-item\" [class.active]=\"pageNumber === page\"\n        [class.disabled]=\"isEllipsis(pageNumber) || disabled\">\n        <a *ngIf=\"isEllipsis(pageNumber)\" class=\"page-link\">\n          <ng-template [ngTemplateOutlet]=\"tplEllipsis?.templateRef || ellipsis\"\n                       [ngTemplateOutletContext]=\"{disabled: true, currentPage: page}\"></ng-template>\n        </a>\n        <a *ngIf=\"!isEllipsis(pageNumber)\" class=\"page-link\" href (click)=\"selectPage(pageNumber); $event.preventDefault()\">\n          <ng-template [ngTemplateOutlet]=\"tplNumber?.templateRef || defaultNumber\"\n                       [ngTemplateOutletContext]=\"{disabled: disabled, $implicit: pageNumber, currentPage: page}\"></ng-template>\n        </a>\n      </li>\n      <li *ngIf=\"directionLinks\" class=\"page-item\" [class.disabled]=\"nextDisabled()\">\n        <a aria-label=\"Next\" i18n-aria-label=\"@@ngb.pagination.next-aria\" class=\"page-link\" href\n          (click)=\"selectPage(page+1); $event.preventDefault()\" [attr.tabindex]=\"(hasNext() ? null : '-1')\">\n          <ng-template [ngTemplateOutlet]=\"tplNext?.templateRef || next\"\n                       [ngTemplateOutletContext]=\"{disabled: nextDisabled(), currentPage: page}\"></ng-template>\n        </a>\n      </li>\n\n      <li *ngIf=\"boundaryLinks\" class=\"page-item\" [class.disabled]=\"nextDisabled()\">\n        <a aria-label=\"Last\" i18n-aria-label=\"@@ngb.pagination.last-aria\" class=\"page-link\" href\n          (click)=\"selectPage(pageCount); $event.preventDefault()\" [attr.tabindex]=\"(hasNext() ? null : '-1')\">\n          <ng-template [ngTemplateOutlet]=\"tplLast?.templateRef || last\"\n                       [ngTemplateOutletContext]=\"{disabled: nextDisabled(), currentPage: page}\"></ng-template>\n        </a>\n      </li>\n    </ul>\n  "
                }] }
    ];
    /** @nocollapse */
    NgbPagination.ctorParameters = function () { return [
        { type: NgbPaginationConfig }
    ]; };
    NgbPagination.propDecorators = {
        tplEllipsis: [{ type: ContentChild, args: [NgbPaginationEllipsis,] }],
        tplFirst: [{ type: ContentChild, args: [NgbPaginationFirst,] }],
        tplLast: [{ type: ContentChild, args: [NgbPaginationLast,] }],
        tplNext: [{ type: ContentChild, args: [NgbPaginationNext,] }],
        tplNumber: [{ type: ContentChild, args: [NgbPaginationNumber,] }],
        tplPrevious: [{ type: ContentChild, args: [NgbPaginationPrevious,] }],
        disabled: [{ type: Input }],
        boundaryLinks: [{ type: Input }],
        directionLinks: [{ type: Input }],
        ellipses: [{ type: Input }],
        rotate: [{ type: Input }],
        collectionSize: [{ type: Input }],
        maxSize: [{ type: Input }],
        page: [{ type: Input }],
        pageSize: [{ type: Input }],
        pageChange: [{ type: Output }],
        size: [{ type: Input }]
    };
    return NgbPagination;
}());
export { NgbPagination };
if (false) {
    /** @type {?} */
    NgbPagination.prototype.pageCount;
    /** @type {?} */
    NgbPagination.prototype.pages;
    /** @type {?} */
    NgbPagination.prototype.tplEllipsis;
    /** @type {?} */
    NgbPagination.prototype.tplFirst;
    /** @type {?} */
    NgbPagination.prototype.tplLast;
    /** @type {?} */
    NgbPagination.prototype.tplNext;
    /** @type {?} */
    NgbPagination.prototype.tplNumber;
    /** @type {?} */
    NgbPagination.prototype.tplPrevious;
    /**
     * If `true`, pagination links will be disabled.
     * @type {?}
     */
    NgbPagination.prototype.disabled;
    /**
     * If `true`, the "First" and "Last" page links are shown.
     * @type {?}
     */
    NgbPagination.prototype.boundaryLinks;
    /**
     * If `true`, the "Next" and "Previous" page links are shown.
     * @type {?}
     */
    NgbPagination.prototype.directionLinks;
    /**
     * If `true`, the ellipsis symbols and first/last page numbers will be shown when `maxSize` > number of pages.
     * @type {?}
     */
    NgbPagination.prototype.ellipses;
    /**
     * Whether to rotate pages when `maxSize` > number of pages.
     *
     * The current page always stays in the middle if `true`.
     * @type {?}
     */
    NgbPagination.prototype.rotate;
    /**
     *  The number of items in your paginated collection.
     *
     *  Note, that this is not the number of pages. Page numbers are calculated dynamically based on
     *  `collectionSize` and `pageSize`. Ex. if you have 100 items in your collection and displaying 20 items per page,
     *  you'll end up with 5 pages.
     * @type {?}
     */
    NgbPagination.prototype.collectionSize;
    /**
     *  The maximum number of pages to display.
     * @type {?}
     */
    NgbPagination.prototype.maxSize;
    /**
     *  The current page.
     *
     *  Page numbers start with `1`.
     * @type {?}
     */
    NgbPagination.prototype.page;
    /**
     *  The number of items per page.
     * @type {?}
     */
    NgbPagination.prototype.pageSize;
    /**
     *  An event fired when the page is changed. Will fire only if collection size is set and all values are valid.
     *
     *  Event payload is the number of the newly selected page.
     *
     *  Page numbers start with `1`.
     * @type {?}
     */
    NgbPagination.prototype.pageChange;
    /**
     * The pagination display size.
     *
     * Bootstrap currently supports small and large sizes.
     * @type {?}
     */
    NgbPagination.prototype.size;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnaW5hdGlvbi5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwLyIsInNvdXJjZXMiOlsicGFnaW5hdGlvbi9wYWdpbmF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxZQUFZLEVBQ1osU0FBUyxFQUNULFlBQVksRUFDWixLQUFLLEVBQ0wsTUFBTSxFQUVOLHVCQUF1QixFQUV2QixXQUFXLEVBQ1osTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLGVBQWUsRUFBRSxRQUFRLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFDdkQsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0scUJBQXFCLENBQUM7Ozs7Ozs7Ozs7Ozs7O0FBY3hELDhDQVVDOzs7Ozs7SUFOQywrQ0FBb0I7Ozs7O0lBS3BCLDRDQUFrQjs7Ozs7Ozs7OztBQVVwQixnREFLQzs7Ozs7O0lBREMsK0NBQWtCOzs7Ozs7O0FBUXBCO0lBRUUsK0JBQW1CLFdBQWtEO1FBQWxELGdCQUFXLEdBQVgsV0FBVyxDQUF1QztJQUFHLENBQUM7O2dCQUYxRSxTQUFTLFNBQUMsRUFBQyxRQUFRLEVBQUUsb0NBQW9DLEVBQUM7Ozs7Z0JBaER6RCxXQUFXOztJQW1EYiw0QkFBQztDQUFBLEFBSEQsSUFHQztTQUZZLHFCQUFxQjs7O0lBQ3BCLDRDQUF5RDs7Ozs7OztBQVF2RTtJQUVFLDRCQUFtQixXQUFrRDtRQUFsRCxnQkFBVyxHQUFYLFdBQVcsQ0FBdUM7SUFBRyxDQUFDOztnQkFGMUUsU0FBUyxTQUFDLEVBQUMsUUFBUSxFQUFFLGlDQUFpQyxFQUFDOzs7O2dCQTFEdEQsV0FBVzs7SUE2RGIseUJBQUM7Q0FBQSxBQUhELElBR0M7U0FGWSxrQkFBa0I7OztJQUNqQix5Q0FBeUQ7Ozs7Ozs7QUFRdkU7SUFFRSwyQkFBbUIsV0FBa0Q7UUFBbEQsZ0JBQVcsR0FBWCxXQUFXLENBQXVDO0lBQUcsQ0FBQzs7Z0JBRjFF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QkFDVCxRQUFRLEVBQUUsZ0JBQWdCO29CQUMxQixlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtvQkFDL0MsSUFBSSxFQUFFLEVBQUMsTUFBTSxFQUFFLFlBQVksRUFBQztvQkFDNUIsUUFBUSxFQUFFLDZySEF1RFQ7aUJBQ0Y7Ozs7Z0JBbktPLG1CQUFtQjs7OzhCQXdLeEIsWUFBWSxTQUFDLHFCQUFxQjsyQkFDbEMsWUFBWSxTQUFDLGtCQUFrQjswQkFDL0IsWUFBWSxTQUFDLGlCQUFpQjswQkFDOUIsWUFBWSxTQUFDLGlCQUFpQjs0QkFDOUIsWUFBWSxTQUFDLG1CQUFtQjs4QkFDaEMsWUFBWSxTQUFDLHFCQUFxQjsyQkFLbEMsS0FBSztnQ0FLTCxLQUFLO2lDQUtMLEtBQUs7MkJBS0wsS0FBSzt5QkFPTCxLQUFLO2lDQVNMLEtBQUs7MEJBS0wsS0FBSzt1QkFPTCxLQUFLOzJCQUtMLEtBQUs7NkJBU0wsTUFBTTt1QkFPTixLQUFLOztJQWtJUixvQkFBQztDQUFBLEFBN1FELElBNlFDO1NBaE5ZLGFBQWE7OztJQUN4QixrQ0FBYzs7SUFDZCw4QkFBcUI7O0lBRXJCLG9DQUF3RTs7SUFDeEUsaUNBQStEOztJQUMvRCxnQ0FBNEQ7O0lBQzVELGdDQUE0RDs7SUFDNUQsa0NBQWtFOztJQUNsRSxvQ0FBd0U7Ozs7O0lBS3hFLGlDQUEyQjs7Ozs7SUFLM0Isc0NBQWdDOzs7OztJQUtoQyx1Q0FBaUM7Ozs7O0lBS2pDLGlDQUEyQjs7Ozs7OztJQU8zQiwrQkFBeUI7Ozs7Ozs7OztJQVN6Qix1Q0FBZ0M7Ozs7O0lBS2hDLGdDQUF5Qjs7Ozs7OztJQU96Qiw2QkFBa0I7Ozs7O0lBS2xCLGlDQUEwQjs7Ozs7Ozs7O0lBUzFCLG1DQUFzRDs7Ozs7OztJQU90RCw2QkFBMkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZCxcbiAgRGlyZWN0aXZlLFxuICBFdmVudEVtaXR0ZXIsXG4gIElucHV0LFxuICBPdXRwdXQsXG4gIE9uQ2hhbmdlcyxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIFNpbXBsZUNoYW5nZXMsXG4gIFRlbXBsYXRlUmVmXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtnZXRWYWx1ZUluUmFuZ2UsIGlzTnVtYmVyfSBmcm9tICcuLi91dGlsL3V0aWwnO1xuaW1wb3J0IHtOZ2JQYWdpbmF0aW9uQ29uZmlnfSBmcm9tICcuL3BhZ2luYXRpb24tY29uZmlnJztcblxuLyoqXG4gKiBBIGNvbnRleHQgZm9yIHRoZVxuICogKiBgTmdiUGFnaW5hdGlvbkZpcnN0YFxuICogKiBgTmdiUGFnaW5hdGlvblByZXZpb3VzYFxuICogKiBgTmdiUGFnaW5hdGlvbk5leHRgXG4gKiAqIGBOZ2JQYWdpbmF0aW9uTGFzdGBcbiAqICogYE5nYlBhZ2luYXRpb25FbGxpcHNpc2BcbiAqXG4gKiBsaW5rIHRlbXBsYXRlcyBpbiBjYXNlIHlvdSB3YW50IHRvIG92ZXJyaWRlIG9uZS5cbiAqXG4gKiBAc2luY2UgNC4xLjBcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBOZ2JQYWdpbmF0aW9uTGlua0NvbnRleHQge1xuICAvKipcbiAgICogVGhlIGN1cnJlbnRseSBzZWxlY3RlZCBwYWdlIG51bWJlclxuICAgKi9cbiAgY3VycmVudFBhZ2U6IG51bWJlcjtcblxuICAvKipcbiAgICogSWYgYHRydWVgLCB0aGUgY3VycmVudCBsaW5rIGlzIGRpc2FibGVkXG4gICAqL1xuICBkaXNhYmxlZDogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBBIGNvbnRleHQgZm9yIHRoZSBgTmdiUGFnaW5hdGlvbk51bWJlcmAgbGluayB0ZW1wbGF0ZSBpbiBjYXNlIHlvdSB3YW50IHRvIG92ZXJyaWRlIG9uZS5cbiAqXG4gKiBFeHRlbmRzIGBOZ2JQYWdpbmF0aW9uTGlua0NvbnRleHRgLlxuICpcbiAqIEBzaW5jZSA0LjEuMFxuICovXG5leHBvcnQgaW50ZXJmYWNlIE5nYlBhZ2luYXRpb25OdW1iZXJDb250ZXh0IGV4dGVuZHMgTmdiUGFnaW5hdGlvbkxpbmtDb250ZXh0IHtcbiAgLyoqXG4gICAqIFRoZSBwYWdlIG51bWJlciwgZGlzcGxheWVkIGJ5IHRoZSBjdXJyZW50IHBhZ2UgbGluay5cbiAgICovXG4gICRpbXBsaWNpdDogbnVtYmVyO1xufVxuXG4vKipcbiAqIEEgZGlyZWN0aXZlIHRvIG1hdGNoIHRoZSAnZWxsaXBzaXMnIGxpbmsgdGVtcGxhdGVcbiAqXG4gKiBAc2luY2UgNC4xLjBcbiAqL1xuQERpcmVjdGl2ZSh7c2VsZWN0b3I6ICduZy10ZW1wbGF0ZVtuZ2JQYWdpbmF0aW9uRWxsaXBzaXNdJ30pXG5leHBvcnQgY2xhc3MgTmdiUGFnaW5hdGlvbkVsbGlwc2lzIHtcbiAgY29uc3RydWN0b3IocHVibGljIHRlbXBsYXRlUmVmOiBUZW1wbGF0ZVJlZjxOZ2JQYWdpbmF0aW9uTGlua0NvbnRleHQ+KSB7fVxufVxuXG4vKipcbiAqIEEgZGlyZWN0aXZlIHRvIG1hdGNoIHRoZSAnZmlyc3QnIGxpbmsgdGVtcGxhdGVcbiAqXG4gKiBAc2luY2UgNC4xLjBcbiAqL1xuQERpcmVjdGl2ZSh7c2VsZWN0b3I6ICduZy10ZW1wbGF0ZVtuZ2JQYWdpbmF0aW9uRmlyc3RdJ30pXG5leHBvcnQgY2xhc3MgTmdiUGFnaW5hdGlvbkZpcnN0IHtcbiAgY29uc3RydWN0b3IocHVibGljIHRlbXBsYXRlUmVmOiBUZW1wbGF0ZVJlZjxOZ2JQYWdpbmF0aW9uTGlua0NvbnRleHQ+KSB7fVxufVxuXG4vKipcbiAqIEEgZGlyZWN0aXZlIHRvIG1hdGNoIHRoZSAnbGFzdCcgbGluayB0ZW1wbGF0ZVxuICpcbiAqIEBzaW5jZSA0LjEuMFxuICovXG5ARGlyZWN0aXZlKHtzZWxlY3RvcjogJ25nLXRlbXBsYXRlW25nYlBhZ2luYXRpb25MYXN0XSd9KVxuZXhwb3J0IGNsYXNzIE5nYlBhZ2luYXRpb25MYXN0IHtcbiAgY29uc3RydWN0b3IocHVibGljIHRlbXBsYXRlUmVmOiBUZW1wbGF0ZVJlZjxOZ2JQYWdpbmF0aW9uTGlua0NvbnRleHQ+KSB7fVxufVxuXG4vKipcbiAqIEEgZGlyZWN0aXZlIHRvIG1hdGNoIHRoZSAnbmV4dCcgbGluayB0ZW1wbGF0ZVxuICpcbiAqIEBzaW5jZSA0LjEuMFxuICovXG5ARGlyZWN0aXZlKHtzZWxlY3RvcjogJ25nLXRlbXBsYXRlW25nYlBhZ2luYXRpb25OZXh0XSd9KVxuZXhwb3J0IGNsYXNzIE5nYlBhZ2luYXRpb25OZXh0IHtcbiAgY29uc3RydWN0b3IocHVibGljIHRlbXBsYXRlUmVmOiBUZW1wbGF0ZVJlZjxOZ2JQYWdpbmF0aW9uTGlua0NvbnRleHQ+KSB7fVxufVxuXG4vKipcbiAqIEEgZGlyZWN0aXZlIHRvIG1hdGNoIHRoZSBwYWdlICdudW1iZXInIGxpbmsgdGVtcGxhdGVcbiAqXG4gKiBAc2luY2UgNC4xLjBcbiAqL1xuQERpcmVjdGl2ZSh7c2VsZWN0b3I6ICduZy10ZW1wbGF0ZVtuZ2JQYWdpbmF0aW9uTnVtYmVyXSd9KVxuZXhwb3J0IGNsYXNzIE5nYlBhZ2luYXRpb25OdW1iZXIge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgdGVtcGxhdGVSZWY6IFRlbXBsYXRlUmVmPE5nYlBhZ2luYXRpb25OdW1iZXJDb250ZXh0Pikge31cbn1cblxuLyoqXG4gKiBBIGRpcmVjdGl2ZSB0byBtYXRjaCB0aGUgJ3ByZXZpb3VzJyBsaW5rIHRlbXBsYXRlXG4gKlxuICogQHNpbmNlIDQuMS4wXG4gKi9cbkBEaXJlY3RpdmUoe3NlbGVjdG9yOiAnbmctdGVtcGxhdGVbbmdiUGFnaW5hdGlvblByZXZpb3VzXSd9KVxuZXhwb3J0IGNsYXNzIE5nYlBhZ2luYXRpb25QcmV2aW91cyB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB0ZW1wbGF0ZVJlZjogVGVtcGxhdGVSZWY8TmdiUGFnaW5hdGlvbkxpbmtDb250ZXh0Pikge31cbn1cblxuLyoqXG4gKiBBIGNvbXBvbmVudCB0aGF0IGRpc3BsYXlzIHBhZ2UgbnVtYmVycyBhbmQgYWxsb3dzIHRvIGN1c3RvbWl6ZSB0aGVtIGluIHNldmVyYWwgd2F5cy5cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbmdiLXBhZ2luYXRpb24nLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgaG9zdDogeydyb2xlJzogJ25hdmlnYXRpb24nfSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8bmctdGVtcGxhdGUgI2ZpcnN0PjxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIGkxOG49XCJAQG5nYi5wYWdpbmF0aW9uLmZpcnN0XCI+JmxhcXVvOyZsYXF1bzs8L3NwYW4+PC9uZy10ZW1wbGF0ZT5cbiAgICA8bmctdGVtcGxhdGUgI3ByZXZpb3VzPjxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIGkxOG49XCJAQG5nYi5wYWdpbmF0aW9uLnByZXZpb3VzXCI+JmxhcXVvOzwvc3Bhbj48L25nLXRlbXBsYXRlPlxuICAgIDxuZy10ZW1wbGF0ZSAjbmV4dD48c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIiBpMThuPVwiQEBuZ2IucGFnaW5hdGlvbi5uZXh0XCI+JnJhcXVvOzwvc3Bhbj48L25nLXRlbXBsYXRlPlxuICAgIDxuZy10ZW1wbGF0ZSAjbGFzdD48c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIiBpMThuPVwiQEBuZ2IucGFnaW5hdGlvbi5sYXN0XCI+JnJhcXVvOyZyYXF1bzs8L3NwYW4+PC9uZy10ZW1wbGF0ZT5cbiAgICA8bmctdGVtcGxhdGUgI2VsbGlwc2lzPi4uLjwvbmctdGVtcGxhdGU+XG4gICAgPG5nLXRlbXBsYXRlICNkZWZhdWx0TnVtYmVyIGxldC1wYWdlIGxldC1jdXJyZW50UGFnZT1cImN1cnJlbnRQYWdlXCI+XG4gICAgICB7eyBwYWdlIH19XG4gICAgICA8c3BhbiAqbmdJZj1cInBhZ2UgPT09IGN1cnJlbnRQYWdlXCIgY2xhc3M9XCJzci1vbmx5XCI+KGN1cnJlbnQpPC9zcGFuPlxuICAgIDwvbmctdGVtcGxhdGU+XG4gICAgPHVsIFtjbGFzc109XCIncGFnaW5hdGlvbicgKyAoc2l6ZSA/ICcgcGFnaW5hdGlvbi0nICsgc2l6ZSA6ICcnKVwiPlxuICAgICAgPGxpICpuZ0lmPVwiYm91bmRhcnlMaW5rc1wiIGNsYXNzPVwicGFnZS1pdGVtXCJcbiAgICAgICAgW2NsYXNzLmRpc2FibGVkXT1cInByZXZpb3VzRGlzYWJsZWQoKVwiPlxuICAgICAgICA8YSBhcmlhLWxhYmVsPVwiRmlyc3RcIiBpMThuLWFyaWEtbGFiZWw9XCJAQG5nYi5wYWdpbmF0aW9uLmZpcnN0LWFyaWFcIiBjbGFzcz1cInBhZ2UtbGlua1wiIGhyZWZcbiAgICAgICAgICAoY2xpY2spPVwic2VsZWN0UGFnZSgxKTsgJGV2ZW50LnByZXZlbnREZWZhdWx0KClcIiBbYXR0ci50YWJpbmRleF09XCIoaGFzUHJldmlvdXMoKSA/IG51bGwgOiAnLTEnKVwiPlxuICAgICAgICAgIDxuZy10ZW1wbGF0ZSBbbmdUZW1wbGF0ZU91dGxldF09XCJ0cGxGaXJzdD8udGVtcGxhdGVSZWYgfHwgZmlyc3RcIlxuICAgICAgICAgICAgICAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwie2Rpc2FibGVkOiBwcmV2aW91c0Rpc2FibGVkKCksIGN1cnJlbnRQYWdlOiBwYWdlfVwiPjwvbmctdGVtcGxhdGU+XG4gICAgICAgIDwvYT5cbiAgICAgIDwvbGk+XG5cbiAgICAgIDxsaSAqbmdJZj1cImRpcmVjdGlvbkxpbmtzXCIgY2xhc3M9XCJwYWdlLWl0ZW1cIlxuICAgICAgICBbY2xhc3MuZGlzYWJsZWRdPVwicHJldmlvdXNEaXNhYmxlZCgpXCI+XG4gICAgICAgIDxhIGFyaWEtbGFiZWw9XCJQcmV2aW91c1wiIGkxOG4tYXJpYS1sYWJlbD1cIkBAbmdiLnBhZ2luYXRpb24ucHJldmlvdXMtYXJpYVwiIGNsYXNzPVwicGFnZS1saW5rXCIgaHJlZlxuICAgICAgICAgIChjbGljayk9XCJzZWxlY3RQYWdlKHBhZ2UtMSk7ICRldmVudC5wcmV2ZW50RGVmYXVsdCgpXCIgW2F0dHIudGFiaW5kZXhdPVwiKGhhc1ByZXZpb3VzKCkgPyBudWxsIDogJy0xJylcIj5cbiAgICAgICAgICA8bmctdGVtcGxhdGUgW25nVGVtcGxhdGVPdXRsZXRdPVwidHBsUHJldmlvdXM/LnRlbXBsYXRlUmVmIHx8IHByZXZpb3VzXCJcbiAgICAgICAgICAgICAgICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cIntkaXNhYmxlZDogcHJldmlvdXNEaXNhYmxlZCgpfVwiPjwvbmctdGVtcGxhdGU+XG4gICAgICAgIDwvYT5cbiAgICAgIDwvbGk+XG4gICAgICA8bGkgKm5nRm9yPVwibGV0IHBhZ2VOdW1iZXIgb2YgcGFnZXNcIiBjbGFzcz1cInBhZ2UtaXRlbVwiIFtjbGFzcy5hY3RpdmVdPVwicGFnZU51bWJlciA9PT0gcGFnZVwiXG4gICAgICAgIFtjbGFzcy5kaXNhYmxlZF09XCJpc0VsbGlwc2lzKHBhZ2VOdW1iZXIpIHx8IGRpc2FibGVkXCI+XG4gICAgICAgIDxhICpuZ0lmPVwiaXNFbGxpcHNpcyhwYWdlTnVtYmVyKVwiIGNsYXNzPVwicGFnZS1saW5rXCI+XG4gICAgICAgICAgPG5nLXRlbXBsYXRlIFtuZ1RlbXBsYXRlT3V0bGV0XT1cInRwbEVsbGlwc2lzPy50ZW1wbGF0ZVJlZiB8fCBlbGxpcHNpc1wiXG4gICAgICAgICAgICAgICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7ZGlzYWJsZWQ6IHRydWUsIGN1cnJlbnRQYWdlOiBwYWdlfVwiPjwvbmctdGVtcGxhdGU+XG4gICAgICAgIDwvYT5cbiAgICAgICAgPGEgKm5nSWY9XCIhaXNFbGxpcHNpcyhwYWdlTnVtYmVyKVwiIGNsYXNzPVwicGFnZS1saW5rXCIgaHJlZiAoY2xpY2spPVwic2VsZWN0UGFnZShwYWdlTnVtYmVyKTsgJGV2ZW50LnByZXZlbnREZWZhdWx0KClcIj5cbiAgICAgICAgICA8bmctdGVtcGxhdGUgW25nVGVtcGxhdGVPdXRsZXRdPVwidHBsTnVtYmVyPy50ZW1wbGF0ZVJlZiB8fCBkZWZhdWx0TnVtYmVyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cIntkaXNhYmxlZDogZGlzYWJsZWQsICRpbXBsaWNpdDogcGFnZU51bWJlciwgY3VycmVudFBhZ2U6IHBhZ2V9XCI+PC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgPC9hPlxuICAgICAgPC9saT5cbiAgICAgIDxsaSAqbmdJZj1cImRpcmVjdGlvbkxpbmtzXCIgY2xhc3M9XCJwYWdlLWl0ZW1cIiBbY2xhc3MuZGlzYWJsZWRdPVwibmV4dERpc2FibGVkKClcIj5cbiAgICAgICAgPGEgYXJpYS1sYWJlbD1cIk5leHRcIiBpMThuLWFyaWEtbGFiZWw9XCJAQG5nYi5wYWdpbmF0aW9uLm5leHQtYXJpYVwiIGNsYXNzPVwicGFnZS1saW5rXCIgaHJlZlxuICAgICAgICAgIChjbGljayk9XCJzZWxlY3RQYWdlKHBhZ2UrMSk7ICRldmVudC5wcmV2ZW50RGVmYXVsdCgpXCIgW2F0dHIudGFiaW5kZXhdPVwiKGhhc05leHQoKSA/IG51bGwgOiAnLTEnKVwiPlxuICAgICAgICAgIDxuZy10ZW1wbGF0ZSBbbmdUZW1wbGF0ZU91dGxldF09XCJ0cGxOZXh0Py50ZW1wbGF0ZVJlZiB8fCBuZXh0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cIntkaXNhYmxlZDogbmV4dERpc2FibGVkKCksIGN1cnJlbnRQYWdlOiBwYWdlfVwiPjwvbmctdGVtcGxhdGU+XG4gICAgICAgIDwvYT5cbiAgICAgIDwvbGk+XG5cbiAgICAgIDxsaSAqbmdJZj1cImJvdW5kYXJ5TGlua3NcIiBjbGFzcz1cInBhZ2UtaXRlbVwiIFtjbGFzcy5kaXNhYmxlZF09XCJuZXh0RGlzYWJsZWQoKVwiPlxuICAgICAgICA8YSBhcmlhLWxhYmVsPVwiTGFzdFwiIGkxOG4tYXJpYS1sYWJlbD1cIkBAbmdiLnBhZ2luYXRpb24ubGFzdC1hcmlhXCIgY2xhc3M9XCJwYWdlLWxpbmtcIiBocmVmXG4gICAgICAgICAgKGNsaWNrKT1cInNlbGVjdFBhZ2UocGFnZUNvdW50KTsgJGV2ZW50LnByZXZlbnREZWZhdWx0KClcIiBbYXR0ci50YWJpbmRleF09XCIoaGFzTmV4dCgpID8gbnVsbCA6ICctMScpXCI+XG4gICAgICAgICAgPG5nLXRlbXBsYXRlIFtuZ1RlbXBsYXRlT3V0bGV0XT1cInRwbExhc3Q/LnRlbXBsYXRlUmVmIHx8IGxhc3RcIlxuICAgICAgICAgICAgICAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwie2Rpc2FibGVkOiBuZXh0RGlzYWJsZWQoKSwgY3VycmVudFBhZ2U6IHBhZ2V9XCI+PC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgPC9hPlxuICAgICAgPC9saT5cbiAgICA8L3VsPlxuICBgXG59KVxuZXhwb3J0IGNsYXNzIE5nYlBhZ2luYXRpb24gaW1wbGVtZW50cyBPbkNoYW5nZXMge1xuICBwYWdlQ291bnQgPSAwO1xuICBwYWdlczogbnVtYmVyW10gPSBbXTtcblxuICBAQ29udGVudENoaWxkKE5nYlBhZ2luYXRpb25FbGxpcHNpcykgdHBsRWxsaXBzaXM6IE5nYlBhZ2luYXRpb25FbGxpcHNpcztcbiAgQENvbnRlbnRDaGlsZChOZ2JQYWdpbmF0aW9uRmlyc3QpIHRwbEZpcnN0OiBOZ2JQYWdpbmF0aW9uRmlyc3Q7XG4gIEBDb250ZW50Q2hpbGQoTmdiUGFnaW5hdGlvbkxhc3QpIHRwbExhc3Q6IE5nYlBhZ2luYXRpb25MYXN0O1xuICBAQ29udGVudENoaWxkKE5nYlBhZ2luYXRpb25OZXh0KSB0cGxOZXh0OiBOZ2JQYWdpbmF0aW9uTmV4dDtcbiAgQENvbnRlbnRDaGlsZChOZ2JQYWdpbmF0aW9uTnVtYmVyKSB0cGxOdW1iZXI6IE5nYlBhZ2luYXRpb25OdW1iZXI7XG4gIEBDb250ZW50Q2hpbGQoTmdiUGFnaW5hdGlvblByZXZpb3VzKSB0cGxQcmV2aW91czogTmdiUGFnaW5hdGlvblByZXZpb3VzO1xuXG4gIC8qKlxuICAgKiBJZiBgdHJ1ZWAsIHBhZ2luYXRpb24gbGlua3Mgd2lsbCBiZSBkaXNhYmxlZC5cbiAgICovXG4gIEBJbnB1dCgpIGRpc2FibGVkOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBJZiBgdHJ1ZWAsIHRoZSBcIkZpcnN0XCIgYW5kIFwiTGFzdFwiIHBhZ2UgbGlua3MgYXJlIHNob3duLlxuICAgKi9cbiAgQElucHV0KCkgYm91bmRhcnlMaW5rczogYm9vbGVhbjtcblxuICAvKipcbiAgICogSWYgYHRydWVgLCB0aGUgXCJOZXh0XCIgYW5kIFwiUHJldmlvdXNcIiBwYWdlIGxpbmtzIGFyZSBzaG93bi5cbiAgICovXG4gIEBJbnB1dCgpIGRpcmVjdGlvbkxpbmtzOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBJZiBgdHJ1ZWAsIHRoZSBlbGxpcHNpcyBzeW1ib2xzIGFuZCBmaXJzdC9sYXN0IHBhZ2UgbnVtYmVycyB3aWxsIGJlIHNob3duIHdoZW4gYG1heFNpemVgID4gbnVtYmVyIG9mIHBhZ2VzLlxuICAgKi9cbiAgQElucHV0KCkgZWxsaXBzZXM6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gcm90YXRlIHBhZ2VzIHdoZW4gYG1heFNpemVgID4gbnVtYmVyIG9mIHBhZ2VzLlxuICAgKlxuICAgKiBUaGUgY3VycmVudCBwYWdlIGFsd2F5cyBzdGF5cyBpbiB0aGUgbWlkZGxlIGlmIGB0cnVlYC5cbiAgICovXG4gIEBJbnB1dCgpIHJvdGF0ZTogYm9vbGVhbjtcblxuICAvKipcbiAgICogIFRoZSBudW1iZXIgb2YgaXRlbXMgaW4geW91ciBwYWdpbmF0ZWQgY29sbGVjdGlvbi5cbiAgICpcbiAgICogIE5vdGUsIHRoYXQgdGhpcyBpcyBub3QgdGhlIG51bWJlciBvZiBwYWdlcy4gUGFnZSBudW1iZXJzIGFyZSBjYWxjdWxhdGVkIGR5bmFtaWNhbGx5IGJhc2VkIG9uXG4gICAqICBgY29sbGVjdGlvblNpemVgIGFuZCBgcGFnZVNpemVgLiBFeC4gaWYgeW91IGhhdmUgMTAwIGl0ZW1zIGluIHlvdXIgY29sbGVjdGlvbiBhbmQgZGlzcGxheWluZyAyMCBpdGVtcyBwZXIgcGFnZSxcbiAgICogIHlvdSdsbCBlbmQgdXAgd2l0aCA1IHBhZ2VzLlxuICAgKi9cbiAgQElucHV0KCkgY29sbGVjdGlvblNpemU6IG51bWJlcjtcblxuICAvKipcbiAgICogIFRoZSBtYXhpbXVtIG51bWJlciBvZiBwYWdlcyB0byBkaXNwbGF5LlxuICAgKi9cbiAgQElucHV0KCkgbWF4U2l6ZTogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiAgVGhlIGN1cnJlbnQgcGFnZS5cbiAgICpcbiAgICogIFBhZ2UgbnVtYmVycyBzdGFydCB3aXRoIGAxYC5cbiAgICovXG4gIEBJbnB1dCgpIHBhZ2UgPSAxO1xuXG4gIC8qKlxuICAgKiAgVGhlIG51bWJlciBvZiBpdGVtcyBwZXIgcGFnZS5cbiAgICovXG4gIEBJbnB1dCgpIHBhZ2VTaXplOiBudW1iZXI7XG5cbiAgLyoqXG4gICAqICBBbiBldmVudCBmaXJlZCB3aGVuIHRoZSBwYWdlIGlzIGNoYW5nZWQuIFdpbGwgZmlyZSBvbmx5IGlmIGNvbGxlY3Rpb24gc2l6ZSBpcyBzZXQgYW5kIGFsbCB2YWx1ZXMgYXJlIHZhbGlkLlxuICAgKlxuICAgKiAgRXZlbnQgcGF5bG9hZCBpcyB0aGUgbnVtYmVyIG9mIHRoZSBuZXdseSBzZWxlY3RlZCBwYWdlLlxuICAgKlxuICAgKiAgUGFnZSBudW1iZXJzIHN0YXJ0IHdpdGggYDFgLlxuICAgKi9cbiAgQE91dHB1dCgpIHBhZ2VDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPG51bWJlcj4odHJ1ZSk7XG5cbiAgLyoqXG4gICAqIFRoZSBwYWdpbmF0aW9uIGRpc3BsYXkgc2l6ZS5cbiAgICpcbiAgICogQm9vdHN0cmFwIGN1cnJlbnRseSBzdXBwb3J0cyBzbWFsbCBhbmQgbGFyZ2Ugc2l6ZXMuXG4gICAqL1xuICBASW5wdXQoKSBzaXplOiAnc20nIHwgJ2xnJztcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IE5nYlBhZ2luYXRpb25Db25maWcpIHtcbiAgICB0aGlzLmRpc2FibGVkID0gY29uZmlnLmRpc2FibGVkO1xuICAgIHRoaXMuYm91bmRhcnlMaW5rcyA9IGNvbmZpZy5ib3VuZGFyeUxpbmtzO1xuICAgIHRoaXMuZGlyZWN0aW9uTGlua3MgPSBjb25maWcuZGlyZWN0aW9uTGlua3M7XG4gICAgdGhpcy5lbGxpcHNlcyA9IGNvbmZpZy5lbGxpcHNlcztcbiAgICB0aGlzLm1heFNpemUgPSBjb25maWcubWF4U2l6ZTtcbiAgICB0aGlzLnBhZ2VTaXplID0gY29uZmlnLnBhZ2VTaXplO1xuICAgIHRoaXMucm90YXRlID0gY29uZmlnLnJvdGF0ZTtcbiAgICB0aGlzLnNpemUgPSBjb25maWcuc2l6ZTtcbiAgfVxuXG4gIGhhc1ByZXZpb3VzKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5wYWdlID4gMTsgfVxuXG4gIGhhc05leHQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLnBhZ2UgPCB0aGlzLnBhZ2VDb3VudDsgfVxuXG4gIG5leHREaXNhYmxlZCgpOiBib29sZWFuIHsgcmV0dXJuICF0aGlzLmhhc05leHQoKSB8fCB0aGlzLmRpc2FibGVkOyB9XG5cbiAgcHJldmlvdXNEaXNhYmxlZCgpOiBib29sZWFuIHsgcmV0dXJuICF0aGlzLmhhc1ByZXZpb3VzKCkgfHwgdGhpcy5kaXNhYmxlZDsgfVxuXG4gIHNlbGVjdFBhZ2UocGFnZU51bWJlcjogbnVtYmVyKTogdm9pZCB7IHRoaXMuX3VwZGF0ZVBhZ2VzKHBhZ2VOdW1iZXIpOyB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQgeyB0aGlzLl91cGRhdGVQYWdlcyh0aGlzLnBhZ2UpOyB9XG5cbiAgaXNFbGxpcHNpcyhwYWdlTnVtYmVyKTogYm9vbGVhbiB7IHJldHVybiBwYWdlTnVtYmVyID09PSAtMTsgfVxuXG4gIC8qKlxuICAgKiBBcHBlbmRzIGVsbGlwc2VzIGFuZCBmaXJzdC9sYXN0IHBhZ2UgbnVtYmVyIHRvIHRoZSBkaXNwbGF5ZWQgcGFnZXNcbiAgICovXG4gIHByaXZhdGUgX2FwcGx5RWxsaXBzZXMoc3RhcnQ6IG51bWJlciwgZW5kOiBudW1iZXIpIHtcbiAgICBpZiAodGhpcy5lbGxpcHNlcykge1xuICAgICAgaWYgKHN0YXJ0ID4gMCkge1xuICAgICAgICBpZiAoc3RhcnQgPiAxKSB7XG4gICAgICAgICAgdGhpcy5wYWdlcy51bnNoaWZ0KC0xKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBhZ2VzLnVuc2hpZnQoMSk7XG4gICAgICB9XG4gICAgICBpZiAoZW5kIDwgdGhpcy5wYWdlQ291bnQpIHtcbiAgICAgICAgaWYgKGVuZCA8ICh0aGlzLnBhZ2VDb3VudCAtIDEpKSB7XG4gICAgICAgICAgdGhpcy5wYWdlcy5wdXNoKC0xKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBhZ2VzLnB1c2godGhpcy5wYWdlQ291bnQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSb3RhdGVzIHBhZ2UgbnVtYmVycyBiYXNlZCBvbiBtYXhTaXplIGl0ZW1zIHZpc2libGUuXG4gICAqIEN1cnJlbnRseSBzZWxlY3RlZCBwYWdlIHN0YXlzIGluIHRoZSBtaWRkbGU6XG4gICAqXG4gICAqIEV4LiBmb3Igc2VsZWN0ZWQgcGFnZSA9IDY6XG4gICAqIFs1LCo2Kiw3XSBmb3IgbWF4U2l6ZSA9IDNcbiAgICogWzQsNSwqNiosN10gZm9yIG1heFNpemUgPSA0XG4gICAqL1xuICBwcml2YXRlIF9hcHBseVJvdGF0aW9uKCk6IFtudW1iZXIsIG51bWJlcl0ge1xuICAgIGxldCBzdGFydCA9IDA7XG4gICAgbGV0IGVuZCA9IHRoaXMucGFnZUNvdW50O1xuICAgIGxldCBsZWZ0T2Zmc2V0ID0gTWF0aC5mbG9vcih0aGlzLm1heFNpemUgLyAyKTtcbiAgICBsZXQgcmlnaHRPZmZzZXQgPSB0aGlzLm1heFNpemUgJSAyID09PSAwID8gbGVmdE9mZnNldCAtIDEgOiBsZWZ0T2Zmc2V0O1xuXG4gICAgaWYgKHRoaXMucGFnZSA8PSBsZWZ0T2Zmc2V0KSB7XG4gICAgICAvLyB2ZXJ5IGJlZ2lubmluZywgbm8gcm90YXRpb24gLT4gWzAuLm1heFNpemVdXG4gICAgICBlbmQgPSB0aGlzLm1heFNpemU7XG4gICAgfSBlbHNlIGlmICh0aGlzLnBhZ2VDb3VudCAtIHRoaXMucGFnZSA8IGxlZnRPZmZzZXQpIHtcbiAgICAgIC8vIHZlcnkgZW5kLCBubyByb3RhdGlvbiAtPiBbbGVuLW1heFNpemUuLmxlbl1cbiAgICAgIHN0YXJ0ID0gdGhpcy5wYWdlQ291bnQgLSB0aGlzLm1heFNpemU7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHJvdGF0ZVxuICAgICAgc3RhcnQgPSB0aGlzLnBhZ2UgLSBsZWZ0T2Zmc2V0IC0gMTtcbiAgICAgIGVuZCA9IHRoaXMucGFnZSArIHJpZ2h0T2Zmc2V0O1xuICAgIH1cblxuICAgIHJldHVybiBbc3RhcnQsIGVuZF07XG4gIH1cblxuICAvKipcbiAgICogUGFnaW5hdGVzIHBhZ2UgbnVtYmVycyBiYXNlZCBvbiBtYXhTaXplIGl0ZW1zIHBlciBwYWdlLlxuICAgKi9cbiAgcHJpdmF0ZSBfYXBwbHlQYWdpbmF0aW9uKCk6IFtudW1iZXIsIG51bWJlcl0ge1xuICAgIGxldCBwYWdlID0gTWF0aC5jZWlsKHRoaXMucGFnZSAvIHRoaXMubWF4U2l6ZSkgLSAxO1xuICAgIGxldCBzdGFydCA9IHBhZ2UgKiB0aGlzLm1heFNpemU7XG4gICAgbGV0IGVuZCA9IHN0YXJ0ICsgdGhpcy5tYXhTaXplO1xuXG4gICAgcmV0dXJuIFtzdGFydCwgZW5kXTtcbiAgfVxuXG4gIHByaXZhdGUgX3NldFBhZ2VJblJhbmdlKG5ld1BhZ2VObykge1xuICAgIGNvbnN0IHByZXZQYWdlTm8gPSB0aGlzLnBhZ2U7XG4gICAgdGhpcy5wYWdlID0gZ2V0VmFsdWVJblJhbmdlKG5ld1BhZ2VObywgdGhpcy5wYWdlQ291bnQsIDEpO1xuXG4gICAgaWYgKHRoaXMucGFnZSAhPT0gcHJldlBhZ2VObyAmJiBpc051bWJlcih0aGlzLmNvbGxlY3Rpb25TaXplKSkge1xuICAgICAgdGhpcy5wYWdlQ2hhbmdlLmVtaXQodGhpcy5wYWdlKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF91cGRhdGVQYWdlcyhuZXdQYWdlOiBudW1iZXIpIHtcbiAgICB0aGlzLnBhZ2VDb3VudCA9IE1hdGguY2VpbCh0aGlzLmNvbGxlY3Rpb25TaXplIC8gdGhpcy5wYWdlU2l6ZSk7XG5cbiAgICBpZiAoIWlzTnVtYmVyKHRoaXMucGFnZUNvdW50KSkge1xuICAgICAgdGhpcy5wYWdlQ291bnQgPSAwO1xuICAgIH1cblxuICAgIC8vIGZpbGwtaW4gbW9kZWwgbmVlZGVkIHRvIHJlbmRlciBwYWdlc1xuICAgIHRoaXMucGFnZXMubGVuZ3RoID0gMDtcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8PSB0aGlzLnBhZ2VDb3VudDsgaSsrKSB7XG4gICAgICB0aGlzLnBhZ2VzLnB1c2goaSk7XG4gICAgfVxuXG4gICAgLy8gc2V0IHBhZ2Ugd2l0aGluIDEuLm1heCByYW5nZVxuICAgIHRoaXMuX3NldFBhZ2VJblJhbmdlKG5ld1BhZ2UpO1xuXG4gICAgLy8gYXBwbHkgbWF4U2l6ZSBpZiBuZWNlc3NhcnlcbiAgICBpZiAodGhpcy5tYXhTaXplID4gMCAmJiB0aGlzLnBhZ2VDb3VudCA+IHRoaXMubWF4U2l6ZSkge1xuICAgICAgbGV0IHN0YXJ0ID0gMDtcbiAgICAgIGxldCBlbmQgPSB0aGlzLnBhZ2VDb3VudDtcblxuICAgICAgLy8gZWl0aGVyIHBhZ2luYXRpbmcgb3Igcm90YXRpbmcgcGFnZSBudW1iZXJzXG4gICAgICBpZiAodGhpcy5yb3RhdGUpIHtcbiAgICAgICAgW3N0YXJ0LCBlbmRdID0gdGhpcy5fYXBwbHlSb3RhdGlvbigpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgW3N0YXJ0LCBlbmRdID0gdGhpcy5fYXBwbHlQYWdpbmF0aW9uKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMucGFnZXMgPSB0aGlzLnBhZ2VzLnNsaWNlKHN0YXJ0LCBlbmQpO1xuXG4gICAgICAvLyBhZGRpbmcgZWxsaXBzZXNcbiAgICAgIHRoaXMuX2FwcGx5RWxsaXBzZXMoc3RhcnQsIGVuZCk7XG4gICAgfVxuICB9XG59XG4iXX0=