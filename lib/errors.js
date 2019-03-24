/*
 * PIZZA Shop rest API
 * 
 * errors functions for callback
 * 
*/

// Dependencies

// Container object for module
var lib = {};

lib.ErrCreate = function(str) {
    return {'Error' : str};
};

lib.OkCreate = function(str) {
    return {'Success' : str};
};

// Export the module
module.exports = lib;
  