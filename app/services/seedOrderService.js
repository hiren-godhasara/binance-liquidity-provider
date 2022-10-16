const { LiqudityProvider } = require("../models");
const { sendForMatching } = require("./matchingService");
const { getOrder } = require("./orderStatusService");
const timer = ms => new Promise(res => setTimeout(res, ms));


exports.getOrders = async () => {
    const allOrders = await LiqudityProvider.find({ status: true });
    allOrders.forEach(async order => {
        const askStatusData = await getOrder(order.symbol, order.askOrderId);
        const bidStatusData = await getOrder(order.symbol, order.bidOrderId);
        if ((askStatusData && askStatusData.status == 'NEW') && (bidStatusData && bidStatusData.status == 'NEW')) {
            sendForMatching(order);
        } else {
            await LiqudityProvider.updateOne({ _id: order._id }, { status: false, err: `Stoped liquidity provide : Your order is filled` });
        }
        await timer(250);
    });
}