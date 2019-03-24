/*
 * PIZZA Shop rest API
 *
 * helpers functions
 *
*/

// Dependencies
var crypto = require('crypto');
var config = require('./config');

// Container object for module
var lib = {};

lib.emailRegExPattern = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;

lib.isValidString = function(str) {
    return typeof(str) == 'string' ? true : false;
};
lib.isNonEmptyString = function(str) {
    return typeof(str) == 'string' && str.trim().length > 0 ? true : false;
};
lib.isValidStringMinLen = function(str, minLength) {
    return typeof(str) == 'string' && str.trim().length >= minLength ? true : false;
};

lib.isValidStringMinMaxLen = function(str, minLength, maxLength) {
    return typeof(str) == 'string' && str.trim().length >= minLength && str.trim().length <= maxLength ? true : false;
};

lib.isValidStringExactLen = function(str, exactLength) {
    return typeof(str) == 'string' && str.trim().length == exactLength ? true : false;
};

lib.getNonEmptyStringOrFalse = function(str) {
    return lib.isNonEmptyString(str) ? str.trim() : false;
};

lib.getValidStringOrEmpty = function(str) {
    return lib.isValidString(str) ? str : '';
};

lib.getValidStringMinLenOrFalse = function(str, minLength) {
    return lib.isValidStringMinLen(str, minLength) ? str : false;
};

lib.getValidStringMinMaxLenOrFalse = function(str, minLength, maxLength) {
    return lib.isValidStringMinMaxLen(str, minLength, maxLength) ? str : false;
};

lib.getValidStringExactLenOrFalse = function(str, exactLength) {
    return lib.isValidStringExactLen(str, exactLength) ? str : false;
};

lib.getValidRegExStringOrFalse = function(str, minLength, pattern) {
    return lib.isValidStringMinLen(str, minLength) && str.match(pattern)!=null ? str : false;
};

lib.getValidEmailStringOrFalse = function(str) {
    return lib.getValidRegExStringOrFalse(str, 5, lib.emailRegExPattern);
};

lib.getValidNumberOrFalse = function(data) {
    return typeof(data) == 'number' && data % 1 == 0 ? data : false;
};

lib.getValidIntNumberOrFalse = function(data) {
    var numberData = false;
    if (typeof(data) == 'number') {
      numberData = data;
    } else if (typeof(data) == 'string') {
      try{
        numberData = parseInt(data);
      }catch(e){
        numberData = false;
      }
    } else {
      numberData = false;
    }
    if (typeof(numberData) == 'number') {
      return (numberData% 1 == 0) ? numberData : false;
    }
    return false;
};

lib.getValidNumberMinOrDefault = function(data, minNumber) {
    return typeof(data) == 'number' && data % 1 == 0 && data >= minNumber ? data : minNumber;
};

lib.getValidNumberMinOrFalse = function(data, minNumber) {
    return typeof(data) == 'number' && data % 1 == 0 && data >= minNumber ? data : false;
};

lib.getValidNumberMinMaxOrFalse = function(data, minNumber, maxNumber) {
    return typeof(data) == 'number' && data % 1 == 0 && data >= minNumber && data <= maxNumber ? data : false;
};

lib.getValidBooleanOrFalse = function(data) {
    return typeof(data) == 'boolean' && data == true ? true : false;
};

lib.getValidArrayOrEmpty = function(data) {
    return typeof(data) == 'object' && data instanceof Array  ? data : [];
};

lib.getValidObjectOrDefault = function(data, defaultData) {
    return typeof(data) == 'object' && data !==null ? data : defaultData;
};

lib.getObjStringOrDefault = function(data) {
    var str = lib.getNonEmptyStringOrFalse(data);
    if (str) {
        return str;
    }
    return JSON.stringify(data);
};

lib.hash = function(str){
    if (lib.isNonEmptyString(str)) {
      var hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
      return hash;
    }else{
      return false;
    }
};

// Parse a JSON string to an object in all cases, without throwing
lib.parseJsonToObject = function(str){
    try{
        var obj = JSON.parse(str);
        return obj;
    } catch(e){
        return {};
    }
};

// Parse a JSON string to an Array in all cases, without throwing
lib.parseJsonToArray = function(str){
    try{
        var obj = JSON.parse(str);
        return Object.values(obj);
    } catch(e){
        return [];
    }
};

// create a string of random alphanumeric characters, of a given length
lib.createRandomString = function(strLength) {
    strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength : false;
    if(strLength){
      // Define all the possible characters that could go into a string
      var possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';

      // Start the final string
      var str = '';
      for(i = 1; i <= strLength; i++) {
          // Get a random charactert from the possibleCharacters string
          var randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
          // Append this character to the string
          str+=randomCharacter;
      }
      // Return the final string
      return str;
    } else {
      return false;
    }
};

lib.DateInMinutesFromNow = function(timerMinutes) {
    timerMinutes = lib.getValidNumberOrFalse(timerMinutes);
    if (!timerMinutes) {
        timerMinutes = 60;
    }
    return Date.now() + 1000 * 60 * timerMinutes;
};

lib.DateStrToObject = function(str) {
  var dateString = typeof(str)=='string' && str.trim().length > 0 ? str.trim() : false;
  var dateObject = typeof(dateString)=='string' ? new Date(dateString) : false;
  return (dateObject);
};

lib.DateInLocalFormat = function(str) {
  var dateObject = lib.DateStrToObject(str);
  var dateFormat = dateObject instanceof Date ? dateObject.toLocaleDateString("cz-CZ") : 'unknown';
  return dateFormat;
};

lib.msg_ok = function(data){
    var msg = lib.getObjStringOrDefault(data);
    return '\x1b[32m'+msg+'\x1b[0m';
};

lib.msg_err = function(data){
    var msg = lib.getObjStringOrDefault(data);
    return '\x1b[31m'+msg+'\x1b[0m';
};

lib.debug_ok = function(writter, data) {
    var msg = lib.getObjStringOrDefault(data);
    writter('\x1b[32m%s\x1b[0m',msg);
};

lib.debug_obj_ok = function(writter, data, detail) {
    var msg = lib.getObjStringOrDefault(data);
    writter('\x1b[32m%s\x1b[0m',msg);
    var obj = lib.getObjStringOrDefault(detail);
    writter('\x1b[32m%s\x1b[0m',obj);
};

lib.debug_err = function(writter, data) {
    var msg = lib.getObjStringOrDefault(data);
    writter('\x1b[31m%s\x1b[0m',msg);
};

lib.debug_obj_err = function(writter, data, detail) {
    var msg = lib.getObjStringOrDefault(data);
    writter('\x1b[31m%s\x1b[0m',msg);
    var obj = lib.getObjStringOrDefault(detail);
    writter('\x1b[31m%s\x1b[0m',obj);
};

// Export the module
module.exports = lib;
