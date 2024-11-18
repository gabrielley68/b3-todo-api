const Sequelize = require('sequelize');

const config = require('../config/config.json');

const databaseConfig = config[process.env.NODE_ENV || 'development'];

const sequelizeInstance = new Sequelize(
    databaseConfig.database,
    databaseConfig.username,
    databaseConfig.password,
    {host: databaseConfig.host, dialect: 'mysql'}
);

module.exports = sequelizeInstance;