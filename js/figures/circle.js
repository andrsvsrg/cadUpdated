// All figures must need methods: start(on created), update(on mouse move),
// clickUpdate, draw(draw completed figure), collapse( collapse with animation)
// createIntersectionPoint
// interface TS must have!



import { PopUpDecorator } from '../mixins/popUpDecorator.js'

export class Circle {
  constructor({x,y, radius = 0}, ) {
    this.x = x
    this.y = y
    this.radius = radius
    this.intersectionPoints = []
    this._totalClick = 2
    this.endAngle = Math.PI * 2
    this.isFinishedDraw = false
  }

  totalCreated(ctx, figures, isClick = false) {
    switch (this._totalClick) {
      case 2: {
        ctx.beginPath()
        this._totalClick -= 1
        break
      }
      case 1: {
        this.draw(ctx)
        if (isClick) {
          this._totalClick -= 1
          this.isFinishedDraw = true
          this.showPopUp('Circle')
        }
        break
      }
      default:
        break
    }
  }

  updateRadius({x , y}) {
    if (this.x && this.y && x && y) {
      const fullLine = Math.sqrt(Math.pow((x - this.x), 2) + Math.pow((y - this.y), 2))  // d2= (х2— х1)2+ (y2— y1)2.
      this.radius = fullLine
    }
  }


  start(ctx) {
    this.totalCreated(ctx)
  }

  update(ctx, {x , y}, figures) {
    this.updateRadius({x , y})
    this.totalCreated(ctx, figures)
  }

  clickUpdate(ctx, figures) {
    this.totalCreated(ctx, figures, true)
  }

  createIntersectionPoint(ctx, figures) {

  }

  collapse() {
    const totalPartCircles = 180
    const cutCircleLength = (Math.PI * 2) / totalPartCircles
    this.endAngle = this.endAngle - cutCircleLength
  }

  draw(ctx) {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, this.endAngle)
    ctx.stroke()
  }
}

Object.assign(Circle.prototype, PopUpDecorator)