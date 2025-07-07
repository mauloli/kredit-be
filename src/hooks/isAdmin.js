const errors = require("@feathersjs/errors");

module.exports = function () {
  return async context => {
    const { params } = context;
    const { user } = params;
    
    if (user.role_id == 3) {
      throw new errors.NotAcceptable()
    }

    return context
  }
}