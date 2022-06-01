var config = {
  http: {
    port: 3000
  },
  mongodb: {
    host: "118.89.243.167",
    port: 27017,
    database: "ConferenceSystem",
    collection: ["user", "conference"],
    getMongoUrl(){
      return 'mongodb://'+config.mongodb.host+':'+config.mongodb.port+'/'+config.mongodb.database;
    }
  },
  salt: "O3IUYRTGODVSNJWK45G65HURIEJWKGTJK21U45GTRFDSEJJ",
  session : {
    secret: "Conference",
    name: "ConferenceSystem"
  },
  file_path : 'C://test/'
};
module.exports = config;