// Initializes the `sales` service on path `/sales`
const { Sales } = require('./sales.class');
const createModel = require('../../models/sales.model');
const hooks = require('./sales.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    multi: ['create']
  };

  // Initialize our service with any options it requires
  app.use('/sales', new Sales(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('sales');

  service.hooks(hooks);
};
