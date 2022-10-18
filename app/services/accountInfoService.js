const axios = require('axios');
const crypto = require('crypto');
const { URL ,server} = require('../config');
const APIKEY = server.APIKEY;
const APISECRET = server.APISECRET;

exports.getAccountDetails = async () => {
    console.log("\x1b[33m",'\nGetting user Account information');
    try {
        const recvWindow = 5000;
        const timestamp = new Date().getTime();
        const query = `recvWindow=${recvWindow}&timestamp=${timestamp}`;
        const signature = crypto.createHmac('sha256', APISECRET).update(query).digest('hex');
        const headers = { 'X-MBX-APIKEY': APIKEY };
        const res = await axios.get(`${URL.TEST_BASE_URL}/v3/account?${query}&signature=${signature}`, { headers: headers });
        console.log("\x1b[0m","\nUserBalance : ",res.data.balances);
        return res;
    } catch (error) {
        console.log(error);
        if (error && error.response.data && error.response.data.msg) {
            error.message = error.response.data.msg
        }
        return error;
    }
}