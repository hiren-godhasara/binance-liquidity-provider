const { liqudityController } = require('../controllers');
const { utils } = require('../helpers');
const { liquidtyProviderSchemas } = require('../schemas');

module.exports = async (fastify) => {
  await utils.routesRegister(fastify, [
    {
      method: 'POST',
      path: '/api/v1/liquidity-provide',
      schema: liquidtyProviderSchemas.postSchema,
      handler: liqudityController.provideLiqudity,
    },
  ]);
};
