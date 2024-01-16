const MILLISECONDS_IN_SECOND = 1000
const SECONDS_IN_A_MINUTE = 60
const MINUTES_IN_AN_HOUR = 60
const HOURS_IN_A_DAY = 24

const SECOND = MILLISECONDS_IN_SECOND
const MINUTE = SECOND * SECONDS_IN_A_MINUTE
const HOUR = MINUTE * MINUTES_IN_AN_HOUR
const DAY = HOUR * HOURS_IN_A_DAY

export function getCurrentTime() {
    const date = new Date()
    return {
        days: date.getDate(),
        hours: date.getHours(),
        minutes: date.getMinutes(),
        seconds: date.getSeconds()
    };
}

export function getTimeLeft(expiredAt) {
    const date = Date.parse(expiredAt) - Date.parse(new Date())
    return {
        days: Math.floor(date / DAY),
        hours: Math.floor(date / HOUR % HOURS_IN_A_DAY),
        minutes: Math.floor(date / MINUTE % MINUTES_IN_AN_HOUR),
        seconds: Math.floor(date / SECOND % SECONDS_IN_A_MINUTE)

    }
}

export function toDoubleDigitTimeUnit(value) {
    return ('0' + value).slice(-2)
}