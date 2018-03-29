
const express = require('express');
const path = require('path');
const router = express.Router();
const uuid = require('uuid')
const moment = require('moment');
const co = require('co');
const fs = require("fs-extra")
const sharp = require('sharp')
const request = require('request');
const sqlFun = require('./assets/sql/sql_fun');
const redis = require('./assets/lib/redis.js');
const config = require(path.join(__dirname, '../config'));
const uploadPath = path.join(__dirname, '../uploads/');
const code = require(path.join(__dirname, '../code'));
const umsUrl = config.umsApiConfig.umsUrl;
const systemCode = config.systemCode;

router.post('/add', function (req, res, next) {
  let info = {
    message: "",
    code: 0,
    flag: false
  };
  let id = uuid.v4();
  let userId = req.body.userId;
  let localToken = req.body.token;
  let content = req.body.content;
  // base64数组
  let imgData = req.body.imgData;
  redis.getData(userId).then(function (result) {
    let redisToken = result;
    /*将前端传过来的本地存储的token与redis里的token对比*/
    if (localToken !== redisToken || !redisToken) {
      info.message = code(1000);
      info.code = 1000;
      res.send(info);
    } else {
      let imgObj = {
        0: null,
        1: null,
        2: null
      };
      let successNum = 0;
      if (!imgData.length) {
        sqlFun.addProblem(id, userId, content, null, null, null).then(function (data) {
          info.flag = true;
          info.message = '添加问题成功';
          res.send(info);
        }, function (data) {
          console.log(data);
          info.message = code(2001);
          info.code = 2001;
          res.send(info);
        })
      } else {

        for (let i = 0; i < imgData.length; i++) {
          let picNmae = `/problem/${id}-${i}.jpg`;
          let filePath = path.join(uploadPath, picNmae)
          let dataBuffer = new Buffer(imgData[i], 'base64');

          fs.outputFile(filePath, dataBuffer, err => {
            if (err) {
              console.log(err);
              info.message = code(1008);
              info.code = 1008;
              res.send(info);
            }
            fs.stat(filePath, function (err, stats) {
              if (err) {
                info.message = code(1013);
                info.code = 1013;
                res.send(info);
              };
              // 图片大于100kb开始压缩
              if (stats.size > 102400) {
                let image = sharp(filePath);
                let outputFilePath = path.join(uploadPath, `/problem/S-${id}-${i}.jpg`)

                image.metadata().then(function (metadata) {
                  return image
                    .resize(metadata.width)
                    .toFile(outputFilePath)
                }).then(function (data) {
                  console.log(`第${i}张图片大于100kb，压缩成功`);
                  picNmae = `/problem/S-${id}-${i}.jpg`;
                  imgObj[i] = picNmae
                  successNum++
                  console.log(successNum);
                  console.log(imgObj);
                  console.log(`成功数为：${successNum}`);
                  if (successNum === imgData.length) {
                    console.log(imgObj);
                    let pro_pic_url1 = imgObj[0] || null;
                    let pro_pic_url2 = imgObj[1] || null;
                    let pro_pic_url3 = imgObj[2] || null;
                    sqlFun.addProblem(id, userId, content, pro_pic_url1, pro_pic_url2, pro_pic_url3).then(function (data) {
                      info.flag = true;
                      info.message = '添加问题成功';
                      res.send(info);
                    }, function (data) {
                      console.log(data);
                      info.message = code(2001);
                      info.code = 2001;
                      res.send(info);
                    })
                  }
                })
              } else {
                imgObj[i] = picNmae
                successNum++
                console.log(successNum);
                console.log(imgObj);
                console.log(`成功数为：${successNum}`);
                if (successNum === imgData.length) {
                  console.log(imgObj);
                  let pro_pic_url1 = imgObj[0] || null;
                  let pro_pic_url2 = imgObj[1] || null;
                  let pro_pic_url3 = imgObj[2] || null;
                  sqlFun.addProblem(id, userId, content, pro_pic_url1, pro_pic_url2, pro_pic_url3).then(function (data) {
                    info.flag = true;
                    info.message = '添加问题成功';
                    res.send(info);
                  }, function (data) {
                    console.log(data);
                    info.message = code(2001);
                    info.code = 2001;
                    res.send(info);
                  })
                }
              }

            });


          })
        }
      }
    }
  })
});


// 删除问题
router.post('/delete', function (req, res, next) {
  let id = req.body.id;
  let userId = req.body.userId;
  let localToken = req.body.token;
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
      sqlFun.deleteProblem(id).then(function (data) {
        info.flag = true;
        info.message = "删除问题成功";
        info.data.problemId = id;
        res.send(info);
      }, function (data) {
        console.log(data);
        info.message = code(2002);
        info.code = 2002;
        res.send(info);
      })
    }
  })
});

router.post('/single', function (req, res, next) {
  let id = req.body.id;
  let userId = req.body.userId;
  let localToken = req.body.token;
  let info = {
    flag: false,
    code: 0,
    message: "",
    data: {}
  };
  redis.getData(userId).then(function (result) {
    let redisToken = result;
    /*将前端传过来的本地存储的token与redis里的token对比*/
    if (localToken !== redisToken || !redisToken) {
      info.message = code(1000);
      info.code = 1000;
      res.send(info);
    } else {
      sqlFun.findOneProblem(id).then(function (data) {
        if (data.data) {
          sqlFun.findProblemAnswer(id).then(function (data1) {
            data.data.answerData = data1.data;
            info.data = data.data;
            info.flag = true;
            info.message = code(0);
            res.send(info);
          }, function (data1) {
            console.log(data1);
            info.message = code(2004);
            info.code = 2004;
            res.send(info);
          })
        } else {
          info.data = data.data;
          info.flag = true;
          info.message = code(0);
          res.send(info);
        }
      }, function (data) {
        console.log(data);
        info.message = code(2003);
        info.code = 2003;
        res.send(info);
      })
    }
  })
});


router.post('/list', function (req, res, next) {
  let userId = req.body.userId;
  let localToken = req.body.token;
  let page = req.body.page;
  let pn = req.body.pn || 18;
  let order = req.body.order || 'DESC';
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
      sqlFun.getProblemList(page, order, 'create_time', pn).then(function (data) {
        let obj = data.data
        co(function* () {
          if (obj) {
            for (let i = 0; i < obj.length; i++) {
              let problemId = obj[i].problem_id;
              yield sqlFun.getAnswerCount(problemId).then(function (data1) {
                obj[i].answerCount = data1.data;
              }, function (data1) {
                console.log(data);
                info.message = code(2005);
                info.code = 2005;
                res.send(info);
              })
            }
            info.data = obj;
            info.message = "查找成功";
            info.flag = true;
            res.send(info);
          } else {
            info.data = [];
            info.message = "查找成功";
            info.flag = true;
            res.send(info);
          }
        })
      }, function (data) {
        console.log(data);
        info.message = code(2006);
        info.code = 2006;
        res.send(info);
      })
    }
  })
});


// 回答问题
router.post('/addAnswer', function (req, res, next) {
  let problemId = req.body.problemId;
  let content = req.body.content;
  let userId = req.body.userId;
  let localToken = req.body.token;
  let answerId = uuid.v4();
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
      sqlFun.addAnswer(answerId, problemId, userId, content).then(function (data) {
        info.flag = true;
        info.message = "添加回答成功";
        info.data.problemId = problemId;
        res.send(info);
      }, function (data) {
        console.log(data);
        info.message = code(2007);
        info.code = 2007;
        res.send(info);
      })
    }
  })
});

router.post('/getAnswerInfo', function (req, res, next) {
  let problemId = req.body.problemId;
  let userId = req.body.userId;
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
      sqlFun.findProblemAnswer(problemId).then(function (data) {
        info.flag = true;
        info.message = "查询问题答案成功";
        info.data = data.data;
        res.send(info);
      }, function (data) {
        console.log(data);
        info.message = code(2004);
        info.code = 2004;
        res.send(info);
      })
    }
  })
});


module.exports = router;



