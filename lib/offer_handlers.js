/*
 * PIZZA Shop rest API
 *
 * Create handlers for Offer API
 *
*/

// Dependencies
var helpers = require('./helpers');
var errors = require('./errors');
var _data = require('./_data');
var _tokens = require('./_tokens');
var _catalog = require('./_catalog');
var util = require('util');
var debugModule = util.debuglog('handlers');

// Container object for module
var handlers = {};

// SUCCESS: callback to caller (ok=statusCode(200), dataObject)
// FAILURE: callback to caller (err=statusCode, errorObject)
handlers.get = function(data, callback){
    // Check that id is valid
    var token = helpers.getValidStringExactLenOrFalse(data.headers.token, 20);
    _tokens.verifyTokenExpriration(token,function(tokenIsValid,userEmail){
        if(tokenIsValid){
          _catalog.getAllGoods(function(err,serviceData){
            if (!err && serviceData){
              callback(200, serviceData);
            }else {
              callback(400, err);
            }
          });
        }else{
            callback(403, errors.ErrCreate("Missing required token in header, or given token is invalid"));
        }
    });
};

// Export the module
module.exports = handlers;
