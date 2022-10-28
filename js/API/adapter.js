import { Circle } from '../figures/circle.js'
import { Line } from '../figures/line.js'
import { classes } from '../canvas.js'

export class Adapter {
  constructor() {
    this.rawData = null
    this.figures = []
  }

  async getFromApi() {
    this.rawData = null
    this.figures = []
    try {
      await fetch('https://6348154cdb76843976b9f18e.mockapi.io/figures')
        .then((res) => res.json())
        .then((data) => {
          this.rawData = data[0]
        })
      await this.adaptToApp()
      return this.figures
    } catch (error) {
      alert(error.message)
    }

  }

  adaptToApp() {
    const data = this.rawData
    for (let figureClass in data) {
      data[figureClass].forEach((coord) => {
        switch (figureClass) {
          case 'Line': {
            const [startX, startY, endX, endY] = coord
            const line = new classes[figureClass]({ x: startX, y: startY, endX, endY })
            this.figures.push(line)
            break
          }
          case 'Circle': {
            const [x, y, radius] = coord
            const circle = new classes[figureClass]({ x, y, radius })
            this.figures.push(circle)
            break
          }
          case 'Triangle' : {
            const [[startX1, startY1, endX1, endY1], [startX2, startY2, endX2, endY2], [startX3, startY3, endX3, endY3]] = coord
            const triangle = new classes[figureClass]({ x: startX1, y: startY1 })
            triangle.secondLine = new Line({ x: startX2, y: startY2 })
            triangle.thirdLine = new Line({ x: startX3, y: startY3 })
            triangle.firstLine.endX = endX1
            triangle.firstLine.endY = endY1
            triangle.secondLine.endX = endX2
            triangle.secondLine.endY = endY2
            triangle.thirdLine.endX = endX3
            triangle.thirdLine.endY = endY3
            this.figures.push(triangle)
            break
          }
          default:
            break
        }
      })
    }
  }

  async sendToApi() {

  }

  adaptForApi() {

  }


}