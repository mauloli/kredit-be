const { authenticate } = require('@feathersjs/authentication').hooks;
const { disablePagination } = require('feathers-hooks-common');

const getByUserId = ()=>{
  return async context => {
    const { params } = context;
    const { user } = params;

    context.params.query = {
      ...context.params.query,
      user_id: user.id,
      $limit:-1
    };

    return context;
  }
}
module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [
      getByUserId(),
      disablePagination()
    ],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
