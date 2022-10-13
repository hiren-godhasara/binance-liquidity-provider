const WebSocket = require('ws');
exports.connectWs = async () => {
     const ws = new WebSocket('wss://stream.binance.com:9443/stream');

     ws.on('open', function open() {
        ws.send(JSON.stringify({method:'SUBSCRIBE',params:['!miniTicker@arr@1000ms'],id:1}))
      });

      ws.on('message', function message(data) {
        console.log(JSON.parse(data))
      });

      ws.on('close', function close() {
        console.log('Binance Market WebSocket Closed');
        module.exports.tryToConnectWsAfterDisconnecting()
      });

      ws.on('error', function error(error) {
        console.log(error,'Binance Market WebSocket Error');
      });
      ws.on('ping', (e) => { 
      ws.pong(); 
    });

}


exports.tryToConnectWsAfterDisconnecting =()=>{
    setTimeout(() => {
        module.exports.connectWs();
    }, 1000);
} 