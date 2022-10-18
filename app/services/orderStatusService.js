const axios = require('axios');
const crypto = require('crypto');
const { URL,server } = require('../config');
const APIKEY = server.APIKEY;
const APISECRET =server.APISECRET;

exports.getOrder = async (symbol='BTCUSDT', orderId=4868224 ) => {
    try {
        const recvWindow = 5000;
        const timestamp = new Date().getTime();
        const query = `symbol=${symbol}&orderId=${orderId}&recvWindow=${recvWindow}&timestamp=${timestamp}`;
        const signature = crypto.createHmac('sha256', APISECRET).update(query).digest('hex');
        const headers = { 'X-MBX-APIKEY': APIKEY };
        const res = await axios.get(`${URL.TEST_BASE_URL}/v3/order?${query}&signature=${signature}`, { headers: headers });
        console.log(res.data);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}