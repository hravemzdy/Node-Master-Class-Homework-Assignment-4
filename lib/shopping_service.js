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
var _tokens = require('./_tokens');
var _cart = require('./_cart');
var _catalog = require('./_catalog');
var util = require('util');
var debugModule = util.debuglog('service');

// Container object for module
var service = {};

// SUCCESS: callback to caller (ok=statusCode(200), dataObject)
// FAILURE: callback to caller (err=statusCode, errorObject)
service.addToCart = function(emailParam,idParam,callback){
  var id = helpers.getValidStringExactLenOrFalse(idParam, 3);
  var userEmail = helpers.getValidEmailStringOrFalse(emailParam);
  if (id && userEmail) {
    // Lookup the good ID
    _catalog.findArticleById(id,function(err,article){
      if(!err && article) {
        // Lookup the user
        _data.read('users',userEmail,function(err, userData){
          if (!err && userData) {
            var userCartId = helpers.getValidStringExactLenOrFalse(userData.cartId, 20);
            // Generate new cart id, if doesn't exist
            var saveCartId = '';
            if (!userCartId){
              saveCartId = helpers.createRandomString(20);
            } else {
              saveCartId = userCartId;
            }
            // Create default cart object
            var saveCartObject = _cart.createEmptyCart(userEmail);
            // Lookup the user's cart
            _data.read('carts', saveCartId, function(err, cartData){
              if (!err && cartData) {
                // init cart for save
                saveCartObject.userEmail = helpers.getValidEmailStringOrFalse(cartData.userEmail);
                saveCartObject.totalCount = 0;
                saveCartObject.totalPrice = 0;
                saveCartObject.cartItems = helpers.getValidArrayOrEmpty(cartData.cartItems);
              } else{
                userCartId = false;
                saveCartId = helpers.createRandomString(20);
              }
              if (saveCartObject.userEmail == userEmail){
                // add the article to cart
                saveCartObject.cartItems.push(article);
                // recalculate total price of order
                saveCartObject = _cart.recalculateCart(saveCartObject);
                // update user cart id
                userData.cartId = saveCartId;
                // save changes to cart and user object
                if (!userCartId){
                  _data.create('carts',saveCartId,saveCartObject,function(err){
                    if (!err) {
                      _data.update('users',userEmail,userData,function(err){
                        if (!err) {
                          helpers.debug_ok(debugModule, errors.OkCreate("User's cart has been created successfully"));
                          callback(200, saveCartObject);
                        }else {
                          callback(500, errors.ErrCreate("Could not update the user"));
                        }
                      });
                    }else {
                      callback(500, errors.ErrCreate("Could not create the user's cart"));
                    }
                  });
                } else {
                  _data.update('carts',saveCartId,saveCartObject,function(err){
                    if (!err) {
                      _data.update('users',userEmail,userData,function(err){
                        if (!err) {
                          helpers.debug_ok(debugModule, errors.OkCreate("User's cart has been updated successfully"));
                          callback(200, saveCartObject);
                        }else {
                          callback(500, errors.ErrCreate("Could not update the user"));
                        }
                      });
                    }else {
                      callback(500, errors.ErrCreate("Could not update the cart"));
                    }
                  });
                }
              } else {
                callback(403);
              }
            });
          } else {
            helpers.debug_err(debugModule, errors.ErrCreate(err));
            callback(403);
          }
        });
      }else {
        callback(400, err);
      }
    });
  }else{
    callback(400, errors.ErrCreate("Missing required field"));
  }
};

// SUCCESS: callback to caller (ok=statusCode(200), dataObject)
// FAILURE: callback to caller (err=statusCode, errorObject)
service.getCart = function(emailParam,callback){
  var userEmail = helpers.getValidEmailStringOrFalse(emailParam);
  if (userEmail) {
    var userCartObject = {
      'userEmail' : userEmail,
      'totalCount' : 0,
      'totalPrice' : 0,
      'cartItems' : []
    };
    _data.read('users',userEmail,function(err, userData){
      if (!err && userData) {
        var userCartId = helpers.getValidStringExactLenOrFalse(userData.cartId, 20);
        // Lookup the user's cart
        if (userCartId){
          _data.read('carts', userCartId, function(err, cartData){
            if (!err && cartData) {
              // init cart for return
              userCartObject.userEmail = helpers.getValidEmailStringOrFalse(cartData.userEmail);
              userCartObject.totalCount = 0;
              userCartObject.totalPrice = 0;
              userCartObject.cartItems = helpers.getValidArrayOrEmpty(cartData.cartItems);
              userCartObject = _cart.recalculateCart(userCartObject);
            }
            // fallback to empty cart
            if (userCartObject.userEmail == userEmail){
              callback(200, userCartObject);
            }else {
              callback(403);
            }
          });
        } else {
          // fallback to empty cart
          if (userCartObject.userEmail == userEmail){
            callback(200, userCartObject);
          }else {
            callback(403);
          }
        }
      } else{
        callback(400, errors.ErrCreate("Could not find the specified user"));
      }
    });
  } else {
    callback(400, errors.ErrCreate("Missing required field"));
  }
};

// SUCCESS: callback to caller (ok=statusCode(200), dataObject)
// FAILURE: callback to caller (err=statusCode, errorObject)
service.updateCart = function(emailParam,indexParam,idParam,callback){
  var userEmail = helpers.getValidEmailStringOrFalse(emailParam);
  var cartIndex = helpers.getValidIntNumberOrFalse(indexParam);
  var id = helpers.getValidStringExactLenOrFalse(idParam, 3);
  if (userEmail && cartIndex>=0 && id) {
    // Lookup the good ID
    _catalog.findArticleById(id,function(err,article){
      if(!err && article) {
        _data.read('users',userEmail,function(err, userData){
          if (!err && userData) {
            var userCartId = helpers.getValidStringExactLenOrFalse(userData.cartId, 20);
            // Lookup the user's cart
            if (userCartId){
              _data.read('carts', userCartId, function(err, cartData){
                if (!err && cartData) {
                  userCartEmail = helpers.getValidEmailStringOrFalse(cartData.userEmail);
                  if (userCartEmail == userEmail){
                    var saveCartObject = _cart.createEmptyCart(userEmail);
                    saveCartObject.userEmail = helpers.getValidEmailStringOrFalse(cartData.userEmail);
                    saveCartObject.totalCount = 0;
                    saveCartObject.totalPrice = 0;
                    saveCartObject.cartItems = helpers.getValidArrayOrEmpty(cartData.cartItems);
                    var updatedIndex = (saveCartObject.cartItems.length > cartIndex) ? cartIndex : false;
                    if (updatedIndex>=0){
                      saveCartObject.cartItems[updatedIndex] = article;
                    }
                    saveCartObject = _cart.recalculateCart(saveCartObject);
                    _data.update('carts',userCartId,saveCartObject,function(err){
                      if (!err) {
                        helpers.debug_ok(debugModule, errors.OkCreate("User's cart has been updated successfully"));
                        callback(200);
                      }else {
                        callback(500, errors.ErrCreate("Could not update the cart"));
                      }
                    });
                  }else {
                    callback(403);
                  }
                }else {
                  callback(400, errors.ErrCreate("Could not find user's cart"));
                }
              });
            }else {
              callback(400, errors.ErrCreate("User's cart is already empty"));
            }
          } else{
            callback(400, errors.ErrCreate("Could not find the specified user"));
          }
        });
      }else {
        callback(400, err);
      }
    });
  } else {
    callback(400, errors.ErrCreate("Missing required field"));
  }
};

// SUCCESS: callback to caller (ok=statusCode(200), dataObject)
// FAILURE: callback to caller (err=statusCode, errorObject)
service.deleteCart = function(emailParam,indexParam,callback){
  var userEmail = helpers.getValidEmailStringOrFalse(emailParam);
  var cartIndex = helpers.getValidIntNumberOrFalse(indexParam);
  if (userEmail) {
    _data.read('users',userEmail,function(err, userData){
      if (!err && userData) {
        var userCartId = helpers.getValidStringExactLenOrFalse(userData.cartId, 20);
        // Lookup the user's cart
        if (userCartId){
          _data.read('carts', userCartId, function(err, cartData){
            if (!err && cartData) {
              userCartEmail = helpers.getValidEmailStringOrFalse(cartData.userEmail);
              if (userCartEmail == userEmail){
                if (cartIndex>=0){
                  var saveCartObject = _cart.createEmptyCart(userEmail);
                  saveCartObject.userEmail = helpers.getValidEmailStringOrFalse(cartData.userEmail);
                  saveCartObject.totalCount = 0;
                  saveCartObject.totalPrice = 0;
                  saveCartObject.cartItems = helpers.getValidArrayOrEmpty(cartData.cartItems);
                  var deletedIndex = (saveCartObject.cartItems.length > cartIndex) ? cartIndex : false;
                  if (deletedIndex>=0){
                    saveCartObject.cartItems.splice(deletedIndex, 1);
                  }
                  saveCartObject = _cart.recalculateCart(saveCartObject);
                  _data.update('carts',userCartId,saveCartObject,function(err){
                    if (!err) {
                      helpers.debug_ok(debugModule, errors.OkCreate("User's cart has been updated successfully"));
                      callback(200);
                    }else {
                      callback(500, errors.ErrCreate("Could not update the cart"));
                    }
                  });
                }else{
                  _data.delete('carts', userCartId, function(err){
                    if (!err) {
                      delete userData.cartId;

                      _data.update('users',userEmail,userData,function(err){
                        if (!err) {
                          helpers.debug_ok(debugModule, errors.OkCreate("User's cart has been deleted successfully"));
                          callback(200);
                        }else {
                          callback(500, errors.ErrCreate("Could not update the user"));
                        }
                      });
                    }else {
                      callback(500, errors.ErrCreate("Could not delete the user's cart"));
                    }
                  });
                }
              }else {
                callback(403);
              }
            }else {
              callback(400, errors.ErrCreate("Could not find user's cart"));
            }
          });
        }else {
          callback(400, errors.ErrCreate("User's cart is already empty"));
        }
      } else{
        callback(400, errors.ErrCreate("Could not find the specified user"));
      }
    });
  } else {
    callback(400, errors.ErrCreate("Missing required field"));
  }
};

// Export the module
module.exports = service;
