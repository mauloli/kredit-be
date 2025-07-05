// A hook that logs service method before, after and error
// See https://github.com/winstonjs/winston for documentation
// about the logger.
const util = require('util');
const { compose, getPath, option } = require('crocks');

const logger = require('../logger');

const getUserId = compose(
  option(null),
  getPath(['params', 'user', 'id'])
);

module.exports = function () {
  return context => {
    const userId = getUserId(context);
    const { path, method, type, params, id = null } = context;
    const { query } = params;

    const defaultData = {
      userId,
      type,
      method,
      path,
      id: id,
      query,
    };

    const childLogger = logger.child(defaultData);

    childLogger.info(`${type} app.service('${path}').${method}()`);
    logger.debug(`${type} app.service('${path}').${method}()`);

    context.logger = childLogger;

    if (typeof context.toJSON === 'function' && logger.level === 'debug') {
      logger.debug('Hook Context', util.inspect(context, {colors: false}));
    }

    if (context.error) {
      childLogger.error(context.error.stack);
    }
  };
};