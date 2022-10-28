// All figures must need methods: start(on created), update(on mouse move),
// clickUpdate(onClick), draw(draw completed figure), collapse( collapse with animation)
// createIntersectionPoint
import { Line } from './line.js'
import { PopUpDecorator } from '../mixins/popUpDecorator.js'

export class Triangle {
  constructor({x,y,}) {
    this.firstLine = new Line({x,y})
    this.secondLine = null
    this.thirdLine = null
    this._totalClick = 3
    this.intersectionPoints =[]
    this.isFinishedDraw = false
  }

  totalCreated(ctx, figures, isClick = false) {
    switch (this._totalClick) {
      case 3: {
        this._totalClick -= 1
        break
      }
      case 2: {
        this.firstLine.draw(ctx)
        this.firstLine.intersectionPoints = []
        this.firstLine.createIntersectionPoint(ctx, figures)
        if (isClick) {
          this._totalClick -= 1
          this.intersectionPoints = [...this.firstLine.intersectionPoints]
          this.firstLine.clickUpdate(ctx, figures, true)
          this.createSecondLine(ctx)
        }
        break
      }
      case 1: {
        this.firstLine.draw(ctx)
        this.firstLine.createIntersectionPoint(ctx, figures)
        this.secondLine.draw(ctx)
        this.secondLine.intersectionPoints = []
        this.secondLine.createIntersectionPoint(ctx, figures)
        if (isClick) {
          this._totalClick -= 1
          this.secondLine.clickUpdate(ctx, figures, true)
          this.intersectionPoints = [...this.intersectionPoints,...this.secondLine.intersectionPoints]
          this.createThirdLine(ctx, figures)
          this.intersectionPoints = [...this.intersectionPoints,...this.thirdLine.intersectionPoints]
          this.isFinishedDraw = true
          this.showPopUp('Triangle')
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

  update(ctx, { x, y }, figures) {
    console.log()
    this.updateLinePosition({ x, y })
    this.totalCreated(ctx, figures)
  }

  clickUpdate(ctx, figures) {
    this.totalCreated(ctx, figures, true)
  }

  draw(ctx) {
    this.firstLine.draw(ctx)
    this.secondLine.draw(ctx)
    this.thirdLine.draw(ctx)
  }

  collapse() {
    this.firstLine.collapse()
    this.secondLine.collapse()
    this.thirdLine.collapse()
  }

  createIntersectionPoint() {

  }

  createSecondLine(ctx) {
    const startX = this.firstLine.endX
    const startY = this.firstLine.endY
    this.secondLine = new Line({ x: startX, y: startY })
    this.secondLine.start(ctx)
  }

  createThirdLine(ctx, figures) {
    const startX = this.secondLine.endX
    const startY = this.secondLine.endY
    this.thirdLine = new Line({ x: startX, y: startY })
    this.thirdLine.endX = this.firstLine.startX
    this.thirdLine.endY = this.firstLine.startY
    this.thirdLine.clickUpdate(ctx, figures)
    this.thirdLine.draw(ctx)
    this.thirdLine.createIntersectionPoint(ctx, figures)
  }


  updateLinePosition({ x, y }) {
    if (this._totalClick === 2) {
      this.firstLine.endX = x
      this.firstLine.endY = y
    } else if (this._totalClick === 1) {
      this.secondLine.endX = x
      this.secondLine.endY = y
    }
  }
}

Object.assign(Triangle.prototype, PopUpDecorator)