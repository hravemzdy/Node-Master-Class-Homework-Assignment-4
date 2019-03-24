/*
 * PIZZA Shop rest API
 *
 * Create handlers for Token API
 *
*/

// Dependencies
var helpers = require('./helpers');
var errors = require('./errors');
var _data = require('./_data');
var _service = require('./tokens_service');
var util = require('util');
var debugModule = util.debuglog('handlers');

// Container object for module
var handlers = {};

// POST: Token, create a new token
// Required data: email address, password
// Optional data: none
// SUCCESS: callback to caller (ok=statusCode(200), dataObject)
// FAILURE: callback to caller (err=statusCode, errorObject)
handlers.post = function(data, callback){
    // Check if all required data are filled out
    var email = helpers.getValidEmailStringOrFalse(data.payload.email);
    var password = helpers.getNonEmptyStringOrFalse(data.payload.password);

    _service.create(email, password, function(err, data){
        callback(err, data);
    });
};

// PUT: Token, update data to extending expiration of existing token
// Required data: token id, extend
// Optional data: none
// SUCCESS: callback to caller (ok=statusCode(200), dataObject)
// FAILURE: callback to caller (err=statusCode, errorObject)
handlers.put = function(data, callback){
    var id = helpers.getValidStringExactLenOrFalse(data.payload.id, 20);
    var extendNow = helpers.getValidBooleanOrFalse(data.payload.extend);

    _service.extend(id, extendNow, function(err, data){
        callback(err, data);
    });
};

// DELETE: Token, delete existing token
// Required data: token id
// Optional data: none
// SUCCESS: callback to caller (ok=statusCode(200), dataObject)
// FAILURE: callback to caller (err=statusCode, errorObject)
handlers.delete = function(data, callback){
    var id = helpers.getValidStringExactLenOrFalse(data.queryStringObject.id, 20);

    _service.delete(id, function(err, data){
        callback(err, data);
    });
};

// SUCCESS: callback to caller (ok=statusCode(200), dataObject)
// FAILURE: callback to caller (err=statusCode, errorObject)
handlers.get = function(data, callback){
    // Check that id is valid
    var id = helpers.getValidStringExactLenOrFalse(data.queryStringObject.id, 20);
    _service.findById(id, function(err, data){
        callback(err, data);
    });
};

// Export the module
module.exports = handlers;
