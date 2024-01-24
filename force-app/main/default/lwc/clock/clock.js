import { LightningElement, api, track } from 'lwc'
import { getCurrentTime, getTimeLeft, toDoubleDigitTimeUnit } from 'c/utils'

const CLOCK_UNITS = ['hours', 'minutes']
const UNITS = ['days', ...CLOCK_UNITS, 'seconds']
const SECONDS = UNITS[UNITS.length - 1]
const ANIMATION_CLASS_NAME = 'flip'
const WIDGET_TYPE = {
    COUNTER: 'counter',
    CLOCK: 'clock',
}

export default class Clock extends LightningElement {
    @api set props(value) {
        this._props = JSON.parse(value)
        this._setWidgetProps()
    }
    get props() {
        return this._props
    }

    days = false
    hours = false
    minutes = false
    seconds = false
    labels = false
    _isTimerOver = false
    _isRendered = false

    @track _props
    @track previous = {
        days: null,
        hours: null,
        minutes: null,
        seconds: null,
    }
    @track current = {
        days: null,
        hours: null,
        minutes: null,
        seconds: null,
    }

    renderedCallback() {
        if (this._isRendered) return

        this.enabledUnits.forEach(unit => this.initCounter(unit))

        this._isRendered = true
    }

    initCounter(unit) {
        let i = 0
        let timeout = null

        const updateClock = () => {
            if (
                this.props.widgetType === WIDGET_TYPE.COUNTER &&
                this.props.dueDate &&
                new Date() >= new Date(this.props.dueDate)
            ) {
                this._isTimerOver = true
                clearTimeout(timeout)

                return
            }
            // eslint-disable-next-line @lwc/lwc/no-async-operation
            requestAnimationFrame(updateClock)

            if (i++ % 10) return

            const timeUnit =
                this.props?.widgetType === WIDGET_TYPE.COUNTER && this.dueDate
                    ? getTimeLeft(this.dueDate)[unit]
                    : getCurrentTime()[unit]

            this._update(
                unit,
                unit === UNITS[0] ? timeUnit : toDoubleDigitTimeUnit(timeUnit)
            )
        }

        // eslint-disable-next-line @lwc/lwc/no-async-operation
        timeout = setTimeout(updateClock, 500)
    }

    _update(unit, value) {
        if (value === this.current[unit]) return

        const flipper = this.template.querySelector(`[data-id="${unit}"`)

        if (!flipper) return

        this.previous[unit] = this.current[unit]
        this.current[unit] = value

        flipper.classList.remove(ANIMATION_CLASS_NAME)
        // eslint-disable-next-line no-void
        void flipper.offsetWidth
        flipper.classList.add(ANIMATION_CLASS_NAME)
    }

    _setWidgetProps() {
        if (!this.props?.widgetType) return

        switch (this.props?.widgetType) {
            case WIDGET_TYPE.COUNTER:
                UNITS.forEach(unit => (this[unit] = true))
                break
            default:
                UNITS.forEach(unit => (this[unit] = CLOCK_UNITS.includes(unit)))
                this.seconds = this.props?.isSecondsEnabled || false
        }

        this.labels = this._props?.isLabelsEnabled
    }

    get dueDate() {
        return this.props?.dueDate ? new Date(this.props.dueDate) : null
    }

    get enabledUnits() {
        return this.props?.widgetType === WIDGET_TYPE.COUNTER
            ? this.props?.isZeroesDisabled
                ? UNITS.filter((unit, index) => {
                      // always render seconds
                      if (unit === SECONDS) return true
                      // check if current unit is zero
                      const isUnitZero = parseInt(this.current[unit], 10) === 0
                      // if the unit is not a zero - render it
                      if (!isUnitZero) return true
                      // hide zero hours with no additional checks
                      if (index === 0) return false
                      // hide unit only if every higher unit is zero
                      return !UNITS.slice(0, index).every(
                          previousUnit =>
                              parseInt(this.current[previousUnit], 10) === 0
                      )
                  })
                : UNITS
            : UNITS.filter(unit => this[unit])
    }

    get counters() {
        return this.enabledUnits.map(unit => ({
            label: unit,
            topValue: this.current[unit],
            flippedValue: this.current[unit],
            bottomValue: this.previous[unit],
            backValue: this.previous[unit],
        }))
    }
}
