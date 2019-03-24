/*
 * PIZZA Shop rest API
 *
 * data create, update, delete, list
 *
*/

// Dependencies
var fs = require('fs');
var path = require('path');
var helpers = require('./helpers');
var errors = require('./errors');
var util = require('util');
var debugModule = util.debuglog('_data');


// Container object for module
var lib = {};

// base dir for data
lib.baseDir = path.join(__dirname, '/../.data/');
lib.keysDir = path.join(__dirname, '/../api_keys/');

lib.ensureExists = function(path, pathShort, callback) {
  const mask = 0777;

  fs.mkdir(path, mask, function(err) {
      if (err) {
          if (err.code == 'EEXIST') {
            // ignore the error if the folder already exists
            console.log(helpers.msg_ok("Directory "+pathShort+" already exists"));
            callback(null);
          } else {
            // something else went wrong
            callback(err);
          }
      } else {
        // successfully created folder
        console.log(helpers.msg_ok("Directory "+pathShort+" successfully created"));
        callback(null);
      }
  });
};

lib.initKeysFiles = function(keysName,keysObject,callback){
  fs.readFile(lib.keysDir+keysName+'.json', 'utf-8', function(err, data) {
      if (!err && data) {
        var parsedData = helpers.parseJsonToObject(data);
        var token = helpers.isNonEmptyString(parsedData.token_pub);
        if (!token){
          lib.updateKeysFile(keysName,keysObject,function(err, errText){
            callback(err, errText);
          });
        }
      }else{
        lib.createKeysFile(keysName,keysObject,function(err, errText){
          callback(err, errText);
        });
      }
  });
};

lib.updateKeysFile = function(keysName,keysObject,callback){
  fs.open(lib.keysDir+keysName+'.json','r+',function(err,fileDescriptor){
    if (!err && fileDescriptor) {
      // Convert data to string
      var stringData = JSON.stringify(keysObject);
      fs.truncate(fileDescriptor, function(err){
        if (!err) {
          fs.writeFile(fileDescriptor, stringData, function(err){
            if (!err) {
              fs.close(fileDescriptor, function(err){
                if (!err) {
                  callback(false, 'key file ' + keysName + ' updated successfully');
                } else {
                  callback(true, 'error closing key file ' + keysName);
                }
              })
            } else {
              callback(true, 'error writing to key file ' + keysName);
            }
          });
        } else {
          callback(true, 'error truncating key file ' + keysName);
        }
      });
    } else {
      callback(true, 'Could not open the file for updating, it may not exist yet');
    }
  });
};

lib.createKeysFile = function(keysName,keysObject,callback){
  fs.open(lib.keysDir+keysName+'.json','wx',function(err,fileDescriptor){
    if (!err && fileDescriptor) {
      // Convert data to string
      var stringData = JSON.stringify(keysObject);
      fs.writeFile(fileDescriptor, stringData, function(err){
        if (!err) {
          fs.close(fileDescriptor, function(err){
            if (!err) {
              callback(false, 'key file ' + keysName + ' created successfully');
            } else {
              callback(true, 'error closing key file ' + keysName);
            }
          });
        } else {
          callback(true, 'error writing to key file ' + keysName);
        }
      });
    } else {
      callback(false, 'key file ' + keysName + ' already exist');
    }
  });
};

lib.createKeysMailGun = function(callback){
  var keysName = '_key_mailgun';
  var keysObject = {
      sandboxid : "sandboxXxx",
      token_pub : "pubkey-Xxx",
      token_sec : "key-Xxx"
  };
  lib.initKeysFiles(keysName,keysObject,callback);
};

lib.createKeysStripe = function(callback){
  var keysName = '_key_stripe';
  var keysObject = {
    token_pub : "pk_test_Xxx",
    token_sec : "rk_test_Xxx"
  };
  lib.initKeysFiles(keysName,keysObject,callback);
};

lib.initFolderData = function(createCatalogData,callback) {
  lib.ensureExists(lib.baseDir, '.data', function(err) {
    var dataFolders = [
      'tokens',
      'users',
      'carts',
      'orders',
      'payments',
      'notifications',
      'catalog'
    ];
    if (!err) {
      var folderCount = dataFolders.length;
      var folderIndex = 0;

      dataFolders.forEach(function(folderData){
        lib.ensureExists(lib.baseDir+folderData, '.data/'+folderData, function(err) {
          if (err) {
            helpers.debug_obj_err(debugModule, "Error creating directory", err);
          }
          folderIndex++;
          if (folderCount == folderIndex){
            createCatalogData(function(){
              callback();
            });
          }
        });
      });
    }
  });
};

lib.initFolderKeys = function(callback) {
  lib.ensureExists(lib.keysDir, 'api_keys', function(err) {
    if (err) {
      helpers.debug_obj_err(debugModule, "Error creating directory", err);
    }else {
      lib.createKeysMailGun(function(err, errMsg) {
        if (!err){
          console.log(helpers.msg_ok(errMsg));
        }else{
          helpers.debug_obj_err(debugModule, err);
        }
        lib.createKeysStripe(function(err, errMsg) {
          if (!err){
            console.log(helpers.msg_ok(errMsg));
          }else{
            helpers.debug_obj_err(debugModule, err);
          }
          callback();
        });
      });
    }
  });
};


lib.init = function(createCatalogData) {
  lib.initFolderData(createCatalogData,function(){
    lib.initFolderKeys(function(){
      console.log(helpers.msg_ok("Initialization app done."));
    });
  })
}

lib.read = function(table,fileid,callback){
    fs.readFile(lib.baseDir+table+'/'+fileid+'.json', 'utf-8', function(err, data) {
        if (!err && data) {
          var parsedData = helpers.parseJsonToObject(data);
          callback(err, parsedData);
        }else{
          callback(err, data);
        }
    });
};

lib.create = function(table,fileid,data,callback){
  // open the file for writing
  fs.open(lib.baseDir+table+'/'+fileid+'.json','wx',function(err,fileDescriptor){
    if (!err && fileDescriptor) {
      // Convert data to string
      var stringData = JSON.stringify(data);
      fs.writeFile(fileDescriptor, stringData, function(err){
        if (!err) {
          fs.close(fileDescriptor, function(err){
            if (!err) {
              callback(false);
            } else {
              callback('error closing new file');
            }
          });
        } else {
          callback('error writing to new file');
        }
      });
    } else {
      callback('error creating new file, it may already exist');
    }
  });
};

lib.update = function(table,fileid,data,callback){
  // open the file for writing
  fs.open(lib.baseDir+table+'/'+fileid+'.json','r+',function(err,fileDescriptor){
    if (!err && fileDescriptor) {
      // Convert data to string
      var stringData = JSON.stringify(data);
      fs.truncate(fileDescriptor, function(err){
        if (!err) {
          fs.writeFile(fileDescriptor, stringData, function(err){
            if (!err) {
              fs.close(fileDescriptor, function(err){
                if (!err) {
                  callback(false);
                } else {
                  callback('error closing existing file');
                }
              })
            } else {
              callback('error writing to existing file');
            }
          });
        } else {
          callback('error truncating existing file');
        }
      });
    } else {
      callback('Could not open the file for updating, it may not exist yet');
    }
  });
};

lib.delete = function(table,fileid,callback){
  // open the file for writing
  fs.unlink(lib.baseDir+table+'/'+fileid+'.json',function(err){
    if (!err) {
      callback(false);
    } else {
      callback('Could not delete the file, it may not exist yet');
    }
  });
};

lib.list = function(table,callback){
  fs.readdir(lib.baseDir+table+'/', function(err,data) {
    if(!err && data && data.length > 0){
      var trimmedFileNames = [];
      data.forEach(function(fileName){
        trimmedFileNames.push(fileName.replace('.json',''));
      });
      callback(false,trimmedFileNames);
    } else {
      callback(err,data);
    }
  });
};

lib.listFilesAsync = function(table) {
  return new Promise((resolve, reject) => {
    var folder = lib.baseDir+table+'/';
    fs.readdir(folder, function(err, data) {
      if(!err && data && data.length > 0){
        var trimmedFileNames = [];
        data.forEach(function(fileName){
          trimmedFileNames.push(lib.baseDir+table+'/'+fileName.replace('.json',''));
        });
        resolve(trimmedFileNames);
      } else {
        reject(err);
      }
    });
  });
};

lib.readFilesObjectAsync = function(filePaths) {
  return new Promise((resolve, reject) => {
    var filesDataArray = [];
    var filePathsCount = filePaths.length;
    var filePathsIndex = 0;
    filePaths.forEach((filePath) => {
      var fileName = filePath+'.json';
      fs.readFile(fileName, 'utf-8', (err, data) => {
        if (!err && data) {
          var parsedData = helpers.parseJsonToObject(data);
          filesDataArray.push(parsedData);
        }else{
          reject(err);
        }
        filePathsIndex++;
        if (filePathsIndex == filePathsCount) {
          resolve(filesDataArray);
        }
      });
    });
  });
};

lib.readFilesArrayAsync = function(filePaths) {
  return new Promise((resolve, reject) => {
    var filesDataArray = [];
    var filePathsCount = filePaths.length;
    var filePathsIndex = 0;
    filePaths.forEach((filePath) => {
      var fileName = filePath+'.json';
      fs.readFile(fileName, 'utf-8', (err, data) => {
        if (!err && data) {
          var parsedData = helpers.parseJsonToArray(data);
          filesDataArray.push(...parsedData);
        }else{
          reject(err);
        }
        filePathsIndex++;
        if (filePathsIndex == filePathsCount) {
          resolve(filesDataArray);
        }
      });
    });
  });
};

lib.readObjectAsync = function(table,fileId) {
  return new Promise((resolve, reject) => {
    var fileName = lib.baseDir+table+'/'+fileId+'.json';
    fs.readFile(fileName, 'utf-8', (err, data) => {
      if (!err && data) {
        var parsedData = helpers.parseJsonToObject(data);
        resolve(parsedData);
      }else{
        reject(err);
      }
    });
  });
};


// Export the module
module.exports = lib;
