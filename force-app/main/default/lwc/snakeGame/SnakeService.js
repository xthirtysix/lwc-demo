export class Snake {
    defaultValues = {}
    _x
    _y
    _tail = []
    directionX = 0
    directionY = 0
    set x(value) {
        this._x = value
    }
    get x() {
        return this._x
    }
    set y(value) {
        this._y = value
    }
    get y() {
        return this._y
    }
    set tail(value) {
        this._tail = value
    }
    get tail() {
        return this._tail
    }
    set direction({ x, y }) {
        this.directionX = x
        this.directionY = y
    }
    get direction() {
        return { x: this.directionX, y: this.directionY }
    }
    size = 0

    constructor(
        startX = 0,
        startY = 0,
        speed = 10,
        isVertical = false,
        size = 4
    ) {
        this.defaultValues = {
            x: startX,
            y: startY,
            directionX: isVertical ? 0 : speed,
            directionY: isVertical ? speed : 0,
            tail: [],
            size: size,
        }

        this._x = startX
        this._y = startY
        this.directionX = isVertical ? 0 : speed
        this.directionY = isVertical ? speed : 0
        this._tail = []
        this.size = size
    }

    reset() {
        for (const [key, value] of Object.entries(this.defaultValues)) {
            this[key] = value
        }
    }

    turn() {
        this._x += this.direction.x
        this._y += this.direction.y
    }

    move() {
        this.tail.unshift({ x: this.x, y: this.y })

        if (this.tail.length > this.size) {
            this.tail.pop()
        }
    }

    grow() {
        this.size++
    }
}

export const CONTROLS = {
    ARROW_UP: 'ArrowUp',
    ARROW_LEFT: 'ArrowLeft',
    ARROW_DOWN: 'ArrowDown',
    ARROW_RIGHT: 'ArrowRight',
}
