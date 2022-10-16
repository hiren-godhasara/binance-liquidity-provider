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
            process.stdout.write(" lastPrice : " + ticker.c + " \r");
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
        const orderData = await LiqudityProvider.findById(order._id);
        if (!orderData || !orderData.status) {
            return;
        }
        await cancleOrder(orderData.symbol, orderData.askOrderId);
        await cancleOrder(orderData.symbol, orderData.bidOrderId);
        const { symbol, askAmount, bidAmount, askDifference, bidDifference } = orderData;
        const symbolData = global.pairs[symbol];
        if (!symbolData) {
            return await LiqudityProvider.updateOne({ _id: orderData._id }, { err: 'Pair not available.' });
        }
        if (symbolData.MIQ > askAmount || symbolData.MAQ < askAmount) {
            return await LiqudityProvider.updateOne({ _id: orderData._id }, { err: 'Order ask amount is invalid.' });
        }
        if (symbolData.MIQ > bidAmount || symbolData.MAQ < bidAmount) {
            return await LiqudityProvider.updateOne({ _id: orderData._id }, { err: 'Order bid amount is invalid.' });
        }
        const validMinPrice = Math.max(symbolData.MIP, symbolData.c * symbolData.MD);
        const validMaxPrice = Math.min(symbolData.MXP, symbolData.c * symbolData.MU);
        const askPrice = symbolData.c + askDifference;
        if (validMinPrice > askPrice || validMaxPrice < askPrice) {
            return await LiqudityProvider.updateOne({ _id: orderData._id }, { err: `Order ask difference is invalid at price ${symbolData.c}.` });
        }
        const bidPrice = symbolData.c - bidDifference;
        if (validMinPrice > bidPrice || validMaxPrice < bidPrice) {
            return await LiqudityProvider.updateOne({ _id: orderData._id }, { err: `Order bid difference is invalid at price ${symbolData.c}.` });
        }
        if ((askAmount * askPrice < symbolData.MIN) || (bidAmount * bidPrice < symbolData.MIN)) {
            return await LiqudityProvider.updateOne({ _id: orderData._id }, { err: `minNotional filter failed at price ${symbolData.c}.` });
        }
        const askOrderData = await placeOrder({ symbol, side: 'SELL', type: 'LIMIT', quantity: askAmount, price: askPrice });
        const bidOrderData = await placeOrder({ symbol, side: 'BUY', type: 'LIMIT', quantity: bidAmount, price: bidPrice });
        const updatedData = await LiqudityProvider.findByIdAndUpdate(orderData._id, { askPrice, bidPrice, askOrderId: askOrderData.orderId, bidOrderId: bidOrderData.orderId, startPrice: symbolData.c }, { new: true });
        this.sendForMatching(updatedData);
    } catch (error) {
        await LiqudityProvider.updateOne({ _id: order._id }, { status: false, err: error.message });
        console.log(error);
    }
}

exports.sendForMatching = async (order) => {
    if (!allOrderData[order.symbol]) {
        allOrderData[order.symbol] = [];
    }
    allOrderData[order.symbol].push(order);
}