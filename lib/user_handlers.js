/*
 * PIZZA Shop rest API
 *
 * Create handlers for User API
 *
*/

// Dependencies
var helpers = require('./helpers');
var errors = require('./errors');
var _data = require('./_data');
var _tokens = require('./_tokens');
var _service = require('./users_service');
var util = require('util');
var debugModule = util.debuglog('handlers');

// Container object for module
var handlers = {};

// POST: Users, create a new user
// Required data: email address, password, full name, street address
// Optional data: none
// SUCCESS: callback to caller (ok=statusCode(200), dataObject)
// FAILURE: callback to caller (err=statusCode, errorObject)
handlers.post = function(data, callback){
    // Check if all required data are filled out
    var email = helpers.getValidEmailStringOrFalse(data.payload.email);
    var password = helpers.getNonEmptyStringOrFalse(data.payload.password);
    var fullName = helpers.getNonEmptyStringOrFalse(data.payload.fullName);
    var address = helpers.getNonEmptyStringOrFalse(data.payload.address);

    _service.create(email,password,fullName,address,function(err, data){
      callback(err, data);
    });
};

// PUT: Users, update data for existing user
// Required data: email address
// Optional data: full name, street address, password, one detail field must be specified
// SUCCESS: callback to caller (ok=statusCode(200), dataObject)
// FAILURE: callback to caller (err=statusCode, errorObject)
handlers.put = function(data, callback){
  var token = helpers.getValidStringExactLenOrFalse(data.headers.token, 20);
  var email = helpers.getValidEmailStringOrFalse(data.payload.email);
  // Check data to update
  var fullName = helpers.getNonEmptyStringOrFalse(data.payload.fullName);
  var address = helpers.getNonEmptyStringOrFalse(data.payload.address);
  var password = helpers.getNonEmptyStringOrFalse(data.payload.password);

  _tokens.verifyTokenExpriration(token,function(tokenIsValid,userEmail){
      if(tokenIsValid){
        _service.update(email,password,fullName,address,function(err, data){
          callback(err, data);
        });
      }else{
        callback(403, errors.ErrCreate("Missing required token in header, or given token is invalid"));
      }
  });
};

// DELETE: Users, delete existing user and associated data
// Required data: email
// Optional data: none
// SUCCESS: callback to caller (ok=statusCode(200), dataObject)
// FAILURE: callback to caller (err=statusCode, errorObject)
handlers.delete = function(data, callback){
    //check that the email number is valid
    var email = helpers.getValidEmailStringOrFalse(data.queryStringObject.email);
    var token = helpers.getValidStringExactLenOrFalse(data.headers.token, 20);
    _tokens.verifyTokenExpriration(token,function(tokenIsValid,userEmail){
        if(tokenIsValid){
          _service.delete(email,function(err, data){
            callback(err, data);
          });
        }else{
          callback(403, errors.ErrCreate("Missing required token in header, or given token is invalid"));
        }
    });
};

// GET: Users, get data of existing user
// Required data: email
// Optional data: none
// SUCCESS: callback to caller (ok=statusCode(200), dataObject)
// FAILURE: callback to caller (err=statusCode, errorObject)
handlers.get = function(data, callback){
    //check that the email number is valid
    var email = helpers.getValidEmailStringOrFalse(data.queryStringObject.email);
    var token = helpers.getValidStringExactLenOrFalse(data.headers.token, 20);

    _tokens.verifyTokenExpriration(token,function(tokenIsValid,userEmail){
        if(tokenIsValid){
          _service.findByEmail(email, function(err, data){
            callback(err, data);
          });
        }else{
          callback(403, errors.ErrCreate("Missing required token in header, or given token is invalid"));
        }
    });
};

// Export the module
module.exports = handlers;
