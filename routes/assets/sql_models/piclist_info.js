/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('piclist_info', {
    piclist_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true
    },
    wetland_name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    pic_type: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    pic_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    max_pic_url: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    min_pic_url: {
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
    tableName: 'piclist_info'
  });
};
