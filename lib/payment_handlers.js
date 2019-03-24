/*
 * PIZZA Shop rest API
 *
 * Create handlers for Payment API
 *
*/

// Dependencies
var helpers = require('./helpers');
var errors = require('./errors');
var _data = require('./_data');
var _tokens = require('./_tokens');
var _service = require('./payment_service');
var util = require('util');
var debugModule = util.debuglog('handlers');

// Container object for module
var handlers = {};

// SUCCESS: callback to caller (ok=statusCode(200), dataObject)
// FAILURE: callback to caller (err=statusCode, errorObject)
handlers.post = function(data, callback) {
  var email = helpers.getValidEmailStringOrFalse(data.payload.email);
  var order = helpers.getValidStringOrEmpty(data.payload.id);
  var token = helpers.getValidStringExactLenOrFalse(data.headers.token, 20);
  _tokens.verifyTokenExpriration(token,function(tokenIsValid,userEmail){
      if(tokenIsValid){
        _service.sendPayment(email,order,function(err,userOrder){
          callback(err, userOrder);
        });
      }else{
        callback(403, errors.ErrCreate("Missing required token in header, or given token is invalid"));
      }
  });
};

// Export the module
module.exports = handlers;
