// All figures must need methods: start(on created), update(on mouse move),
// clickUpdate(onClick), draw(draw completed figure), collapse( collapse with animation)
// createIntersectionPoint
// interface TS must have!


import { Point } from './point.js'
import { intersectionsPointLine } from '../mixins/intersectionsPoint.js'
import { PopUpDecorator } from '../mixins/popUpDecorator.js'

export class Line {
  constructor(options) {
    this.startX = options.x
    this.startY = options.y
    this.endX = options.endX
    this.endY = options.endY
    this.fullLengthLine = 0
    this._totalClick = 2        // to created figure
    this.intersectionPoints = []
    this.isFinishedDraw = false
  }

  totalCreated(ctx, figures, isClick = false) {
    switch (this._totalClick) {
      case 2: {
        ctx.beginPath()
        ctx.moveTo(this.startX, this.startY)
        this._totalClick -= 1
        break
      }
      case 1: {
        this.draw(ctx)
        this.intersectionPoints = []
        this.createIntersectionPoint(ctx, figures)
        if (isClick) {
          this._totalClick -= 1
          this.isFinishedDraw = true
          this.showPopUp('Line')
        }
        break
      }
      default:
        break
    }
  }

  start(ctx) {
    this.totalCreated(ctx)
  }

  clickUpdate(ctx, figures) {
    this.totalCreated(ctx, figures, true)
  }

  update(ctx, { x: endX, y: endY }, figures) {
    this.endX = endX
    this.endY = endY
    this.totalCreated(ctx, figures)
  }

  draw(ctx) {
    ctx.beginPath()
    ctx.moveTo(this.startX, this.startY)
    ctx.lineTo(this.endX, this.endY)
    ctx.stroke()
  }

  createPoint(x, y) {
    const point = new Point({ x, y })
    return point
  }

  checkEndLinePositionForPoint() {
    const { startX, startY, endX, endY } = this

    this.intersectionPoints.forEach((point) => {
      const { x, y } = point
      const minMaxX = [Math.floor(x - 3), Math.floor(x + 3)]
      const minMaxY = [Math.floor(y - 3), Math.floor(y + 3)]

      const conditionStartPoint = !!(minMaxX[0] < Math.floor(startX) && Math.floor(startX) < minMaxX[1] && minMaxY[0] < Math.floor(startY) && Math.floor(startY) < minMaxY[1])
      const conditionEndPoint = !!(minMaxX[0] < Math.floor(endX) && Math.floor(endX) < minMaxX[1] && minMaxY[0] < Math.floor(endY) && Math.floor(endY) < minMaxY[1])

      if (conditionStartPoint || conditionEndPoint) {
        this.intersectionPoints = this.intersectionPoints.filter((pointFilter) => pointFilter !== point)
      }
    })
  }

  getPositionIntersection(allFigures) {
    let points = []
    allFigures.forEach((figure) => {
      const intersectionPoints = this.getIntersectionForLine(this, figure)
      if (intersectionPoints) {
        points.push(...intersectionPoints)
      }
    })
    return points
  }

  createIntersectionPoint(ctx, figures) {
    if (figures.length > 0) {
      const pointsCoordinates = this.getPositionIntersection(figures)
      if (pointsCoordinates) {
        pointsCoordinates.forEach(([x, y]) => {
          const point = this.createPoint(x, y)
          point.draw(ctx)
          this.intersectionPoints.push(point)
        })
      }
    }
  }

  getFullLength() {
    if (this.startX && this.startY && this.endX && this.endY) {
      const fullLine = Math.sqrt(Math.pow((this.endX - this.startX), 2) + Math.pow((this.endY - this.startY), 2))  // d2= (х2— х1)2+ (y2— y1)2.
      this.fullLengthLine = fullLine
    }
  }

  getDecreaseLength() {
    const totalPartLine = 180
    const cutLengthFromLine = this.fullLengthLine / (totalPartLine / 2)
    return cutLengthFromLine
  }

  getNextPosition() {
    this.getFullLength()
    const decreaseLength = this.getDecreaseLength()
    const k = decreaseLength / this.fullLengthLine

    const newStartX = this.startX + (this.endX - this.startX) * k
    const newStartY = this.startY + (this.endY - this.startY) * k

    const newEndX = this.endX + (this.startX - this.endX) * k
    const newEndY = this.endY + (this.startY - this.endY) * k

    return [newStartX, newStartY, newEndX, newEndY]
  }


  collapse() {
    this.checkEndLinePositionForPoint()
    const [newStartX, newStartY, newEndX, newEndY] = this.getNextPosition()
    this.startX = newStartX
    this.startY = newStartY
    this.endX = newEndX
    this.endY = newEndY
  }
}

Object.assign(Line.prototype, intersectionsPointLine)
Object.assign(Line.prototype, PopUpDecorator)

