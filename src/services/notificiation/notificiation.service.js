// Initializes the `notificiation` service on path `/notificiation`
const { Notificiation } = require('./notificiation.class');
const createModel = require('../../models/notificiation.model');
const hooks = require('./notificiation.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/notificiation', new Notificiation(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('notificiation');

  service.hooks(hooks);
};
