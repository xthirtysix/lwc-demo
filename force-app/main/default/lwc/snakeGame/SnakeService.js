export const DIRECTION = /** @type {const} */ ({
    UP: 0,
    RIGHT: 1,
    DOWN: 2,
    LEFT: 3,
})

/**
 * @typedef coordinates
 * @param {number} x - x position on canvas
 * @param {number} y - y position on canvas
/**
 * @export
 * @class NewSnake
 */
export class Snake {
    /**
     * @constructor
     * @param  {number} x - x position on canvas
     * @param  {number} y - y position on canvas
     * @param  {number} cellSize - x and y dimensions of a snake's section
     * @param  {number} maxSize - current maximum size of a snake
     * @param  {0 | 1 | 2 | 3} direction - direction of movement
     */
    constructor(
        x = 0,
        y = 0,
        cellSize = 10,
        maxSize,
        direction = DIRECTION.RIGHT
    ) {
        this._x = x
        this._y = y
        this._speed = cellSize
        this._size = maxSize || 6
        this._direction = direction

        this._initialValues = {
            _x: this._x,
            _y: this._y,
            _speed: this._speed,
            _size: this._size,
            _direction: this._direction,
            _tail: [],
        }
    }

    /**
     * @type {coordinates[]} - snake's tail items on canvas
     * @memberof NewSnake
     */
    _tail = []

    /**
     * @type {object}
     * @descriptions initial values used to reset game on lose
     * @memberof NewSnake
     */
    _initialValues = {}

    /**
     * @method moveHead
     * @param {0 | 1 | 2 |3} direction
     * @see DIRECTION
     * @description turn snake in a way of direction
     */
    moveHead() {
        switch (this._direction) {
            case DIRECTION.UP:
                this._y = this._y - this._speed
                break
            case DIRECTION.RIGHT:
                this._x = this._x + this._speed
                break
            case DIRECTION.DOWN:
                this._y = this._y + this._speed
                break
            // case DIRECTION.LEFT
            default:
                this._x = this._x - this._speed
        }
    }

    /**
     * @method moveTail
     * @description move snake's tail
     */
    moveTail() {
        this._tail.unshift({ x: this._x, y: this._y })

        if (this._tail.length > this._size) {
            this._tail.pop()
        }
    }

    turn(direction) {
        this._direction = direction
    }

    /**
     * @method grow
     * @description increase snake's length after it ate a fruit
     */
    grow() {
        this._size++
    }

    /**
     * @method reset
     * @description reset game on lose
     */
    reset() {
        for (const [key, value] of Object.entries(this._initialValues)) {
            this[key] = value
            console.log(key, this[key])
        }
    }

    // GETTERS
    get xPosition() {
        return this._x
    }

    get yPosition() {
        return this._y
    }

    get tail() {
        return this._tail
    }

    get direction() {
        return this._direction
    }

    // SETTERS
    set xPosition(value) {
        this._x = value
    }

    set yPosition(value) {
        this._y = value
    }
}
