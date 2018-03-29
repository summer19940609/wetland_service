/* jshint indent: 2 */
const moment = require('moment');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('evaluateinfo', {
    evaluate_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true
    },
    user_tea_id: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    user_stu_id: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    group_id: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    evaluate_module: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    first_score: {
      type: DataTypes.INTEGER(10),
      allowNull: false
    },
    second_score: {
      type: DataTypes.INTEGER(10),
      allowNull: false
    },
    third_score: {
      type: DataTypes.INTEGER(10),
      allowNull: false
    },
    fourth_score: {
      type: DataTypes.INTEGER(10),
      allowNull: false
    },
    fifth_score: {
      type: DataTypes.INTEGER(10),
      allowNull: false
    },
    remark: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: true,
      get() {
        return moment(this.getDataValue('create_time')).format('YYYY-MM-DD HH:mm:ss');
      }
    },
    update_time: {
      type: DataTypes.DATE,
      allowNull: true,
      get() {
        return moment(this.getDataValue('update_time')).format('YYYY-MM-DD HH:mm:ss');
      }
    }
  }, {
    tableName: 'evaluateinfo'
  });
};
