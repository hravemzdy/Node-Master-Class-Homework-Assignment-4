/*
 * PIZZA Shop rest API
 *
 * Tokens service module
 *
*/

// Dependencies
var helpers = require('./helpers');
var errors = require('./errors');
var _data = require('./_data');
var _tokens = require('./_tokens');
var util = require('util');
var debugModule = util.debuglog('service');

// Container object for module
var service = {};

// SUCCESS: callback to caller (ok=statusCode(200), dataObject)
// FAILURE: callback to caller (err=statusCode, errorObject)
service.findById = function(idParam, callback) {
    // Check that id is valid
    var id = helpers.getValidStringExactLenOrFalse(idParam, 20);
    if (id) {
        // lookup the token
        _data.read('tokens', id, function(err, tokenData){
            if (!err && tokenData) {
                callback(200, tokenData);
            } else {
                callback(404);
            }
        });
    }else{
        callback(400, errors.ErrCreate("Missing required field"));
    }
};

// SUCCESS: callback to caller (ok=statusCode(200), dataObject)
// FAILURE: callback to caller (err=statusCode, errorObject)
service.create = function(emailParam, passwordParam, callback) {
    // Check if all required data are filled out
    var email = helpers.getValidEmailStringOrFalse(emailParam);
    var password = helpers.getNonEmptyStringOrFalse(passwordParam);

    if (email && password){
        // Make sure that user doesn't already exists
        _data.read('users', email, function(err, userData) {
            if (!err && userData) {
                // Hash the password
                var hashedPassword = helpers.hash(password);

                if (hashedPassword == userData.hashedPassword){
                    // if valid, create a new token with random name, set expiration date 1 hour in the future.
                    var tokenId = helpers.createRandomString(20);

                    var expires = helpers.DateInMinutesFromNow(60);

                    var tokenObject = {
                      'email' : email,
                      'id' : tokenId,
                      'expires' : expires
                    };

                    _data.create('tokens', tokenId, tokenObject, function(err) {
                        if (!err) {
                            callback(200, tokenObject);
                        }else{
                            callback(500, errors.ErrCreate("Could not create a new token"));
                        }
                    });
                }else{
                    callback(400, errors.ErrCreate("Password did not match the specified user's stored password"));
                }
            } else {
                callback(400, errors.ErrCreate("Could not find the specified user"));
            }
        });
    }else{
        callback(400, errors.ErrCreate("Missing required field'"));
    }
};

// SUCCESS: callback to caller (ok=statusCode(200), dataObject)
// FAILURE: callback to caller (err=statusCode, errorObject)
service.extend = function(idParam, extendParam, callback) {
    var id = helpers.getValidStringExactLenOrFalse(idParam, 20);
    var extendNow = helpers.getValidBooleanOrFalse(extendParam);

    if (id && extendNow) {
        // lookup the token
        _data.read('tokens', id, function(err, tokenData){
            if (!err && tokenData) {
                // Check to make sure that token isn't already expired
                if (tokenData.expires > Date.now()) {
                    tokenData.expires = helpers.DateInMinutesFromNow(60);

                    // Store the new expiration
                    _data.update('tokens', id, tokenData, function(err) {
                        if (!err){
                            callback(200);
                        }else{
                            callback(500, errors.ErrCreate("Token already expired and can't be extended"));
                        }
                    });
                } else {
                    callback(400, errors.ErrCreate("Could not update token\'s expiration"));
                }
            } else {
                callback(400, errors.ErrCreate("This specified token doesn\'t exist'"));
            }
        });
    } else {
        callback(400, errors.ErrCreate("Missing required field or field(s) are invalid"));
    }
};

// SUCCESS: callback to caller (ok=statusCode(200), empty)
// FAILURE: callback to caller (err=statusCode, errorObject)
service.delete = function(idParam, callback) {
    // Check that id is valid
    var id = helpers.getValidStringExactLenOrFalse(idParam, 20);
    if (id) {
        // lookup the token
        _data.read('tokens', id, function(err, tokenData){
            if (!err && tokenData) {
                _data.delete('tokens', id, function(err){
                    if (!err) {
                        callback(200);
                    } else {
                        callback(500, errors.ErrCreate("Could not delete the specified token"));
                    }
                });
            } else {
                callback(400, errors.ErrCreate("Could not find the specified token"));
            }
        });
    } else {
        callback(400, errors.ErrCreate("Missing required field"));
    }
};

// Export the module
module.exports = service;
