const errors = require('@feathersjs/errors');

const CreateService = require('feathers-sequelize').Service;

class Service {
  constructor(options = {}) {
    this.sequelizeService = new CreateService(options);
    this.paginate = options.paginate || false;
    this.Model = options.Model;
  }

  setup(app) {
    this.app = app;
  }

  async patch(id, data, params) {
    const { status } = data
    if (status == "SUKSES") {

      const getInvoice = await this.app.service('invoices')._get(id)
      const invoices = await this.app.service('invoices')._find({
        query: {
          id_penjualan: getInvoice.id_penjualan,
          status: 'SUKSES',
          $sort: { cicilan: -1 },
          $limit: 1
        },
        paginate: false
      });

      const lastCicilan = invoices.length > 0 ? invoices[0].cicilan : 0;

      data.cicilan = lastCicilan + 1;

      try {
        await this.app.service('invoices').patch(id, {
          status,
          cicilan: lastCicilan + 1
        })
        return { message: "Success update data" }
      } catch (error) {
        throw new errors.BadRequest(error)
      }
    }
    try {
      await this.app.service('invoices').patch(id, {
        status
      })
      return { message: "Success update data" }
    } catch (error) {
      throw new errors.BadRequest(error)
    }
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
