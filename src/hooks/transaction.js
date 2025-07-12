/* eslint-disable no-unused-vars */
const { checkContext } = require('feathers-hooks-common');

module.exports = {
  start: (options = {}) => async context => {
    checkContext(context, 'before', null, 'transaction start');

    const sequelize = context.app.get('sequelizeClient');
    const transaction = await sequelize.transaction(options);

    if (context.params.sequelize) {
      Object.assign(context.params.sequelize, {
        transaction,
      });

      return context;
    }

    Object.assign(context.params, {
      sequelize: {
        transaction,
      },
    });

    return context;
  },
  end: (options = {}) => async context => {
    checkContext(context, 'after', null, 'transaction end');

    const { transaction } = context.params.sequelize || {};

    if (transaction) {
      await transaction.commit();
    }

    return context;
  },
  rollback: (options = {}) => async context => {
    checkContext(context, 'error', null, 'transaction rollback');

    const { transaction } = context.params.sequelize || {};

    if (transaction) {
      if (transaction.finished === 'commit') {
        return context;
      }

      await transaction.rollback();
    }

    return context;
  },
};
