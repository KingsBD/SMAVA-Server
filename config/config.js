var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'smava'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/smava-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'smava'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/smava-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'smava'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/smava-production'
  }
};

module.exports = config[env];
