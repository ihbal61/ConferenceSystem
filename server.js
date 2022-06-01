var debug = require('debug')('conferencesystem:server');
var http = require('http');
var config = require("./lib/config");
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser')(config.session.secret);
var bodyParser = require('body-parser');
var logger = require('morgan');
var session = require('express-session');
var sharedsession = require('express-socket.io-session');
var mongostore = require('connect-mongo')(session);
const fs = require('fs');
var router = require('./routes/router');
var mongodb = require('./lib/mongo');
var mailer = require('nodemailer');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser);
let sessionmiddleware = session({
  secret: config.session.secret,
  key: config.session.name,
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 15},
  resave: true,
  saveUninitialized: true,
  store: new mongostore({
    url: config.mongodb.getMongoUrl(),
    ttl: 14 * 24 * 60 * 60
  })
});
app.use(sessionmiddleware);
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



//////////////////////////////////////////////////////////////////////////////
//                            服务器监听
//////////////////////////////////////////////////////////////////////////////
// region
/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || config.http.port);
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);
var io = require('socket.io')(server);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
  console.log('Listening on ' + bind);
}
// endregion
//////////////////////////////////////////////////////////////////////////////
//                          服务器监听结束
//////////////////////////////////////////////////////////////////////////////

var transporter = mailer.createTransport({
  host: "smtp.163.com",
  secureConnection: true,
  port:465,
  secure: true,
  auth: {
    user: 'yuyyi51@163.com',
    pass: 'yyy163auth',
  }
});

function sendmail(message){
  transporter.sendMail(message, function(error, response){
    if(error){
      console.log("send email fail: " + error);
    }else{
      console.log("send email success: " + response.message);
    }
  });
}
/*
let mailmessage = {
  from: "yuyyi51@163.com",
  to: "954822146@qq.com",
  subject: "学术会议管理系统",
  text: '用户yuyyi51，您向会议"人工智能的未来与发展"投稿的论文已被回忆负责人审阅，请查看审阅结果'
};
*/




/**
 * WebSocket事件
 */
io.use(sharedsession(sessionmiddleware), cookieParser, {autoSave:true});

io.on('connection', (socket) => {
  console.log('visitor connected.');
  socket.on('disconnect', (reason) => {
    console.log('visitor disconnected cause : ' + reason);
  });
  ///////////////////////////////////////////////////////////////////////
  //以下是socket响应
  ///////////////////////////////////////////////////////////////////////

  socket.on('user:login', (data) => {
    /*
    data = {
      username: str,
      password: str
    }
    */
    mongodb.login(data.username, data.password, (res) => {
      if (res){
        socket.handshake.session.user = {username: data.username, type: res.type};
        socket.handshake.session.save();
      }
      console.log(res !== null);
      socket.emit('user:login', res!==null);
    });
  });

  socket.on('user:add_conference', (data) => {
    data.update_time = new Date();
    mongodb.addConference(data, (res) => {
      socket.emit('user:add_conference', res);
    });
  });
  socket.on('user:contribution_upload', (data) => {
      let datac = {
                _id:null,
               title: data.title,
               abstract: data.abstract,
               org: data.org,
               firstau: data.firstau,
               secondau: data.secondau,
               thirdau: data.thirdau,
               filename:data.filename,
               cid:data.conferenceid,
               pid:null,
               uploader:socket.handshake.session.user.username,
               result:0
                      };
      console.log(datac.org);
      mongodb.addContribution(datac,(res)=>
      {
                datac.pid=res;
                mongodb.addConbyid(datac);
                let base = data.base64 ;
                datac.base64 = null;
                let filename =datac.pid;
                let filebuffer = new Buffer(base, 'base64');
                let wstream = fs.createWriteStream(config.file_path + filename, {
                        flags : 'w',
                    encoding: 'binary'
                });
                wstream.on('open', () => {
                       wstream.write(filebuffer);
                        wstream.end();
                    });
                wstream.on('close', () => {
                        function log(str){
                                console.log(new Date().toLocaleString() + " : " + str);
                            }

                    });
                   socket.emit('user:contribution_upload', true);

      });
  });

  socket.on('org:review', (data) => {
    mongodb.reviewPaper(data.pid, data.update, (resr) => {
      let cid = data.cid;
      mongodb.selectConference(cid, (res) => {
        let c_title = res.title;
        mongodb.selectPaper(data.pid,(res) => {
          let email = res.uploader;
          let result = "未知";
          if (data.update.result === 1) result = "通过";
          if (data.update.result === 2) result = "需要修改";
          if (data.update.result === 3) result = "拒绝";
          let mailmessage = {
            from: "yuyyi51@163.com",
            to: email,
            subject: "学术会议管理系统",
            text: '用户' + email + '，您向会议"'+ c_title +'"投稿的论文已被会议负责人审阅。\n评审结果为：'+ result +'\n审阅意见为：\n' + data.update.opinion
          };
          sendmail(mailmessage);
          socket.emit('org:review', resr !== null);
        });
      });
    });
  });

  socket.on('user:register',(data)=>{
    /*
    data={
      username:str,
      password:str,
      institution:str
    }
     */
    data.update_time=new Date();
    mongodb.register(data,(res)=>{
      socket.emit('user:register',res);
    })
  });

    socket.on('user:unitRegister',(data)=>{
        /*
        data={
          institution:str,
          type:str,
          location:str,
          connectAdd:str,
          manager:str,
          telphone:str,
          introduction:str
        }
         */
        var username=socket.handshake.session.user.username;
        data.update_time=new Date();
        mongodb.unitRegister(username,data,(res)=>{
            socket.emit('user:unitRegister',res);
        })
    });

    socket.on('user:updateconfer',(data)=>{
        data.update.update_time=new Date();
        mongodb.updateinfo(data._cid, data.update, (res)=>{
            socket.emit('user:updateconfer',res);
        })
    });
});


