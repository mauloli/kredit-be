const transaction = require('../../hooks/transaction');

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

const pushNotification = () => {
  return async context => {
    const { app, result, params } = context;
    const model = app.get('sequelizeClient').models;
    const { tb_penjualan } = model;

    const { id_user: userIdSales = null } = await tb_penjualan.findOne({
      where: { id: result.id_penjualan },
      attributes: ['id_user']
    });

    if (userIdSales) {
      const notificationService = app.service('notificiation');
      await notificationService._create({
        title: 'Pembayaran Baru',
        message: `Pembayaran baru untuk penjualan ID ${result.id_penjualan}`,
        user_id: userIdSales
      });
    }

    return context;
  }
}



module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [
      includePelanggan()
    ],
    get: [],
    create: [
      transaction.start(),
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
    create: [
      pushNotification(),
      transaction.end()
    ],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [
      transaction.rollback()
    ],
    update: [],
    patch: [],
    remove: []
  }
};
