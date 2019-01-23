const datePickerUtils = {
    /**
     * @type {Boolean}
     */
    useUtc: false,

    /**
     * @type {Array<Number>}
     */
    daysInMonths: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],

    /**
     * @type {Array<String>}
     */
    weekdayLabels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],

    /**
     * @type {Array<String>}
     */
    monthLabels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],

    /**
     * @return {Object} Returns object {year, month index, day} based on current date
     */
    getCurrentDateInfo () {
        const today = new Date();
        return {
            year: this.getFullYear(today),
            month: this.getMonth(today) + 1,
            day: this.getDate(today)
        };
    },

    /**
     * @param {String} framework bulma | bootstrap | any
     * @return {String} Returns <input> element classes related to listed css frameworks
     */
    getCssFrameworkInputClass (framework) {
        switch (framework) {
            case cssFrameworks.BULMA: return 'input';
            case cssFrameworks.BOOTSTRAP: return 'form-control';
            default: return 'default-input';
        }
    },

    /**
     * @param {String} framework bulma | bootstrap | any
     * @return {String} Returns <span> element (parent of inline icons on <input> element) classes related to listed css frameworks
     */
    getCssFrameworkIconClass (framework) {
        switch (framework) {
            case cssFrameworks.BULMA: return 'icon is-right';
            case cssFrameworks.BOOTSTRAP: return 'input-group-append';
            default: return 'default-icon';
        }
    },

    /**
     * @param {String} framework bulma | bootstrap | any
     * @return {String} Returns parent <div> element of control element classes related to listed css frameworks
     */
    getCssFrameworkWrapperClass (framework) {
        switch (framework) {
            case cssFrameworks.BULMA: return 'control has-icons-right';
            case cssFrameworks.BOOTSTRAP: return 'input-group';
            default: return 'default-wrapper';
        }
    },

    /**
     * @param {Number} day day
     * @param {Number} weekday weekday
     * @param {Number} week week
     * @param {Number} month month
     * @param {Number} year year
     * @param {Number} daysInMonth daysInMonth
     * @param {Boolean} isPreviousMonth isPreviousMonth
     * @param {Boolean} isNextMonth isNextMonth
     * @param {Boolean} isThisMonth isThisMonth
     * @param {Object} todayDateInfo todayDateInfo
     * @return {Object} Returns dayInfo object
     */
    createDayInfo (day, weekday, week, month, year, daysInMonth, isPreviousMonth, isNextMonth, isThisMonth, todayDateInfo) {
        return {
            label: (day || '').toString(),
            day: day,
            weekday: weekday,
            week: week,
            month: month,
            year: year,
            date: new Date(year, month - 1, day),
            beforeMonth: isPreviousMonth,
            afterMonth: isNextMonth,
            inMonth: isThisMonth,
            isToday: day === todayDateInfo.day && month === todayDateInfo.month && year === todayDateInfo.year,
            isFirstDay: isThisMonth && day === 1,
            isLastDay: isThisMonth && day === daysInMonth,
            isSelected: false
        };
    },

    /**
     * Validates a date object or date string
     * @param {Date | String} date Date object
     * @return {Boolean} Validates a date object or date string
     */
    isValidDate (date) {
        if (!date || date.toString() === parseInt(date).toString()) return false;
        var tryDate = new Date(date);
        return (tryDate && tryDate.toString() != "NaN" && tryDate != "Invalid Date");
    },

    /**
     * @param {Date} date Date object
     * @return {String} Returns date formatted as string (example: 2019-02-21) - used when no dateFormatter param is passed to DatePickerLite component
     */
    defaultDateFormatter (date) {
        return date.toISOString().slice(0, 10);
    },

    /**
     * @param {Date} date Date object
     * @return {Number} Returns the minutes, using UTC or local
     */
    getMinutes (date) {
        return this.useUtc ? date.getUTCMinutes() : date.getMinutes();
    },

    /**
     * @param {Date} date Date object
     * @return {Number} Returns the hours, using UTC or local
     */
    getHours (date) {
        return this.useUtc ? date.getUTCHours() : date.getHours();
    },

    /**
     * @param {Date} date Date object
     * @return {Number} Returns the day, using UTC or local
     */
    getDay (date) {
        return this.useUtc ? date.getUTCDay() : date.getDay();
    },

    /**
     * @param {Date} date Date object
     * @return {Number} Returns the month, using UTC or local
     */
    getMonth (date) {
        return this.useUtc ? date.getUTCMonth() : date.getMonth();
    },

    /**
     * @param {Date} date Date object
     * @return {Number} Returns the full year, using UTC or local
     */
    getFullYear (date) {
        return this.useUtc ? date.getUTCFullYear() : date.getFullYear();
    },

    /**
     * @param {Date} date Date object
     * @return {Number} Returns the date, using UTC or local
     */
    getDate (date) {
        return this.useUtc ? date.getUTCDate() : date.getDate();
    }
};

/**
 * CSS frameworks to render control layouts as.
 */
export const cssFrameworks = {
    BULMA: 'bulma',
    BOOTSTRAP: 'bootstrap'
};

export const createDatePickerUtils = useUtc => ({ ...datePickerUtils, useUtc });