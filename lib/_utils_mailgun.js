/*
 * PIZZA Shop rest API
 *
 * mailgun API functions
 *
 *
*/

// Dependencies
var https = require('https');
var querystring = require('querystring');
var helpers = require('./helpers');
var errors = require('./errors');
var _data = require('./_data');
var util = require('util');
var debugModule = util.debuglog('service');
var libKey = require('../api_keys/_key_mailgun.json');

// Container object for module
var lib = {};

lib.apiSendEmailHost = 'api.mailgun.net';

lib.createEmailConfirmation = function(invoice){
  var message = 'Helo, ' + invoice.customerName + '.\n';
  message += 'Thank you for your order and your payment\n';
  message += 'This is summary of the order #:'+ invoice.orderNumber +' you have placed at: ';
  message += new Date(invoice.orderDate).toLocaleDateString("cz-CZ") + '\n\n';
  message += '|  Article:               ';
  message += '|  Price                  |\n';

  invoice.orderItems.forEach(function(item){
    message += '|  ';
    message += item.name+'  |  ';
    message += item.price+'  |\n';
  });
  message += '---------------------------------\n';
  message += '|  Total quantity: ' + invoice.totalQuantity;
  message += '  ';
  message += '|  price:  ' + invoice.totalCharge;
  message += '  |\n';
  message += '---------------------------------\n\n';
  message += 'Shipping address: ' + invoice.shipToAddress + '\n\n';
  message += 'You are truly awesome!\n';

  var confirmationData = {
    'nameTo' : invoice.customerName,
    'emailTo' : invoice.customerEmail,
    'msg' : message,
    'invoice' : invoice
  };
  return confirmationData;
};

lib.getPathToApi = function(){
    return '/v3/' + libKey.sandboxid + '.mailgun.org/messages';
};

lib.getEmailFrom = function(){
    return 'test@' + libKey.sandboxid + '.mailgun.org';
};

lib.getBoundaryString = function(boundaryToken) {
  return '----SandBoxFormBoundary' + boundaryToken;
};

lib.getFormDataString = function(formData, boundaryToken){
  var formDataString = '';
  for (var formItem in formData) {
    var formItemValue = helpers.getNonEmptyStringOrFalse(formData[formItem]);
    if (formItemValue) {
      formDataString += "--";
      formDataString += lib.getBoundaryString(boundaryToken);
      formDataString += "\r\n";
      formDataString += "Content-Disposition: form-data; name=\"";
      formDataString += formItem;
      formDataString += "\"\r\n\r\n";
      formDataString += formItemValue;
      formDataString += "\r\n";
    }
  }
  formDataString += "--";
  formDataString += lib.getBoundaryString(boundaryToken);
  formDataString += "--";
  return formDataString;
};
// SUCCESS: callback to caller (ok=false)
// FAILURE: callback to caller (err=message)
lib.notifyCustomerByEmailMock = function(confirmation, callback){
  var email = helpers.getNonEmptyStringOrFalse(confirmation.emailTo);
  var name = helpers.getNonEmptyStringOrFalse(confirmation.nameTo);
  var msg = helpers.getValidStringMinMaxLenOrFalse(confirmation.msg, 1, 1600);
  var token = helpers.getNonEmptyStringOrFalse(libKey.token_sec);
  var orderNumber = helpers.getNonEmptyStringOrFalse(confirmation.invoice.orderNumber);

  if (email && name && msg && token) {
    // Configure the request payload
    var payload = {
      'from' : 'Mailgun Sandbox <' + lib.getEmailFrom() + '>',
      'to' : name + '<'+ email +'>',
      'subject' : 'Order from Pizza Express: '+orderNumber,
      'text' : msg
    };

    var boundaryToken = helpers.createRandomString(15);
    // stringify the payload
    var formDataString = lib.getFormDataString(payload, boundaryToken);
    console.log(helpers.msg_ok('FORMDATA:'), formDataString);

    // Configure tvilio request details
    var requestDetails = {
      'protocol' : 'https:',
      'hostname' : lib.apiSendEmailHost,
      'method' : 'POST',
      'path' : lib.getPathToApi(),
      'auth' : 'api:'+token,
      'headers' : {
        'content-type' : 'multipart/form-data; boundary='
          + lib.getBoundaryString(boundaryToken)
      }
    };

    callback(false);
  }else {
    callback('Given parameters were missing or invalid');
  }
};

// SUCCESS: callback to caller (ok=false)
// FAILURE: callback to caller (err=message)
lib.notifyCustomerByEmail = function(confirmation, callback){
  var email = helpers.getNonEmptyStringOrFalse(confirmation.emailTo);
  var name = helpers.getNonEmptyStringOrFalse(confirmation.nameTo);
  var msg = helpers.getValidStringMinMaxLenOrFalse(confirmation.msg, 1, 1600);
  var token = helpers.getNonEmptyStringOrFalse(libKey.token_sec);
  var orderNumber = helpers.getNonEmptyStringOrFalse(confirmation.invoice.orderNumber);

  if (email && name && msg && token) {
    // Configure the request payload
    var payload = {
      'from' : 'Mailgun Sandbox <' + lib.getEmailFrom() + '>',
      'to' : name + '<'+ email +'>',
      'subject' : 'Order from Pizza Express: '+orderNumber,
      'text' : msg
    };

    var boundaryToken = helpers.createRandomString(15);
    // stringify the payload
    var formDataString = lib.getFormDataString(payload, boundaryToken);
    // Configure tvilio request details
    var requestDetails = {
      'protocol' : 'https:',
      'hostname' : lib.apiSendEmailHost,
      'method' : 'POST',
      'path' : lib.getPathToApi(),
      'auth' : 'api:'+token,
      'headers' : {
        'content-type' : 'multipart/form-data; boundary='
          + lib.getBoundaryString(boundaryToken)
      }
    };

    var formDataString = lib.getFormDataString(payload, boundaryToken);

    var responseData = "";
    // Instantiate the request object
    var req = https.request(requestDetails,function(res){
        // Grab the status of the sent request
        var status =  res.statusCode;

        var res_decoded_data = '';
        res.on('data', function(chunk) {
           res_decoded_data = chunk.toString('utf8');
           responseData += res_decoded_data;
        }).on('end', function() {
           if (helpers.isNonEmptyString(responseData)){
             var responseObject = helpers.parseJsonToObject(responseData);
             _data.create('notifications', orderNumber, responseObject, function(err){
               if (err){
                 helpers.debug_ok(debugModule, errors.ErrCreate("Failed to save response to notification"));
               }
             });
           }
        });

        if(status == 200 || status == 201){
          callback(false);
        } else {
          callback('Mailgun API returned Status code '+status+'\n');
        }
    });

    // Bind to the error event so it doesn't get thrown
    req.on('error',function(e){
      callback(e);
    });

    req.write(formDataString);

    // End the request
    req.end();
  }else {
    callback('Given parameters were missing or invalid');
  }
};

// Export the module
module.exports = lib;
