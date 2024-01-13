export function getDate() {
    const date = new Date()
    return {
        date: date.getDate(),
        hours: date.getHours(),
        minutes: date.getMinutes(),
        seconds: date.getSeconds()
    };
}

export function toDoubleDigitTimeUnit(value) {
    return ('0' + value).slice(-2)
}