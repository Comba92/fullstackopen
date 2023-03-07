require('dotenv').config()
const migratorConfig = require('./migrator')
const { Sequelize } = require('sequelize')
const { Umzug } = require('umzug') 

const sequelize = new Sequelize(process.env.DB_URL)

const rollbackMigration = async () => {
  await sequelize.authenticate()
  const migrator = new Umzug(migratorConfig)
  await migrator.down()
  await sequelize.close()
}

rollbackMigration()