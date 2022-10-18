const { utils } = require("../helpers");
const { orderPlaceService } = require("../services");
const { COMMON } = require('../config/responseMessage');
const { sendForMatching } = require("../services/matchingService");

exports.provideLiqudity = async (req, res) => {
    try {
        const { symbol, askAmount, bidAmount, askDifference, bidDifference } = req.body;
        const symbolData = global.pairs[symbol];
        if (!symbolData) {
            return utils.sendResponse(res, 404, `Pair not available.`, {}, {});
        }
        if (symbolData.MIQ > askAmount || symbolData.MAQ < askAmount) {
            return utils.sendResponse(res, 400, `Order askAmount is invalid.`, {}, {});
        }
        if (symbolData.MIQ > bidAmount || symbolData.MAQ < bidAmount) {
            return utils.sendResponse(res, 400, `Order bidAmount is invalid.`, {}, {});
        }
        const validMinPrice = Math.max(symbolData.MIP, symbolData.c * symbolData.MD);
        const validMaxPrice = Math.min(symbolData.MXP, symbolData.c * symbolData.MU);

        const askPrice = symbolData.c + askDifference;
        if (validMinPrice > askPrice || validMaxPrice < askPrice) {
            return utils.sendResponse(res, 400, `Order askDifference is invalid.`, {}, {});
        }
        const bidPrice = symbolData.c - bidDifference;
        if (validMinPrice > bidPrice || validMaxPrice < bidPrice) {
            return utils.sendResponse(res, 400, `Order bidDifference is invalid.`, {}, {});
        }
        if (askAmount * askPrice < symbolData.MIN || bidAmount * bidPrice < symbolData.MIN) {
            return utils.sendResponse(res, 400, `minNotional filter failed at price ${symbolData.c}.`, {}, {});
        }
        const askOrderData = await orderPlaceService.placeOrder({ symbol, side: 'SELL', type: 'LIMIT', quantity: askAmount, price: askPrice });
        const bidOrderData = await orderPlaceService.placeOrder({ symbol, side: 'BUY', type: 'LIMIT', quantity: bidAmount, price: bidPrice });
        const obj = { ...req.body, askPrice, bidPrice, askOrderId: askOrderData.orderId, bidOrderId: bidOrderData.orderId, startPrice: symbolData.c };
        sendForMatching(obj);
        return utils.sendResponse(res, 200, COMMON.SUCCESS, obj, {});
    } catch (error) {
        console.log(error);
        return utils.sendResponse(res, 500, error.message, {}, error);
    }

}