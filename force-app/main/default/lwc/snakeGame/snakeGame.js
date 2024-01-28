/* eslint-disable @lwc/lwc/no-async-operation */
import { LightningElement } from 'lwc'
import { Snake, CONTROLS } from './SnakeService'
import { getRandomNumber, EVENT_NAME } from 'c/utils'

const CELL_SIZE = 16
const CANVAS_DIMENSION = CELL_SIZE * 25
const SNAKE_COLOR = '--color-snake'
const APPLE_COLOR = '--color-apple'

/**
 * @typedef {object} coordinates
 * @property {number} x - x on canvas
 * @property {number} y - y on canvas
 */

export default class SnakeGame extends LightningElement {
    /** @type {coordinates} */
    apple = {
        x: 480,
        y: 240,
    }

    config = {
        cell: CELL_SIZE,
        speed: 0,
        canvas: {
            width: CANVAS_DIMENSION,
            height: CANVAS_DIMENSION,
        },
    }

    colors = {
        snake: 'green',
        apple: 'red',
    }

    canvasContext = null
    _isFirstRender = true

    connectedCallback() {
        this.snake = new Snake(
            this.config.canvas.width / 2,
            this.config.canvas.height / 2,
            this.config.cell
        )
    }

    renderedCallback() {
        if (!this._isFirstRender) return

        this.canvasContext = this.template
            .querySelector('.canvas')
            ?.getContext('2d')

        this.colors.snake = getComputedStyle(
            this.template.host
        ).getPropertyValue(SNAKE_COLOR)

        this.colors.apple = getComputedStyle(
            this.template.host
        ).getPropertyValue(APPLE_COLOR)

        this._registerKeys()

        requestAnimationFrame(this.animate.bind(this))

        this._isFirstRender = false
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this))

        this.config.speed++

        if (this.config.speed < 4) return

        this.config.speed = 0
        this.canvasContext.clearRect(
            0,
            0,
            this.config.canvas.width,
            this.config.canvas.height
        )

        this.snake.turn()

        if (this.snake.x < 0) {
            this.snake.x = this.config.canvas.width - this.config.cell
        } else if (this.snake.x >= this.config.canvas.width) {
            this.snake.x = 0
        }

        if (this.snake.y < 0) {
            this.snake.y = this.config.canvas.height - this.config.cell
        } else if (this.snake.y >= this.config.canvas.height) {
            this.snake.y = 0
        }

        this.snake.move()

        this.canvasContext.fillStyle = this.colors.apple
        this.canvasContext.fillRect(
            this.apple.x,
            this.apple.y,
            this.config.cell - 1,
            this.config.cell - 1
        )
        this.canvasContext.fillStyle = this.colors.snake

        this.snake.tail.forEach((cell, index) => {
            this.canvasContext.fillRect(
                cell.x,
                cell.y,
                this.config.cell - 1,
                this.config.cell - 1
            )
            if (cell.x === this.apple.x && cell.y === this.apple.y) {
                this.snake.grow()
                this.apple.x = getRandomNumber(0, 25) * this.config.cell
                this.apple.y = getRandomNumber(0, 25) * this.config.cell
            }
            for (let i = index + 1; i < this.snake.tail.length; i++) {
                if (
                    cell.x === this.snake.tail[i].x &&
                    cell.y === this.snake.tail[i].y
                ) {
                    this.snake.reset()
                }
            }
        })
    }

    _registerKeys() {
        this.template.addEventListener(EVENT_NAME.KEYDOWN, event => {
            const { x, y } = this.snake.direction

            switch (event.key) {
                case CONTROLS.ARROW_LEFT:
                    if (x === 0)
                        this.snake.direction = { x: -this.config.cell, y: 0 }
                    break
                case CONTROLS.ARROW_RIGHT:
                    if (x === 0)
                        this.snake.direction = { x: this.config.cell, y: 0 }
                    break
                case CONTROLS.ARROW_UP:
                    if (y === 0)
                        this.snake.direction = { x: 0, y: -this.config.cell }
                    break
                case CONTROLS.ARROW_DOWN:
                    if (y === 0)
                        this.snake.direction = { x: 0, y: this.config.cell }
                    break
                default:
            }
        })
    }
}
