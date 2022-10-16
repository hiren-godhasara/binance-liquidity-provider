const { liqudityController } = require('../controllers');
const { utils } = require('../helpers');
const { liquidtyProviderSchemas } = require('../schemas');

module.exports = async (fastify) => {
  fastify.log.info('Liquidty provider route registration started');
  await utils.routesRegister(fastify, [
    {
      method: 'POST',
      path: '/api/v1/liquidity-provide',
      schema: liquidtyProviderSchemas.postSchema,
      handler: liqudityController.provideLiqudity,
    },
  ]);
  fastify.log.info('Liquidty provider route registration completed');
};
