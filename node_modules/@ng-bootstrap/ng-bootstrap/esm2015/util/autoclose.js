/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { fromEvent, race } from 'rxjs';
import { delay, filter, map, takeUntil, withLatestFrom } from 'rxjs/operators';
import { Key } from './key';
import { closest } from './util';
/** @type {?} */
const isContainedIn = (element, array) => array ? array.some(item => item.contains(element)) : false;
const ɵ0 = isContainedIn;
/** @type {?} */
const matchesSelectorIfAny = (element, selector) => !selector || closest(element, selector) != null;
const ɵ1 = matchesSelectorIfAny;
// we'll have to use 'touch' events instead of 'mouse' events on iOS and add a more significant delay
// to avoid re-opening when handling (click) on a toggling element
// TODO: use proper Angular platform detection when NgbAutoClose becomes a service and we can inject PLATFORM_ID
/** @type {?} */
let iOS = false;
if (typeof navigator !== 'undefined') {
    iOS = !!navigator.userAgent && /iPad|iPhone|iPod/.test(navigator.userAgent);
}
/**
 * @param {?} zone
 * @param {?} document
 * @param {?} type
 * @param {?} close
 * @param {?} closed$
 * @param {?} insideElements
 * @param {?=} ignoreElements
 * @param {?=} insideSelector
 * @return {?}
 */
export function ngbAutoClose(zone, document, type, close, closed$, insideElements, ignoreElements, insideSelector) {
    // closing on ESC and outside clicks
    if (type) {
        zone.runOutsideAngular(() => {
            /** @type {?} */
            const shouldCloseOnClick = (event) => {
                /** @type {?} */
                const element = (/** @type {?} */ (event.target));
                if ((event instanceof MouseEvent && event.button === 2) || isContainedIn(element, ignoreElements)) {
                    return false;
                }
                if (type === 'inside') {
                    return isContainedIn(element, insideElements) && matchesSelectorIfAny(element, insideSelector);
                }
                else if (type === 'outside') {
                    return !isContainedIn(element, insideElements);
                }
                else /* if (type === true) */ {
                    return matchesSelectorIfAny(element, insideSelector) || !isContainedIn(element, insideElements);
                }
            };
            /** @type {?} */
            const escapes$ = fromEvent(document, 'keydown')
                .pipe(takeUntil(closed$), 
            // tslint:disable-next-line:deprecation
            filter(e => e.which === Key.Escape));
            // we have to pre-calculate 'shouldCloseOnClick' on 'mousedown/touchstart',
            // because on 'mouseup/touchend' DOM nodes might be detached
            /** @type {?} */
            const mouseDowns$ = fromEvent(document, iOS ? 'touchstart' : 'mousedown')
                .pipe(map(shouldCloseOnClick), takeUntil(closed$));
            /** @type {?} */
            const closeableClicks$ = fromEvent(document, iOS ? 'touchend' : 'mouseup')
                .pipe(withLatestFrom(mouseDowns$), filter(([_, shouldClose]) => shouldClose), delay(iOS ? 16 : 0), takeUntil(closed$));
            race([escapes$, closeableClicks$]).subscribe(() => zone.run(close));
        });
    }
}
export { ɵ0, ɵ1 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b2Nsb3NlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvIiwic291cmNlcyI6WyJ1dGlsL2F1dG9jbG9zZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQ0EsT0FBTyxFQUFDLFNBQVMsRUFBYyxJQUFJLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDakQsT0FBTyxFQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxjQUFjLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUM3RSxPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sT0FBTyxDQUFDO0FBQzFCLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxRQUFRLENBQUM7O01BRXpCLGFBQWEsR0FBRyxDQUFDLE9BQW9CLEVBQUUsS0FBcUIsRUFBRSxFQUFFLENBQ2xFLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSzs7O01BRXhELG9CQUFvQixHQUFHLENBQUMsT0FBb0IsRUFBRSxRQUFpQixFQUFFLEVBQUUsQ0FDckUsQ0FBQyxRQUFRLElBQUksT0FBTyxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsSUFBSSxJQUFJOzs7Ozs7SUFLL0MsR0FBRyxHQUFHLEtBQUs7QUFDZixJQUFJLE9BQU8sU0FBUyxLQUFLLFdBQVcsRUFBRTtJQUNwQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxTQUFTLElBQUksa0JBQWtCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQztDQUM3RTs7Ozs7Ozs7Ozs7O0FBRUQsTUFBTSxVQUFVLFlBQVksQ0FDeEIsSUFBWSxFQUFFLFFBQWEsRUFBRSxJQUFvQyxFQUFFLEtBQWlCLEVBQUUsT0FBd0IsRUFDOUcsY0FBNkIsRUFBRSxjQUE4QixFQUFFLGNBQXVCO0lBQ3hGLG9DQUFvQztJQUNwQyxJQUFJLElBQUksRUFBRTtRQUNSLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUU7O2tCQUVwQixrQkFBa0IsR0FBRyxDQUFDLEtBQThCLEVBQUUsRUFBRTs7c0JBQ3RELE9BQU8sR0FBRyxtQkFBQSxLQUFLLENBQUMsTUFBTSxFQUFlO2dCQUMzQyxJQUFJLENBQUMsS0FBSyxZQUFZLFVBQVUsSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxJQUFJLGFBQWEsQ0FBQyxPQUFPLEVBQUUsY0FBYyxDQUFDLEVBQUU7b0JBQ2pHLE9BQU8sS0FBSyxDQUFDO2lCQUNkO2dCQUNELElBQUksSUFBSSxLQUFLLFFBQVEsRUFBRTtvQkFDckIsT0FBTyxhQUFhLENBQUMsT0FBTyxFQUFFLGNBQWMsQ0FBQyxJQUFJLG9CQUFvQixDQUFDLE9BQU8sRUFBRSxjQUFjLENBQUMsQ0FBQztpQkFDaEc7cUJBQU0sSUFBSSxJQUFJLEtBQUssU0FBUyxFQUFFO29CQUM3QixPQUFPLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxjQUFjLENBQUMsQ0FBQztpQkFDaEQ7cUJBQU0sd0JBQXdCLENBQUM7b0JBQzlCLE9BQU8sb0JBQW9CLENBQUMsT0FBTyxFQUFFLGNBQWMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxjQUFjLENBQUMsQ0FBQztpQkFDakc7WUFDSCxDQUFDOztrQkFFSyxRQUFRLEdBQUcsU0FBUyxDQUFnQixRQUFRLEVBQUUsU0FBUyxDQUFDO2lCQUN4QyxJQUFJLENBQ0QsU0FBUyxDQUFDLE9BQU8sQ0FBQztZQUNsQix1Q0FBdUM7WUFDdkMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssS0FBSyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7Ozs7a0JBS3ZELFdBQVcsR0FBRyxTQUFTLENBQWEsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUM7aUJBQzVELElBQUksQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsRUFBRSxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7O2tCQUVwRSxnQkFBZ0IsR0FBRyxTQUFTLENBQWEsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7aUJBQ3hELElBQUksQ0FDRCxjQUFjLENBQUMsV0FBVyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsV0FBVyxDQUFDLEVBQUUsRUFBRSxDQUFDLFdBQVcsQ0FBQyxFQUN0RSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUd6RSxJQUFJLENBQVEsQ0FBQyxRQUFRLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDN0UsQ0FBQyxDQUFDLENBQUM7S0FDSjtBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge05nWm9uZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge2Zyb21FdmVudCwgT2JzZXJ2YWJsZSwgcmFjZX0gZnJvbSAncnhqcyc7XG5pbXBvcnQge2RlbGF5LCBmaWx0ZXIsIG1hcCwgdGFrZVVudGlsLCB3aXRoTGF0ZXN0RnJvbX0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtLZXl9IGZyb20gJy4va2V5JztcbmltcG9ydCB7Y2xvc2VzdH0gZnJvbSAnLi91dGlsJztcblxuY29uc3QgaXNDb250YWluZWRJbiA9IChlbGVtZW50OiBIVE1MRWxlbWVudCwgYXJyYXk/OiBIVE1MRWxlbWVudFtdKSA9PlxuICAgIGFycmF5ID8gYXJyYXkuc29tZShpdGVtID0+IGl0ZW0uY29udGFpbnMoZWxlbWVudCkpIDogZmFsc2U7XG5cbmNvbnN0IG1hdGNoZXNTZWxlY3RvcklmQW55ID0gKGVsZW1lbnQ6IEhUTUxFbGVtZW50LCBzZWxlY3Rvcj86IHN0cmluZykgPT5cbiAgICAhc2VsZWN0b3IgfHwgY2xvc2VzdChlbGVtZW50LCBzZWxlY3RvcikgIT0gbnVsbDtcblxuLy8gd2UnbGwgaGF2ZSB0byB1c2UgJ3RvdWNoJyBldmVudHMgaW5zdGVhZCBvZiAnbW91c2UnIGV2ZW50cyBvbiBpT1MgYW5kIGFkZCBhIG1vcmUgc2lnbmlmaWNhbnQgZGVsYXlcbi8vIHRvIGF2b2lkIHJlLW9wZW5pbmcgd2hlbiBoYW5kbGluZyAoY2xpY2spIG9uIGEgdG9nZ2xpbmcgZWxlbWVudFxuLy8gVE9ETzogdXNlIHByb3BlciBBbmd1bGFyIHBsYXRmb3JtIGRldGVjdGlvbiB3aGVuIE5nYkF1dG9DbG9zZSBiZWNvbWVzIGEgc2VydmljZSBhbmQgd2UgY2FuIGluamVjdCBQTEFURk9STV9JRFxubGV0IGlPUyA9IGZhbHNlO1xuaWYgKHR5cGVvZiBuYXZpZ2F0b3IgIT09ICd1bmRlZmluZWQnKSB7XG4gIGlPUyA9ICEhbmF2aWdhdG9yLnVzZXJBZ2VudCAmJiAvaVBhZHxpUGhvbmV8aVBvZC8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5nYkF1dG9DbG9zZShcbiAgICB6b25lOiBOZ1pvbmUsIGRvY3VtZW50OiBhbnksIHR5cGU6IGJvb2xlYW4gfCAnaW5zaWRlJyB8ICdvdXRzaWRlJywgY2xvc2U6ICgpID0+IHZvaWQsIGNsb3NlZCQ6IE9ic2VydmFibGU8YW55PixcbiAgICBpbnNpZGVFbGVtZW50czogSFRNTEVsZW1lbnRbXSwgaWdub3JlRWxlbWVudHM/OiBIVE1MRWxlbWVudFtdLCBpbnNpZGVTZWxlY3Rvcj86IHN0cmluZykge1xuICAvLyBjbG9zaW5nIG9uIEVTQyBhbmQgb3V0c2lkZSBjbGlja3NcbiAgaWYgKHR5cGUpIHtcbiAgICB6b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcblxuICAgICAgY29uc3Qgc2hvdWxkQ2xvc2VPbkNsaWNrID0gKGV2ZW50OiBNb3VzZUV2ZW50IHwgVG91Y2hFdmVudCkgPT4ge1xuICAgICAgICBjb25zdCBlbGVtZW50ID0gZXZlbnQudGFyZ2V0IGFzIEhUTUxFbGVtZW50O1xuICAgICAgICBpZiAoKGV2ZW50IGluc3RhbmNlb2YgTW91c2VFdmVudCAmJiBldmVudC5idXR0b24gPT09IDIpIHx8IGlzQ29udGFpbmVkSW4oZWxlbWVudCwgaWdub3JlRWxlbWVudHMpKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlID09PSAnaW5zaWRlJykge1xuICAgICAgICAgIHJldHVybiBpc0NvbnRhaW5lZEluKGVsZW1lbnQsIGluc2lkZUVsZW1lbnRzKSAmJiBtYXRjaGVzU2VsZWN0b3JJZkFueShlbGVtZW50LCBpbnNpZGVTZWxlY3Rvcik7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ291dHNpZGUnKSB7XG4gICAgICAgICAgcmV0dXJuICFpc0NvbnRhaW5lZEluKGVsZW1lbnQsIGluc2lkZUVsZW1lbnRzKTtcbiAgICAgICAgfSBlbHNlIC8qIGlmICh0eXBlID09PSB0cnVlKSAqLyB7XG4gICAgICAgICAgcmV0dXJuIG1hdGNoZXNTZWxlY3RvcklmQW55KGVsZW1lbnQsIGluc2lkZVNlbGVjdG9yKSB8fCAhaXNDb250YWluZWRJbihlbGVtZW50LCBpbnNpZGVFbGVtZW50cyk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IGVzY2FwZXMkID0gZnJvbUV2ZW50PEtleWJvYXJkRXZlbnQ+KGRvY3VtZW50LCAna2V5ZG93bicpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAucGlwZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YWtlVW50aWwoY2xvc2VkJCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmRlcHJlY2F0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyKGUgPT4gZS53aGljaCA9PT0gS2V5LkVzY2FwZSkpO1xuXG5cbiAgICAgIC8vIHdlIGhhdmUgdG8gcHJlLWNhbGN1bGF0ZSAnc2hvdWxkQ2xvc2VPbkNsaWNrJyBvbiAnbW91c2Vkb3duL3RvdWNoc3RhcnQnLFxuICAgICAgLy8gYmVjYXVzZSBvbiAnbW91c2V1cC90b3VjaGVuZCcgRE9NIG5vZGVzIG1pZ2h0IGJlIGRldGFjaGVkXG4gICAgICBjb25zdCBtb3VzZURvd25zJCA9IGZyb21FdmVudDxNb3VzZUV2ZW50Pihkb2N1bWVudCwgaU9TID8gJ3RvdWNoc3RhcnQnIDogJ21vdXNlZG93bicpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucGlwZShtYXAoc2hvdWxkQ2xvc2VPbkNsaWNrKSwgdGFrZVVudGlsKGNsb3NlZCQpKTtcblxuICAgICAgY29uc3QgY2xvc2VhYmxlQ2xpY2tzJCA9IGZyb21FdmVudDxNb3VzZUV2ZW50Pihkb2N1bWVudCwgaU9TID8gJ3RvdWNoZW5kJyA6ICdtb3VzZXVwJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnBpcGUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXRoTGF0ZXN0RnJvbShtb3VzZURvd25zJCksIGZpbHRlcigoW18sIHNob3VsZENsb3NlXSkgPT4gc2hvdWxkQ2xvc2UpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsYXkoaU9TID8gMTYgOiAwKSwgdGFrZVVudGlsKGNsb3NlZCQpKTtcblxuXG4gICAgICByYWNlPEV2ZW50PihbZXNjYXBlcyQsIGNsb3NlYWJsZUNsaWNrcyRdKS5zdWJzY3JpYmUoKCkgPT4gem9uZS5ydW4oY2xvc2UpKTtcbiAgICB9KTtcbiAgfVxufVxuIl19