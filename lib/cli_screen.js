/*
 * PIZZA Shop Admin CLI
 *
 *  screen formating module
 *
*/

// Dependencies
var helpers = require('./helpers');

// Container object for module
var lib = {};

// create a vertical space
lib.verticalSpace = (line) => {
  line = helpers.getValidNumberMinOrDefault(line, 1);
  for (i=0; i < line; i++){
    console.log('');
  }
};

// create a horizontal line across the screen
lib.horizontalLine = () => {
  // Get the available screen size
  var width = process.stdout.columns;
  var line = '';
  for(i=0; i < width; i++){
    line += '=';
  }
  console.log(line);
};

// create a centered text on the screen
lib.centered = (str) => {
  str = helpers.getValidStringOrEmpty(str);
  // Get the available screen size
  var width = process.stdout.columns;
  // Calculate the left padding there should be
  var leftPadding = Math.floor((width-str.length) / 2);
  // put left padding spaces before the string itself
  var line = '';
  for(i=0; i < leftPadding; i++){
    line += ' ';
  }
  line += str;
  console.log(line);
};

lib.clearScreen = () => {
  process.stdout.write('\033c');
};

lib.showHeader = (str) => {
  lib.verticalSpace();
  lib.horizontalLine();
  lib.centered(str);
  lib.horizontalLine();
  lib.verticalSpace(2);
};

lib.printLine = (str) => {
  console.log(str);
  lib.verticalSpace();
};

lib.printObject = (obj) => {
  console.dir(obj,{'colors':true});
  lib.verticalSpace();
};
// Export the module
module.exports = lib;
