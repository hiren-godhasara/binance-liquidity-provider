const Fastify = require('fastify');
const routes = require('./app/routes');
const config = require('./app/config');
const { bootstrapProcess } = require('./app/services/bootstrapService');

const fastify = Fastify({
    logger: true,
});
fastify.register(require('@fastify/helmet'));
fastify.register(require('@fastify/cors'), config.cors);

async function start() {
    try {
        await fastify.register(require('@fastify/swagger'), config.swagger);
        await fastify.register(routes);
        fastify.swagger();
        await fastify.listen({ port: config.server.port});
        await bootstrapProcess();
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
}
start();

module.exports = fastify



