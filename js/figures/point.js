
export class Point{
  constructor(options) {
    this.x = options.x
    this.y = options.y
    this.defaultRadius = 4
  }

  collapse(ctx) {
    if (this.defaultRadius === 0) {
      return
    }
    this.defaultRadius -= 4
    ctx.beginPath()
    ctx.moveTo(this.x, this.y)
    ctx.arc(this.x, this.y, this.defaultRadius, 0, Math.PI * 2, true)
    ctx.fillStyle = '#ff0000'
    ctx.fill()
  }

  draw(ctx) {
    ctx.beginPath()
    ctx.moveTo(this.x, this.y)
    ctx.arc(this.x, this.y, this.defaultRadius, 0, Math.PI * 2, true)
    ctx.fillStyle = '#ff0000'
    ctx.fill()
  }
}