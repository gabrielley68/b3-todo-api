const Sequelize = require('sequelize');

const config = require('../config/config.json');

const databaseConfig = config[process.env.NODE_ENV || 'development'];

const sequelizeInstance = new Sequelize(
    process.env.DB_BIS_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {host: 'localhost', dialect: 'mysql'}
);

module.exports = sequelizeInstance;