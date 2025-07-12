// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { authenticate } = require('@feathersjs/authentication').hooks;
const moment = require('moment');
// eslint-disable-next-line no-unused-vars

function getDueDate(createdAt) {
  const created = moment(createdAt);
  const now = moment();
  const thisMonthDue = moment()
    .set('date', created.date())
    .set('hour', 0)
    .set('minute', 0)
    .set('second', 0)
    .set('millisecond', 0);

  if (!thisMonthDue.isValid()) return null;

  const dueDate = thisMonthDue.subtract(7, 'days');

  if (dueDate.month() === now.month() && dueDate.year() === now.year()) {
    return dueDate.format('YYYY-MM-DD');
  }

  return null;
}

module.exports = (options = {}) => {
  return async context => {
    const { params } = context;

    if (params?.user?.role_id !== 3 || !params?.user) {
      return context
    }

    const salesService = context.app.service('sales');
    const model = context.app.get('sequelizeClient').models;
    const { tb_pelanggan, users } = model;
    const sales = await salesService._find({
      query: {
      },
      sequelize: {
        include: [
          {
            model: tb_pelanggan,
            include: [{ model: users, where: { id: params.user.id } }],
            raw: false
          }
        ],
        raw: false
      }
    });

    const datSales = sales.data[0]
    if (!datSales) {
      return context;
    }
    const dueDate = getDueDate(datSales.created_at);
    const today = moment().startOf('day');
    const due = moment(dueDate, 'YYYY-MM-DD').startOf('day');

    if (today.isSameOrAfter(due)) {
      console.log('Sudah jatuh tempo atau lebih');
    } else {
      console.log('Belum jatuh tempo');
    }
    return context;
  };
};
