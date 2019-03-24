/*
 * PIZZA Shop rest API
 *
 * Payment service module
 *
*/

// Dependencies
var helpers = require('./helpers');
var errors = require('./errors');
var _data = require('./_data');
var _orders_service = require('./orders_service');
var _users_service = require('./users_service');
var _stripe = require('./_utils_stripe');
var _mailgun = require('./_utils_mailgun');
var util = require('util');
var debugModule = util.debuglog('service');

// Container object for module
var service = {};

// SUCCESS: callback to caller (ok=statusCode(200), dataObject)
// FAILURE: callback to caller (err=statusCode, errorObject)
service.sendPayment = function(emailParam,orderParam,callback){
  var userEmail = helpers.getValidEmailStringOrFalse(emailParam);
  var userOrder = helpers.getValidStringOrEmpty(orderParam);

  _orders_service.getOrders(emailParam,userOrder,function(statusCode, data){
    if (statusCode==200 && data){
      var orderData = helpers.getValidObjectOrDefault(data, false);
      if (orderData){
        // Create payment
        service._createChargeAndNotifyToEmail(userEmail,orderData,function(errCharge,errChargeMsg){
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
      }else {
        callback(403, errors.ErrCreate("Failed to read order data"));
      }
    } else {
      callback(statusCode, data);
    }
  });
};

// SUCCESS: callback to caller (ok=false, false)
// FAILURE: callback to caller (err=statusCode, errorObject)
service._createChargeAndNotifyToEmail = function(userEmail,orderInvoice,callback){
  // Call charge API
  _stripe.chargeCustomer(orderInvoice.orderNumber, orderInvoice.totalCharge, 'usd', function(errCharge){
    if (!errCharge){
      service._updateUserInvoicePaid(orderInvoice.orderNumber,function(errUpdatePaid){
        // Create email to customer
        service._createEmailAndNotifyToEmail(orderInvoice,function(errEmail,errEmailMsg){
          if (!errEmail) {
            if (!errUpdatePaid){
              callback(false, false);
            }else {
              callback(500, errors.ErrCreate(errUpdatePaid));
            }
          }else {
            callback(errEmail, errEmailMsg);
          }
        });
      });
    }else {
      callback(500, errCharge)
    }
  });
};

// SUCCESS: callback to caller (ok=false, false)
// FAILURE: callback to caller (err=statusCode, errorObject)
service._createEmailAndNotifyToEmail = function(orderInvoice,callback){
  var emailConfirmation = _mailgun.createEmailConfirmation(orderInvoice);
  if (emailConfirmation)
  {
    // Call mailgun API
    _mailgun.notifyCustomerByEmail(emailConfirmation, function(errEmail){
      if (!errEmail){
        service._updateUserInvoiceSent(orderInvoice.orderNumber,function(errUpdateSent){
          if (!errUpdateSent){
            callback(false, false);
          }else {
            callback(500, errors.ErrCreate(errUpdateSent));
          }
        });
      } else {
        callback(500, errors.ErrCreate(errEmail));
      }
    });
  }else {
    callback(500, errors.ErrCreate("Error encountered when creating email confirmation, user was carged, but invoice cannot be sent"));
  }
};

// SUCCESS: callback to caller (ok=false)
// FAILURE: callback to caller (err=errorText)
service._updateUserInvoicePaid = function(orderNumber,callback){
  // Lookup order data
  _data.read('orders',orderNumber,function(err, orderData){
    if (!err && orderData) {
      // update order data with payment
      orderData.invoicePaid = true;
      _data.update('orders',orderNumber,orderData,function(err){
        if (!err){
          callback(false);
        }else {
          callback("Failed to update order data with InvoicePaid");
        }
      });
    } else {
      callback("Failed to read order data for update with InvoicePaid");
    }
  });
};

// SUCCESS: callback to caller (ok=false)
// FAILURE: callback to caller (err=errorText)
service._updateUserInvoiceSent = function(orderNumber,callback){
  // Lookup order data
  _data.read('orders',orderNumber,function(err, orderData){
    if (!err && orderData) {
      // update order data with payment
      orderData.invoiceSent = true;
      _data.update('orders',orderNumber,orderData,function(err){
        if (!err){
          callback(false);
        }else {
          helpers.debug_err(debugModule, errors.ErrCreate("Failed to update order data with InvoicePaid"));
          callback("Failed to update order data with InvoiceSent");
        }
      });
    } else {
      callback("Failed to read order data for update with InvoiceSent");
    }
  });
};

// Export the module
module.exports = service;
