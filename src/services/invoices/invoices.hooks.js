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

module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [],
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
