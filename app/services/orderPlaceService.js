const axios = require('axios');
const crypto = require('crypto');
const { URL,server } = require('../config');
const APIKEY = server.APIKEY;
const APISECRET = server.APISECRET;

exports.placeOrder = async ({ symbol, side, type, quantity, price, }) => {
    try {
        const recvWindow = 5000;
        const timestamp = new Date().getTime();
        const timeInForce = 'GTC';
        const query = `symbol=${symbol}&side=${side}&type=${type}&timeInForce=${timeInForce}&quantity=${quantity}&price=${price}&recvWindow=${recvWindow}&timestamp=${timestamp}`;
        const signature = crypto.createHmac('sha256', APISECRET).update(query).digest('hex');
        const headers = { 'X-MBX-APIKEY': APIKEY };
        const res = await axios.post(`${URL.TEST_BASE_URL}/v3/order`, `${query}&signature=${signature}`, { headers: headers });
        console.log(res.data);
        return res.data;
    } catch (error) {
        console.log(error);
        if(error&&error.response.data&&error.response.data.msg)
        error.message=error.response.data.msg;
        throw error
    }
}