/*
 * PIZZA Shop rest API
 *
 * Checkout service module
 *
*/

// Dependencies
var helpers = require('./helpers');
var errors = require('./errors');
var _orders_service = require('./orders_service');
var _payment_service = require('./payment_service');
var _users_service = require('./users_service');
var _stripe = require('./_utils_stripe');
var _mailgun = require('./_utils_mailgun');
var util = require('util');
var debugModule = util.debuglog('service');

// Container object for module
var service = {};

// SUCCESS: callback to caller (ok=statusCode(200), dataObject)
// FAILURE: callback to caller (err=statusCode, errorObject)
service.placeOrder = function(emailParam,callback){
  var userEmail = helpers.getValidEmailStringOrFalse(emailParam);
  _orders_service.createOrder(emailParam, function(statusCode, data){
    if (statusCode==200 && data){
      // Create payment
      _payment_service._createChargeAndNotifyToEmail(userEmail,data,function(errCharge,errChargeMsg){
        if (!errCharge){
          helpers.debug_ok(debugModule, errors.OkCreate("User's order was place successfully"));
          // return invoice object
          _users_service._updateUserClearLastOrder(userEmail,function(errUsers,errUsersMsg){
            if (errUsers===200){
              callback(200, data);
            } else {
              callback(errUsers,errUsersMsg);
            }
          });
        } else {
          callback(errCharge, errChargeMsg);
        }
      });
    } else {
      callback(statusCode, data);
    }
  });
};

// Export the module
module.exports = service;
