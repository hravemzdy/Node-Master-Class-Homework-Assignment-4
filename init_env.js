/*
 * PIZZA Shop rest API
 *
 * Init environment
 * - create folder .data and subfolders (carts,catalog,orders,tokens,users)
 * - create file .data/catalog/pizzas.json
 * - create file .data/catalog/sweets.json
 * - create folder api_keys
 * - create file api_keys/_key_mailgun.json
 * - file _key_mailgun.json should update with keys (sandboxid, token_pub, token_sec)
 * - create file api_keys/_key_stripe.json
 * - file _key_stripe.json should update with keys (token_pub, token_sec)
 *
*/

// Dependecies
var helpers = require('./lib/helpers');
var _catalog = require('./lib/catalog_service');
var _data = require('./lib/_data');

// Declare the app
var app = {};

// Initialize the app
app.init = function() {

  _data.init(function(callback) {
    _catalog.initPiizaCatalog(function(err){
      if (!err){
        console.log(helpers.msg_ok("Catalog successfully updated with pizzas"));
      }else{
        console.log(helpers.msg_err("Catalog failed update with pizzas"));
      }
      _catalog.initSweetCatalog(function(err){
        if (!err){
          console.log(helpers.msg_ok("Catalog successfully updated with sweets"));
        }else{
          console.log(helpers.msg_err("Catalog failed update with sweets"));
        }
        callback();
      });
    });
  });
};

// Execute the init Function
app.init();

// Export the app
module.exports = app;
