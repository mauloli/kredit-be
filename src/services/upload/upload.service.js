// Initializes the `upload` service on path `/upload`
const { Upload } = require('./upload.class');
const hooks = require('./upload.hooks');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const uploadDir = path.join(__dirname, '../../uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads'));  // simpan ke folder uploads di luar src
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `file_${Date.now()}${ext}`;
    cb(null, filename);
  }
});

const uploadMiddleware = multer({ storage });

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  const addFileToFeathersReq = (req, _, next) => {
    req.feathers.file = req.file;
    next();
  };

  // Initialize our service with any options it requires
  app.use('/upload',
    uploadMiddleware.single('uri'),
    addFileToFeathersReq,
    new Upload(options, app)
  );

  // Get our initialized service so that we can register hooks
  const service = app.service('upload');

  service.hooks(hooks);
};
