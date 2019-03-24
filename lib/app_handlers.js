/*
 * PIZZA Shop WEB APP handlers
 *
 * Create handlers for WEB APP
 *
*/

// Dependencies
var _templates = require('./_templates');
var util = require('util');
var debugModule = util.debuglog('webapp');

// Container object for module
var handlers = {};

handlers.getIndex = function(callback){
  // Prepare the data for interpolation
  var templateData = {
    'head.title' : 'PIZZA romano - OUR DOUGH IS MADE FRESH DAILY',
    'head.description' : 'Famosi per la Pizza',
    'body.class' : 'index'
  };
  _templates.preparePageWithTemplate('index',templateData,function(statusCode,str,contentType){
    callback(statusCode,str,contentType);
  });
};

handlers.getAccountCreate = function(callback){
  // Prepare the data for interpolation
  var templateData = {
    'head.title' : 'Create an Account',
    'head.description' : 'Signup is easy and only takes a few seconds.',
    'body.class' : 'accountCreate'
  };
  _templates.preparePageWithTemplate('accountCreate',templateData,function(statusCode,str,contentType){
    callback(statusCode,str,contentType);
  });
};

handlers.getAccountEdit = function(callback){
  // Prepare the data for interpolation
  var templateData = {
    'head.title' : 'Account Settings',
    'body.class' : 'accountEdit'
  };
  _templates.preparePageWithTemplate('accountEdit',templateData,function(statusCode,str,contentType){
    callback(statusCode,str,contentType);
  });
};

handlers.getAccountDeleted = function(callback){
  // Prepare the data for interpolation
  var templateData = {
    'head.title' : 'Your account has been deleted',
    'body.class' : 'accountDeleted'
  };
  _templates.preparePageWithTemplate('accountDeleted',templateData,function(statusCode,str,contentType){
    callback(statusCode,str,contentType);
  });
};

handlers.getAccountHistory = function(callback){
  // Prepare the data for interpolation
  var templateData = {
    'head.title' : 'Orders history',
    'body.class' : 'accountHistory'
  };
  _templates.preparePageWithTemplate('accountHistory',templateData,function(statusCode,str,contentType){
    callback(statusCode,str,contentType);
  });
};

handlers.getSessionCreate = function(callback){
  // Prepare the data for interpolation
  var templateData = {
    'head.title' : 'Login to your account',
    'head.description' : 'Please enter your email and password to access your account.',
    'body.class' : 'sessionCreate'
  };
  _templates.preparePageWithTemplate('sessionCreate',templateData,function(statusCode,str,contentType){
    callback(statusCode,str,contentType);
  });
};

handlers.getSessionDeleted = function(callback) {
  // Prepare the data for interpolation
  var templateData = {
    'head.title' : 'Loged Out',
    'head.description' : 'You have been logged out of your account.',
    'body.class' : 'sessionDeleted'
  };
  _templates.preparePageWithTemplate('sessionDeleted',templateData,function(statusCode,str,contentType){
    callback(statusCode,str,contentType);
  });
};

handlers.getCartList = function(callback){
  // Prepare the data for interpolation
  var templateData = {
    'head.title' : 'Shopping Cart',
    'body.class' : 'cartList'
  };
  _templates.preparePageWithTemplate('cartList',templateData,function(statusCode,str,contentType){
    callback(statusCode,str,contentType);
  });
};

handlers.getCartAdd = function(callback){
  // Prepare the data for interpolation
  var templateData = {
    'head.title' : 'Add to Shopping Cart',
    'body.class' : 'cartAdd'
  };
  _templates.preparePageWithTemplate('cartAdd',templateData,function(statusCode,str,contentType){
    callback(statusCode,str,contentType);
  });
};

handlers.getCartEdit = function(callback){
  // Prepare the data for interpolation
  var templateData = {
    'head.title' : 'Refine the ordered article',
    'body.class' : 'cartEdit'
  };
  _templates.preparePageWithTemplate('cartEdit',templateData,function(statusCode,str,contentType){
    callback(statusCode,str,contentType);
  });
};

handlers.getCartCheckout = function(callback){
  // Prepare the data for interpolation
  var templateData = {
    'head.title' : 'Checkout and Create order',
    'body.class' : 'cartCheckout'
  };
  _templates.preparePageWithTemplate('cartCheckout',templateData,function(statusCode,str,contentType){
    callback(statusCode,str,contentType);
  });
};

handlers.getCartPayment = function(callback){
  // Prepare the data for interpolation
  var templateData = {
    'head.title' : 'Send payment for order',
    'body.class' : 'cartPayment'
  };
  _templates.preparePageWithTemplate('cartPayment',templateData,function(statusCode,str,contentType){
    callback(statusCode,str,contentType);
  });
};

handlers.getCatalogList = function(callback){
  // Prepare the data for interpolation
  var templateData = {
    'head.title' : 'All of our deleicious delicatezza',
    'body.class' : 'catalogList'
  };
  _templates.preparePageWithTemplate('catalogList',templateData,function(statusCode,str,contentType){
    callback(statusCode,str,contentType);
  });
};

handlers.getFavIcon = function(assetName, callback){
  _templates.getStaticAsset(assetName, function(err,data){
    if (!err && data) {
      callback(200, 'favicon');
    }else {
      callback(500);
    }
  });
};

handlers.getStaticAsset = function(assetName, callback){
  _templates.getStaticAsset(assetName, function(err,data){
    if (!err && data) {
      // Determin the content type (default the plain text)
      var contentType = 'plain';
      if (assetName.indexOf('.css') > -1) {
        contentType = 'css';
      }

      if (assetName.indexOf('.png') > -1) {
        contentType = 'png';
      }

      if (assetName.indexOf('.jpg') > -1) {
        contentType = 'jpg';
      }

      if (assetName.indexOf('.ico') > -1) {
        contentType = 'favicon';
      }
      // Callback the data and content-type
      callback(200, data, contentType);
    }else {
      callback(404);
    }
  });
};

// Export the module
module.exports = handlers;
