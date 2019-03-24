/*
 * PIZZA Shop rest API
 *
 * Users service module
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
service.findByEmail = function(emailParam,callback){
  //check that the email number is valid
  var email = helpers.getValidEmailStringOrFalse(emailParam);
  if (email) {
      // lookup the user
      _data.read('users', email, function(err, data){
          if (!err && data) {
              // Remove the hashed password from the user's object before returning in to the requestor
              delete data.hashedPassword;
              callback(200, data);
          } else {
              callback(404);
          }
      });
  }else{
      callback(400, errors.ErrCreate("Missing required field"));
  }
};

// SUCCESS: callback to caller (ok=statusCode(200), empty)
// FAILURE: callback to caller (err=statusCode, errorObject)
service.create = function(emailParam,passwordParam,fullNameParam,addressParam,callback){
  var email = helpers.getValidEmailStringOrFalse(emailParam);
  var password = helpers.getNonEmptyStringOrFalse(passwordParam);
  var fullName = helpers.getNonEmptyStringOrFalse(fullNameParam);
  var address = helpers.getNonEmptyStringOrFalse(addressParam);

  if (fullName && email && password && address){
      // Make sure that user doesn't already exists
      _data.read('users', email, function(err, data) {
          if (err) {
              // Hash the password
              var hashedPassword = helpers.hash(password);
              var signedDate = new Date(Date.now());
              if (hashedPassword) {
                  // create user object
                  var userObject = {
                      'fullName' : fullName,
                      'email' : email,
                      'hashedPassword' : hashedPassword,
                      'address' : address,
                      'signedDate' : signedDate
                  };
                  // persiste user object to file on disk
                  _data.create('users', email, userObject, function(err){
                      if (!err) {
                          helpers.debug_ok(debugModule, errors.OkCreate("The new user created"));
                          callback(200);
                      } else {
                          helpers.debug_err(debugModule, err);
                          callback(500, errors.ErrCreate("Could not create the new user"));
                      }
                  });
              } else {
                  callback(500, errors.ErrCreate("Could not hash the user's password"));
              }
          }else{
              // A user already exists
              callback(400, errors.ErrCreate("A user with that email address already exists"));
          }
      });
  } else {
      callback(400, errors.ErrCreate("Missing required fields!"));
  }
};

service._updateUserObject = function(password,fullName,address,userData){
  if (fullName) {
      userData.fullName = fullName;
  }
  if (address) {
      userData.address = address;
  }
  if (password) {
      userData.hashedPassword = helpers.hash(password);
  }
};

// SUCCESS: callback to caller (ok=statusCode(200), empty)
// FAILURE: callback to caller (err=statusCode, errorObject)
service._updateUser = function(email,password,fullName,address,callback){
  if (fullName || address || password){
      // Lookup the user
      _data.read('users', email, function(err, userData){
          if (!err && userData) {
              service._updateUserObject(password,fullName,address,userData);

              _data.update('users', email, userData, function(err){
                  if (!err){
                      helpers.debug_ok(debugModule, errors.OkCreate("The user updated"));
                      callback(200);
                  }else{
                      callback(500, errors.ErrCreate("Could not update the user"));
                  }
              });
          } else {
              helpers.debug_err(debugModule, errors.ErrCreate(err));
              callback(400, errors.ErrCreate("This specified user doesn't exist"));
          }
      });
  } else {
      callback(400, errors.ErrCreate("Missing the fields to update"));
  }
};

// SUCCESS: callback to caller (ok=statusCode(200), empty)
// FAILURE: callback to caller (err=statusCode, errorObject)
service._updateUserClearLastOrder = function(email,callback){
  // Lookup the user
  _data.read('users', email, function(err, userData){
      if (!err && userData) {
          delete userData.lastOrder;

          _data.update('users', email, userData, function(err){
              if (!err){
                  helpers.debug_ok(debugModule, errors.OkCreate("The user updated"));
                  callback(200);
              }else{
                  callback(500, errors.ErrCreate("Could not update the user"));
              }
          });
      } else {
          helpers.debug_err(debugModule, errors.ErrCreate(err));
          callback(400, errors.ErrCreate("This specified user doesn't exist"));
      }
  });
};

// SUCCESS: callback to caller (ok=statusCode(200), empty)
// FAILURE: callback to caller (err=statusCode, errorObject)
service._updateUserClearDeleteCart = function(email,callback){
  // Lookup the user
  _data.read('users', email, function(err, userData){
      if (!err && userData) {
          delete userData.cartId;

          _data.update('users', email, userData, function(err){
              if (!err){
                  helpers.debug_ok(debugModule, errors.OkCreate("The user updated"));
                  callback(200);
              }else{
                  callback(500, errors.ErrCreate("Could not update the user"));
              }
          });
      } else {
          helpers.debug_err(debugModule, errors.ErrCreate(err));
          callback(400, errors.ErrCreate("This specified user doesn't exist"));
      }
  });
};

// SUCCESS: callback to caller (ok=statusCode(200), dataObject)
// FAILURE: callback to caller (err=statusCode, errorObject)
service.update = function(emailParam,passwordParam,fullNameParam,addressParam,callback){
  // Check if all required data are filled out
  var email = helpers.getValidEmailStringOrFalse(emailParam);
  var password = helpers.getNonEmptyStringOrFalse(passwordParam);
  var fullName = helpers.getNonEmptyStringOrFalse(fullNameParam);
  var address = helpers.getNonEmptyStringOrFalse(addressParam);

  if (email){
      service._updateUser(email,password,fullName,address,function(err,data){
        callback(err, data);
      });
  }else{
      callback(400, errors.ErrCreate("Missing required field"));
  }
};

// SUCCESS: callback to caller (ok=false)
// FAILURE: callback to caller (err=errorText)
service._deteteUserCart = function(userData,callback){
  var userCartId = helpers.getValidStringExactLenOrFalse(userData.cartId, 20);

  if (userCartId){
    // Delete the user's cart
    _data.delete('carts',userCartId,function(err){
      if (!err) {
        callback(false);
      }else {
        callback("Errors encountered while attempting to delete the user's cart.");
      }
    });
  }else {
    callback(false);
  }
};

// SUCCESS: callback to caller (ok=false)
// FAILURE: callback to caller (err=errorText)
service._deteteUserOrders = function(userData,callback){
  var userOrders = helpers.getValidArrayOrEmpty(userData.orders);
  var ordersCount = userOrders.length;
  var ordersIndex = 0;

  var deletetionError = false;
  if (ordersCount > 0) {
    // Loops through the orders
    userOrders.forEach(function(orderId){
      // delete the order
      _data.delete('orders', orderId, function(err) {
        if (err) {
          deletetionError = true;
        }
        ordersIndex ++;
        if (ordersIndex == ordersCount){
          if (!deletetionError){
            callback(false);
          }else{
            callback("Errors encountered while attempting to delete the all of the user's orders.");
          }
        }
      });
    });
  }else {
    callback(false);
  }
};


// SUCCESS: callback to caller (ok=statusCode(200), empty)
// FAILURE: callback to caller (err=statusCode, errorObject)
service._deleteUser = function(email,callback) {
  // lookup the user
  _data.read('users', email, function(err, userData){
      if (!err && userData) {
          _data.delete('users', email, function(err){
              if (!err) {
                service._deteteUserCart(userData, function(errCart){
                  service._deteteUserOrders(userData, function(errOrders){
                    if (!errCart && !errOrders){
                      helpers.debug_ok(debugModule, errors.OkCreate("The user deleted"));
                      callback(200);
                    }else{
                      var errDelete = 'Errors:';
                      if (errCart) {
                        errDelete = [errDelete, errCart].join(' ');
                      }
                      if (errOrders){
                        errDelete = [errDelete, errOrders].join(' ');
                      }
                      errDelete += "Cart and all orders may not have been deleted from the system successfully.";
                      callback(500, errors.ErrCreate(errDelete));
                    }
                  });
                });
              }else{
                  callback(500, errors.ErrCreate("Could not delete the specified user"));
              }
          });
      } else {
          callback(400, errors.ErrCreate("Could not find the specified user"));
      }
  });
};

// SUCCESS: callback to caller (ok=statusCode(200), empty)
// FAILURE: callback to caller (err=statusCode, errorObject)
service.delete = function(emailParam,callback){
  //check that the email number is valid
  var email = helpers.getValidEmailStringOrFalse(emailParam);
  if (email) {
      service._deleteUser(email,function(err,data){
        callback(err, data);
      });
  }else{
      callback(400, errors.ErrCreate("Missing required field"));
  }
};
// Export the module
module.exports = service;
