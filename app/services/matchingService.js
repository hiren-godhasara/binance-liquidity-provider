const { LiqudityProvider } = require("../models");
const { cancleOrder } = require("./cancleOrderService");
const { placeOrder } = require("./orderPlaceService");
let allOrderData = {};

exports.checkOrderPrice = async (tickers) => {
    for (let i = 0; i < tickers.length; i++) {
        const ticker = tickers[i];
        if (!allOrderData[ticker.s]) {
            continue;
        }
        for (let j = 0; j < allOrderData[ticker.s].length; j++) {
            const order = allOrderData[ticker.s][j];
            process.stdout.write("ask: "+order.askPrice+" lastPrice: " + Number(ticker.c) + " bid: " +order.bidPrice+" \r");
            if (order.askPrice <= Number(ticker.c) || order.bidPrice >= Number(ticker.c)) {
                this.orderMatched(order);
                await allOrderData[ticker.s].splice(j, 1);
                j--;
            }
        }
    }
}

exports.orderMatched = async (order) => {
    try {
        await cancleOrder(order.symbol, order.askOrderId);
        await cancleOrder(order.symbol, order.bidOrderId);
        const { symbol, askAmount, bidAmount, askDifference, bidDifference } = order;
        const symbolData = global.pairs[symbol];
        if (!symbolData) {
            console.log('Pair not available.');
            return
        }
        if (symbolData.MIQ > askAmount || symbolData.MAQ < askAmount) {
            console.log('Order ask amount is invalid.');
            return
        }
        if (symbolData.MIQ > bidAmount || symbolData.MAQ < bidAmount) {
            console.log('Order bid amount is invalid.');
            return
        }
        const validMinPrice = Math.max(symbolData.MIP, symbolData.c * symbolData.MD);
        const validMaxPrice = Math.min(symbolData.MXP, symbolData.c * symbolData.MU);
        const askPrice = symbolData.c + askDifference;
        if (validMinPrice > askPrice || validMaxPrice < askPrice) {
            console.log(`Order ask difference is invalid at price ${symbolData.c}.`);
            return
        }
        const bidPrice = symbolData.c - bidDifference;
        if (validMinPrice > bidPrice || validMaxPrice < bidPrice) {
            console.log(`Order bid difference is invalid at price ${symbolData.c}.`);
            return
        }
        if ((askAmount * askPrice < symbolData.MIN) || (bidAmount * bidPrice < symbolData.MIN)) {
            console.log(`minNotional filter failed at price ${symbolData.c}.`);
            return
        }
        const askOrderData = await placeOrder({ symbol, side: 'SELL', type: 'LIMIT', quantity: askAmount, price: askPrice });
        const bidOrderData = await placeOrder({ symbol, side: 'BUY', type: 'LIMIT', quantity: bidAmount, price: bidPrice });
        const updatedData = {symbol, askAmount, bidAmount, askDifference, bidDifference, askPrice, bidPrice,askOrderId: askOrderData.orderId, bidOrderId: bidOrderData.orderId, startPrice: symbolData.c}
        this.sendForMatching(updatedData);
    } catch (error) {
        console.log(error);
    }
}

exports.sendForMatching = async (order) => {
    if (!allOrderData[order.symbol]) {
        allOrderData[order.symbol] = [];
    }
    allOrderData[order.symbol].push(order);
}