/* jshint indent: 2 */
const moment = require('moment');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('proinfo_answer', {
    answer_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true
    },
    problem_id: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    user_id: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    answer_content: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    answer_pic_url1: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    answer_pic_url2: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    answer_pic_url3: {
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
    },
    is_delete: {
      type: DataTypes.INTEGER(10),
      allowNull: true,
      defaultValue: '0'
    }
  }, {
    tableName: 'proinfo_answer'
  });
};
