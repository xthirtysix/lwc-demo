import { LightningElement, api, track } from 'lwc'
import { getCurrentTime, getTimeLeft, toDoubleDigitTimeUnit } from 'c/utils'

const UNITS = ['days', 'hours', 'minutes', 'seconds']
const ANIMATION_CLASS_NAME = 'flip'

export default class Clock extends LightningElement {
    @api days = false
    @api hours = false
    @api minutes = false
    @api seconds = false
    @api labels = false
    @api isCounter = false
    @api expiredTime = new Date(new Date().setDate(new Date().getDate() + 130))

    @track previous = {
        days: null,
        hours: null,
        minutes: null,
        seconds: null
    }
    @track current = {
        days: null,
        hours: null,
        minutes: null,
        seconds: null
    }

    isRendered = false

    renderedCallback() {
        if (this.isRendered) return

        if (this.isCounter && this.expiredTime) {
            UNITS.forEach(unit => this.initCounter(unit))
        } else {
            this.enabledUnits.forEach(unit => this.initCounter(unit))
        }

        this.isRendered = true
    }

    initCounter(unit) {
        let i = 0

        const updateClock = () => {
            requestAnimationFrame(updateClock)

            if (i++ % 10) return

            const timeUnit = (this.isCounter && this.expiredTime)
                    ? getTimeLeft(this.expiredTime)[unit]
                    : getCurrentTime()[unit]

            this._update(
                unit,
                unit === UNITS[0]
                    ? timeUnit
                    : toDoubleDigitTimeUnit(timeUnit)
            )
        }

        setTimeout(updateClock, 500)
    }

    _update(unit, value) {
        if (value === this.current[unit]) return

        const flipper = this.template.querySelector(`[data-id="${unit}"`)

        if (!flipper) return

        this.previous[unit] = this.current[unit]
        this.current[unit] = value

        flipper.classList.remove(ANIMATION_CLASS_NAME)
        flipper.offsetWidth
        flipper.classList.add(ANIMATION_CLASS_NAME)
    }

    get enabledUnits() {
        return (this.isCounter && this.expiredTime)
            ? UNITS
            : UNITS.filter(unit => this[unit])
    }

    get counters() {
        return this.enabledUnits.map(unit => ({
            label: unit,
            topValue: this.current[unit],
            flippedValue: this.current[unit],
            bottomValue: this.previous[unit],
            backValue: this.previous[unit]
        }))
    }
}