// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { authenticate } = require('@feathersjs/authentication').hooks;
const moment = require('moment');
require('moment/locale/id');
moment.locale('id');

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

  if (dueDate < now) {
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
    const notificationService = context.app.service('notificiation');
    const model = context.app.get('sequelizeClient').models;
    const { tb_pelanggan, users, tb_pembayaran, notificiation } = model;
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

    const startOfMonth = moment().startOf('month').toDate();
    const endOfMonth = moment().endOf('month').toDate();

    const invoices = await tb_pembayaran.findOne({
      where: {
        id_penjualan: datSales.id,
        status: { $ne: 'TOLAK' },
        created_at: {
          $between: [startOfMonth, endOfMonth]
        }
      },
    });

    const dueDate = getDueDate(datSales.created_at);
    const today = moment().startOf('day');
    const due = moment(dueDate, 'YYYY-MM-DD').startOf('day');
    const duedate = due.add(7, 'days').toDate();
    const dueDateFormatted = moment(duedate).format('LL');

    if (today.isSameOrAfter(due) && !invoices) {
      const checkNotif = await notificiation.findOne({
        where: {
          user_id: params.user.id,
          title: 'Jatuh Tempo',
          message: `Penjualan dengan No kontrak ${datSales.no_kontrak} jatuh tempo pada ${dueDateFormatted}`
        }
      });


      if (checkNotif) {
        return context;
      }

      await notificationService._create({
        title: 'Jatuh Tempo',
        message: `Penjualan dengan No kontrak ${datSales.no_kontrak} jatuh tempo pada ${dueDateFormatted}`,
        user_id: params.user.id
      });
      console.log(`Notifikasi jatuh tempo untuk penjualan ID ${datSales.id} telah dikirim.`);
    }
    return context;
  };
};
