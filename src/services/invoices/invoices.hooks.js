const { disablePagination } = require('feathers-hooks-common');
const transaction = require('../../hooks/transaction');

const { authenticate } = require('@feathersjs/authentication').hooks;

const addCicilan = () => {
  return async context => {
    const { data, app } = context;

    if (!data.id_penjualan) {
      throw new Error('id_penjualan wajib diisi');
    }

    const invoices = await app.service('invoices')._find({
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
    const { app, params } = context
    const sequelize = app.get('sequelizeClient').models
    const { tb_pelanggan, tb_penjualan, tb_motor } = sequelize
    const { user } = params;

    const includeOptions = [
      {
        model: tb_penjualan,
        required: true,
        include: []
      }
    ];

    if (user.role_id === 3) {
      includeOptions[0].include.push(
        {
          model: tb_pelanggan,
          where: { id_user: user.id },
          required: true
        },
        {
          model: tb_motor,
          required: false
        }
      );
    } else {
      includeOptions[0].include.push(
        { model: tb_pelanggan, required: false },
        { model: tb_motor, required: false }
      );
    }

    context.params.sequelize = {
      include: includeOptions,
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

const addNumber = () => {
  return async context => {
    const { result, params } = context;
    const skip = Number(params.query?.$skip) || 0;
    const results = result?.data || result
    const handleResult = results.map((item, index) => {
      const data = item.dataValues ?? item;

      return {
        ...data,
        no: skip + index + 1
      };
    });

    if(result.data){
      context.result.data = handleResult;
    } else{
      context.result = handleResult;
    }

    return context;
  }
}



module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [
      includePelanggan(),
      disablePagination()
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
    find: [
      addNumber()
    ],
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
