'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cities extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Cities.init({
    user_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    long: DataTypes.NUMERIC,
    lat: DataTypes.NUMERIC
  }, {
    sequelize,
    modelName: 'Cities',
  });
  return Cities;
};