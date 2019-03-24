/*
 * PIZZA Shop rest API
 *
 * Shopping service module
 *
*/

// Dependencies
var helpers = require('./helpers');
var errors = require('./errors');
var _data = require('./_data');
var _cart = require('./_cart');
var util = require('util');
var debugModule = util.debuglog('service');

// Container object for module
var service = {};

// SUCCESS: callback to caller (ok=false)
// FAILURE: callback to caller (err=errorText)
service._updateUserCartEmpty = function(userEmail,userCartId,callback){
  var userCartId = helpers.getValidStringExactLenOrFalse(userCartId, 20);
  if (userCartId) {
    var cartEmpty = _cart.createEmptyCart(userEmail);
    // update user's carts data with empty cart
    _data.update('carts',userCartId,cartEmpty,function(err){
      if (!err){
        callback(false);
      }else {
        helpers.debug_err(debugModule, errors.ErrCreate("Failed to empty user's cart"));
        callback("Failed to empty user's cart");
      }
    });
  }else{
    callback(false);
  }
};

// SUCCESS: callback to caller (ok=false, dataObject)
// FAILURE: callback to caller (err=errorText)
service._createInvoice = function(userEmail,userData,cartData,callback){
  if (cartData.totalPrice > 0 && cartData.totalCount > 0){
    var orderNumber = helpers.createRandomString(20);
    var orderDate = new Date(Date.now());
    // Create order, invoice and place order
    var orderInvoice = _cart.createInvoice(orderNumber,orderDate,userData,cartData);
    if (orderInvoice) {
      callback(false,orderInvoice);
    } else {
      helpers.debug_err(debugModule, errors.ErrCreate("Failed to update order data with InvoiceSent"));
      callback("Error encountered when creating invoice");
    }
  }else {
    callback("Nothing to order, user's cart is empty");
  }
};

service.createOrder = function(emailParam,callback){
  var userEmail = helpers.getValidEmailStringOrFalse(emailParam);
  if (userEmail) {
    // Lookup user data for cart id
    _data.read('users',userEmail,function(err, userData){
      if (!err && userData) {
        var userCartId = helpers.getValidStringExactLenOrFalse(userData.cartId, 20);
        if (userCartId) {
          // Lookup the user's cart
          _data.read('carts', userCartId, function(err, cartData){
            if (!err && cartData) {
              if (userEmail == cartData.userEmail){
                service._createInvoice(userEmail,userData,cartData,function(errInvoice,orderInvoice){
                  if (!errInvoice && orderInvoice){
                    // Create order in user data
                    _data.create('orders',orderInvoice.orderNumber,orderInvoice,function(err){
                      if (!err){
                        var userOrders = helpers.getValidArrayOrEmpty(userData.orders);
                        userOrders.push(orderInvoice.orderNumber);
                        userData.orders = userOrders;
                        userData.lastOrder = orderInvoice.orderNumber;
                        // update User data with placed orders
                        _data.update('users',userEmail,userData,function(err){
                          if (!err){
                            service._updateUserCartEmpty(userEmail,userCartId,function(err){
                              if (!err) {
                                callback(200, orderInvoice);
                              } else {
                                callback(500, errors.ErrCreate("Error updating user's cart to empty state"));
                              }
                            });
                          } else {
                            callback(500, errors.ErrCreate("Error updating user's data with placed order"));
                          }
                        });
                      } else {
                        callback(500, errors.ErrCreate("Error creating and saving order"));
                      }
                    });
                  } else {
                    callback(500, errors.ErrCreate(errInvoice));
                  }
                });
              } else {
                helpers.debug_err(debugModule, errors.ErrCreate("User's email doen't correspond with cart's email"));
                callback(403);
              }
            } else {
              callback(500, errors.ErrCreate("Could not find the user's cart"));
            }
          });
        } else {
          callback(400, errors.ErrCreate("Nothing to order, user's cart doesn't exist"));
        }
      } else {
        callback(400, errors.ErrCreate("Could not find the specified user"));
      }
    });
  } else {
    callback(400, errors.ErrCreate("Missing required field"));
  }
};

// SUCCESS: callback to caller (ok=statusCode(200), dataObject)
// FAILURE: callback to caller (err=statusCode, errorObject)
service.getOrders = function(emailParam,orderParam,callback){
  var userEmail = helpers.getValidEmailStringOrFalse(emailParam);
  var userOrder = helpers.getValidStringOrEmpty(orderParam);
  if (userEmail) {
    // Lookup the user's daza
    _data.read('users',userEmail,function(err, userData){
      if (!err && userData) {
        if (userOrder) {
          if (userOrder === 'last'){
            userOrder = helpers.getValidStringExactLenOrFalse(userData.lastOrder, 20);
          }
          if (userOrder) {
            var userOrders = helpers.getValidArrayOrEmpty(userData.orders);
            var userOrderIndex = userOrders.indexOf(userOrder);

            if (userOrderIndex > -1) {
              // Lookup the user's order
              _data.read('orders', userOrder, function(err, orderData){
                if (!err && orderData) {
                  callback(200, orderData);
                }else {
                  callback(404, "Error while attempting to read user's order.");
                }
              });
            } else {
              callback(403);
            }
          } else {
            callback(404, "Could not find the user's last order.");
          }
        } else {
          // Read all the orders to array
          var selectedOrders = [];
          var userOrders = helpers.getValidArrayOrEmpty(userData.orders);
          var readOrderError = false;
          var ordersCount = userOrders.length;
          var ordersIndex = 0;
          userOrders.forEach(function(orderId){
            // delete the order
            _data.read('orders', orderId, function(err,data) {
              if (!err && data) {
                selectedOrders.push(data);
              } else {
                readOrderError = true;
              }
              ordersIndex ++;
              if (ordersIndex == ordersCount){
                if (!readOrderError){
                  callback(200, selectedOrders);
                }else{
                  callback(404, "Errors encountered while attempting to read the all of the user's orders.");
                }
              }
            });
          });
        }
      } else {
        callback(400, errors.ErrCreate("Could not find the specified user"));
      }
    });
  } else {
    callback(400, errors.ErrCreate("Missing required field"));
  }
};

// Export the module
module.exports = service;
