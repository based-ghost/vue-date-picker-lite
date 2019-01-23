<template>
    <div :class="renderWrapperClass">
        <input type="text"
               :class="renderInputClass"
               :id="id"
               :name="name"
               :value="value"
               :disabled="disabled"
               :required="required"
               :readonly="!isEditable"
               :placeholder="placeholder">
        <span v-if="showClearButton"
              :class="['clear-date-icon', renderIconClass]"
              data-tooltip="Clear date"
              @click="clearDay">
            <i :class="clearButtonIcon">
                <span v-if="!clearButtonIcon">&times;</span>
            </i>
        </span>
        <span :class="['toggle-calendar-icon', renderIconClass]"
              :data-tooltip="showCalendar ? 'Hide calendar' : 'Show calendar'"
              @click="showCalendar = !showCalendar">
            <i :class="[calendarButtonIcon, { 'calendar-icon-active': showCalendar }]">
                <span v-if="!calendarButtonIcon">&hellip;</span>
            </i>
        </span>
        <div v-show="showCalendar" class="calendar-wrapper">
            <div ref="calendar" class="calendar">
                <div class="header">
                    <a @click="year--">&laquo;</a>
                    <a @click="movePreviousMonth">&lsaquo;</a>
                    <span>{{`${months[this.monthIndex].label} ${year}`}}</span>
                    <a @click="moveNextMonth">&rsaquo;</a>
                    <a @click="year++">&raquo;</a>
                </div>
                <div class="weekdays-header">
                    <div v-for="weekday in weekdays" :key="weekday.number">
                        {{weekday.label}}
                    </div>
                </div>
                <div v-for="(week, index) in weeks"
                     :key="index"
                     class="week">
                    <a v-for="(day, index) in week"
                       :key="index"
                       role="button"
                       :class="['day', { 'today': day.isToday, 'not-in-month': !day.inMonth, 'selected': day.isSelected }]"
                       @click="selectDay(day)">
                        {{day.label}}
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import { createDatePickerUtils } from '../utils/DatePickerUtils'

    export default {
        props: {
            value: String,
            id: String,
            name: String,
            placeholder: String,
            clearButtonIcon: String,
            calendarButtonIcon: String,
            cssFrameworkStyle: String,
            monthLblSubstringEndPos: {
                type: Number,
                default: 0
            },
            weekdayLblSubstringEndPos: {
                type: Number,
                default: 3
            },
            inputClass: {
                type: [String, Array],
                default: null
            },
            wrapperClass: {
                type: [String, Array],
                default: null
            },
            useUtc: {
                type: Boolean,
                default: false
            },
            disabled: {
                type: Boolean,
                default: false
            },
            required: {
                type: Boolean,
                default: false
            },
            isEditable: {
                type: Boolean,
                default: false
            },
            showClearButton: {
                type: Boolean,
                default: true
            },
            dateFormatter: {
                type: Function,
                default: null
            }
        },
        data() {
            return {
                year: 0,
                month: 0,
                todayDateInfo: {},
                showCalendar: false,
                dateUtils: createDatePickerUtils(this.useUtc)
            }
        },
        created() {
            this.initializeCurrentDateInfo()
            this.formatInitialValue()
        },
        beforeDestroy() {
            document.removeEventListener('click', this.handleClickOutside, false)
        },
        computed: {
            monthIndex() {
                return this.month - 1
            },
            firstWeekdayInMonth() {
                const date = new Date(this.year, this.monthIndex, 1)
                return this.dateUtils.getDay(date) + 1
            },
            hasDateFormatterFunc() {
                return this.dateFormatter && typeof (this.dateFormatter) === 'function'
            },
            isLeapYear() {
                return (this.year % 4 === 0 && this.year % 100 !== 0) || this.year % 400 === 0
            },
            daysInMonth() {
                return (this.month === 2 && this.isLeapYear) ? 29 : this.dateUtils.daysInMonths[this.monthIndex]
            },
            renderIconClass() {
                return this.dateUtils.getCssFrameworkIconClass(this.cssFrameworkStyle)
            },
            renderInputClass() {
                const frameworkInputCls = this.dateUtils.getCssFrameworkInputClass(this.cssFrameworkStyle)
                if (frameworkInputCls) {
                    return (typeof (this.inputClass) === 'string')
                        ? ['date-picker-input', this.inputClass, frameworkInputCls].join(' ')
                        : ['date-picker-input', frameworkInputCls, ...this.inputClass || []]
                }
                return this.inputClass
            },
            renderWrapperClass() {
                const frameworkWrapperCls = this.dateUtils.getCssFrameworkWrapperClass(this.cssFrameworkStyle)
                if (frameworkWrapperCls) {
                    return (typeof (this.wrapperClass) === 'string')
                        ? [this.wrapperClass, frameworkWrapperCls].join(' ')
                        : [frameworkWrapperCls, ...this.wrapperClass || []]
                }
                return this.wrapperClass
            },
            months() {
                return this.dateUtils.monthLabels.map((ml, i) => ({
                    label: this.monthLblSubstringEndPos > 0 ? ml.substring(0, this.monthLblSubstringEndPos) : ml,
                    number: i + 1
                }))
            },
            weekdays() {
                return this.dateUtils.weekdayLabels.map((wl, i) => ({
                    label: this.weekdayLblSubstringEndPos > 0 ? wl.substring(0, this.weekdayLblSubstringEndPos) : wl,
                    number: i + 1
                }))
            },
            previousMonthInfo() {
                if (this.month === 1) {
                    return {
                        days: this.dateUtils.daysInMonths[11],
                        month: 12,
                        year: this.year - 1
                    }
                } else {
                    return {
                        days: (this.month === 3 && this.isLeapYear) ? 29 : this.dateUtils.daysInMonths[this.month - 2],
                        month: this.month - 1,
                        year: this.year
                    }
                }
            },
            nextMonthInfo() {
                if (this.month === 12) {
                    return {
                        days: this.dateUtils.daysInMonths[0],
                        month: 1,
                        year: this.year + 1
                    }
                } else {
                    return {
                        days: (this.month === 2 && this.isLeapYear) ? 29 : this.dateUtils.daysInMonths[this.month],
                        month: this.month + 1,
                        year: this.year
                    }
                }
            },
            weeks() {
                const weeks = []
                let previousMonth = true
                let thisMonth = false
                let nextMonth = false
                let day = this.previousMonthInfo.days - this.firstWeekdayInMonth + 2
                let month = this.previousMonthInfo.month
                let year = this.previousMonthInfo.year

                for (let w = 1; w <= 6 && !nextMonth; w++) {
                    const week = []
                    for (let d = 1; d <= 7; d++) {
                        if (previousMonth && d >= this.firstWeekdayInMonth) {
                            day = 1
                            month = this.month
                            year = this.year
                            previousMonth = false
                            thisMonth = true
                        }

                        const dayInfo = this.dateUtils.createDayInfo(day, d, w, month, year, this.daysInMonth, previousMonth, nextMonth, thisMonth, this.todayDateInfo)
                        dayInfo.isSelected = (this.value && (this.formatDate(dayInfo.date) === this.value))
                        week.push(dayInfo)

                        if (thisMonth && day >= this.daysInMonth) {
                            thisMonth = false
                            nextMonth = true
                            day = 1
                            month = this.nextMonthInfo.month
                            year = this.nextMonthInfo.year
                        } else {
                            day++
                        }
                    }
                    weeks.push(week)
                }
                return weeks
            },
        },
        watch: {
            showCalendar(newValue, previousValue) {
                if (newValue) {
                    document.addEventListener('click', this.handleClickOutside, false)
                    this.$emit('calendar-opened')
                } else if (!newValue && previousValue) {
                    document.removeEventListener('click', this.handleClickOutside, false)
                    this.$emit('calendar-closed')
                }
            }
        },
        methods: {
            clearDay() {
                this.value = null
                this.$emit('input', null)
                this.$nextTick(() => {
                    this.showCalendar = false
                    this.$emit('cleared')
                    this.initializeCurrentDateInfo()
                })
            },
            selectDay(day) {
                if (!day.inMonth) {
                    return
                }

                const dateValue = day.isSelected ? null : this.formatDate(day.date)
                this.value = dateValue
                this.$emit('input', dateValue)
                this.$emit('selected', dateValue)
                this.$nextTick(() => {
                    this.showCalendar = false
                    if (!dateValue) {
                        this.$emit('cleared')
                    }
                })
            },
            moveNextMonth() {
                const { month, year } = this.nextMonthInfo
                this.month = month
                this.year = year
            },
            movePreviousMonth() {
                const { month, year } = this.previousMonthInfo
                this.month = month
                this.year = year
            },
            validateAndFormatDate(date) {
                return this.dateUtils.isValidDate(date) ? this.formatDate(new Date(date)) : null
            },
            formatDate(date) {
                return this.hasDateFormatterFunc ? this.dateFormatter(date) : this.dateUtils.defaultDateFormatter(date)
            },
            handleClickOutside(event) {
                if (this.showCalendar && !this.$refs.calendar.contains(event.target)) {
                    this.showCalendar = false
                }
            },
            formatInitialValue() {
                const dateValue = this.validateAndFormatDate(this.value)
                this.value = dateValue
                this.$emit('input', dateValue)
            },
            initializeCurrentDateInfo() {
                this.todayDateInfo = this.dateUtils.getCurrentDateInfo()
                this.year = this.todayDateInfo.year
                this.month = this.todayDateInfo.month
            }
        }
    }
</script>
<style lang="scss">
@import '../styles/style.scss';
</style>