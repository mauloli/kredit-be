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
    try {
      await this.app.service('invoices').patch(id, {
        valid: true
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
