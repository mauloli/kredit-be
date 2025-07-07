// Application hooks that run for every service

const isAdmin = require("./hooks/isAdmin");
const log = require("./hooks/log");
const { authenticate } = require('@feathersjs/authentication').hooks;

module.exports = {
  before: {
    all: [log()],
    find: [],
    get: [],
    create: [
      authenticate('jwt'),
      isAdmin()
    ],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [log()],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [log()],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
