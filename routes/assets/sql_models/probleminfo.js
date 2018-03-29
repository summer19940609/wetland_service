/* jshint indent: 2 */
const moment = require('moment');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('probleminfo', {
    problem_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    problem_content: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    pro_pic_url1: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    pro_pic_url2: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    pro_pic_url3: {
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
    tableName: 'probleminfo'
  });
};
