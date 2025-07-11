const users = require('./users/users.service.js');
const roles = require('./../models/roles.model.js')
const vehicle = require('./vehicle/vehicle.service.js');
const sales = require('./sales/sales.service.js');
const customers = require('./customers/customers.service.js');
const invoices = require('./invoices/invoices.service.js');
const dashboard = require('./dashboard/dashboard.service.js');
const upload = require('./upload/upload.service.js');
const report = require('./report/report.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(roles)
  app.configure(vehicle);
  app.configure(customers);
  app.configure(sales);
  app.configure(invoices);
  app.configure(dashboard);
  app.configure(upload);
  app.configure(report);
};
