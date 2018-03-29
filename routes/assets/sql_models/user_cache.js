/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_cache', {
    user_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true
    },
    login_name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    real_name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    role_type: {
      type: DataTypes.INTEGER(10),
      allowNull: true
    },
    tea_user_id: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    tea_real_name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    user_img: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    class_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    class_name_show: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    school_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    update_time: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'user_cache'
  });
};
