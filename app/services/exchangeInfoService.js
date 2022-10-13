const axios = require('axios');
const { DATA_NOT_FOUND } = require('../config/responseMessage');

global.pairs = {};

exports.getBinanceExchangeInfo = async () => {
    try {
        let resp = await axios.get('https://api3.binance.com/api/v3/exchangeInfo')
        let symbols = resp.data.symbols;
        if (!symbols || !symbols.length) {
            console.log(DATA_NOT_FOUND.message);
            return;
        }
        for (let i = 0; i < symbols.length; i++) {
            var singleSymbol = symbols[i];
            let objSymbol = {};
            objSymbol.s = singleSymbol.symbol;
            objSymbol.STS = singleSymbol.status;
            objSymbol.BA = singleSymbol.baseAsset;
            objSymbol.QA = singleSymbol.quoteAsset;
            for (let filter of singleSymbol.filters) {
                switch (filter.filterType) {
                    case "PRICE_FILTER":
                        objSymbol.MIP = Number(filter.minPrice);
                        objSymbol.MXP = Number(filter.maxPrice);
                        var tickSize = (filter.tickSize).indexOf('1') - 1;
                        objSymbol.TS = tickSize == -1 ? 0 : tickSize
                        objSymbol.TSF = (tickSize == -1 ? "1.0-0" : "1." + tickSize + "-" + tickSize);
                        break;
                    case "PERCENT_PRICE":
                        objSymbol.MU = Number(filter.multiplierUp);
                        objSymbol.MD = Number(filter.multiplierDown);
                        objSymbol.APM = Number(filter.avgPriceMins);
                        break;
                    case "LOT_SIZE":
                        objSymbol.MIQ = Number(filter.minQty);
                        objSymbol.MXQ = Number(filter.maxQty);
                        var stepSize = (filter.stepSize).indexOf('1') - 1;
                        objSymbol.SS = stepSize == -1 ? 0 : stepSize
                        objSymbol.SSF = (stepSize == -1 ? "1.0-0" : "1." + stepSize + "-" + stepSize);
                        break;
                    case "MIN_NOTIONAL":
                        objSymbol.MIN = Number(filter.minNotional);
                        break;
                    case "MAX_NUM_ORDERS":
                        objSymbol.MXO = Number(filter.maxNumOrders);
                        break;
                }
            }
            if (objSymbol.STS === 'TRADING') {
                pairs[`${singleSymbol.symbol}`] = objSymbol
            }
            setTimeout(() => {
                module.exports.getBinanceExchangeInfo();
            }, 3600000);
        }
    } catch (error) {
        console.log(error)
    }

}


