const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    queryInterface.addColumn('users', 'session', DataTypes.STRING)
  },
  down: async ({ context: queryInterface }) => {
    queryInterface.removeColumn('users', 'session')
  }
}