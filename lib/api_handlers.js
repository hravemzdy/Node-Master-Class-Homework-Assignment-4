/*
 * PIZZA Shop rest API
 *
 * Create handlers for App API
 *
*/

// Dependencies
var _app = require('./app_handlers');
var _users = require('./user_handlers');
var _tokens = require('./token_handlers');
var _offers = require('./offer_handlers');
var _shopping = require('./shopping_handlers');
var _checkout = require('./checkout_handlers');
var _payment = require('./payment_handlers');
var _orders = require('./order_handlers');

// Container object for module
var handlers = {};

// Web app handlers
// index handler
handlers.index = function(data, callback){
  if (data.method == 'get') {
    _app.getIndex(function(statusCode,str,contentType){
      callback(statusCode,str,contentType);
    });
  } else {
    callback(405, undefined, 'html');
  }
};

// Create the new user account
handlers.accountCreate = function(data, callback){
  if (data.method == 'get') {
    _app.getAccountCreate(function(statusCode,str,contentType){
      callback(statusCode,str,contentType);
    });
  } else {
    callback(405, undefined, 'html');
  }
};

// Edit the existing user account
handlers.accountEdit = function(data, callback){
  if (data.method == 'get') {
    _app.getAccountEdit(function(statusCode,str,contentType){
      callback(statusCode,str,contentType);
    });
  } else {
    callback(405, undefined, 'html');
  }
};

// The user account has been deleted
handlers.accountDeleted = function(data, callback){
  if (data.method == 'get') {
    _app.getAccountDeleted(function(statusCode,str,contentType){
      callback(statusCode,str,contentType);
    });
  } else {
    callback(405, undefined, 'html');
  }
};

// The user account has been deleted
handlers.accountHistory = function(data, callback){
  if (data.method == 'get') {
    _app.getAccountHistory(function(statusCode,str,contentType){
      callback(statusCode,str,contentType);
    });
  } else {
    callback(405, undefined, 'html');
  }
};

// Create the new session
handlers.sessionCreate = function(data, callback){
  if (data.method == 'get') {
    _app.getSessionCreate(function(statusCode,str,contentType){
      callback(statusCode,str,contentType);
    });
  } else {
    callback(405, undefined, 'html');
  }
};

// The existing session has been deleted
handlers.sessionDeleted = function(data, callback){
  if (data.method == 'get') {
    _app.getSessionDeleted(function(statusCode,str,contentType){
      callback(statusCode,str,contentType);
    });
  } else {
    callback(405, undefined, 'html');
  }
};

// List user's shopping cart with articles
handlers.cartList = function(data, callback){
  if (data.method == 'get') {
    _app.getCartList(function(statusCode,str,contentType){
      callback(statusCode,str,contentType);
    });
  } else {
    callback(405, undefined, 'html');
  }
};

// Add the article to shopping cart
handlers.cartAdd = function(data, callback){
  if (data.method == 'get') {
    _app.getCartAdd(function(statusCode,str,contentType){
      callback(statusCode,str,contentType);
    });
  } else {
    callback(405, undefined, 'html');
  }
};

// Refine the shopping cart, change, delete
handlers.cartEdit = function(data, callback){
  if (data.method == 'get') {
    _app.getCartEdit(function(statusCode,str,contentType){
      callback(statusCode,str,contentType);
    });
  } else {
    callback(405, undefined, 'html');
  }
};

// Create order and clean shopping cart
handlers.cartCheckout = function(data, callback){
  if (data.method == 'get') {
    _app.getCartCheckout(function(statusCode,str,contentType){
      callback(statusCode,str,contentType);
    });
  } else {
    callback(405, undefined, 'html');
  }
};

// Create Paymenr and Notify User
handlers.cartPayment = function(data, callback){
  if (data.method == 'get') {
    _app.getCartPayment(function(statusCode,str,contentType){
      callback(statusCode,str,contentType);
    });
  } else {
    callback(405, undefined, 'html');
  }
};

// Show catalog of pizzas and sweets
handlers.catalogList = function(data, callback){
  if (data.method == 'get') {
    _app.getCatalogList(function(statusCode,str,contentType){
      callback(statusCode,str,contentType);
    });
  } else {
    callback(405, undefined, 'html');
  }
};

// Favicon handler
handlers.favIcon = function(data, callback){
  if (data.method == 'get') {
    _app.getFavIcon('favicon.ico', function(statusCode,str,contentType){
      callback(statusCode,str,contentType);
    });
  } else {
    callback(405);
  }
};

// Public assets handler
handlers.public = function(data, callback){
  if (data.method == 'get') {
    // Get the filename being requested
    var trimmedAssetName = data.handlerPath.replace('public/', '').trim();
    if (trimmedAssetName.length > 0) {
      _app.getStaticAsset(trimmedAssetName, function(statusCode,str,contentType){
        callback(statusCode,str,contentType);
      });
    } else {
      callback(404);
    }
  } else {
    callback(405);
  }
};


// API JSON handlers

// Ping handler
handlers.ping = function(data, callback){
    // Callback a http status code, and a payload object
    callback(200);
};

// Not found handler
handlers.notFound = function(data, callback){
    callback(404);
};

handlers.users = function(data, callback){
    var acceptableMethods = ['post','get','put','delete'];

    if (acceptableMethods.indexOf(data.method) > -1){
        _users[data.method](data, callback);
    } else {
        callback(405);
    }

};

handlers.tokens = function(data, callback){
    var acceptableMethods = ['post','get','put','delete'];

    if (acceptableMethods.indexOf(data.method) > -1){
        _tokens[data.method](data, callback);
    } else {
        callback(405);
    }

};

handlers.offer = function(data, callback){
    var acceptableMethods = ['get'];

    if (acceptableMethods.indexOf(data.method) > -1){
        _offers[data.method](data, callback);
    } else {
       callback(405);
    }

};

handlers.shopping = function(data, callback){
    var acceptableMethods = ['post','get','put','delete'];

    if (acceptableMethods.indexOf(data.method) > -1){
        _shopping[data.method](data, callback);
    } else {
       callback(405);
    }

};

handlers.orders = function(data, callback){
    var acceptableMethods = ['post','get'];

    if (acceptableMethods.indexOf(data.method) > -1){
        _orders[data.method](data, callback);
    } else {
       callback(405);
    }

};

handlers.checkout = function(data, callback){
    var acceptableMethods = ['post'];

    if (acceptableMethods.indexOf(data.method) > -1){
        _checkout[data.method](data, callback);
    } else {
       callback(405);
    }

};

handlers.payment = function(data, callback){
    var acceptableMethods = ['post'];

    if (acceptableMethods.indexOf(data.method) > -1){
        _payment[data.method](data, callback);
    } else {
       callback(405);
    }

};

// Export the module
module.exports = handlers;
