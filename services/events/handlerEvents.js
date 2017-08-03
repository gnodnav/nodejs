var eventsConfig = require("./eventConfig").events;
var handlerReq = require("./events");
var util = require('util')

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/nodejs";

var handlerreq = new handlerReq();
//them
handlerreq.on(eventsConfig.INSERT_CUSTOMER, function (req, res) {
    delete req.body['event'];
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        db.collection("customer").insert(req.body, function (err, result) {
            if (err) throw err;
            res.send(result);
            util.log(`Đã Thêm ${req.body.name}`);
            db.close();
        });
    });
})
//update
handlerreq.on(eventsConfig.UPDATE_CUSTOMER, function (req, res) {
    delete req.body['event'];
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var myquery = { name: req.body.nameCurrent, country: req.body.countryCurrent };
        var newvalues = { name: req.body.nameUpdate, country: req.body.countryUpdate };
        db.collection("customer").updateOne(myquery, newvalues, function (err, result) {
            if (err) throw err;
            res.send(result);
            db.close();
        });
    });

})
//xoa khach hang
handlerreq.on(eventsConfig.DELETE_CUSTOMER, function (req, res) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var myquery = { name: req.body.name, country: req.body.country };
        db.collection("customer").deleteOne(myquery, function (err, result) {
            if (err) throw err;
            res.send(result);
            util.log(`Đã Xóa ${req.body.NAME}`);
            db.close();
        });
    });

})
//dang nhap
handlerreq.on(eventsConfig.LOGIN_USER, function (req, res) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var myquery = { username: req.body.username, password: req.body.password };
        db.collection("user").find(myquery).toArray(function (err, result) {
            if (err) throw err;
            if(result.length>0)
                res.json("TRUE");
            else
                res.send("FALSE");
            util.log(`${req.body.username} đã đăng nhập`);
            return;
            db.close();
        });
    });
})

module.exports = handlerreq;