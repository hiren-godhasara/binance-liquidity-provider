const liquidtyProviderRoute = require('./liquidtyProviderRoute');

module.exports = async(fastify) => {
    fastify.log.info('Registering the routes started');
    await liquidtyProviderRoute(fastify);
    fastify.log.info('Registering the routes completed');
};



