const { Sequelize } = require('sequelize')
const { SequelizeStorage } = require('umzug')

const sequelize = new Sequelize(process.env.DB_URL)

module.exports = {
  migrations: {
    glob: 'migrations/*.js'
  },
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  context: sequelize.getQueryInterface(),
  logger: console
}