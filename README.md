#sequelize-auto生成models
```code
sequelize-auto -o "./routes/assets/sql_models" -d wetland_service -h localhost -u root -p 3306 -x Admin12345* -e mysql
```

##读取两个excel文件账号信息批量登录老师学生账号，以便确定数据库老师学生关系信息

#用户模块

##1、登录
```code
参数：{
	"username":"xianianjun",
	"password": "123456"
}
方式：post
192.168.110.17:3001/wetland_service/user/login
返回：{
    "flag": true,
    "message": "登录成功",
    "data": {
        "userData": {
            "userId": "67F85309845A3C99DE931E07BA2581CD",
            "name": "夏念军",
            "roleType": 1,
            "schoolName": "上海坦思计算机系统股份有限公司",
            "gradeName": "三部",
            "className": "教育班"
        },
        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1MjE0NDA4MzQsInN1YiI6IntcInN5c3RlbUNvZGVcIjpcImV0enJcIixcInVzZXJJZFwiOlwiNjdGODUzMDk4NDVBM0M5OURFOTMxRTA3QkEyNTgxQ0RcIn0iLCJpc3MiOiJ1bXMiLCJhdWQiOiJldHpyIiwiZXhwIjoxNTIyMDQ1NjM0LCJuYmYiOjE1MjE0NDA4MzR9.R6JabjAma98ln-LgpHav3pSBYZEFuz3YZ0k4h1VyzaE"
    }
}
```

##2、注销
```code
参数：{
	"userId": "67F85309845A3C99DE931E07BA2581CD",
	"token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1MjE0NDA4MzQsInN1YiI6IntcInN5c3RlbUNvZGVcIjpcImV0enJcIixcInVzZXJJZFwiOlwiNjdGODUzMDk4NDVBM0M5OURFOTMxRTA3QkEyNTgxQ0RcIn0iLCJpc3MiOiJ1bXMiLCJhdWQiOiJldHpyIiwiZXhwIjoxNTIyMDQ1NjM0LCJuYmYiOjE1MjE0NDA4MzR9.R6JabjAma98ln-LgpHav3pSBYZEFuz3YZ0k4h1VyzaE"
}
方式：post
192.168.110.17:3001/wetland_service/user/logout
返回： {
    "message": "注销登录成功",
    "flag": true
}
```


##3、自动登录
```code
参数：token
      userId
方式：post
192.168.110.17:3001/wetland_service/user/autoLogin
```

##4、修改名字
```code
参数：token
      userId
      name
方式：post
192.168.110.17:3001/wetland_service/user/updateUserName
返回： {
    "message": "修改成功",
    "code": 0,
    "flag": true
}
```

##5、修改图象
```code
参数：userId
      token
      imgData
方式：post
192.168.110.17:3001/wetland_service/user/changeUserImg
返回：{
    "message": "头像修改成功",
    "code": 0,
    "flag": true
}
```

##6、获得个人中心三个值
```code
参数：token
      userID
      roleType  1或2  学生/老师
方式：post
192.168.110.17:3001/wetland_service/user/selfInfoNum
返回： {
    "flag": true,
    "code": 0,
    "message": "",
    "data": {
        "problemNum": 0,
        "answerNum": 0,
        "evaluationNum": 6
    }
}
```

##9、更新班级名
```code
参数：userId
      token
      className
方式：post
192.168.110.17:3001/wetland_service/user/updateClassName
返回：{
    "flag": true,
    "code": 0,
    "message": "修改成功",
    "data": {
        "className": "二班"
    }
}
```


#问题模块

##1、添加问题
```code
参数：token
      userId
      content
      imgData   数组
方式：post
192.168.110.17:3001/wetland_service/problem/add
返回： {
    "message": "添加问题成功",
    "code": 0,
    "flag": true
}
```

##2、删除问题
```code
参数：token
      userId
      id
方式：post
192.168.110.17:3001/wetland_service/problem/delete
返回： {
    "message": "删除问题成功",
    "code": 0,
    "flag": true
}
```

##3、单个问题
```code
参数：token
      userId
      id
方式：post
192.168.110.17:3001/wetland_service/problem/single
返回： {
    "flag": true,
    "code": 0,
    "message": "成功",
    "data": {
        "create_time": "2018-03-28 13:10:01",
        "update_time": "2018-03-20 13:10:10",
        "problem_id": "qqwqwqwq",
        "user_id": "1234",
        "problem_content": "啊啊啊到家附近的房价爱挨打放松的方式地方",
        "pro_pic_url1": "1",
        "pro_pic_url2": "1",
        "pro_pic_url3": "1",
        "is_delete": 0,
        "user_cache": {
            "user_id": "1234",
            "login_name": null,
            "real_name": "问问",
            "role_type": 1,
            "tea_user_id": null,
            "tea_real_name": null,
            "user_img": null,
            "class_name": "1班",
            "school_name": "小学",
            "create_time": "2018-03-20T07:03:12.000Z",
            "update_time": "2018-03-20T07:03:14.000Z"
        },
        "answerData": [
            {
                "create_time": "2018-03-20 16:52:41",
                "update_time": "2018-03-20 16:52:44",
                "answer_id": "3232323",
                "problem_id": "qqwqwqwq",
                "user_id": "1234",
                "answer_content": "山东的等等等等等等",
                "answer_pic_url1": " 1",
                "answer_pic_url2": " 1",
                "answer_pic_url3": "1",
                "is_delete": 0,
                "user_cache": {
                    "user_id": "1234",
                    "login_name": null,
                    "real_name": "问问",
                    "role_type": 1,
                    "tea_user_id": null,
                    "tea_real_name": null,
                    "user_img": null,
                    "class_name": "1班",
                    "school_name": "小学",
                    "create_time": "2018-03-20T07:03:12.000Z",
                    "update_time": "2018-03-20T07:03:14.000Z"
                }
            }
        ]
    }
}
```


##4、问题列表
```code
参数：token
      userId
      page 页码 整数
      pn 每页个数
      order 排序规则 DESC 倒序  ASC 正序
方式：post
192.168.110.17:3001/wetland_service/problem/list
返回： {
    "flag": true,
    "code": 0,
    "message": "查找成功",
    "data": [
        {
            "create_time": "2018-03-28 13:10:01",
            "update_time": "2018-03-20 13:10:10",
            "problem_id": "qqwqwqwq",
            "user_id": "1234",
            "problem_content": "啊啊啊到家附近的房价爱挨打放松的方式地方",
            "pro_pic_url1": "1",
            "pro_pic_url2": "1",
            "pro_pic_url3": "1",
            "is_delete": 0,
            "user_cache": {
                "user_id": "1234",
                "login_name": null,
                "real_name": "问问",
                "role_type": 1,
                "tea_user_id": null,
                "tea_real_name": null,
                "user_img": null,
                "class_name": "1班",
                "school_name": "小学",
                "create_time": "2018-03-20T07:03:12.000Z",
                "update_time": "2018-03-20T07:03:14.000Z"
            },
            "answerCount": 1
        },
        {
            "create_time": "2018-03-21 16:43:27",
            "update_time": "2018-03-21 16:43:27",
            "problem_id": "3994c185-959c-4e1f-abe9-68ad6c6a4063",
            "user_id": "67F85309845A3C99DE931E07BA2581CD",
            "problem_content": "1111",
            "pro_pic_url1": "/problem/3994c185-959c-4e1f-abe9-68ad6c6a4063-3.png",
            "pro_pic_url2": "/problem/3994c185-959c-4e1f-abe9-68ad6c6a4063-3.png",
            "pro_pic_url3": "/problem/3994c185-959c-4e1f-abe9-68ad6c6a4063-3.png",
            "is_delete": 0,
            "user_cache": {
                "user_id": "67F85309845A3C99DE931E07BA2581CD",
                "login_name": "xianianjun",
                "real_name": "夏念军1",
                "role_type": 1,
                "tea_user_id": "555555",
                "tea_real_name": "李四",
                "user_img": "/avatar/67F85309845A3C99DE931E07BA2581CD.png",
                "class_name": "[三部,教育班]",
                "school_name": "上海坦思计算机系统股份有限公司",
                "create_time": "2018-03-19T10:03:03.000Z",
                "update_time": "2018-03-21T09:04:35.000Z"
            },
            "answerCount": 0
        },
        {
            "create_time": "2018-03-21 16:38:13",
            "update_time": "2018-03-21 16:38:13",
            "problem_id": "df6e3a32-d220-40b9-837c-99314063b535",
            "user_id": "67F85309845A3C99DE931E07BA2581CD",
            "problem_content": "1111",
            "pro_pic_url1": "/problem/df6e3a32-d220-40b9-837c-99314063b535-3.png",
            "pro_pic_url2": "/problem/df6e3a32-d220-40b9-837c-99314063b535-3.png",
            "pro_pic_url3": "/problem/df6e3a32-d220-40b9-837c-99314063b535-3.png",
            "is_delete": 0,
            "user_cache": {
                "user_id": "67F85309845A3C99DE931E07BA2581CD",
                "login_name": "xianianjun",
                "real_name": "夏念军1",
                "role_type": 1,
                "tea_user_id": "555555",
                "tea_real_name": "李四",
                "user_img": "/avatar/67F85309845A3C99DE931E07BA2581CD.png",
                "class_name": "[三部,教育班]",
                "school_name": "上海坦思计算机系统股份有限公司",
                "create_time": "2018-03-19T10:03:03.000Z",
                "update_time": "2018-03-21T09:04:35.000Z"
            },
            "answerCount": 0
        }
    ]
}
```


##5、回答问题
```code
参数：token
      userId
      problemId
      content
方式：post
192.168.110.17:3001/wetland_service/problem/addAnswer
返回： {
    "message": "添加回答成功",
    "code": 0,
    "flag": true
}
```

##6、获取问题答案数据
```code
参数：token
      userId
      problemId
方式：post
192.168.110.17:3001/wetland_service/problem/getAnswerInfo
返回： {
    "flag": true,
    "code": 0,
    "message": "查询问题答案成功",
    "data": [
        {
            "create_time": "Invalid date",
            "update_time": "Invalid date",
            "answer_id": "aaaaaaaaaaaaaaaaaaa",
            "problem_id": "0a091c76-2078-4faa-8bbc-9657be5c76a1",
            "user_id": "AD0DE1AA814C8437CE75BAFCFC4A69F2",
            "answer_content": "2q2222",
            "answer_pic_url1": null,
            "answer_pic_url2": null,
            "answer_pic_url3": null,
            "is_delete": 0,
            "user_cache": {
                "user_id": "AD0DE1AA814C8437CE75BAFCFC4A69F2",
                "login_name": "wtt001",
                "real_name": "王老师",
                "role_type": 2,
                "tea_user_id": "AD0DE1AA814C8437CE75BAFCFC4A69F2",
                "tea_real_name": "王老师",
                "user_img": null
            }
        }
    ]
}
```

#评价模块

##1、列出老师的所有学生
```code
参数：token
      teacherId
方式：post
192.168.110.17:3001/wetland_service/evaluation/listAllStudent
返回： {
    "flag": true,
    "code": 0,
    "message": "获取学生列表成功",
    "data": [
        {
            "user_id": "140C72AFF2E4694C3CEA1C54E4EBF01D",
            "login_name": "huliang",
            "real_name": "胡亮",
            "role_type": 1,
            "tea_user_id": "555555",
            "tea_real_name": "李四",
            "user_img": "/avatar/140C72AFF2E4694C3CEA1C54E4EBF01D.png"
        },
        {
            "user_id": "67F85309845A3C99DE931E07BA2581CD",
            "login_name": "xianianjun",
            "real_name": "夏念军1",
            "role_type": 1,
            "tea_user_id": "555555",
            "tea_real_name": "李四",
            "user_img": "/avatar/67F85309845A3C99DE931E07BA2581CD.png"
        }
    ]
}
```

##2、批量添加评价
```code
参数：token
      teacherId
      evaluationData

      evaluationData形式:
[{
	"user_tea_id": "abcdefg",
	"user_stu_id": "qqqqqqq",
	"evaluate_module": "111",
	"first_score": 1,
	"second_score": 1,
	"third_score": 1,
	"fourth_score": 1,
	"fifth_score": 1
}, {
	"user_tea_id": "abcdefg",
	"user_stu_id": "qqqqqqq",
	"evaluate_module": "111",
	"first_score": 1,
	"second_score": 1,
	"third_score": 1,
	"fourth_score": 1,
	"fifth_score": 1
}, {
	"user_tea_id": "abcdefg",
	"user_stu_id": "qqqqqqq",
	"evaluate_module": "111",
	"first_score": 1,
	"second_score": 1,
	"third_score": 1,
	"fourth_score": 1,
	"fifth_score": 1
}]
方式：post
192.168.110.17:3001/wetland_service/evaluation/addEvaluation
返回： {
    "flag": true,
    "code": 0,
    "message": "添加评价成功"
}
```

##3、老师点开一个学生查看详细的记录
```code
参数： studentId
  teacherId
  token
方式：post
192.168.110.17:3001/wetland_service/evaluation/singleStudentRecord
返回： {
    "flag": true,
    "code": 0,
    "message": "查找成功",
    "data": {
        "userInfo": {
            "user_id": "qqqqqqq",
            "login_name": null,
            "real_name": "张三",
            "role_type": 1,
            "tea_user_id": "dddd",
            "tea_real_name": null,
            "user_img": null
        },
        "evaluationSum": {
            "first_score": 3,
            "second_score": 3,
            "third_score": 3,
            "fourth_score": 3,
            "fifth_score": 3
        },
        "evaluationData": [
            {
                "create_time": "2018-03-23 13:33:46",
                "update_time": "2018-03-23 13:33:46",
                "evaluate_id": "31546fba-8e03-4723-aa82-f9c349781e16",
                "user_tea_id": "abcdefg",
                "user_stu_id": "qqqqqqq",
                "group_id": "9226cab0-21e9-4ba8-b438-4cfd6437acf9",
                "evaluate_module": 111,
                "first_score": 1,
                "second_score": 1,
                "third_score": 1,
                "fourth_score": 1,
                "fifth_score": 1,
                "remark": null
            },
            {
                "create_time": "2018-03-23 13:33:46",
                "update_time": "2018-03-23 13:33:46",
                "evaluate_id": "367ae309-857f-4354-aa50-eec9f015f20e",
                "user_tea_id": "abcdefg",
                "user_stu_id": "qqqqqqq",
                "group_id": "9226cab0-21e9-4ba8-b438-4cfd6437acf9",
                "evaluate_module": 111,
                "first_score": 1,
                "second_score": 1,
                "third_score": 1,
                "fourth_score": 1,
                "fifth_score": 1,
                "remark": null
            },
            {
                "create_time": "2018-03-23 13:33:46",
                "update_time": "2018-03-23 13:33:46",
                "evaluate_id": "65689ddd-871e-41b5-ba79-b3b804aad626",
                "user_tea_id": "abcdefg",
                "user_stu_id": "qqqqqqq",
                "group_id": "9226cab0-21e9-4ba8-b438-4cfd6437acf9",
                "evaluate_module": 111,
                "first_score": 1,
                "second_score": 1,
                "third_score": 1,
                "fourth_score": 1,
                "fifth_score": 1,
                "remark": null
            }
        ]
    }
}
```

##4、老师查看所有学生的记录
```code
参数： teacherId
      token
方式：post
192.168.110.17:3001/wetland_service/evaluation/listStudentScoreSum
返回： {
    "flag": true,
    "code": 0,
    "message": "获取评论列表成功",
    "data": [
        {
            "user_id": "140C72AFF2E4694C3CEA1C54E4EBF01D",
            "login_name": "huliang",
            "real_name": "胡亮",
            "role_type": 1,
            "tea_user_id": "555555",
            "tea_real_name": "李四",
            "user_img": "/avatar/140C72AFF2E4694C3CEA1C54E4EBF01D.png",
            "evaluationSum": {
                'first_score': 0,
                'second_score': 0,
                'third_score': 0,
                'fourth_score': 0,
                'fifth_score': 0
            }
        },
        {
            "user_id": "67F85309845A3C99DE931E07BA2581CD",
            "login_name": "xianianjun",
            "real_name": "夏念军1",
            "role_type": 1,
            "tea_user_id": "555555",
            "tea_real_name": "李四",
            "user_img": "/avatar/67F85309845A3C99DE931E07BA2581CD.png",
            "evaluationSum": {
                'first_score': 0,
                'second_score': 0,
                'third_score': 0,
                'fourth_score': 0,
                'fifth_score': 0
            }
        },
        {
            "user_id": "qqqqqqq",
            "login_name": null,
            "real_name": "张三",
            "role_type": 1,
            "tea_user_id": "555555",
            "tea_real_name": null,
            "user_img": null,
            "evaluationSum": {
                "first_score": 3,
                "second_score": 3,
                "third_score": 3,
                "fourth_score": 3,
                "fifth_score": 3
            }
        }
    ]
}
```
##5、学生查看自己的记录
```code
参数： studentId
      token
方式：post
192.168.110.17:3001/wetland_service/evaluation/listStudentAllEvaluation
返回： {
    "flag": true,
    "code": 0,
    "message": "获取评论成功",
    "data": [
        {
            "create_time": "2018-03-23 13:33:46",
            "update_time": "2018-03-23 13:33:46",
            "evaluate_id": "31546fba-8e03-4723-aa82-f9c349781e16",
            "user_tea_id": "abcdefg",
            "user_stu_id": "qqqqqqq",
            "group_id": "9226cab0-21e9-4ba8-b438-4cfd6437acf9",
            "evaluate_module": 111,
            "first_score": 1,
            "second_score": 1,
            "third_score": 1,
            "fourth_score": 1,
            "fifth_score": 1,
            "remark": null,
            "teacherInfo": {
                "user_id": "abcdefg",
                "login_name": null,
                "real_name": "张张",
                "role_type": 2,
                "tea_user_id": null,
                "tea_real_name": null,
                "user_img": null
            }
        },
        {
            "create_time": "2018-03-23 13:33:46",
            "update_time": "2018-03-23 13:33:46",
            "evaluate_id": "367ae309-857f-4354-aa50-eec9f015f20e",
            "user_tea_id": "abcdefg",
            "user_stu_id": "qqqqqqq",
            "group_id": "9226cab0-21e9-4ba8-b438-4cfd6437acf9",
            "evaluate_module": 111,
            "first_score": 1,
            "second_score": 1,
            "third_score": 1,
            "fourth_score": 1,
            "fifth_score": 1,
            "remark": null,
            "teacherInfo": {
                "user_id": "abcdefg",
                "login_name": null,
                "real_name": "张张",
                "role_type": 2,
                "tea_user_id": null,
                "tea_real_name": null,
                "user_img": null
            }
        },
        {
            "create_time": "2018-03-23 13:33:46",
            "update_time": "2018-03-23 13:33:46",
            "evaluate_id": "65689ddd-871e-41b5-ba79-b3b804aad626",
            "user_tea_id": "abcdefg",
            "user_stu_id": "qqqqqqq",
            "group_id": "9226cab0-21e9-4ba8-b438-4cfd6437acf9",
            "evaluate_module": 111,
            "first_score": 1,
            "second_score": 1,
            "third_score": 1,
            "fourth_score": 1,
            "fifth_score": 1,
            "remark": null,
            "teacherInfo": {
                "user_id": "abcdefg",
                "login_name": null,
                "real_name": "张张",
                "role_type": 2,
                "tea_user_id": null,
                "tea_real_name": null,
                "user_img": null
            }
        }
    ]
}
```







