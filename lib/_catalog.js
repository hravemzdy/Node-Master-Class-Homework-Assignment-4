/*
 * PIZZA Shop rest API
 *
 * catalog functions
 *
*/

// Dependencies
var helpers = require('./helpers');
var errors = require('./errors');
var _data = require('./_data');
var util = require('util');
var debugModule = util.debuglog('service');

// Container object for module
var lib = {};

lib.getAllGoods = function(callback){
  _data.list('catalog', function(err,goods){
      if (!err && goods && goods.length > 0) {
          var catalogOffer = [];
          var catalogCount = goods.length;
          var catalogIndex = 0;
          goods.forEach(function(cataůogGood){
              _data.read('catalog',cataůogGood,function(err,catalogData){
                  if (!err && catalogData && catalogData.length > 0){
                      catalogData.forEach(function(dataItem){
                          catalogOffer.push(dataItem);
                      });
                  }else {
                    helpers.debug_err("Error reading one of the catalog's files")
                  }
                  catalogIndex++;
                  if (catalogIndex == catalogCount){
                      callback(false, catalogOffer);
                  }
              });
          });
      } else {
          callback(errors.ErrCreate("Cannot find any articles to offer"));
      }
  });
};

lib.findArticleById = function(idParam, callback){
  var id = helpers.getValidStringExactLenOrFalse(idParam, 3);
  _data.list('catalog', function(err,goods){
      if (!err && goods && goods.length > 0) {
          var articleOffer = {};
          var catalogCount = goods.length;
          var catalogIndex = 0;
          goods.forEach(function(cataůogGood){
              _data.read('catalog',cataůogGood,function(err,catalogData){
                  if (!err && catalogData && catalogData.length > 0){
                      catalogData.forEach(function(dataItem){
                          if (dataItem.id==id){
                            articleOffer = dataItem;
                            callback(false, articleOffer);
                          };
                      });
                  }else {
                    helpers.debug_err("Error reading one of the catalog's files")
                  }
              });
          });
      } else {
          callback(errors.ErrCreate("Specified article doesn't exist in catalog"));
      }
  });
};

// Export the module
module.exports = lib;
