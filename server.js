const WebSocket = require('ws');

class WebSocketServer {
  constructor(port) {
    this.wss = new WebSocket.Server({ port: port });
    this.clients = new Array();    
    this.wss.on('connection', (ws) => this.addClient(ws));
  }

  addClient(webSocket) {
    this.clients.push(webSocket);
    webSocket.on('message', (msg) => this.processMessage(webSocket, msg)); 
  }

  processMessage(ws, message) {
    console.log('received: %s', message);
    for (const socket of this.clients) {
      try {
        socket.send(message)
      } catch (error) {
        this.clients.filter((client) => client != ws)
      }
    }
  }
}

new WebSocketServer(8080)