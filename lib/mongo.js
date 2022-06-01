let config = require("./config");
let mongojs = require("mongojs")
let db = mongojs(config.mongodb.host + ":" + config.mongodb.port + "/" + config.mongodb.database,
    config.mongodb.collection);
db.on("error", (err) => {
    console.log('database error - ', err);
});
module.exports = class Mongo {

    static register(data, fn) {
        this.findUser(data.username, (res) => {
            if (res) {
                fn(false);
                return;
            }
            db.user.insert(data, (err, res) => {
                if (!res) {
                    fn(false);
                    return;
                }
                fn(true);
            });
        });
    }
    static updateinfo(cid,data,fn){
        db.conference.update({_id:mongojs.ObjectID(cid)}, {$set :{"description":data.description, "paper_info":data.paper_info, "conferarrange":data.arrange, "update_time":data.update_time}}, (err, res) => {
            console.log(res);
            fn(res);
        });
    }


    static unitRegister(username,data,fn){
        var whereStr={
            username:username
        };
        var updateStr={
            $set:{
                institution:data.institution,
                type:data.type,
                location:data.location,
                connectAdd:data.connectAdd,
                manager:data.manager,
                telphone:data.telphone,
                introduction:data.introduction
            }
        }
        db.user.update(whereStr,updateStr,(err,res)=>{
            if (err) throw err;
            if (!res) {
                fn(false);
                return;
            }
            fn(true);
        })
    }

    static findUser(username, fn) {
        db.user.findOne({username: username}, (err, res) => {
            if (!res) {
                fn(false);
                return;
            }
            fn(true);
        });
    }

    static login(username, password, fn) {
        console.log(username,password);
        db.user.findOne({username: username, password: password}, (err, res) => {
            console.log(res);
            fn(res);
        });
    }

  static addConference(data, fn){
    data.important_dates.conference_start = new Date(data.important_dates.conference_start);
    data.important_dates.conference_end = new Date(data.important_dates.conference_end);
    data.important_dates.paper_end = new Date(data.important_dates.paper_end);
    data.important_dates.inform_end = new Date(data.important_dates.inform_end);
    data.important_dates.register_end = new Date(data.important_dates.register_end);
    db.conference.insert(data, (err,res) => {
      console.log(res);
      if (!res){
        fn(false);
        return;
      }
      fn(true);
    });
  }

  static addContribution(data,fn){
      db.paper.insert(data, (err,res)=>{
          fn(res._id);
      });

  };
  static addConbyid(data){
      db.conference.update({_id:mongojs.ObjectId(data.cid)},{$push:{pid:data._id}},{upsert:true });

    };

  static getConference(id, fn){
    db.conference.findOne({_id: mongojs.ObjectId(id)}, (err,res) => {
      fn(res);
    })
  }

  static lastestConference(skip, count, order, fn){
    db.conference.find({}).sort({update_time: order}).skip(skip).limit(count).toArray((err, res) => {
      fn(res);
    });
  }

  static searchConference(keywords, start, end, skip, count, order, fn){
    let arr = [];
    keywords.forEach((item, index) => {
      arr.push({title:eval('/'+item+'/')});
    });
    db.conference.find({
      $and:[
        {$or: arr},
        {"important_dates.conference_start":{
            $gte: start,
            $lt: end
          }}
      ]
    },{
      title:1,
      description:1,
      important_dates:1,
      location:1,
      org:1
    }).sort({"important_dates.conference_start": order}).skip(skip).limit(count).toArray((err, res) => {
        fn(res);
    });
  }
    static searchResult(userid, count,fn){
            db.paper.find({uploader:userid}).limit(count).toArray((err, res) => {
            fn(res);
        });
    }

  static getmyConference(username, skip, count, fn){
      let arr = [];
      db.conference.find({creator:username}).skip(skip).limit(count).toArray((err, res) =>{
          fn(res);
      });
  }

  static selectConference(id, fn){
    db.conference.findOne({_id: mongojs.ObjectID(id)}, (err, res) => {
      fn(res);
    })
  }
  static selectPaper(id, fn){
    db.paper.findOne({_id: mongojs.ObjectID(id)}, (err, res) => {
      fn(res);
    });
  }
  static checkPaperInConference(cid, pid, fn){
    db.conference.findOne({_id: mongojs.ObjectID(cid), papers:pid}, (err, res) => {
      fn(res);
    });
  }
  static reviewPaper(pid, data, fn){
    db.paper.update({_id:mongojs.ObjectID(pid)}, {$set :data}, (err, res) => {
      console.log(res);
      fn(res);
    });
  }
  static selectPapers(cid, skip, count, fn){
    db.conference.find({_id: mongojs.ObjectID(cid)},{pid:1}, (err, res) => {
      if (res.length === 0){
        fn([]);
        return;
      }
      let pid = res[0].pid;
      if (!pid){
        fn([]);
        return;
      }
      for (let i = 0; i < pid.length ;++i){
        pid[i] = mongojs.ObjectID(pid[i]);
      }
      db.paper.find({_id:{$in:pid}}).skip(skip).limit(count).toArray((err, res) => {
        fn(res);
      });
    });

  }
};

