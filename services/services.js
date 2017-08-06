var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();
var handlerreq = require("./events/handlerEvents");
var multer = require('multer');
var url = require("url");
var MongoClient = require('mongodb').MongoClient;
var urldb = "mongodb://localhost:27017/nodejs";
var util = require("util");

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
//get product
app.get('/trangchu', function (req, res) {
    MongoClient.connect(urldb, function (err, db) {
        if (err) throw err;
        db.collection("products").find({}).toArray(function (err, result) {
            if (err) throw err;
            res.send(result);
            db.close();
        });
    });
})
//get customer
app.get('/khachhang', function (req, res) {
    MongoClient.connect(urldb, function (err, db) {
        if (err) throw err;
        db.collection("customer").find({}).toArray(function (err, result) {
            if (err) throw err;
            res.send(result);
            db.close();
        });
    });
})
//get list Moderator 
app.get('/listMod', function (req, res) {
    MongoClient.connect(urldb, function (err, db) {
        if (err) throw err;
        db.collection("user").find({type:"mod"}).toArray(function (err, result) {
            if (err) throw err;
            res.send(result);
            db.close();
        });
    });
})
//post req delete/insert/login
app.post('/events', function (req, res) {
    handlerreq.Reponse(req, res);
    //console.log(req.body);

})
//load html,image
app.use(express.static(
    path.resolve(__dirname, '../')
));
app.use('/res', express.static(
    path.resolve(__dirname, '../public')
));
app.use('/res/public/upload', express.static(
    path.resolve(__dirname, '../public/upload')
));
app.use('/res/dashboard', express.static(
    path.resolve(__dirname, 'templates/dashboard')
));
//load css
app.use('/res/css', express.static(
    path.resolve(__dirname, '../public/css')
));
app.use('/res/bootstrap/css', express.static(
    path.resolve(__dirname, '../public/bootstrap/css')
));
//load js
app.use('/res/bootstrap/js', express.static(
    path.resolve(__dirname, '../public/bootstrap/js')
));
app.use('/res/libs', express.static(
    path.resolve(__dirname, '../public/libs')
));
app.use('/controller', express.static(
    path.resolve(__dirname, '../controller')
));
//load fonts
app.use('/res/fonts', express.static(
    path.resolve(__dirname, '../public/bootstrap/fonts')
));
//upload
var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, '../public/upload/')
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
    }
});
var upload = multer({ //multer settings
    storage: storage
}).single('file');
/** API path that will upload the files */
app.post('/upload', function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            res.json({ error_code: 1, err_desc: err });
            return;
        }
        var parsed = url.parse(req.file.path);
        var imageUrl = '/res/public/upload/' + path.basename(parsed.pathname);
        var value = {
            productName: req.body.name,
            price: req.body.price,
            description: req.body.description,
            type: req.body.type,
            imageUrl: imageUrl
        }
        MongoClient.connect(urldb, function (err, db) {
            if (err) throw err;
            db.collection("products").insert(value, function (err, result) {
                if (err) throw err;
                util.log(`Đã Thêm ${req.body.name}`);
                 res.json({ error_code: 0, err_desc: err });
                return;
                db.close();
            });
        });
    })
});
app.listen(8000);
