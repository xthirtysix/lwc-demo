import { LightningElement, api } from 'lwc'
import { THEME, EVENT_NAME, STORAGE } from 'c/utils'

/**
 * @slot header Header slot
 * @slot footer Footer slot
 * @slot default Content slot
 */
export default class StickyFooterTheme extends LightningElement {
    @api set theme(value) {
        this._theme = value
        this._switchTheme()
    }
    get theme() {
        return this._theme
    }

    _theme = THEME.LIGHT

    connectedCallback() {
        this.template.addEventListener(
            EVENT_NAME.THEME_TOGGLE,
            this._switchTheme.bind(this)
        )

        const theme = window.localStorage.getItem(STORAGE.THEME)

        if (theme !== THEME.DARK && theme !== THEME.LIGHT) {
            window.localStorage.setItem(STORAGE.THEME, this._theme)
        }
        if (theme === THEME.LIGHT) return

        this._switchTheme()
    }

    _switchTheme() {
        switch (this._theme) {
            case THEME.DARK:
                this.template.host.classList.remove(THEME.DARK)
                window.localStorage.setItem(STORAGE.THEME, THEME.LIGHT)
                this._theme = THEME.LIGHT
                break
            default:
                this.template.host.classList.add(THEME.DARK)
                window.localStorage.setItem(STORAGE.THEME, THEME.DARK)
                this._theme = THEME.DARK
        }
    }
}
