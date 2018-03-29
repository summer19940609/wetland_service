const uuid = require('uuid')
const path = require('path');
const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize')
const Op = Sequelize.Op;
const config = require(path.join(__dirname, '../../../config'));
const co = require('co');
const moment = require('moment');
/*读取配置文件里的MySQL连接信息*/
const sqlConfig = config["sqlConfig"];
const database = sqlConfig["database"];
const username = sqlConfig["user"];
const password = sqlConfig["password"];
const host = sqlConfig["host"];
const sequelize = new Sequelize(database, username, password, sqlConfig["options"]);

const EVALUATION = require('../sql_models/evaluateinfo')(sequelize, Sequelize)
const PICLIST = require('../sql_models/piclist_info')(sequelize, Sequelize)
const PROBLEM = require('../sql_models/probleminfo')(sequelize, Sequelize)
const ANSWER = require('../sql_models/proinfo_answer')(sequelize, Sequelize)
const USER = require('../sql_models/user_cache')(sequelize, Sequelize)
const Log = require('../sql_models/user_log')(sequelize, Sequelize)

/*---------------几个表之间的关系，sequelize后面的多表联合查询前提条件---------------*/
//user_etzr和postings_table之间关系

PROBLEM.hasMany(ANSWER, {
  foreignKey: 'problem_id'
});
//user_etzr和comment_table之间关系
ANSWER.belongsTo(USER, {
  foreignKey: 'user_id'
});
USER.hasMany(ANSWER, {
  foreignKey: 'user_id'
});
PROBLEM.belongsTo(USER, {
  foreignKey: 'user_id'
});
USER.hasMany(PROBLEM, {
  foreignKey: 'user_id'
});

// //postings_table和resouce_table之间关系
// DIARY.hasMany(RESOURCE, {
//     foreignKey: 'parent_id',
//     as: 'imgData'
// });
/*-----------------------------------------------------------------------------------*/


/*---------------方法---------------*/
let sqlFun = {
  /*查找用户*/
  findUserOne: function (user_id) {
    let info = {
      flag: false,
      message: "",
      data: {}
    };
    let promise = new Promise(function (resolve, reject) {
      USER.findOne({
        attributes: [
          'user_id', 'login_name', 'real_name', 'role_type', 'tea_user_id', 'tea_real_name', 'user_img', 'class_name_show'
        ],
        where: {
          user_id: user_id
        }
      }).then(function (result) {
        if (result) {
          let data = JSON.parse(JSON.stringify(result));
          info.data = data;
          info.flag = true;
          info.message = "查找用户成功";
          resolve(info);
        } else {
          info.message = "查找用户为空";
          info.flag = true;
          info.data = null;
          resolve(info);
        }
      }, function (err) {
        console.log(err);
        info.message = "数据库连接失败";
        reject(info);
      })
    });
    return promise;
  },

  /*插入用户*/
  insertUser: function (user_id, loginName, name, roleType, tea_user_id, tea_real_name, schoolName, className) {
    let info = {
      flag: false,
      message: ""
    };
    let promise = new Promise(function (resolve, reject) {
      USER.create({
        'login_name': loginName,
        'user_id': user_id,
        'real_name': name,
        'role_type': roleType,
        'tea_user_id': tea_user_id,
        'tea_real_name': tea_real_name,
        'user_img': null,
        'class_name': className,
        'class_name_show': null,
        'school_name': schoolName
      }).then(function (result) {
        info.message = "用户添加成功";
        info.flag = true;
        resolve(info);
      }, function (err) {
        console.log(err);
        info.message = "数据库连接失败";
        reject(info);
      })
    });
    return promise;
  },

  // 插入log记录
  updateNameLog: function (id, userId, roleType, content) {
    let info = {
      flag: false,
      message: ""
    };
    let promise = new Promise(function (resolve, reject) {
      Log.create({
        'id': id,
        'user_id': userId,
        'modify_type': '2',
        'role_type': roleType,
        'modify_content': content
      }).then(function (result) {
        info.message = "添加成功";
        info.flag = true;
        resolve(info);
      }, function (err) {
        console.log(err);
        info.message = "数据库连接失败";
        reject(info);
      })
    });
    return promise;
  },

  // 学生查询老师id姓名
  findTeacherByStudent: function (className) {
    let info = {
      flag: false,
      message: "",
      data: {}
    }
    let promise = new Promise(function (resolve, reject) {
      USER.findOne({
        attributes: ['user_id', 'real_name'],
        where: {
          role_type: 2,
          class_name: className
        }
      }).then(function (result) {
        if (result) {
          let data = JSON.parse(JSON.stringify(result));
          info.data = data;
          info.flag = true;
          info.message = "查找用户成功";
          resolve(info);
        } else {
          info.message = "查找用户为空";
          info.flag = true;
          info.data = null;
          resolve(info);
        }
      }, function (err) {
        console.log(err);
        info.message = "数据库连接失败";
        reject(info);
      })
    });
    return promise;
  },

  /*更新用户*/
  updateUser: function (user_id, loginName, name, roleType, tea_user_id, tea_real_name, schoolName, className) {
    let info = {
      flag: false,
      message: ""
    };
    let promise = new Promise(function (resolve, reject) {
      USER.update({
        'login_name': loginName,
        'real_name': name,
        'role_type': roleType,
        'tea_user_id': tea_user_id,
        'tea_real_name': tea_real_name,
        'class_name': className,
        'school_name': schoolName
      }, {
          where: {
            "user_id": user_id
          }
        }).then(function (result) {
          info.flag = true;
          info.message = "更新成功";
          resolve(info);
        }, function (err) {
          console.log(err);
          info.message = "更新失败";
          reject(info);
        })
    });
    return promise;
  },

  // 更新用户名
  updateUserName: function (userId, name) {
    let info = {
      flag: false,
      message: ""
    };
    let promise = new Promise(function (resolve, reject) {
      USER.update({
        'real_name': name,
      }, {
          where: {
            "user_id": userId
          }
        }).then(function (result) {
          info.flag = true;
          info.message = "更新成功";
          resolve(info);
        }, function (err) {
          console.log(err);
          info.message = "更新失败";
          reject(info);
        })
    });
    return promise;
  },

  // 更新班级
  updateClassName: function (userId, className) {
    let info = {
      flag: false,
      message: ""
    };
    let promise = new Promise(function (resolve, reject) {
      USER.update({
        'class_name_show': className,
      }, {
          where: {
            "user_id": userId
          }
        }).then(function (result) {
          info.flag = true;
          info.message = "更新成功";
          resolve(info);
        }, function (err) {
          console.log(err);
          info.message = "更新失败";
          reject(info);
        })
    });
    return promise;
  },

  // 更新用户头相
  updateUserImg: function (user_id, img) {
    let info = {
      flag: false,
      message: ""
    };
    let promise = new Promise(function (resolve, reject) {
      USER.update({
        'user_img': img
      }, {
          where: {
            "user_id": user_id
          }
        }).then(function (result) {
          info.flag = true;
          info.message = "更新成功";
          resolve(info);
        }, function (err) {
          console.log(err);
          info.message = "更新失败";
          reject(info);
        })
    });
    return promise;
  },

  // 添加问题
  addProblem: function (id, user_id, content, pro_pic_url1, pro_pic_url2, pro_pic_url3) {
    let info = {
      flag: false,
      message: ""
    };
    let promise = new Promise(function (resolve, reject) {
      PROBLEM.create({
        'problem_id': id,
        'user_id': user_id,
        'problem_content': content,
        'pro_pic_url1': pro_pic_url1,
        'pro_pic_url2': pro_pic_url2,
        'pro_pic_url3': pro_pic_url3,
        'is_delete': 0,
      }).then(function (result) {
        info.message = "日记添加成功";
        info.flag = true;
        resolve(info);
      }, function (err) {
        console.log(err);
        info.message = "数据库连接失败";
        reject(info);
      })
    });
    return promise;
  },

  // 问题的会大数
  getAnswerCount: function (id) {
    let info = {
      flag: false,
      message: "",
      data: null
    }
    let promise = new Promise(function (resolve, reject) {
      ANSWER.count({
        where: {
          "problem_id": id,
          "is_delete": 0
        }
      }).then(function (result) {
        //查询到的该post_type的数量
        info.flag = true;
        info.message = "数量查询成功";
        info.data = result;
        resolve(info);
      }, function (err) {
        console.log(err);
        info.message = "数据库连接失败";
        reject(info);
      })
    });
    return promise;
  },

  // 删除问题
  deleteProblem: function (id) {
    let info = {
      flag: false,
      message: ""
    };
    let promise = new Promise(function (resolve, reject) {
      PROBLEM.update({
        'is_delete': 1
      }, {
          where: {
            "problem_id": id
          }
        }).then(function (result) {
          info.flag = true;
          info.message = "删除成功";
          resolve(info);
        }, function (err) {
          console.log(err);
          info.message = "删除失败";
          reject(info);
        })
    });
    return promise;
  },

  // 删除问题的回答
  deleteAllAnswer: function (id) {
    let info = {
      flag: false,
      message: ""
    };
    let promise = new Promise(function (resolve, reject) {
      ANSWER.update({
        'is_delete': 1
      }, {
          where: {
            "problem_id": id
          }
        }).then(function (result) {
          info.flag = true;
          info.message = "删除成功";
          resolve(info);
        }, function (err) {
          console.log(err);
          info.message = "删除失败";
          reject(info);
        })
    });
    return promise;
  },

  // 单个问题
  findOneProblem: function (id) {
    let info = {
      flag: false,
      message: ""
    };
    let promise = new Promise(function (resolve, reject) {
      PROBLEM.findOne({
        where: {
          'problem_id': id
        },
        include: [{
          model: USER,
          attributes: [
            'user_id', 'login_name', 'real_name', 'role_type', 'tea_user_id', 'tea_real_name', 'user_img'
          ]
        }]
      }).then(function (result) {
        if (result) {
          let data = JSON.parse(JSON.stringify(result));
          info.data = data;
          info.flag = true;
          info.message = "获取数据成功";
          resolve(info);
        } else {
          info.message = "查找数据为空";
          info.flag = true;
          info.data = null;
          resolve(info);
        }
      }, function (err) {
        console.log(err);
        info.message = "数据库连接失败";
        reject(info);
      })
    });
    return promise;
  },

  // 问题的回答信息
  findProblemAnswer: function (id) {
    let info = {
      flag: false,
      message: "",
      data: {}
    };
    let promise = new Promise(function (resolve, reject) {
      ANSWER.findAll({
        where: {
          problem_id: id
        },
        order: [
          ['create_time', 'DESC']
        ],
        include: [{
          model: USER,
          attributes: [
            'user_id', 'login_name', 'real_name', 'role_type', 'tea_user_id', 'tea_real_name', 'user_img'
          ]
        }]
      }).then(function (result) {
        let data = JSON.parse(JSON.stringify(result));
        if (data.length) {
          info.data = data;
          info.flag = true;
          info.message = "获取图片信息成功";
          resolve(info);
        } else {
          info.message = "获取图片信息为空";
          info.flag = true;
          info.data = null;
          resolve(info);
        }
      }, function (err) {
        console.log(err);
        info.message = "数据库连接失败";
        reject(info);
      })
    });
    return promise;
  },

  // 问题列表
  getProblemList: function (page, order, orderType, pn) {
    let info = {
      flag: false,
      message: "",
      data: []
    };
    let promise = new Promise(function (resolve, reject) {
      page = parseInt(page - 1) * pn;
      PROBLEM.findAndCountAll({
        order: [
          [orderType, order]
        ],
        include: [{
          model: USER,
          attributes: [
            'user_id', 'login_name', 'real_name', 'role_type', 'tea_user_id', 'tea_real_name', 'user_img'
          ]
        }],
        where: {
          "is_delete": 0
        },
        offset: page,
        limit: pn
      }).then(function (result) {
        if (result.rows.length) {
          let data = JSON.parse(JSON.stringify(result));
          info.data = data.rows;
          info.flag = true;
          info.message = "获取数据成功";
          resolve(info);
        } else {
          info.message = "查找数据为空";
          info.flag = true;
          info.data = null;
          resolve(info);
        }
      }, function (err) {
        console.log(err);
        info.message = "数据库连接失败";
        reject(info);
      })
    });
    return promise;
  },

  // 添加回答
  addAnswer: function (id, problemId, userId, content) {
    let info = {
      flag: false,
      message: ""
    };
    let promise = new Promise(function (resolve, reject) {
      ANSWER.create({
        'answer_id': id,
        'user_id': userId,
        'problem_id': problemId,
        'answer_content': content,
        'is_delete': 0
      }).then(function (result) {
        info.message = "添加成功";
        info.flag = true;
        resolve(info);
      }, function (err) {
        console.log(err);
        info.message = "数据库连接失败";
        reject(info);
      })
    });
    return promise;
  },

  // 列出老师的所有学生
  listAllStudent: function (teacherId) {
    let info = {
      flag: false,
      message: ""
    };
    let promise = new Promise(function (resolve, reject) {
      USER.findAll({
        attributes: [
          'user_id', 'login_name', 'real_name', 'role_type', 'tea_user_id', 'tea_real_name', 'user_img'
        ],
        where: {
          tea_user_id: teacherId,
          role_type: 1
        },
        order: [
          ['login_name', 'ASC']
        ]
      }).then(function (result) {
        let data = JSON.parse(JSON.stringify(result));
        if (data.length) {
          info.data = data;
          info.flag = true;
          info.message = "获取成功";
          resolve(info);
        } else {
          info.message = "获取成功";
          info.flag = true;
          info.data = null;
          resolve(info);
        }
      }, function (err) {
        console.log(err);
        info.message = "数据库连接失败";
        reject(info);
      })
    })
    return promise;
  },

  // 批量添加评论
  addEvaluation: function (evaluationArr) {
    let info = {
      flag: false,
      message: ""
    };
    let promise = new Promise(function (resolve, reject) {
      EVALUATION.bulkCreate(evaluationArr).then(function (result) {
        info.message = "评论添加成功";
        info.flag = true;
        resolve(info);
      }, function (err) {
        console.log(err);
        info.message = "数据库连接失败";
        reject(info);
      })
    });
    return promise;
  },

  // 得到单个学生所有的评价
  getStudentAllSingleEvaluation: function (studentId) {
    let info = {
      flag: false,
      message: "",
      data: null
    };
    let promise = new Promise(function (resolve, reject) {
      EVALUATION.findAll({
        where: {
          user_stu_id: studentId
        },
        order: [
          ['create_time', 'DESC']
        ]
      }).then(function (result) {
        let data = JSON.parse(JSON.stringify(result));
        if (data.length) {
          info.data = data;
          info.flag = true;
          info.message = "获取信息成功";
          resolve(info);
        } else {
          info.message = "获取信息为空";
          info.flag = true;
          info.data = null;
          resolve(info);
        }
      }, function (err) {
        console.log(err);
        info.message = "数据库连接失败";
        reject(info);
      })
    });
    return promise;
  },

  // getStudentModuelEvaluation: function (studentId, moduelName) {
  //   let info = {
  //     flag: false,
  //     message: "",
  //     data: null
  //   };
  //   let promise = new Promise(function (resolve, reject) {
  //     EVALUATION.findAll({
  //       where: {
  //         user_stu_id: studentId,
  //         evaluate_module: moduelName
  //       }
  //     }).then(function (result) {
  //       let data = JSON.parse(JSON.stringify(result));
  //       if (data.length) {
  //         info.data = data;
  //         info.flag = true;
  //         info.message = "获取信息成功";
  //         resolve(info);
  //       } else {
  //         info.message = "获取信息为空";
  //         info.flag = true;
  //         info.data = null;
  //         resolve(info);
  //       }
  //     }, function (err) {
  //       console.log(err);
  //       info.message = "数据库连接失败";
  //       reject(info);
  //     })
  //   });
  //   return promise;
  // },

  sumPartScore: function (studentId) {
    let info = {
      flag: false,
      message: "",
      data: null
    };
    let promise = new Promise(function (resolve, reject) {
      EVALUATION.findAll({
        attributes: [
          [sequelize.fn('SUM', sequelize.col('first_score')), 'first_score'],
          [sequelize.fn('SUM', sequelize.col('second_score')), 'second_score'],
          [sequelize.fn('SUM', sequelize.col('third_score')), 'third_score'],
          [sequelize.fn('SUM', sequelize.col('fourth_score')), 'fourth_score'],
          [sequelize.fn('SUM', sequelize.col('fifth_score')), 'fifth_score']
        ],
        group: 'user_stu_id',
        raw: true,
        where: {
          'user_stu_id': studentId
        }
      }).then(function (result) {
        let data = JSON.parse(JSON.stringify(result));
        if (data.length) {
          for (let i in data[0]) {
            if (data[0].hasOwnProperty(i)) {
              let element = data[0][i];
              newElement = parseInt(element, 10)
              data[0][i] = newElement
            }
          }
          info.data = data[0];
          info.flag = true;
          info.message = "获取信息成功";
          resolve(info);
        } else {
          info.message = "获取信息为空";
          info.flag = true;
          info.data = {
            'first_score': 0,
            'second_score': 0,
            'third_score': 0,
            'fourth_score': 0,
            'fifth_score': 0
          };
          resolve(info);
        }
      }, function (err) {
        console.log(err);
        info.message = "数据库连接失败";
        reject(info);
      })
    });
    return promise;
  },

  // listStudentModuel: function (studentId) {
  //   let info = {
  //     flag: false,
  //     message: "",
  //     data: null
  //   };
  //   let promise = new Promise(function (resolve, reject) {
  //     EVALUATION.findAll({
  //       attributes: ['evaluate_module'],
  //       where: {
  //         'user_stu_id': studentId
  //       },
  //       group: 'evaluate_module',
  //       raw: true
  //     }).then(function (result) {
  //       let data = JSON.parse(JSON.stringify(result));
  //       if (data.length) {
  //         info.data = data;
  //         info.flag = true;
  //         info.message = "获取信息成功";
  //         resolve(info);
  //       } else {
  //         info.message = "获取信息为空";
  //         info.flag = true;
  //         info.data = null;
  //         resolve(info);
  //       }
  //     }, function (err) {
  //       console.log(err);
  //       info.message = "数据库连接失败";
  //       reject(info);
  //     })
  //   });
  //   return promise;
  // },


  // sumModuelPartScore: function (studentId, moduelName) {
  //   let info = {
  //     flag: false,
  //     message: "",
  //     data: null
  //   };
  //   let promise = new Promise(function (resolve, reject) {
  //     EVALUATION.findAll({
  //       attributes: [
  //         [sequelize.fn('SUM', sequelize.col('first_score')), 'first_score'],
  //         [sequelize.fn('SUM', sequelize.col('second_score')), 'second_score'],
  //         [sequelize.fn('SUM', sequelize.col('third_score')), 'third_score'],
  //         [sequelize.fn('SUM', sequelize.col('fourth_score')), 'fourth_score'],
  //         [sequelize.fn('SUM', sequelize.col('fifth_score')), 'fifth_score']
  //       ],
  //       group: 'evaluate_module',
  //       raw: true,
  //       where: {
  //         'user_stu_id': studentId,
  //         'evaluate_module': moduelName
  //       }
  //     }).then(function (result) {
  //       let data = JSON.parse(JSON.stringify(result));
  //       if (data.length) {
  //         info.data = data[0];
  //         info.flag = true;
  //         info.message = "获取信息成功";
  //         resolve(info);
  //       } else {
  //         info.message = "获取信息为空";
  //         info.flag = true;
  //         info.data = null;
  //         resolve(info);
  //       }
  //     }, function (err) {
  //       console.log(err);
  //       info.message = "数据库连接失败";
  //       reject(info);
  //     })
  //   });
  //   return promise;
  // },

  listStudentAllEvaluation: function (studentId) {
    let info = {
      flag: false,
      message: "",
      data: null
    };
    let promise = new Promise(function (resolve, reject) {
      EVALUATION.findAll({
        where: {
          'user_stu_id': studentId
        },
        order: [
          ['create_time', 'DESC']
        ]
      }).then(function (result) {
        if (result) {
          let data = JSON.parse(JSON.stringify(result));
          info.data = data;
          info.flag = true;
          info.message = "查找用户成功";
          resolve(info);
        } else {
          info.message = "查找用户为空";
          info.flag = true;
          info.data = null;
          resolve(info);
        }
      }, function (err) {
        console.log(err);
        info.message = "数据库连接失败";
        reject(info);
      })
    });
    return promise;
  },

  // 获得提问数
  getProblemNum: function (userId) {
    let info = {
      flag: false,
      message: "",
      data: null
    };
    let promise = new Promise(function (resolve, reject) {
      PROBLEM.count({
        where: {
          'user_id': userId,
          'is_delete': 0
        },
      }).then(function (result) {
        info.data = result;
        info.flag = true;
        info.message = "查找提问数成功";
        resolve(info);
      }, function (err) {
        console.log(err);
        info.message = "数据库连接失败";
        reject(info);
      })
    });
    return promise;
  },

  // 获得回答数
  getAnswerNum: function (userId) {
    let info = {
      flag: false,
      message: "",
      data: null
    };
    let promise = new Promise(function (resolve, reject) {
      ANSWER.count({
        where: {
          'user_id': userId,
          'is_delete': 0
        },
      }).then(function (result) {
        info.data = result;
        info.flag = true;
        info.message = "查找提问数成功";
        resolve(info);
      }, function (err) {
        console.log(err);
        info.message = "数据库连接失败";
        reject(info);
      })
    });
    return promise;
  },


  getStudentEvaluationNum: function (studentId) {
    let info = {
      flag: false,
      message: "",
      data: null
    };
    let promise = new Promise(function (resolve, reject) {
      EVALUATION.count({
        where: {
          'user_stu_id': studentId
        },
      }).then(function (result) {
        info.data = result;
        info.flag = true;
        info.message = "查找提问数成功";
        resolve(info);
      }, function (err) {
        console.log(err);
        info.message = "数据库连接失败";
        reject(info);
      })
    });
    return promise;
  },

  getTeacherEvaluationNum: function (teacherId) {
    let info = {
      flag: false,
      message: "",
      data: null
    };
    let promise = new Promise(function (resolve, reject) {
      EVALUATION.aggregate('group_id', 'count', {
        where: {
          'user_tea_id': teacherId
        },
        distinct: true
      }).then(function (result) {
        console.log(result);
        info.data = result;
        info.flag = true;
        info.message = "查找提问数成功";
        resolve(info);
      }, function (err) {
        console.log(err);
        info.message = "数据库连接失败";
        reject(info);
      })
    });
    return promise;
  },

}




module.exports = sqlFun