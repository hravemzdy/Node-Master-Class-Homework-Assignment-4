/*
 * PIZZA Shop WEB APP
 *
 * HTML templates functions
 *
*/

// Dependencies
var path = require('path');
var fs = require('fs');
var config = require('./config');
var helpers = require('./helpers');
var util = require('util');
var debugModule = util.debuglog('webapp');

// Container object for module
var lib = {};

lib.preparePageWithTemplate = function(templateName,templateData,callback) {
  lib.getTemplate(templateName,templateData,function(err,str){
    if (!err && str) {
      // Add the universal header and footer
      lib.addUniversalTemplates(str,templateData,function(err,str){
        if (!err && str){
          callback(200, str, 'html');
        }else {
          helpers.debug_obj_err(debugModule, "Error addTemplates: ", err);
          callback(500, undefined, 'html');
        }
      });
    }else {
      helpers.debug_obj_err(debugModule, "Error getTemplate: ", err);
      callback(500, undefined, 'html');
    }
  });
};

// Get the string content of a template
lib.getTemplate = function(templateName,data,callback) {
  templateName = helpers.getNonEmptyStringOrFalse(templateName);
  data = helpers.getValidObjectOrDefault(data, {});

  if (templateName){
    var templateDir = path.join(__dirname,'/../templates/');
    fs.readFile(templateDir+templateName+'.html','utf8',function(err,str){
      if (!err && str && str.length > 0) {
        // Do interpolation on the string
        var finalString = lib.interpolate(str,data);
        callback(false,finalString);
      }else {
        callback('No template could be found');
      }
    });
  }else {
    callback('A valid template name was not specified');
  }
};

// Add universal header and footer to a string and pass provided data object to the header and footer for interpolation
lib.addUniversalTemplates = function(str,data,callback){
  str = helpers.getValidStringOrEmpty(str);
  data = helpers.getValidObjectOrDefault(data, {});

  // get the header
  lib.getTemplate('_header', data, function(err,headerString){
    if (!err && headerString){
      // get the footer
      lib.getTemplate('_footer', data, function(err,footerString){
        if (!err && footerString){
          // Add them together
          var fullString = headerString+str+footerString;
          callback(false,fullString);
        }else {
          callback('Could not find the footer template');
        }
      });
    }else {
      callback('Could not find the header template');
    }
  });
};

// Take a string and a data object and find/replace all the keys within it
lib.interpolate = function(str,data) {
  str = helpers.getValidStringOrEmpty(str);
  data = helpers.getValidObjectOrDefault(data, {});

  // add the globals to the data object, pretending their name with "global."
  for(var keyName in config.templateGlobals){
    if (config.templateGlobals.hasOwnProperty(keyName)){
      data['global.'+keyName] = config.templateGlobals[keyName];
    }
  }
  // For each key in data object, insert its value into the string at the corresponding placeholder
  for(var key in data){
    if (data.hasOwnProperty(key) && typeof(data[key])=='string'){
      var replace = data[key];
      var find = '{'+key+'}';
      str = str.replace(find,replace);
    }
  }
  return str;
};

lib.getStaticAsset = function(fileName,callback){
  fileName = helpers.getNonEmptyStringOrFalse(fileName);
  if (fileName) {
    var publicDir = path.join(__dirname,'/../public/');
    fs.readFile(publicDir+fileName,function(err,data){
      if (!err && data) {
          callback(false,data);
      }else {
        callback('No file could be found');
      }
    });
  }else {
    callback('A valid file name was not specified');
  }
};

// Export the module
module.exports = lib;
