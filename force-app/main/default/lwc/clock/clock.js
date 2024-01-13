import { LightningElement, api, track } from 'lwc'
import { getDate, toDoubleDigitTimeUnit } from 'c/utils'

const UNITS = ['date', 'hours', 'minutes', 'seconds']
const ANIMATION_CLASS_NAME = 'flip'

export default class Clock extends LightningElement {
    @api date = false
    @api hours = false
    @api minutes = false
    @api seconds = false
    @api disableLabels = false

    @track previous = {
        date: null,
        hours: null,
        minutes: null,
        seconds: null
    }
    @track current = {
        date: null,
        hours: null,
        minutes: null,
        seconds: null
    }

    isRendered = false

    renderedCallback() {
        if (this.isRendered) return

        this.enabledUnits.forEach(unit => this.initCounter(unit))
        this.isRendered = true
    }

    initCounter(unit) {
        let i = 0

        const updateClock = () => {
            requestAnimationFrame(updateClock)

            if (i++ % 10) return

            this._update(unit, toDoubleDigitTimeUnit(getDate()[unit]))
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
        return UNITS.filter(unit => this[unit])
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