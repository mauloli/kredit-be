const { authenticate } = require('@feathersjs/authentication').hooks;

const handleUser = () => {
  return async context => {
    const { data, params } = context;
    const { user } = params;

    if (Array.isArray(data)) {
      context.data = data.map(item => ({
        ...item,
        id_user: user.id
      }));
    } else {
      Object.assign(context.data, {
        id_user: user.id
      });
    }

    return context;
  };
};

const adjustStok = () => {
  return async context => {
    const { id_motor } = context.data;

    await context.app.get('sequelizeClient').models.tb_motor.increment(
      { jumlah_stok: -1 },
      { where: { id: id_motor } }
    );

    return context;
  }
}



module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [
      handleUser()
    ],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [
      adjustStok()
    ],
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
