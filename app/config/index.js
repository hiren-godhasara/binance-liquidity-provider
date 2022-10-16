require('dotenv').config();

exports.server = {
  port: process.env.PORT,
  db_url: process.env.DATABASE_URL
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
  TEST_BASE_URL: process.env.TEST_BASE_URL,
  BINANCE_BASE_URL: process.env.BINANCE_BASE_URL
}

exports.cors = {
  origin: '*'
};

exports.response = {
  messages: require('./responseMessage')
};
