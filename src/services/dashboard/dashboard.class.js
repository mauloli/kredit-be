/* eslint-disable no-unused-vars */
exports.Dashboard = class Dashboard {
  constructor(options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
  }

  async find(params) {
    const sales = this.app.service('sales')
    const invoice = this.app.service('invoices')
    const vehicles = this.app.service('vehicle')
    const customers = this.app.service('customers')

    const model = this.app.get('sequelizeClient').models

    const { user } = params
    const { tb_pelanggan, tb_penjualan } = model

    const result = await invoice.find({
      sequelize: {
        include: [
          {
            model: tb_penjualan,
            include: [tb_pelanggan]
          }
        ],
        raw: false
      }
    })

    const allVehicles = await vehicles.find({
      paginate: false,
      query: {}
    });

    const totalPelangan = await customers.Model.count()
    const totalSales = await sales.Model.count()
    const totalStok = allVehicles.reduce((sum, item) => sum + (item.jumlah_stok || 0), 0);
    const totalTipe = allVehicles.length

    Object.assign(result, {
      totalPelangan, totalSales, totalStok, totalTipe
    })

    return result;
  }

  async get(id, params) {
    return {
      id, text: `A new message with ID: ${id}!`
    };
  }

  async create(data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)));
    }

    return data;
  }

  async update(id, data, params) {
    return data;
  }

  async patch(id, data, params) {
    return data;
  }

  async remove(id, params) {
    return { id };
  }
};
