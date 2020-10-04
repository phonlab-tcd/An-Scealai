/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { NgbDate } from './ngb-date';
import { isDefined } from '../util/util';
/**
 * @param {?} prev
 * @param {?} next
 * @return {?}
 */
export function isChangedDate(prev, next) {
    return !dateComparator(prev, next);
}
/**
 * @param {?} prev
 * @param {?} next
 * @return {?}
 */
export function isChangedMonth(prev, next) {
    return !prev && !next ? false : !prev || !next ? true : prev.year !== next.year || prev.month !== next.month;
}
/**
 * @param {?} prev
 * @param {?} next
 * @return {?}
 */
export function dateComparator(prev, next) {
    return (!prev && !next) || (!!prev && !!next && prev.equals(next));
}
/**
 * @param {?} minDate
 * @param {?} maxDate
 * @return {?}
 */
export function checkMinBeforeMax(minDate, maxDate) {
    if (maxDate && minDate && maxDate.before(minDate)) {
        throw new Error("'maxDate' " + maxDate + " should be greater than 'minDate' " + minDate);
    }
}
/**
 * @param {?} date
 * @param {?} minDate
 * @param {?} maxDate
 * @return {?}
 */
export function checkDateInRange(date, minDate, maxDate) {
    if (date && minDate && date.before(minDate)) {
        return minDate;
    }
    if (date && maxDate && date.after(maxDate)) {
        return maxDate;
    }
    return date;
}
/**
 * @param {?} date
 * @param {?} state
 * @return {?}
 */
export function isDateSelectable(date, state) {
    var minDate = state.minDate, maxDate = state.maxDate, disabled = state.disabled, markDisabled = state.markDisabled;
    // clang-format off
    return !(!isDefined(date) ||
        disabled ||
        (markDisabled && markDisabled(date, { year: date.year, month: date.month })) ||
        (minDate && date.before(minDate)) ||
        (maxDate && date.after(maxDate)));
    // clang-format on
}
/**
 * @param {?} calendar
 * @param {?} date
 * @param {?} minDate
 * @param {?} maxDate
 * @return {?}
 */
export function generateSelectBoxMonths(calendar, date, minDate, maxDate) {
    if (!date) {
        return [];
    }
    /** @type {?} */
    var months = calendar.getMonths(date.year);
    if (minDate && date.year === minDate.year) {
        /** @type {?} */
        var index = months.findIndex(function (month) { return month === minDate.month; });
        months = months.slice(index);
    }
    if (maxDate && date.year === maxDate.year) {
        /** @type {?} */
        var index = months.findIndex(function (month) { return month === maxDate.month; });
        months = months.slice(0, index + 1);
    }
    return months;
}
/**
 * @param {?} date
 * @param {?} minDate
 * @param {?} maxDate
 * @return {?}
 */
export function generateSelectBoxYears(date, minDate, maxDate) {
    if (!date) {
        return [];
    }
    /** @type {?} */
    var start = minDate && minDate.year || date.year - 10;
    /** @type {?} */
    var end = maxDate && maxDate.year || date.year + 10;
    return Array.from({ length: end - start + 1 }, function (e, i) { return start + i; });
}
/**
 * @param {?} calendar
 * @param {?} date
 * @param {?} maxDate
 * @return {?}
 */
export function nextMonthDisabled(calendar, date, maxDate) {
    return maxDate && calendar.getNext(date, 'm').after(maxDate);
}
/**
 * @param {?} calendar
 * @param {?} date
 * @param {?} minDate
 * @return {?}
 */
export function prevMonthDisabled(calendar, date, minDate) {
    /** @type {?} */
    var prevDate = calendar.getPrev(date, 'm');
    return minDate && (prevDate.year === minDate.year && prevDate.month < minDate.month ||
        prevDate.year < minDate.year && minDate.month === 1);
}
/**
 * @param {?} calendar
 * @param {?} date
 * @param {?} state
 * @param {?} i18n
 * @param {?} force
 * @return {?}
 */
export function buildMonths(calendar, date, state, i18n, force) {
    var displayMonths = state.displayMonths, months = state.months;
    // move old months to a temporary array
    /** @type {?} */
    var monthsToReuse = months.splice(0, months.length);
    // generate new first dates, nullify or reuse months
    /** @type {?} */
    var firstDates = Array.from({ length: displayMonths }, function (_, i) {
        /** @type {?} */
        var firstDate = calendar.getNext(date, 'm', i);
        months[i] = null;
        if (!force) {
            /** @type {?} */
            var reusedIndex = monthsToReuse.findIndex(function (month) { return month.firstDate.equals(firstDate); });
            // move reused month back to months
            if (reusedIndex !== -1) {
                months[i] = monthsToReuse.splice(reusedIndex, 1)[0];
            }
        }
        return firstDate;
    });
    // rebuild nullified months
    firstDates.forEach(function (firstDate, i) {
        if (months[i] === null) {
            months[i] = buildMonth(calendar, firstDate, state, i18n, monthsToReuse.shift() || (/** @type {?} */ ({})));
        }
    });
    return months;
}
/**
 * @param {?} calendar
 * @param {?} date
 * @param {?} state
 * @param {?} i18n
 * @param {?=} month
 * @return {?}
 */
export function buildMonth(calendar, date, state, i18n, month) {
    if (month === void 0) { month = (/** @type {?} */ ({})); }
    var dayTemplateData = state.dayTemplateData, minDate = state.minDate, maxDate = state.maxDate, firstDayOfWeek = state.firstDayOfWeek, markDisabled = state.markDisabled, outsideDays = state.outsideDays;
    /** @type {?} */
    var calendarToday = calendar.getToday();
    month.firstDate = null;
    month.lastDate = null;
    month.number = date.month;
    month.year = date.year;
    month.weeks = month.weeks || [];
    month.weekdays = month.weekdays || [];
    date = getFirstViewDate(calendar, date, firstDayOfWeek);
    // month has weeks
    for (var week = 0; week < calendar.getWeeksPerMonth(); week++) {
        /** @type {?} */
        var weekObject = month.weeks[week];
        if (!weekObject) {
            weekObject = month.weeks[week] = { number: 0, days: [], collapsed: true };
        }
        /** @type {?} */
        var days = weekObject.days;
        // week has days
        for (var day = 0; day < calendar.getDaysPerWeek(); day++) {
            if (week === 0) {
                month.weekdays[day] = calendar.getWeekday(date);
            }
            /** @type {?} */
            var newDate = new NgbDate(date.year, date.month, date.day);
            /** @type {?} */
            var nextDate = calendar.getNext(newDate);
            /** @type {?} */
            var ariaLabel = i18n.getDayAriaLabel(newDate);
            // marking date as disabled
            /** @type {?} */
            var disabled = !!((minDate && newDate.before(minDate)) || (maxDate && newDate.after(maxDate)));
            if (!disabled && markDisabled) {
                disabled = markDisabled(newDate, { month: month.number, year: month.year });
            }
            // today
            /** @type {?} */
            var today = newDate.equals(calendarToday);
            // adding user-provided data to the context
            /** @type {?} */
            var contextUserData = dayTemplateData ? dayTemplateData(newDate, { month: month.number, year: month.year }) : undefined;
            // saving first date of the month
            if (month.firstDate === null && newDate.month === month.number) {
                month.firstDate = newDate;
            }
            // saving last date of the month
            if (newDate.month === month.number && nextDate.month !== month.number) {
                month.lastDate = newDate;
            }
            /** @type {?} */
            var dayObject = days[day];
            if (!dayObject) {
                dayObject = days[day] = (/** @type {?} */ ({}));
            }
            dayObject.date = newDate;
            dayObject.context = Object.assign(dayObject.context || {}, {
                $implicit: newDate,
                date: newDate,
                data: contextUserData,
                currentMonth: month.number, disabled: disabled,
                focused: false,
                selected: false, today: today
            });
            dayObject.tabindex = -1;
            dayObject.ariaLabel = ariaLabel;
            dayObject.hidden = false;
            date = nextDate;
        }
        weekObject.number = calendar.getWeekNumber(days.map(function (day) { return day.date; }), firstDayOfWeek);
        // marking week as collapsed
        weekObject.collapsed = outsideDays === 'collapsed' && days[0].date.month !== month.number &&
            days[days.length - 1].date.month !== month.number;
    }
    return month;
}
/**
 * @param {?} calendar
 * @param {?} date
 * @param {?} firstDayOfWeek
 * @return {?}
 */
export function getFirstViewDate(calendar, date, firstDayOfWeek) {
    /** @type {?} */
    var daysPerWeek = calendar.getDaysPerWeek();
    /** @type {?} */
    var firstMonthDate = new NgbDate(date.year, date.month, 1);
    /** @type {?} */
    var dayOfWeek = calendar.getWeekday(firstMonthDate) % daysPerWeek;
    return calendar.getPrev(firstMonthDate, 'd', (daysPerWeek + dayOfWeek - firstDayOfWeek) % daysPerWeek);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci10b29scy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwLyIsInNvdXJjZXMiOlsiZGF0ZXBpY2tlci9kYXRlcGlja2VyLXRvb2xzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBR25DLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxjQUFjLENBQUM7Ozs7OztBQUd2QyxNQUFNLFVBQVUsYUFBYSxDQUFDLElBQWEsRUFBRSxJQUFhO0lBQ3hELE9BQU8sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3JDLENBQUM7Ozs7OztBQUVELE1BQU0sVUFBVSxjQUFjLENBQUMsSUFBYSxFQUFFLElBQWE7SUFDekQsT0FBTyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDO0FBQy9HLENBQUM7Ozs7OztBQUVELE1BQU0sVUFBVSxjQUFjLENBQUMsSUFBYSxFQUFFLElBQWE7SUFDekQsT0FBTyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ3JFLENBQUM7Ozs7OztBQUVELE1BQU0sVUFBVSxpQkFBaUIsQ0FBQyxPQUFnQixFQUFFLE9BQWdCO0lBQ2xFLElBQUksT0FBTyxJQUFJLE9BQU8sSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ2pELE1BQU0sSUFBSSxLQUFLLENBQUMsZUFBYSxPQUFPLDBDQUFxQyxPQUFTLENBQUMsQ0FBQztLQUNyRjtBQUNILENBQUM7Ozs7Ozs7QUFFRCxNQUFNLFVBQVUsZ0JBQWdCLENBQUMsSUFBYSxFQUFFLE9BQWdCLEVBQUUsT0FBZ0I7SUFDaEYsSUFBSSxJQUFJLElBQUksT0FBTyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEVBQUU7UUFDM0MsT0FBTyxPQUFPLENBQUM7S0FDaEI7SUFDRCxJQUFJLElBQUksSUFBSSxPQUFPLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsRUFBRTtRQUMxQyxPQUFPLE9BQU8sQ0FBQztLQUNoQjtJQUVELE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQzs7Ozs7O0FBRUQsTUFBTSxVQUFVLGdCQUFnQixDQUFDLElBQWEsRUFBRSxLQUEwQjtJQUNqRSxJQUFBLHVCQUFPLEVBQUUsdUJBQU8sRUFBRSx5QkFBUSxFQUFFLGlDQUFZO0lBQy9DLG1CQUFtQjtJQUNuQixPQUFPLENBQUMsQ0FDTixDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUM7UUFDaEIsUUFBUTtRQUNSLENBQUMsWUFBWSxJQUFJLFlBQVksQ0FBQyxJQUFJLEVBQUUsRUFBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBQyxDQUFDLENBQUM7UUFDMUUsQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNqQyxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQ2pDLENBQUM7SUFDRixrQkFBa0I7QUFDcEIsQ0FBQzs7Ozs7Ozs7QUFFRCxNQUFNLFVBQVUsdUJBQXVCLENBQUMsUUFBcUIsRUFBRSxJQUFhLEVBQUUsT0FBZ0IsRUFBRSxPQUFnQjtJQUM5RyxJQUFJLENBQUMsSUFBSSxFQUFFO1FBQ1QsT0FBTyxFQUFFLENBQUM7S0FDWDs7UUFFRyxNQUFNLEdBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBRTFDLElBQUksT0FBTyxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssT0FBTyxDQUFDLElBQUksRUFBRTs7WUFDbkMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBQSxLQUFLLElBQUksT0FBQSxLQUFLLEtBQUssT0FBTyxDQUFDLEtBQUssRUFBdkIsQ0FBdUIsQ0FBQztRQUNoRSxNQUFNLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUM5QjtJQUVELElBQUksT0FBTyxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssT0FBTyxDQUFDLElBQUksRUFBRTs7WUFDbkMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBQSxLQUFLLElBQUksT0FBQSxLQUFLLEtBQUssT0FBTyxDQUFDLEtBQUssRUFBdkIsQ0FBdUIsQ0FBQztRQUNoRSxNQUFNLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO0tBQ3JDO0lBRUQsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQzs7Ozs7OztBQUVELE1BQU0sVUFBVSxzQkFBc0IsQ0FBQyxJQUFhLEVBQUUsT0FBZ0IsRUFBRSxPQUFnQjtJQUN0RixJQUFJLENBQUMsSUFBSSxFQUFFO1FBQ1QsT0FBTyxFQUFFLENBQUM7S0FDWDs7UUFFSyxLQUFLLEdBQUcsT0FBTyxJQUFJLE9BQU8sQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksR0FBRyxFQUFFOztRQUNqRCxHQUFHLEdBQUcsT0FBTyxJQUFJLE9BQU8sQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksR0FBRyxFQUFFO0lBRXJELE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUcsS0FBSyxHQUFHLENBQUMsRUFBQyxFQUFFLFVBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSyxPQUFBLEtBQUssR0FBRyxDQUFDLEVBQVQsQ0FBUyxDQUFDLENBQUM7QUFDcEUsQ0FBQzs7Ozs7OztBQUVELE1BQU0sVUFBVSxpQkFBaUIsQ0FBQyxRQUFxQixFQUFFLElBQWEsRUFBRSxPQUFnQjtJQUN0RixPQUFPLE9BQU8sSUFBSSxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDL0QsQ0FBQzs7Ozs7OztBQUVELE1BQU0sVUFBVSxpQkFBaUIsQ0FBQyxRQUFxQixFQUFFLElBQWEsRUFBRSxPQUFnQjs7UUFDaEYsUUFBUSxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQztJQUM1QyxPQUFPLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEtBQUssT0FBTyxDQUFDLElBQUksSUFBSSxRQUFRLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLO1FBQ2hFLFFBQVEsQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksSUFBSSxPQUFPLENBQUMsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQzFFLENBQUM7Ozs7Ozs7OztBQUVELE1BQU0sVUFBVSxXQUFXLENBQ3ZCLFFBQXFCLEVBQUUsSUFBYSxFQUFFLEtBQTBCLEVBQUUsSUFBdUIsRUFDekYsS0FBYztJQUNULElBQUEsbUNBQWEsRUFBRSxxQkFBTTs7O1FBRXRCLGFBQWEsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDOzs7UUFHL0MsVUFBVSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBQyxNQUFNLEVBQUUsYUFBYSxFQUFDLEVBQUUsVUFBQyxDQUFDLEVBQUUsQ0FBQzs7WUFDcEQsU0FBUyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDaEQsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUVqQixJQUFJLENBQUMsS0FBSyxFQUFFOztnQkFDSixXQUFXLEdBQUcsYUFBYSxDQUFDLFNBQVMsQ0FBQyxVQUFBLEtBQUssSUFBSSxPQUFBLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxFQUFqQyxDQUFpQyxDQUFDO1lBQ3ZGLG1DQUFtQztZQUNuQyxJQUFJLFdBQVcsS0FBSyxDQUFDLENBQUMsRUFBRTtnQkFDdEIsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3JEO1NBQ0Y7UUFFRCxPQUFPLFNBQVMsQ0FBQztJQUNuQixDQUFDLENBQUM7SUFFRiwyQkFBMkI7SUFDM0IsVUFBVSxDQUFDLE9BQU8sQ0FBQyxVQUFDLFNBQVMsRUFBRSxDQUFDO1FBQzlCLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksRUFBRTtZQUN0QixNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLFFBQVEsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxhQUFhLENBQUMsS0FBSyxFQUFFLElBQUksbUJBQUEsRUFBRSxFQUFrQixDQUFDLENBQUM7U0FDekc7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUVILE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUM7Ozs7Ozs7OztBQUVELE1BQU0sVUFBVSxVQUFVLENBQ3RCLFFBQXFCLEVBQUUsSUFBYSxFQUFFLEtBQTBCLEVBQUUsSUFBdUIsRUFDekYsS0FBNEM7SUFBNUMsc0JBQUEsRUFBQSwyQkFBd0IsRUFBRSxFQUFrQjtJQUN2QyxJQUFBLHVDQUFlLEVBQUUsdUJBQU8sRUFBRSx1QkFBTyxFQUFFLHFDQUFjLEVBQUUsaUNBQVksRUFBRSwrQkFBVzs7UUFDN0UsYUFBYSxHQUFHLFFBQVEsQ0FBQyxRQUFRLEVBQUU7SUFFekMsS0FBSyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7SUFDdkIsS0FBSyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7SUFDdEIsS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQzFCLEtBQUssQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztJQUN2QixLQUFLLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDO0lBQ2hDLEtBQUssQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLFFBQVEsSUFBSSxFQUFFLENBQUM7SUFFdEMsSUFBSSxHQUFHLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsY0FBYyxDQUFDLENBQUM7SUFFeEQsa0JBQWtCO0lBQ2xCLEtBQUssSUFBSSxJQUFJLEdBQUcsQ0FBQyxFQUFFLElBQUksR0FBRyxRQUFRLENBQUMsZ0JBQWdCLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRTs7WUFDekQsVUFBVSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO1FBQ2xDLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDZixVQUFVLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFDLENBQUM7U0FDekU7O1lBQ0ssSUFBSSxHQUFHLFVBQVUsQ0FBQyxJQUFJO1FBRTVCLGdCQUFnQjtRQUNoQixLQUFLLElBQUksR0FBRyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsUUFBUSxDQUFDLGNBQWMsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFO1lBQ3hELElBQUksSUFBSSxLQUFLLENBQUMsRUFBRTtnQkFDZCxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDakQ7O2dCQUVLLE9BQU8sR0FBRyxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQzs7Z0JBQ3RELFFBQVEsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQzs7Z0JBRXBDLFNBQVMsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQzs7O2dCQUczQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUM5RixJQUFJLENBQUMsUUFBUSxJQUFJLFlBQVksRUFBRTtnQkFDN0IsUUFBUSxHQUFHLFlBQVksQ0FBQyxPQUFPLEVBQUUsRUFBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUksRUFBQyxDQUFDLENBQUM7YUFDM0U7OztnQkFHRyxLQUFLLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUM7OztnQkFHckMsZUFBZSxHQUNmLGVBQWUsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSxFQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSSxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUztZQUVuRyxpQ0FBaUM7WUFDakMsSUFBSSxLQUFLLENBQUMsU0FBUyxLQUFLLElBQUksSUFBSSxPQUFPLENBQUMsS0FBSyxLQUFLLEtBQUssQ0FBQyxNQUFNLEVBQUU7Z0JBQzlELEtBQUssQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDO2FBQzNCO1lBRUQsZ0NBQWdDO1lBQ2hDLElBQUksT0FBTyxDQUFDLEtBQUssS0FBSyxLQUFLLENBQUMsTUFBTSxJQUFJLFFBQVEsQ0FBQyxLQUFLLEtBQUssS0FBSyxDQUFDLE1BQU0sRUFBRTtnQkFDckUsS0FBSyxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7YUFDMUI7O2dCQUVHLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDO1lBQ3pCLElBQUksQ0FBQyxTQUFTLEVBQUU7Z0JBQ2QsU0FBUyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxtQkFBQSxFQUFFLEVBQWdCLENBQUM7YUFDNUM7WUFDRCxTQUFTLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQztZQUN6QixTQUFTLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLE9BQU8sSUFBSSxFQUFFLEVBQUU7Z0JBQ3pELFNBQVMsRUFBRSxPQUFPO2dCQUNsQixJQUFJLEVBQUUsT0FBTztnQkFDYixJQUFJLEVBQUUsZUFBZTtnQkFDckIsWUFBWSxFQUFFLEtBQUssQ0FBQyxNQUFNLEVBQUUsUUFBUSxVQUFBO2dCQUNwQyxPQUFPLEVBQUUsS0FBSztnQkFDZCxRQUFRLEVBQUUsS0FBSyxFQUFFLEtBQUssT0FBQTthQUN2QixDQUFDLENBQUM7WUFDSCxTQUFTLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLFNBQVMsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1lBQ2hDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1lBRXpCLElBQUksR0FBRyxRQUFRLENBQUM7U0FDakI7UUFFRCxVQUFVLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFBLEdBQUcsSUFBSSxPQUFBLEdBQUcsQ0FBQyxJQUFJLEVBQVIsQ0FBUSxDQUFDLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFFdEYsNEJBQTRCO1FBQzVCLFVBQVUsQ0FBQyxTQUFTLEdBQUcsV0FBVyxLQUFLLFdBQVcsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssS0FBSyxLQUFLLENBQUMsTUFBTTtZQUNyRixJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxLQUFLLEtBQUssQ0FBQyxNQUFNLENBQUM7S0FDdkQ7SUFFRCxPQUFPLEtBQUssQ0FBQztBQUNmLENBQUM7Ozs7Ozs7QUFFRCxNQUFNLFVBQVUsZ0JBQWdCLENBQUMsUUFBcUIsRUFBRSxJQUFhLEVBQUUsY0FBc0I7O1FBQ3JGLFdBQVcsR0FBRyxRQUFRLENBQUMsY0FBYyxFQUFFOztRQUN2QyxjQUFjLEdBQUcsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQzs7UUFDdEQsU0FBUyxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLEdBQUcsV0FBVztJQUNuRSxPQUFPLFFBQVEsQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLEdBQUcsRUFBRSxDQUFDLFdBQVcsR0FBRyxTQUFTLEdBQUcsY0FBYyxDQUFDLEdBQUcsV0FBVyxDQUFDLENBQUM7QUFDekcsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7TmdiRGF0ZX0gZnJvbSAnLi9uZ2ItZGF0ZSc7XG5pbXBvcnQge0RhdGVwaWNrZXJWaWV3TW9kZWwsIERheVZpZXdNb2RlbCwgTW9udGhWaWV3TW9kZWx9IGZyb20gJy4vZGF0ZXBpY2tlci12aWV3LW1vZGVsJztcbmltcG9ydCB7TmdiQ2FsZW5kYXJ9IGZyb20gJy4vbmdiLWNhbGVuZGFyJztcbmltcG9ydCB7aXNEZWZpbmVkfSBmcm9tICcuLi91dGlsL3V0aWwnO1xuaW1wb3J0IHtOZ2JEYXRlcGlja2VySTE4bn0gZnJvbSAnLi9kYXRlcGlja2VyLWkxOG4nO1xuXG5leHBvcnQgZnVuY3Rpb24gaXNDaGFuZ2VkRGF0ZShwcmV2OiBOZ2JEYXRlLCBuZXh0OiBOZ2JEYXRlKSB7XG4gIHJldHVybiAhZGF0ZUNvbXBhcmF0b3IocHJldiwgbmV4dCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0NoYW5nZWRNb250aChwcmV2OiBOZ2JEYXRlLCBuZXh0OiBOZ2JEYXRlKSB7XG4gIHJldHVybiAhcHJldiAmJiAhbmV4dCA/IGZhbHNlIDogIXByZXYgfHwgIW5leHQgPyB0cnVlIDogcHJldi55ZWFyICE9PSBuZXh0LnllYXIgfHwgcHJldi5tb250aCAhPT0gbmV4dC5tb250aDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRhdGVDb21wYXJhdG9yKHByZXY6IE5nYkRhdGUsIG5leHQ6IE5nYkRhdGUpIHtcbiAgcmV0dXJuICghcHJldiAmJiAhbmV4dCkgfHwgKCEhcHJldiAmJiAhIW5leHQgJiYgcHJldi5lcXVhbHMobmV4dCkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2hlY2tNaW5CZWZvcmVNYXgobWluRGF0ZTogTmdiRGF0ZSwgbWF4RGF0ZTogTmdiRGF0ZSkge1xuICBpZiAobWF4RGF0ZSAmJiBtaW5EYXRlICYmIG1heERhdGUuYmVmb3JlKG1pbkRhdGUpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGAnbWF4RGF0ZScgJHttYXhEYXRlfSBzaG91bGQgYmUgZ3JlYXRlciB0aGFuICdtaW5EYXRlJyAke21pbkRhdGV9YCk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrRGF0ZUluUmFuZ2UoZGF0ZTogTmdiRGF0ZSwgbWluRGF0ZTogTmdiRGF0ZSwgbWF4RGF0ZTogTmdiRGF0ZSk6IE5nYkRhdGUge1xuICBpZiAoZGF0ZSAmJiBtaW5EYXRlICYmIGRhdGUuYmVmb3JlKG1pbkRhdGUpKSB7XG4gICAgcmV0dXJuIG1pbkRhdGU7XG4gIH1cbiAgaWYgKGRhdGUgJiYgbWF4RGF0ZSAmJiBkYXRlLmFmdGVyKG1heERhdGUpKSB7XG4gICAgcmV0dXJuIG1heERhdGU7XG4gIH1cblxuICByZXR1cm4gZGF0ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRGF0ZVNlbGVjdGFibGUoZGF0ZTogTmdiRGF0ZSwgc3RhdGU6IERhdGVwaWNrZXJWaWV3TW9kZWwpIHtcbiAgY29uc3Qge21pbkRhdGUsIG1heERhdGUsIGRpc2FibGVkLCBtYXJrRGlzYWJsZWR9ID0gc3RhdGU7XG4gIC8vIGNsYW5nLWZvcm1hdCBvZmZcbiAgcmV0dXJuICEoXG4gICAgIWlzRGVmaW5lZChkYXRlKSB8fFxuICAgIGRpc2FibGVkIHx8XG4gICAgKG1hcmtEaXNhYmxlZCAmJiBtYXJrRGlzYWJsZWQoZGF0ZSwge3llYXI6IGRhdGUueWVhciwgbW9udGg6IGRhdGUubW9udGh9KSkgfHxcbiAgICAobWluRGF0ZSAmJiBkYXRlLmJlZm9yZShtaW5EYXRlKSkgfHxcbiAgICAobWF4RGF0ZSAmJiBkYXRlLmFmdGVyKG1heERhdGUpKVxuICApO1xuICAvLyBjbGFuZy1mb3JtYXQgb25cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlU2VsZWN0Qm94TW9udGhzKGNhbGVuZGFyOiBOZ2JDYWxlbmRhciwgZGF0ZTogTmdiRGF0ZSwgbWluRGF0ZTogTmdiRGF0ZSwgbWF4RGF0ZTogTmdiRGF0ZSkge1xuICBpZiAoIWRhdGUpIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBsZXQgbW9udGhzID0gY2FsZW5kYXIuZ2V0TW9udGhzKGRhdGUueWVhcik7XG5cbiAgaWYgKG1pbkRhdGUgJiYgZGF0ZS55ZWFyID09PSBtaW5EYXRlLnllYXIpIHtcbiAgICBjb25zdCBpbmRleCA9IG1vbnRocy5maW5kSW5kZXgobW9udGggPT4gbW9udGggPT09IG1pbkRhdGUubW9udGgpO1xuICAgIG1vbnRocyA9IG1vbnRocy5zbGljZShpbmRleCk7XG4gIH1cblxuICBpZiAobWF4RGF0ZSAmJiBkYXRlLnllYXIgPT09IG1heERhdGUueWVhcikge1xuICAgIGNvbnN0IGluZGV4ID0gbW9udGhzLmZpbmRJbmRleChtb250aCA9PiBtb250aCA9PT0gbWF4RGF0ZS5tb250aCk7XG4gICAgbW9udGhzID0gbW9udGhzLnNsaWNlKDAsIGluZGV4ICsgMSk7XG4gIH1cblxuICByZXR1cm4gbW9udGhzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2VuZXJhdGVTZWxlY3RCb3hZZWFycyhkYXRlOiBOZ2JEYXRlLCBtaW5EYXRlOiBOZ2JEYXRlLCBtYXhEYXRlOiBOZ2JEYXRlKSB7XG4gIGlmICghZGF0ZSkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGNvbnN0IHN0YXJ0ID0gbWluRGF0ZSAmJiBtaW5EYXRlLnllYXIgfHwgZGF0ZS55ZWFyIC0gMTA7XG4gIGNvbnN0IGVuZCA9IG1heERhdGUgJiYgbWF4RGF0ZS55ZWFyIHx8IGRhdGUueWVhciArIDEwO1xuXG4gIHJldHVybiBBcnJheS5mcm9tKHtsZW5ndGg6IGVuZCAtIHN0YXJ0ICsgMX0sIChlLCBpKSA9PiBzdGFydCArIGkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbmV4dE1vbnRoRGlzYWJsZWQoY2FsZW5kYXI6IE5nYkNhbGVuZGFyLCBkYXRlOiBOZ2JEYXRlLCBtYXhEYXRlOiBOZ2JEYXRlKSB7XG4gIHJldHVybiBtYXhEYXRlICYmIGNhbGVuZGFyLmdldE5leHQoZGF0ZSwgJ20nKS5hZnRlcihtYXhEYXRlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHByZXZNb250aERpc2FibGVkKGNhbGVuZGFyOiBOZ2JDYWxlbmRhciwgZGF0ZTogTmdiRGF0ZSwgbWluRGF0ZTogTmdiRGF0ZSkge1xuICBjb25zdCBwcmV2RGF0ZSA9IGNhbGVuZGFyLmdldFByZXYoZGF0ZSwgJ20nKTtcbiAgcmV0dXJuIG1pbkRhdGUgJiYgKHByZXZEYXRlLnllYXIgPT09IG1pbkRhdGUueWVhciAmJiBwcmV2RGF0ZS5tb250aCA8IG1pbkRhdGUubW9udGggfHxcbiAgICAgICAgICAgICAgICAgICAgIHByZXZEYXRlLnllYXIgPCBtaW5EYXRlLnllYXIgJiYgbWluRGF0ZS5tb250aCA9PT0gMSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZE1vbnRocyhcbiAgICBjYWxlbmRhcjogTmdiQ2FsZW5kYXIsIGRhdGU6IE5nYkRhdGUsIHN0YXRlOiBEYXRlcGlja2VyVmlld01vZGVsLCBpMThuOiBOZ2JEYXRlcGlja2VySTE4bixcbiAgICBmb3JjZTogYm9vbGVhbik6IE1vbnRoVmlld01vZGVsW10ge1xuICBjb25zdCB7ZGlzcGxheU1vbnRocywgbW9udGhzfSA9IHN0YXRlO1xuICAvLyBtb3ZlIG9sZCBtb250aHMgdG8gYSB0ZW1wb3JhcnkgYXJyYXlcbiAgY29uc3QgbW9udGhzVG9SZXVzZSA9IG1vbnRocy5zcGxpY2UoMCwgbW9udGhzLmxlbmd0aCk7XG5cbiAgLy8gZ2VuZXJhdGUgbmV3IGZpcnN0IGRhdGVzLCBudWxsaWZ5IG9yIHJldXNlIG1vbnRoc1xuICBjb25zdCBmaXJzdERhdGVzID0gQXJyYXkuZnJvbSh7bGVuZ3RoOiBkaXNwbGF5TW9udGhzfSwgKF8sIGkpID0+IHtcbiAgICBjb25zdCBmaXJzdERhdGUgPSBjYWxlbmRhci5nZXROZXh0KGRhdGUsICdtJywgaSk7XG4gICAgbW9udGhzW2ldID0gbnVsbDtcblxuICAgIGlmICghZm9yY2UpIHtcbiAgICAgIGNvbnN0IHJldXNlZEluZGV4ID0gbW9udGhzVG9SZXVzZS5maW5kSW5kZXgobW9udGggPT4gbW9udGguZmlyc3REYXRlLmVxdWFscyhmaXJzdERhdGUpKTtcbiAgICAgIC8vIG1vdmUgcmV1c2VkIG1vbnRoIGJhY2sgdG8gbW9udGhzXG4gICAgICBpZiAocmV1c2VkSW5kZXggIT09IC0xKSB7XG4gICAgICAgIG1vbnRoc1tpXSA9IG1vbnRoc1RvUmV1c2Uuc3BsaWNlKHJldXNlZEluZGV4LCAxKVswXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmlyc3REYXRlO1xuICB9KTtcblxuICAvLyByZWJ1aWxkIG51bGxpZmllZCBtb250aHNcbiAgZmlyc3REYXRlcy5mb3JFYWNoKChmaXJzdERhdGUsIGkpID0+IHtcbiAgICBpZiAobW9udGhzW2ldID09PSBudWxsKSB7XG4gICAgICBtb250aHNbaV0gPSBidWlsZE1vbnRoKGNhbGVuZGFyLCBmaXJzdERhdGUsIHN0YXRlLCBpMThuLCBtb250aHNUb1JldXNlLnNoaWZ0KCkgfHwge30gYXMgTW9udGhWaWV3TW9kZWwpO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIG1vbnRocztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkTW9udGgoXG4gICAgY2FsZW5kYXI6IE5nYkNhbGVuZGFyLCBkYXRlOiBOZ2JEYXRlLCBzdGF0ZTogRGF0ZXBpY2tlclZpZXdNb2RlbCwgaTE4bjogTmdiRGF0ZXBpY2tlckkxOG4sXG4gICAgbW9udGg6IE1vbnRoVmlld01vZGVsID0ge30gYXMgTW9udGhWaWV3TW9kZWwpOiBNb250aFZpZXdNb2RlbCB7XG4gIGNvbnN0IHtkYXlUZW1wbGF0ZURhdGEsIG1pbkRhdGUsIG1heERhdGUsIGZpcnN0RGF5T2ZXZWVrLCBtYXJrRGlzYWJsZWQsIG91dHNpZGVEYXlzfSA9IHN0YXRlO1xuICBjb25zdCBjYWxlbmRhclRvZGF5ID0gY2FsZW5kYXIuZ2V0VG9kYXkoKTtcblxuICBtb250aC5maXJzdERhdGUgPSBudWxsO1xuICBtb250aC5sYXN0RGF0ZSA9IG51bGw7XG4gIG1vbnRoLm51bWJlciA9IGRhdGUubW9udGg7XG4gIG1vbnRoLnllYXIgPSBkYXRlLnllYXI7XG4gIG1vbnRoLndlZWtzID0gbW9udGgud2Vla3MgfHwgW107XG4gIG1vbnRoLndlZWtkYXlzID0gbW9udGgud2Vla2RheXMgfHwgW107XG5cbiAgZGF0ZSA9IGdldEZpcnN0Vmlld0RhdGUoY2FsZW5kYXIsIGRhdGUsIGZpcnN0RGF5T2ZXZWVrKTtcblxuICAvLyBtb250aCBoYXMgd2Vla3NcbiAgZm9yIChsZXQgd2VlayA9IDA7IHdlZWsgPCBjYWxlbmRhci5nZXRXZWVrc1Blck1vbnRoKCk7IHdlZWsrKykge1xuICAgIGxldCB3ZWVrT2JqZWN0ID0gbW9udGgud2Vla3Nbd2Vla107XG4gICAgaWYgKCF3ZWVrT2JqZWN0KSB7XG4gICAgICB3ZWVrT2JqZWN0ID0gbW9udGgud2Vla3Nbd2Vla10gPSB7bnVtYmVyOiAwLCBkYXlzOiBbXSwgY29sbGFwc2VkOiB0cnVlfTtcbiAgICB9XG4gICAgY29uc3QgZGF5cyA9IHdlZWtPYmplY3QuZGF5cztcblxuICAgIC8vIHdlZWsgaGFzIGRheXNcbiAgICBmb3IgKGxldCBkYXkgPSAwOyBkYXkgPCBjYWxlbmRhci5nZXREYXlzUGVyV2VlaygpOyBkYXkrKykge1xuICAgICAgaWYgKHdlZWsgPT09IDApIHtcbiAgICAgICAgbW9udGgud2Vla2RheXNbZGF5XSA9IGNhbGVuZGFyLmdldFdlZWtkYXkoZGF0ZSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG5ld0RhdGUgPSBuZXcgTmdiRGF0ZShkYXRlLnllYXIsIGRhdGUubW9udGgsIGRhdGUuZGF5KTtcbiAgICAgIGNvbnN0IG5leHREYXRlID0gY2FsZW5kYXIuZ2V0TmV4dChuZXdEYXRlKTtcblxuICAgICAgY29uc3QgYXJpYUxhYmVsID0gaTE4bi5nZXREYXlBcmlhTGFiZWwobmV3RGF0ZSk7XG5cbiAgICAgIC8vIG1hcmtpbmcgZGF0ZSBhcyBkaXNhYmxlZFxuICAgICAgbGV0IGRpc2FibGVkID0gISEoKG1pbkRhdGUgJiYgbmV3RGF0ZS5iZWZvcmUobWluRGF0ZSkpIHx8IChtYXhEYXRlICYmIG5ld0RhdGUuYWZ0ZXIobWF4RGF0ZSkpKTtcbiAgICAgIGlmICghZGlzYWJsZWQgJiYgbWFya0Rpc2FibGVkKSB7XG4gICAgICAgIGRpc2FibGVkID0gbWFya0Rpc2FibGVkKG5ld0RhdGUsIHttb250aDogbW9udGgubnVtYmVyLCB5ZWFyOiBtb250aC55ZWFyfSk7XG4gICAgICB9XG5cbiAgICAgIC8vIHRvZGF5XG4gICAgICBsZXQgdG9kYXkgPSBuZXdEYXRlLmVxdWFscyhjYWxlbmRhclRvZGF5KTtcblxuICAgICAgLy8gYWRkaW5nIHVzZXItcHJvdmlkZWQgZGF0YSB0byB0aGUgY29udGV4dFxuICAgICAgbGV0IGNvbnRleHRVc2VyRGF0YSA9XG4gICAgICAgICAgZGF5VGVtcGxhdGVEYXRhID8gZGF5VGVtcGxhdGVEYXRhKG5ld0RhdGUsIHttb250aDogbW9udGgubnVtYmVyLCB5ZWFyOiBtb250aC55ZWFyfSkgOiB1bmRlZmluZWQ7XG5cbiAgICAgIC8vIHNhdmluZyBmaXJzdCBkYXRlIG9mIHRoZSBtb250aFxuICAgICAgaWYgKG1vbnRoLmZpcnN0RGF0ZSA9PT0gbnVsbCAmJiBuZXdEYXRlLm1vbnRoID09PSBtb250aC5udW1iZXIpIHtcbiAgICAgICAgbW9udGguZmlyc3REYXRlID0gbmV3RGF0ZTtcbiAgICAgIH1cblxuICAgICAgLy8gc2F2aW5nIGxhc3QgZGF0ZSBvZiB0aGUgbW9udGhcbiAgICAgIGlmIChuZXdEYXRlLm1vbnRoID09PSBtb250aC5udW1iZXIgJiYgbmV4dERhdGUubW9udGggIT09IG1vbnRoLm51bWJlcikge1xuICAgICAgICBtb250aC5sYXN0RGF0ZSA9IG5ld0RhdGU7XG4gICAgICB9XG5cbiAgICAgIGxldCBkYXlPYmplY3QgPSBkYXlzW2RheV07XG4gICAgICBpZiAoIWRheU9iamVjdCkge1xuICAgICAgICBkYXlPYmplY3QgPSBkYXlzW2RheV0gPSB7fSBhcyBEYXlWaWV3TW9kZWw7XG4gICAgICB9XG4gICAgICBkYXlPYmplY3QuZGF0ZSA9IG5ld0RhdGU7XG4gICAgICBkYXlPYmplY3QuY29udGV4dCA9IE9iamVjdC5hc3NpZ24oZGF5T2JqZWN0LmNvbnRleHQgfHwge30sIHtcbiAgICAgICAgJGltcGxpY2l0OiBuZXdEYXRlLFxuICAgICAgICBkYXRlOiBuZXdEYXRlLFxuICAgICAgICBkYXRhOiBjb250ZXh0VXNlckRhdGEsXG4gICAgICAgIGN1cnJlbnRNb250aDogbW9udGgubnVtYmVyLCBkaXNhYmxlZCxcbiAgICAgICAgZm9jdXNlZDogZmFsc2UsXG4gICAgICAgIHNlbGVjdGVkOiBmYWxzZSwgdG9kYXlcbiAgICAgIH0pO1xuICAgICAgZGF5T2JqZWN0LnRhYmluZGV4ID0gLTE7XG4gICAgICBkYXlPYmplY3QuYXJpYUxhYmVsID0gYXJpYUxhYmVsO1xuICAgICAgZGF5T2JqZWN0LmhpZGRlbiA9IGZhbHNlO1xuXG4gICAgICBkYXRlID0gbmV4dERhdGU7XG4gICAgfVxuXG4gICAgd2Vla09iamVjdC5udW1iZXIgPSBjYWxlbmRhci5nZXRXZWVrTnVtYmVyKGRheXMubWFwKGRheSA9PiBkYXkuZGF0ZSksIGZpcnN0RGF5T2ZXZWVrKTtcblxuICAgIC8vIG1hcmtpbmcgd2VlayBhcyBjb2xsYXBzZWRcbiAgICB3ZWVrT2JqZWN0LmNvbGxhcHNlZCA9IG91dHNpZGVEYXlzID09PSAnY29sbGFwc2VkJyAmJiBkYXlzWzBdLmRhdGUubW9udGggIT09IG1vbnRoLm51bWJlciAmJlxuICAgICAgICBkYXlzW2RheXMubGVuZ3RoIC0gMV0uZGF0ZS5tb250aCAhPT0gbW9udGgubnVtYmVyO1xuICB9XG5cbiAgcmV0dXJuIG1vbnRoO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Rmlyc3RWaWV3RGF0ZShjYWxlbmRhcjogTmdiQ2FsZW5kYXIsIGRhdGU6IE5nYkRhdGUsIGZpcnN0RGF5T2ZXZWVrOiBudW1iZXIpOiBOZ2JEYXRlIHtcbiAgY29uc3QgZGF5c1BlcldlZWsgPSBjYWxlbmRhci5nZXREYXlzUGVyV2VlaygpO1xuICBjb25zdCBmaXJzdE1vbnRoRGF0ZSA9IG5ldyBOZ2JEYXRlKGRhdGUueWVhciwgZGF0ZS5tb250aCwgMSk7XG4gIGNvbnN0IGRheU9mV2VlayA9IGNhbGVuZGFyLmdldFdlZWtkYXkoZmlyc3RNb250aERhdGUpICUgZGF5c1BlcldlZWs7XG4gIHJldHVybiBjYWxlbmRhci5nZXRQcmV2KGZpcnN0TW9udGhEYXRlLCAnZCcsIChkYXlzUGVyV2VlayArIGRheU9mV2VlayAtIGZpcnN0RGF5T2ZXZWVrKSAlIGRheXNQZXJXZWVrKTtcbn1cbiJdfQ==