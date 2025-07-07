const { authenticate } = require('@feathersjs/authentication').hooks;

const createUser = () => {
  return async context => {
    const { data, app, params } = context;

    const userPayload = {
      username: data.email,
      password: data.password,
      name: data.nama,
      role: 3
    };

    const user = await app.service('users').create(userPayload, params);

    context.data.id_user = user.id;

    delete context.data.password;

    return context;
  };
};


module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [
      createUser()
    ],
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
