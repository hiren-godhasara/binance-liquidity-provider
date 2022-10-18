require('dotenv').config();

exports.server = {
  port: 8000,
  APIKEY:process.env.APIKEY,
  APISECRET:process.env.APISECRET
};

exports.swagger = {
  routePrefix: '/doc',
  exposeRoute: true,
  swagger: {
    info: {
      title: 'Binance Liqudity Provider Swagger',
      version: '1.0.0'
    },
    externalDocs: {
      url: 'https://swagger.io',
      description: 'Find more info here'
    },
    host: `localhost:${this.server.port}`,
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json']
  }
};

exports.URL = {
  TEST_BASE_URL: 'https://testnet.binance.vision/api',
  BINANCE_BASE_URL: 'https://api3.binance.com/api'
}

exports.cors = {
  origin: '*'
};

exports.response = {
  messages: require('./responseMessage')
};
