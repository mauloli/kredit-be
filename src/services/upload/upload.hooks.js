const { authenticate } = require('@feathersjs/authentication').hooks;

const handleUpload = () => {
  return async context => {
    const { params } = context

    context.result = { file_name: params.file.filename }
    return context
  }
}

module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [
      handleUpload()
    ],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
