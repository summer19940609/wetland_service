const xlsx = require("node-xlsx")
const request = require("request")

let teacherInfo = xlsx.parse("老师导入模板.xlsx")
let studentInfo = xlsx.parse("学生导入模板.xlsx")
let loginUrl = `http://localhost:3001/wetland_service/user/login`
let defaultPassword = `123456`

let successTeacherNum = 0

teacherInfo[0].data.forEach((el, index) => {
  if (index > 0) {
    console.log(`登录的老师序号：${index}`)
    console.log(`登录的老师账号：${el[10]}`)

    request.post({
      url: loginUrl,
      body: {
        "username": el[10],
        "password": defaultPassword
      },
      json: true
    }, function optionalCallback(err, httpResponse, body) {
      if (err) {
        console.error('发生错误：', err)
      } else {
        if (!body.code) {
          successTeacherNum++
          // 所有账号全部登录成功
          if (successTeacherNum === teacherInfo[0].data.length - 1) {
            console.log(`所有教师账号登录成功`)
            console.log(`开始登录学生账号`)

            let successStudentNum = 0

            studentInfo[0].data.forEach((el, index) => {
              if (index > 0) {
                console.log(`登录的学生序号：${index}`)
                console.log(`登录的学生账号：${el[11]}`)

                request.post({
                  url: loginUrl,
                  body: {
                    "username": el[11],
                    "password": defaultPassword
                  },
                  json: true
                }, function optionalCallback(err, httpResponse, body) {
                  if (err) {
                    console.error('发生错误：', err)
                  } else {
                    if (!body.code) {
                      successStudentNum++
                      // 所有账号全部登录成功
                      if (successStudentNum === studentInfo[0].data.length - 1) {
                        console.log(`所有学生账号登录成功`)
                        console.log(`-----老师和学生账号全部登录成功-----`);
                      }
                    } else {
                      console.log(`登录失败学生账号为：${el[11]}`)
                    }
                  }
                })
              }
            })
          }
        } else {
          console.log(`登录失败教师账号为：${el[10]}`)
        }
      }
    })
  }
})