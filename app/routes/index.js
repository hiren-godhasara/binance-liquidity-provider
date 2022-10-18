const liquidtyProviderRoute = require('./liquidtyProviderRoute');

module.exports = async(fastify) => {
    await liquidtyProviderRoute(fastify);
};



