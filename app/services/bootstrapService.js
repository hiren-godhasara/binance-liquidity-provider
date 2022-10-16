const { getAccountDetails } = require("./accountInfoService");
const { getBinanceExchangeInfo } = require("./exchangeInfoService");
const { getOrders } = require("./seedOrderService");
const { connectWs } = require("./websocketService");

exports.bootstrapProcess = async () => {
    await getBinanceExchangeInfo();
    await connectWs();
    await getOrders();
    await getAccountDetails();
    console.log('Bootstrap process completed.');
}


