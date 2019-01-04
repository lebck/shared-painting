const ws = new WebSocket('ws://localhost:8080')

ws.onopen = () => {
  ws.send('something')
}

ws.onmessage = (e) => {
  console.log("Received: %s", e.data)
}

window.addEventListener('load', () => {
  new DrawBoard(document, ws)
})


class DrawBoard {
  constructor(document, socket) {
      this.canvas = document.getElementById('canvas')
      this.context = this.canvas.getContext("2d")
      this.draw = false
      this.socket = socket

      this.socket.onmessage = (e) => {
        let coords = JSON.parse(e.data)
        this.drawPoint(coords)
      }
      this.enablePen(document, this.canvas)
  }

  enablePen(document, canvas) {
    document.addEventListener('mousedown', (e) => {
      if (e.target == canvas) this.draw = true
    }) 

    document.addEventListener('mousemove', (e) => {
      if (e.target == canvas && this.draw){
        let x = e.offsetX
        let y = e.offsetY
        let coords = {x: x, y: y, radius: 4}
        this.drawPoint(coords)
        this.sendMessage(coords)
      }
    })

    document.addEventListener('mouseup', (e) => {
      this.draw = false
    }) 
  }

  drawPoint(data) {
    this.context.beginPath();
    this.context.arc(data.x, data.y, data.radius, 0, 2 * Math.PI, true);
    this.context.fill();

  }

  sendMessage(data) {
    this.socket.send(JSON.stringify(data));
  }
}