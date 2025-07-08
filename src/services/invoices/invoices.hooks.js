const { authenticate } = require('@feathersjs/authentication').hooks;

const addCicilan = () => {
  return async context => {
    const { data, app } = context;

    if (!data.id_penjualan) {
      throw new Error('id_penjualan wajib diisi');
    }

    const invoices = await app.service('invoices').find({
      query: {
        id_penjualan: data.id_penjualan,
        status: { $nin: ['TOLAK'] },
        $sort: { cicilan: -1 },
        $limit: 1
      },
      paginate: false
    });

    const lastCicilan = invoices.length > 0 ? invoices[0].cicilan : 0;

    data.cicilan = lastCicilan + 1;

    return context;
  };
};

const includePelanggan = () => {
  return async context => {
    const { app } = context
    const sequelize = app.get('sequelizeClient').models
    const { tb_pelanggan, tb_penjualan } = sequelize

    context.params.sequelize = {
      include: [
        { model: tb_penjualan, include: [tb_pelanggan] }
      ],
      raw: false,
      where: { status: { $notIn: ['TOLAK'] } }
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
      addCicilan()
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
