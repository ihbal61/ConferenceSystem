# 学术会议管理平台
## 项目规范
### server.js
该文件是服务器的主程序，内容包括：
- express框架的引入
- express框架中间件的引入
- 路由文件引入
- 端口监听
- WebSocket监听
- WebSocket功能定义

如果需要增加客户端与服务端的交互功能，则应向该文件中的WebSocket部分添加功能。
### routes/router.js
该文件是网站的路由管理，内容包括：
- 路由的获取
- ejs模板的渲染

如果需要增加新页面，则应向该文件添加路由。
### views/
该文件夹是ejs模板文件夹，所有页面模板应保存在这个文件夹内。
如果需要添加页面文件，则应保存在该文件夹内。
### public/
该文件夹是网站的静态文件的保存文件夹，内部的文件可以视作存在于网站根目录。
### lib/
该文件夹内是自行编写的功能库。
如果需要增加新的功能库，那么可以在该文件夹内添加。
### lib/config
该文件是项目的配置文件，内容包括：
- http监听端口
- mongodb参数
- 密码的salt
- session的参数

如果有新的可配置项，可以将参数添加入该文件。
### lib/mongo.js
该文件是与数据库的操作库，所有需要操作数据库的功能都应作为函数写入。
如果需要添加新的数据库操作，那么可以在该文件内添加。
## 数据库参考
由于使用的数据库是mongodb，因此没有固定的数据库表的概念，可自由添加新数据项，以下仅供参考。
### 用户
```
{
    "_id" : ObjectId("5b3739954768d440bc02dedc"),
    "username" : "123123",
    "password" : "123123"
}
```
### 会议信息
```
{
    "_id" : ObjectId("5b3838570aec855474e3a5a1"),
    "title" : "title",
    "description" : "description",
    "paper_info" : "info",
    "important_dates" : {
        "paper_deadline" : "2018-7-12 08:00:00",
        "dtba" : "2018-7-13 08:00:00",
        "regis_date" : "2018-7-15 08:00:00",
        "conference_date" : "2018-7-19 08:00:00"
    },
    "arrangement" : [
        {
            "start" : "2018-7-19 08:00:00",
            "end" : "2018-7-19 12:00:00",
            "description" : "上午会议"
        },
        {
            "start" : "2018-7-19 12:00:00",
            "end" : "2018-7-19 13:30:00",
            "description" : "午餐"
        },
        {
            "start" : "2018-7-19 14:00:00",
            "end" : "2018-7-19 18:00:00",
            "description" : "下午会议"
        }
    ],
    "org" : "org",
    "template" : "templateid",
    "price" : 10,
    "acc_traffic" : "traffic",
    "contact" : "123123123123"
}
```
