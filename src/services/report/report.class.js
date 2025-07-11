/* eslint-disable no-unused-vars */
const ExcelJS = require('exceljs');

exports.Report = class Report {
  constructor(options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
  }

  async find(params) {
    return [];
  }

  async get(id, params) {
    return {
      id, text: `A new message with ID: ${id}!`
    };
  }

  async create(data, params) {
    const sales = this.app.service('sales');
    const model = this.app.get('sequelizeClient').models;

    const { tb_pelanggan, tb_motor } = model;

    const result = await sales._find({
      sequelize: {
        include: [tb_motor, tb_pelanggan],
        raw: false
      }
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sales Report');

    worksheet.columns = [
      { header: 'No Kontrak', key: 'no_kontrak', width: 25 },
      { header: 'Nama Pelanggan', key: 'nama', width: 25 },
      { header: 'Motor', key: 'motor', width: 20 },
      { header: 'Uang Muka', key: 'uang_muka', width: 15 },
      { header: 'Tenor', key: 'tenor', width: 10 },
      { header: 'Angsuran', key: 'angsuran', width: 15 },
      { header: 'Tanggal', key: 'created_at', width: 20 },
    ];

    result.data.forEach(item => {
      worksheet.addRow({
        no_kontrak: item.no_kontrak,
        nama: item.tb_pelanggan?.nama,
        motor: item.tb_motor?.tipe_motor,
        uang_muka: item.uang_muka,
        tenor: item.tenor,
        angsuran: item.angsuran,
        created_at: new Date(item.created_at).toLocaleString()
      });
      worksheet.eachRow({ includeEmpty: false }, row => {
        row.alignment = { horizontal: 'left' };
      });
    });

    return { workbook };
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
