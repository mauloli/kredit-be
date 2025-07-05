// Initializes the `invoices` service on path `/invoices`
const { Invoices } = require('./invoices.class');
const createModel = require('../../models/invoices.model');
const hooks = require('./invoices.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/invoices', new Invoices(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('invoices');

  service.hooks(hooks);
};
