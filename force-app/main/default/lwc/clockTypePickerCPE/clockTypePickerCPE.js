/* eslint-disable @lwc/lwc/no-api-reassignments */
import { LightningElement, api } from 'lwc'

const TYPES = ['--None--', 'Counter', 'Clock']

export default class ClockTypePickerCPE extends LightningElement {
    @api value
    @api label
    @api schema
    @api errors

    // Widget type getters
    get options() {
        return TYPES.map((type, index) => {
            return {
                label: type,
                value: index === 0 ? null : type.toLowerCase(),
                disabled: index === 0,
            }
        })
    }

    get typeValue() {
        return this.value?.widgetType || TYPES[0]
    }

    get isWidgetTypeSelected() {
        return this.value?.widgetType || false
    }

    get isClock() {
        return this.value?.widgetType === 'clock' || false
    }

    get isCounter() {
        return this.value?.widgetType === 'counter' || false
    }

    // Enable labels getters
    get labelsValue() {
        return this.value?.isLabelsEnabled || false
    }

    // Enable seconds getters (clock only)
    get secondsValue() {
        return this.value?.isSecondsEnabled || false
    }

    // Due date getters (counter only)
    get minDueDate() {
        return new Date().toISOString()
    }

    get dueDateValue() {
        return this.value?.dueDate || null
    }

    // Disable zeroes getters (counter only)
    get zeroesValue() {
        return this.value?.isZeroesDisabled || false
    }

    handleTypeChange(event) {
        const value = event.detail.value
        this.value = { ...this.value, widgetType: value }
        this._updateValue()
    }

    handleLabelToggle(event) {
        this.value = { ...this.value, isLabelsEnabled: event.target.checked }
        this._updateValue()
    }

    handleSecondsToggle(event) {
        this.value = { ...this.value, isSecondsEnabled: event.target.checked }
        this._updateValue()
    }

    handleZeroesToggle(event) {
        this.value = { ...this.value, isZeroesDisabled: event.target.checked }
        this._updateValue()
    }

    handleDueDateChange(event) {
        this.value = { ...this.value, dueDate: event.detail.value }
        this._updateValue()
    }

    _updateValue() {
        this.dispatchEvent(
            new CustomEvent('valuechange', {
                detail: { value: this.value },
            })
        )
    }
}
