/* eslint-disable @lwc/lwc/no-async-operation */
import { LightningElement } from 'lwc'
import { Snake, DIRECTION } from './SnakeService'
import { getRandomNumber, EVENT_NAME } from 'c/utils'

const CELL_SIZE = 32
const CANVAS_DIMENSION_MULTIPLIER = 15
const CANVAS_DIMENSION = CELL_SIZE * CANVAS_DIMENSION_MULTIPLIER
const SNAKE_COLOR = '--color-snake'
const APPLE_COLOR = '--color-apple'
const CONTROLS = {
    ARROW_UP: 'ArrowUp',
    ARROW_LEFT: 'ArrowLeft',
    ARROW_DOWN: 'ArrowDown',
    ARROW_RIGHT: 'ArrowRight',
}
const FOOD = ['🍓', '🍑', '🍎', '🍒']

/**
 * @typedef {object} coordinates
 * @property {number} x - x on canvas
 * @property {number} y - y on canvas
 */

export default class SnakeGame extends LightningElement {
    /** @type {coordinates} */
    apple = {
        x: 320,
        y: 320,
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
        this.snake = new Snake(160, 160, this.config.cell, 6, DIRECTION.RIGHT)
        document.addEventListener(EVENT_NAME.KEYDOWN, event =>
            this._registerKeys.call(this, event)
        )
    }

    disconnectedCallback() {
        document.removeEventListener(EVENT_NAME.KEYDOWN, this._registerKeys)
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

        requestAnimationFrame(this.animate.bind(this))

        this._isFirstRender = false
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this))

        this.config.speed++

        if (this.config.speed < 16) return
        if (!this.food) this.food = FOOD[getRandomNumber(0, FOOD.length)]

        this.config.speed = 0
        this.canvasContext.clearRect(
            0,
            0,
            this.config.canvas.width,
            this.config.canvas.height
        )

        this.snake.moveHead()

        if (this.snake.xPosition < 0) {
            this.snake.xPosition = this.config.canvas.width - this.config.cell
        } else if (this.snake.xPosition >= this.config.canvas.width) {
            this.snake.xPosition = 0
        }

        if (this.snake.yPosition < 0) {
            this.snake.yPosition = this.config.canvas.height - this.config.cell
        } else if (this.snake.yPosition >= this.config.canvas.height) {
            this.snake.yPosition = 0
        }

        this.snake.moveTail()

        this.canvasContext.globalAlpha = 0
        this.canvasContext.fillStyle = this.colors.apple
        this.canvasContext.fillRect(
            this.apple.x,
            this.apple.y,
            this.config.cell - 1,
            this.config.cell - 1
        )
        this.canvasContext.globalAlpha = 1
        this.canvasContext.font = `${CELL_SIZE}px serif`
        this.canvasContext.textAlign = 'center'
        this.canvasContext.textBaseline = 'middle'
        this.canvasContext.fillText(
            this.food,
            this.apple.x + this.config.cell / 2,
            this.apple.y + this.config.cell / 2
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
                this.food = null
                this.snake.grow()
                this.apple.x =
                    getRandomNumber(0, CANVAS_DIMENSION_MULTIPLIER) *
                    this.config.cell
                this.apple.y =
                    getRandomNumber(0, CANVAS_DIMENSION_MULTIPLIER) *
                    this.config.cell
            }
            for (let i = index + 1; i < this.snake.tail.length; i++) {
                if (
                    cell.x === this.snake.tail[i].x &&
                    cell.y === this.snake.tail[i].y
                ) {
                    this.snake = new Snake(
                        160,
                        160,
                        this.config.cell,
                        6,
                        DIRECTION.RIGHT
                    )
                    this.apple.x =
                        getRandomNumber(0, CANVAS_DIMENSION_MULTIPLIER) *
                        this.config.cell
                    this.apple.y =
                        getRandomNumber(0, CANVAS_DIMENSION_MULTIPLIER) *
                        this.config.cell
                    break
                }
            }
        })
    }

    _registerKeys(event) {
        console.log(event.key)
        const direction = this.snake.direction

        switch (event.key) {
            case CONTROLS.ARROW_LEFT:
                if (direction !== DIRECTION.RIGHT) {
                    this.snake.turn(DIRECTION.LEFT)
                }
                break
            case CONTROLS.ARROW_RIGHT:
                if (direction !== DIRECTION.LEFT) {
                    this.snake.turn(DIRECTION.RIGHT)
                }
                break
            case CONTROLS.ARROW_UP:
                if (direction !== DIRECTION.DOWN) {
                    this.snake.turn(DIRECTION.UP)
                }
                break
            case CONTROLS.ARROW_DOWN:
                if (direction !== DIRECTION.UP) {
                    this.snake.turn(DIRECTION.DOWN)
                }
                break
            default:
        }
    }
}
