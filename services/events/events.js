'use strict';
var Emitter = require('events');
class handlerReq extends Emitter {
    constructor() {
        super();
        this.result = "";
    }
    Reponse(req, res) {
        this.emit(req.body.event, req, res);
    }
}
module.exports = handlerReq;