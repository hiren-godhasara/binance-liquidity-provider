const axios = require('axios');
const crypto = require('crypto');
const { URL } = require('../config');
const APIKEY = process.env.APIKEY;
const APISECRET = process.env.APISECRET;

exports.getAccountDetails = async () => {
    try {
        const recvWindow = 5000;
        const timestamp = new Date().getTime();
        const query = `recvWindow=${recvWindow}&timestamp=${timestamp}`;
        const signature = crypto.createHmac('sha256', APISECRET).update(query).digest('hex');
        const headers = { 'X-MBX-APIKEY': APIKEY };
        const res = await axios.get(`${URL.TEST_BASE_URL}/v3/account?${query}&signature=${signature}`, { headers: headers });
        console.log(res.data.balances);
        return res;
    } catch (error) {
        console.log(error);
        if (error && error.response.data && error.response.data.msg) {
            error.message = error.response.data.msg
        }
        return error;
    }
}