import { Observer, Observable } from './figuresObserver.js'

import { Line } from './figures/line.js'
import { Circle } from './figures/circle.js'
import { Triangle } from './figures/triangle.js'

export const classes = {
  Line,
  Circle,
  Triangle
}

let canvas

export class Canvas {
  constructor() {
    if(!canvas) canvas = this
    this.canvasArea = document.querySelector('.canvas')
    this.ctx = this.canvasArea.getContext('2d')
    this.width = this.canvasArea.width
    this.height = this.canvasArea.height
    this.figures = []
    this.temporaryFigure = null
    this.currentFigure = 'Line'
    this.mousePosition = { x: 0, y: 0 }
    this.isCollapsed = false
    this.totalAnimationPart = 180
    return canvas
  }


  startDraw() {
    if (this.isCollapsed) {
      return
    }
    if (this.temporaryFigure === null) {
      const newFigure = new classes[this.currentFigure](this.mousePosition)
      newFigure.start(this.ctx)
      this.temporaryFigure = newFigure
    } else {
      this.clearArea()
      if (this.figures.length !== 0) {
        this.drawAll()
      }
      this.temporaryFigure.clickUpdate(this.ctx, this.figures)

      if (this.temporaryFigure.isFinishedDraw) {
        this.figures = [...this.figures, this.temporaryFigure]
        this.temporaryFigure = null
      }
    }
  }

  updateDraw() {
    if (this.isCollapsed) {
      return
    }
    if (this.temporaryFigure !== null) {
      this.clearArea()
      if (this.figures.length !== 0) {
        this.drawAll()
      }
      this.temporaryFigure.update(this.ctx, this.mousePosition, this.figures)
    }
  }

  onCancelDraw() {
    this.temporaryFigure = null
    this.clearArea()
    this.drawAll()
  }

  clearAllData() {
    this.figures = []
    this.temporaryFigure = null
  }

  drawAll() {
    if (this.figures.length !== 0) {
      this.figures.forEach((figure) => {
        figure.draw(this.ctx)
        figure.intersectionPoints.forEach((point) => point.draw(this.ctx))
      })
    }
  }

  clearArea() {
    this.ctx.clearRect(0, 0, this.width, this.height)
  }

  animationCollapse() {
    this.totalAnimationPart--
    this.clearArea()
    this.figures.forEach((figure) => {
      figure.collapse()
    })
    this.drawAll()
    if (this.totalAnimationPart > 0) {
      requestAnimationFrame(this.animationCollapse.bind(this))
    } else {
      this.clearArea()
      this.clearAllData()
      this.totalAnimationPart = 180
      this.isCollapsed = false
    }
  }

  setFigures(figures) {
    this.figures = figures
    this.figures.forEach((figure) => {
     figure.createIntersectionPoint(this.ctx, figures)
    })
    this.clearArea()
    this.drawAll()
  }

  collapseAll() {
    this.isCollapsed = true
    this.animationCollapse()
  }

  createButtonsObserver() {
    const figureType = new Observer((state) => {
      this.currentFigure = state
    })
    const buttonObservable = new Observable()
    buttonObservable.addAllListeners()
    buttonObservable.subscribe(figureType)
  }

  init() {
    this.createButtonsObserver()
  }

}
