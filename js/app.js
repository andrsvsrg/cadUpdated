import { Canvas } from './canvas.js'
import { Adapter } from './API/adapter.js'

export class App {
  constructor() {
    this.canvas = new Canvas()
    this.button = document.querySelector('.collapse-btn')
    this.getApiButton = document.querySelector('.get-data-btn')
  }

  onUpdateMousePosition(e) {
    const positionX = e.offsetX < 0 ? 0 : e.offsetX
    const positionY = e.offsetY < 0 ? 0 : e.offsetY
    this.canvas.mousePosition = { x: positionX, y: positionY }
    if(this.canvas.temporaryFigure !== null) {
      this.canvas.updateDraw()
    }
  }

  async getFiguresFromApi() {
    if(this.canvas.isCollapsed) {
      return
    }
    const adapter = new Adapter()
    const figuresFromApi = await adapter.getFromApi()
    this.canvas.setFigures(figuresFromApi)

  }

  onCancelCreateLine() {
    this.canvas.onCancelDraw()
  }

  onCollapseClick() {
    if(this.canvas.figures.length !==0) {
      this.canvas.collapseAll()
    }
  }

  onCanvasClick() {
    this.canvas.startDraw()
  }

  addListeners() {
    this.canvas.init()
    this.getApiButton.addEventListener('click', this.getFiguresFromApi.bind(this))
    this.button.addEventListener('click', this.onCollapseClick.bind(this))
    this.canvas.canvasArea.addEventListener('contextmenu', this.onCancelCreateLine.bind(this))
    this.canvas.canvasArea.addEventListener('mousemove', this.onUpdateMousePosition.bind(this))
    this.canvas.canvasArea.addEventListener('click', this.onCanvasClick.bind(this))
  }

  init() {
    this.addListeners()
  }
}



