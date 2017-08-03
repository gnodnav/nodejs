var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/nodejs";
var db;
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database created!");
});
module.exports = db;