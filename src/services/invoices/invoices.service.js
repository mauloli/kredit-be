// Initializes the `invoices` service on path `/invoices`
const { Invoices } = require('./invoices.class');
const createModel = require('../../models/invoices.model');
const hooks = require('./invoices.hooks');
const validateHooks = require('./validate.hooks');
const validateClass = require('./validate.class');


module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/invoices', new Invoices(options, app));
  app.use('/invoices/validate', validateClass(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('invoices');
  const validate= app.service('invoices/validate')

  service.hooks(hooks);
  validate.hooks(validateHooks)
};
