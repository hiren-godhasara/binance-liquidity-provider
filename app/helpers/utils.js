

exports.routesRegister = async (fastify, routes = []) => {
  if (!Array.isArray(routes)) {
    throw new Error('routes must be an array');
  }
  routes.forEach((ro) => {
    fastify.route(ro);
  });
};
