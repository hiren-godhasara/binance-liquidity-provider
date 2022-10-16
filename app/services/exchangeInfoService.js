const axios = require('axios');
const { URL } = require('../config');
global.pairs = {};

exports.getBinanceExchangeInfo = async () => {
    try {
        let resp = await axios.get(`${URL.BINANCE_BASE_URL}/v3/exchangeInfo`);
        let symbols = resp.data.symbols;
        if (!symbols || !symbols.length) {
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
                        objSymbol.TS = tickSize == -1 ? 0 : tickSize;
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
                        objSymbol.SS = stepSize == -1 ? 0 : stepSize;
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
                pairs[`${singleSymbol.symbol}`] = objSymbol;
            }
        }
        await this.getPair24hourChange()
        setTimeout(() => {
            module.exports.getBinanceExchangeInfo();
        }, 3600000); //1hour
    } catch (error) {
        console.log(error);
    }

}

exports.getPair24hourChange = async () => {
    try {
        let res = await axios.get(`${URL.BINANCE_BASE_URL}/v3/ticker/24hr`);
        let data = res.data;
        if (!data || !data.length) {
            return;
        }
        for (let i = 0; i < data.length; i++) {
            if (pairs[data[i].symbol] != undefined) {
                pairs[data[i].symbol].c = Number(data[i].lastPrice);
            }
        }
    } catch (error) {
        console.log(error);
    }
}


