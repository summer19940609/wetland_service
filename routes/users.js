// 用户逻辑路由

const express = require('express')
const path = require('path')
const router = express.Router()
const co = require('co')
const uuid = require('uuid')
const fs = require('fs-extra')
const sharp = require('sharp')
const request = require('request')
const sqlFun = require('./assets/sql/sql_fun')
const redis = require('./assets/lib/redis.js')
const config = require(path.join(__dirname, '../config'))
const uploadPath = path.join(__dirname, '../uploads/')
const code = require(path.join(__dirname, '../code'))
const umsUrl = config.umsApiConfig.umsUrl
const systemCode = config.systemCode

router.post('/login', function (req, res, next) {
  let info = {
    flag: false,
    code: 0,
    message: "",
    data: {}
  };
  let studentId = req.body.username;
  let passWord = req.body.password;
  request.post({
    url: umsUrl + '/user/login',
    body: {
      "mobile": "",
      "passWord": passWord,
      "loginName": studentId,
      "systemCode": systemCode,
      "verifyCode": ""
    },
    json: true
  }, function optionalCallback(err, httpResponse, body) {
    console.log(httpResponse)
    console.log(body)
    if (err) {
      console.error('error:', err);
      info.code = 1001;
      info.message = code(1001);
      res.send(info);
    } else {
      //登录失败情况
      if (!body.userInfo) {
        info.message = body.description;
        info.code = body.code;
        res.send(info);
        //登录成功情况
      } else {
        info.flag = true;
        info.message = "登录成功";
        let userId = body.userInfo.userId;
        let nikeName = body.userInfo.nickName;
        let roleType = body.userInfo.roleType;
        let token = body.token.token;
        let userData = {
          userId: "",
          loginName: "",
          name: "",
          roleType: "",
          schoolName: "",
          className: "",
          teaUserId: "",
          teaRealName: "",
          userImg: ""
        };
        userData.userId = userId;
        userData.name = nikeName;
        userData.roleType = roleType;

        /*过期时间*/
        let expiresIn = body.token.expiresIn;
        // 根据userId和token查找用户信息 班级
        request.post({
          url: umsUrl + '/user/getUserInfo',
          form: {
            "systemCode": systemCode,
            "userId": userId,
            "token": token
          }
        }, function optionalCallback(err, httpResponse, body) {
          if (err) {
            console.error('error:', err);
            info.code = 1001;
            info.message = code(1000);
            res.send(info);
          } else {
            body = JSON.parse(body);
            if (body.code) {
              info.message = body.description;
              info.code = body.code;
              res.send(info);
            } else {
              let schoolName = body.userInfo.schoolName;
              let loginName = body.userInfo.loginName;
              let className = body.userInfo.integratGradeClass;
              userData.loginName = loginName;
              userData.schoolName = schoolName;

              sqlFun.findUserOne(userId).then(function (data0) {
                let teaRealName;
                let teaUserId;
                co(function* () {
                  if (roleType === 1) {
                    yield sqlFun.findTeacherByStudent(className).then(function (data2) {
                      if (data2.data) {
                        teaUserId = data2.data.user_id;
                        teaRealName = data2.data.real_name;
                      } else {
                        teaUserId = null;
                        teaRealName = null;
                      }
                    }, function (data2) {
                      info.code = 1002;
                      info.message = code(1002);
                      res.send(info);
                    })
                  }
                  if (roleType === 2) {
                    teaUserId = userId;
                    teaRealName = nikeName;
                  }
                  userData.teaUserId = teaUserId;
                  userData.teaRealName = teaRealName;

                  if (data0.data) {
                    userData.userImg = data0.data.user_img;
                    userData.className = data0.data.class_name_show;
                    //如果能查询到数据，执行更新
                    yield sqlFun.updateUser(userId, loginName, nikeName, roleType, teaUserId, teaRealName, schoolName, className).then(function (data1) {
                      //更新成功
                    }, function (data1) {
                      //更新失败
                      info.message = code(1003);
                      info.code = 1003;
                      res.send(info);
                    })
                  } else {
                    userData.userImg = null;
                    userData.className = null;
                    yield sqlFun.insertUser(userId, loginName, nikeName, roleType, teaUserId, teaRealName, schoolName, className).then(function (data3) {
                      //插入成功
                    }, function (data3) {
                      info.message = code(1004);
                      info.code = 1004;
                      res.send(info);
                    })

                  }
                  info.data.userData = userData;
                  info.data.token = token;
                  //产生session
                  req.session.user = userId;
                  req.session.token = token;

                  //将token存入redis
                  redis.setData(userId, token, parseInt(expiresIn / 1000));
                  console.log(info);
                  res.send(info);
                })
              }, function (data0) {
                info.code = 1005;
                info.message = code(1005);
                res.send(info);
              });

            }
          }
        })
      }
    }
  });
});

/*自动登录*/
router.post('/autoLogin', function (req, res, next) {
  let info = {
    message: "",
    flag: false,
    code: 0,
    data: {}
  };
  let token = req.body.token;
  let userId = req.body.userId;
  redis.getData(userId).then(function (result) {
    let redisToken = result;
    /*将前端传过来的本地存储的token与redis里的token对比*/
    if (token !== redisToken || !redisToken) {
      info.message = code(1000);
      info.code = 1000;
      res.send(info);
    } else {
      request.post({
        url: umsUrl + '/token/refreshToken',
        form: {
          "systemCode": systemCode,
          "userId": userId,
          "token": token
        }
      }, function optionalCallback(err, httpResponse, body) {
        if (err) {
          console.error('error:', err);
          info.message = code(1001);
          info.code = 1001;
          res.send(info);
        } else {
          let data = JSON.parse(body);
          let newToken = data.token;
          if (!newToken) {
            info.message = data.description;
            info.code = data.code;
            res.send(info);
          } else {
            let newExpiresIn = data.expiresIn;
            info.data.token = newToken;
            info.data.userId = userId;
            info.flag = true;
            info.message = "自动登录成功";
            info.code = 0;
            req.session.user = userId;
            req.session.token = token;
            redis.setData(userId, newToken, parseInt(newExpiresIn / 1000));
            res.send(info);
          }
        }
      })
    }
  })
});

/*注销*/
router.post('/logout', function (req, res, next) {
  let userId = req.body.userId;
  let token = req.body.token;
  let info = {
    message: "",
    code: 0,
    flag: false
  };
  redis.getData(userId).then(function (result) {
    let redisToken = result;
    /*将前端传过来的本地存储的token与redis里的token对比*/
    if (token !== redisToken || !redisToken) {
      info.message = code(1000);
      info.code = 1000;
      res.send(info);
    } else {
      request.post({
        url: umsUrl + '/user/loginOut',
        form: {
          "systemCode": systemCode,
          "userId": userId,
          "token": token
        }
      }, function optionalCallback(err, httpResponse, body) {
        if (err) {
          console.error('error:', err);
          info.message = code(1001);
          info.code = 1001;
          res.send(info);
        } else {
          if (!body.code) {
            //注销成功
            info.flag = true;
            info.message = "注销登录成功";
            info.code = 0;
            req.session.destroy();
            res.send(info);
          } else {
            info.message = body.description;
            info.code = body.code;
            res.send(info);
          }
        }
      })
    }
  })
});


// 修改图象
router.post("/changeUserImg", function (req, res, next) {
  let info = {
    message: "",
    code: 0,
    flag: false,
    data: {
      avatarUrl: null
    }
  };
  /*redis存取的token*/
  let userId = req.body.userId;
  let localToken = req.body.token;
  let imgBase64 = req.body.imgData;
  redis.getData(userId).then(function (result) {
    let redisToken = result;
    /*将前端传过来的本地存储的token与redis里的token对比*/
    if (localToken !== redisToken || !redisToken) {
      info.message = code(1000);
      info.code = 1000;
      res.send(info);
    } else {
      let filePath = path.join(uploadPath, `/avatar/${userId}.jpg`)
      //过滤data:URL
      let dataBuffer = new Buffer(imgBase64, 'base64');
      // 保存图片
      fs.outputFile(filePath, dataBuffer, err => {
        if (err) {
          console.log(err);
          info.message = code(1008);
          info.code = 1008;
          res.send(info);
          return false;
        }
        // 删除已经存在的压缩图片
        let compressFilePath = path.join(uploadPath, `/avatar/S-${userId}.jpg`)
        fs.remove(compressFilePath, function (err) {
          if (err) {
            console.log(err);
            info.message = code(1013);
            info.code = 1013;
            res.send(info);
          } else {
            sharp.cache(false);
            sharp(filePath).resize(300, 300).jpeg().toFile(compressFilePath, (err, data) => {
              if (err) {
                console.log(err);
                info.message = code(1013);
                info.code = 1013;
                res.send(info);
              } else {
                let userImgUrl = '/avatar/S-' + userId + '.jpg'
                sqlFun.updateUserImg(userId, userImgUrl).then(function (data) {
                  info.flag = true;
                  info.message = "头像修改成功";
                  info.data.avatarUrl = userImgUrl;
                  res.send(info);
                }, function (data) {
                  console.log(data);
                  info.message = data.message;
                  res.send(info);
                })
              }
            })

          }
        });

      })
    }
  })
})


// 修改用户名
router.post('/updateUserName', function (req, res, next) {
  let userId = req.body.userId
  let token = req.body.token
  let name = req.body.name
  let roleType = req.body.roleType
  let info = {
    message: "",
    code: 0,
    flag: false,
    data: {}
  };
  redis.getData(userId).then(function (result) {
    let redisToken = result;
    /*将前端传过来的本地存储的token与redis里的token对比*/
    if (token !== redisToken || !redisToken) {
      info.message = code(1000);
      info.code = 1000;
      res.send(info);
    } else {
      request.post({
        url: umsUrl + '/update/updateUserInfo',
        body: {
          "nickName": name,
          "systemCode": systemCode,
          "token": token,
          "updateUser": "admin",
          "userId": userId
        },
        json: true
      }, function optionalCallback(err, httpResponse, body) {
        console.log(body);
        if (err) {
          console.error('error:', err);
          info.message = code(1001);
          info.code = 1001;
          res.send(info);
        } else {
          if (!body.code) {
            // 修改数据库user_cache表
            sqlFun.updateUserName(userId, name).then(function (data1) {
              let id = uuid.v4()
              let content = `用户id为${userId}的用户更新真实名为${name}`
              return sqlFun.updateNameLog(id, userId, roleType, content)
            }, function (data1) {
              console.log(data1);
              info.message = code(1007);
              info.code = 1007;
              res.send(info);
            }).then(function () {
              info.message = '修改成功';
              info.data.name = name
              info.flag = true;
              res.send(info)
            }, function () {
              console.log(data1);
              info.message = code(1014);
              info.code = 1014;
              res.send(info);
            })
          } else {
            info.message = body.description;
            info.code = body.code;
            res.send(info);
          }
        }
      })
    }
  })
});

// 更新显示的班级名
router.post('/updateClassName', function (req, res, next) {
  let userId = req.body.userId;
  let localToken = req.body.token;
  let className = req.body.className;
  let info = {
    flag: false,
    code: 0,
    message: "",
    data: {}
  };
  /*redis存取的token*/
  redis.getData(userId).then(function (result) {
    let redisToken = result;
    /*将前端传过来的本地存储的token与redis里的token对比*/
    if (localToken !== redisToken || !redisToken) {
      info.message = code(1000);
      info.code = 1000;
      res.send(info);
    } else {
      sqlFun.updateClassName(userId, className).then(function (data) {
        info.flag = true;
        info.message = "修改成功";
        info.data.className = className;
        res.send(info);
      }, function (data) {
        console.log(data);
        info.message = code(1012);
        info.code = 1012;
        res.send(info);
      })
    }
  })

});



router.post('/selfInfoNum', function (req, res, next) {
  let userId = req.body.userId;
  let roleType = req.body.roleType;
  let localToken = req.body.token;
  let info = {
    flag: false,
    code: 0,
    message: "",
    data: null
  };
  /*redis存取的token*/
  redis.getData(userId).then(function (result) {
    let redisToken = result;
    /*将前端传过来的本地存储的token与redis里的token对比*/
    if (localToken !== redisToken || !redisToken) {
      info.message = code(1000);
      info.code = 1000;
      res.send(info);
    } else {
      let selfInfoNum = {
        problemNum: null,
        answerNum: null,
        evaluationNum: null
      }
      co(function* () {
        yield sqlFun.getProblemNum(userId).then(function (data) {
          selfInfoNum.problemNum = data.data;
        }, function (data) {
          console.log(data);
          info.message = code(1009);
          info.code = 1009;
          res.send(info);
        })

        yield sqlFun.getAnswerNum(userId).then(function (data) {
          selfInfoNum.answerNum = data.data;
        }, function (data) {
          console.log(data);
          info.message = code(1010);
          info.code = 1010;
          res.send(info);
        })

        if (roleType === 1) {
          // 学生
          yield sqlFun.getStudentEvaluationNum(userId).then(function (data) {
            selfInfoNum.evaluationNum = data.data;
          }, function (data) {
            console.log(data);
            info.message = code(2002);
            info.code = 2002;
            res.send(info);
          })
        }
        else if (roleType === 2) {
          // 老师
          yield sqlFun.getTeacherEvaluationNum(userId).then(function (data) {
            selfInfoNum.evaluationNum = data.data;
          }, function (data) {
            console.log(data);
            info.message = code(2002);
            info.code = 2002;
            res.send(info);
          })
        }

        info.data = selfInfoNum
        info.flag = true
        res.send(info)
      })


    }
  })
});


module.exports = router;