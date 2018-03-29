// 评价相关路由
const express = require('express')
const path = require('path')
const router = express.Router()
const co = require('co')
const uuid = require('uuid')
const fs = require("fs-extra")
const request = require('request')
const sqlFun = require('./assets/sql/sql_fun')
const redis = require('./assets/lib/redis.js')
const config = require(path.join(__dirname, '../config'))
const uploadPath = path.join(__dirname, '../uploads/')
const code = require(path.join(__dirname, '../code'))
const umsUrl = config.umsApiConfig.umsUrl
const systemCode = config.systemCode


// 列出老师所有的学生
router.post('/listAllStudent', function (req, res, next) {
  let teacherId = req.body.teacherId;
  let localToken = req.body.token;
  let info = {
    flag: false,
    code: 0,
    message: ""
  };
  /*redis存取的token*/
  redis.getData(teacherId).then(function (result) {
    let redisToken = result;
    /*将前端传过来的本地存储的token与redis里的token对比*/
    if (localToken !== redisToken || !redisToken) {
      info.message = code(1000);
      info.code = 1000;
      res.send(info);
    } else {
      sqlFun.listAllStudent(teacherId).then(function (data) {
        info.flag = true;
        info.message = "获取学生列表成功";
        info.data = data.data;
        res.send(info);
      }, function (data) {
        console.log(data);
        info.message = code(3001);
        info.code = 3001;
        res.send(info);
      })
    }
  })
});

// 添加评价
router.post('/addEvaluation', function (req, res, next) {
  let teacherId = req.body.teacherId;
  let localToken = req.body.token;
  let evaluationData = req.body.evaluationData;

  let info = {
    flag: false,
    code: 0,
    message: ""
  };
  /*redis存取的token*/
  redis.getData(teacherId).then(function (result) {
    let redisToken = result;
    /*将前端传过来的本地存储的token与redis里的token对比*/
    if (localToken !== redisToken || !redisToken) {
      info.message = code(1000);
      info.code = 1000;
      res.send(info);
    } else {
      let groupId = uuid.v4();
      evaluationData.forEach((el, index) => {
        let evaluationId = uuid.v4();
        el['evaluate_id'] = evaluationId;
        el['group_id'] = groupId;
        el['remark'] = null;
      });
      sqlFun.addEvaluation(evaluationData).then(function (data) {
        info.flag = true;
        info.message = "添加评价成功";
        res.send(info);
      }, function (data) {
        console.log(data);
        info.message = code(3002);
        info.code = 3002;
        res.send(info);
      })
    }
  })
});

// 老师查看单个学生的评价记录
router.post('/singleStudentRecord', function (req, res, next) {
  let studentId = req.body.studentId;
  let teacherId = req.body.teacherId;
  let localToken = req.body.token;
  let info = {
    flag: false,
    code: 0,
    message: "",
    data: {}
  };
  /*redis存取的token*/
  redis.getData(teacherId).then(function (result) {
    let redisToken = result;
    /*将前端传过来的本地存储的token与redis里的token对比*/
    if (localToken !== redisToken || !redisToken) {
      info.message = code(1000);
      info.code = 1000;
      res.send(info);
    } else {
      sqlFun.findUserOne(studentId).then(function (data) {
        console.log(data);
        if (!data.data) {
          info.message = "没有该用户";
          info.flag = true;
          res.send(info);
          return false;
        }
        info.data.userInfo = data.data;
        return sqlFun.getStudentAllSingleEvaluation(studentId)
      }, function (data) {
        console.log(data);
        info.message = code(1005);
        info.code = 1005;
        res.send(info);
      }).then(function (data1) {

        if (data1.data) {
          let firstScoreSum = 0;
          let secondScoreSum = 0;
          let thirdScoreSum = 0;
          let fourthScoreSum = 0;
          let fifthScoreSum = 0;
          for (let i = 0; i < data1.data.length; i++) {
            firstScoreSum += data1.data[i].first_score;
            secondScoreSum += data1.data[i].second_score;
            thirdScoreSum += data1.data[i].third_score;
            fourthScoreSum += data1.data[i].fourth_score;
            fifthScoreSum += data1.data[i].fifth_score;
          }
          info.data.evaluationSum = {
            "first_score": firstScoreSum,
            "second_score": secondScoreSum,
            "third_score": thirdScoreSum,
            "fourth_score": fourthScoreSum,
            "fifth_score": fifthScoreSum
          };
          info.data.evaluationData = data1.data;
          info.flag = true;
          info.message = "查找成功";
          res.send(info);
        } else {
          info.message = "没有评论";
          info.data.evaluationSum = {
            "first_score": 0,
            "second_score": 0,
            "third_score": 0,
            "fourth_score": 0,
            "fifth_score": 0
          };
          info.flag = true;
          res.send(info);
        }
      }, function (data1) {
        console.log(data);
        info.message = code(3002);
        info.code = 3002;
        res.send(info);
      })
    }
  })

});

// 老师查看所有学生的评价记录
router.post('/listStudentScoreSum', function (req, res, next) {
  let teacherId = req.body.teacherId;
  let localToken = req.body.token;
  let info = {
    flag: false,
    code: 0,
    message: "",
    data: []
  };
  // /*redis存取的token*/
  redis.getData(teacherId).then(function (result) {
    let redisToken = result;
    /*将前端传过来的本地存储的token与redis里的token对比*/
    if (localToken !== redisToken || !redisToken) {
      info.message = code(1000);
      info.code = 1000;
      res.send(info);
    } else {
      sqlFun.listAllStudent(teacherId).then(function (data) {
        if (!data.data) {
          info.message = "查询为空"
          info.flag = false
          res.send(info)
          return false
        }
        co(function* () {
          for (let i = 0; i < data.data.length; i++) {
            let studentId = data.data[i].user_id;
            yield sqlFun.sumPartScore(studentId).then(function (data1) {
              data.data[i].evaluationSum = data1.data;
            }, function (data1) {
              console.log(data);
              info.message = code(3003);
              info.code = 3003;
              res.send(info);
            })
          }
          info.data = data.data;
          info.flag = true;
          info.message = '获取评论列表成功';
          res.send(info);
        })
      }, function (data) {
        console.log(data);
        info.message = code(3001);
        info.code = 3001;
        res.send(info);
      })
    }
  })
});

router.post('/listStudentAllEvaluation', function (req, res, next) {
  var studentId = req.body.studentId;
  var localToken = req.body.token;
  var info = {
    flag: false,
    code: 0,
    message: "",
    data: []
  };
  /*redis存取的token*/
  redis.getData(studentId).then(function (result) {
    var redisToken = result;
    /*将前端传过来的本地存储的token与redis里的token对比*/
    if (localToken !== redisToken || !redisToken) {
      info.message = code(1000);
      info.code = 1000;
      res.send(info);
    } else {
      sqlFun.listStudentAllEvaluation(studentId).then(function (data) {
        if (!data.data) {
          info.message = "查询为空"
          info.flag = false
          res.send(info)
          return false
        }
        co(function* () {
          for (var i = 0; i < data.data.length; i++) {
            var teacherId = data.data[i].user_tea_id;
            yield sqlFun.findUserOne(teacherId).then(function (data1) {
              data.data[i].teacherInfo = data1.data;
            }, function (data1) {
              console.log(data);
              info.message = code(3003);
              info.code = 3003;
              res.send(info);
            })
          }
          info.data = data.data;
          info.flag = true;
          info.message = '获取评论成功';
          res.send(info);
        })
      }, function (data) {
        console.log(data);
        info.message = code(3001);
        info.code = 3001;
        res.send(info);
      })
    }
  })
});

module.exports = router;

