import { LightningElement } from 'lwc'
import { THEME, EVENT_NAME, STORAGE } from 'c/utils'

export default class ThemeSwitcher extends LightningElement {
    _theme = THEME.LIGHT

    connectedCallback() {
        const theme = window.localStorage.getItem(STORAGE.THEME) || THEME.LIGHT

        if (theme === THEME.LIGHT) return

        this._theme = theme
    }

    get isChecked() {
        return this._theme === THEME.DARK
    }

    handleTogglerChange(event) {
        event.preventDefault()

        this._theme = this._theme === THEME.LIGHT ? THEME.DARK : THEME.LIGHT

        this.dispatchEvent(
            new CustomEvent(EVENT_NAME.THEME_TOGGLE, {
                bubbles: true,
                composed: true,
            })
        )
    }
}
