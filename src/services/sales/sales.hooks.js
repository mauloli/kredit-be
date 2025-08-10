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

const generateContract = () => {
  return async context => {
    const prefix = 'MTR';
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();

    const contractNumber = `${prefix}-${date}-${random}`;

    context.data.no_kontrak = contractNumber

    return context;
  };
}

const includePelanggan = () => {
  return async context => {
    const { app } = context
    const sequelize = app.get('sequelizeClient').models
    const { tb_pelanggan,tb_motor } = sequelize

    context.params.sequelize = {
      include: [tb_pelanggan,tb_motor],
      raw: false
    };

    return context;
  };
};



module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [
      includePelanggan()

    ],
    get: [],
    create: [
      generateContract(),
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
