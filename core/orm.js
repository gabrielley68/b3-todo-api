const Sequelize = require('sequelize');

const sequelizeInstance = new Sequelize(
    process.env.DB_BIS_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {host: 'localhost', dialect: 'mysql'}
);

module.exports = sequelizeInstance;