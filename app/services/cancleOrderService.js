const axios = require('axios');
const crypto = require('crypto');
const { URL } = require('../config');
const APIKEY = process.env.APIKEY;
const APISECRET = process.env.APISECRET;



exports.cancleOrder = async (symbol, orderId) => {
    try {
        const recvWindow = 5000;
        const timestamp = new Date().getTime();
        const query = `symbol=${symbol}&orderId=${orderId}&recvWindow=${recvWindow}&timestamp=${timestamp}`;
        const signature = crypto.createHmac('sha256', APISECRET).update(query).digest('hex');
        const headers = { 'X-MBX-APIKEY': APIKEY };
        const res = await axios.delete(`${URL.TEST_BASE_URL}/v3/order?${query}&signature=${signature}`, { headers: headers });
        console.log(res.data);
        return res.data;
    } catch { }
}