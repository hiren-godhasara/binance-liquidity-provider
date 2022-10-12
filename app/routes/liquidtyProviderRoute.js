const { utils } = require('../helpers');


module.exports = async (fastify) => {
  fastify.log.info('Liquidty provider route registration started');

  await utils.routesRegister(fastify, [
    
  ]);

  fastify.log.info('Liquidty provider route registration completed');
};
