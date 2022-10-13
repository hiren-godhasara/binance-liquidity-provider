const { getBinanceExchangeInfo } = require("./exchangeInfoService");
const { connectWs } = require("./websocketService");

exports.bootstrapProcess = async () => {

await getBinanceExchangeInfo();
await connectWs()
}


