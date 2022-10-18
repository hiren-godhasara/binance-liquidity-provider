const { server } = require("../config");
const { getAccountDetails } = require("./accountInfoService");
const { getBinanceExchangeInfo } = require("./exchangeInfoService");
const { connectWs } = require("./websocketService");

exports.bootstrapProcess = async () => {
    console.log("\x1b[34m",'\n------ Bootstrap process starting  Wait a moment ---------');
    await getBinanceExchangeInfo();
    await connectWs();
    await getAccountDetails();
    console.log("\x1b[34m",'\n------ Bootstrap process completed successfully ---------');
    console.log("\x1b[33m",'Just trigger below POST API with required data to start Liquidity provideing\n');
    console.log("\x1b[32m",`http://localhost:${server.port}/api/v1/liquidity-provide`);
    console.log("\x1b[0m");
}


