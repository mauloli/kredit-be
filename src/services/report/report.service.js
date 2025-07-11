// Initializes the `report` service on path `/report`
const { Report } = require('./report.class');
const hooks = require('./report.hooks');
const generateExcelWorkbook = require('../../middleware/generate-excel-workbook');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/report', new Report(options, app),generateExcelWorkbook());

  // Get our initialized service so that we can register hooks
  const service = app.service('report');

  service.hooks(hooks);
};
