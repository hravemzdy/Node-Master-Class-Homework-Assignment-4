/*
 * PIZZA Shop CLI client
 *
 * The Assignment (Scenario):
 *
 * It is time to build the Admin CLI for the pizza-delivery app you built in the previous assignments. Please build a CLI interface that would allow the manager of the pizza place to:
 *
 * 1. View all the current menu items
 *
 * 2. View all the recent orders in the system (orders placed in the last 24 hours)
 *
 * 3. Lookup the details of a specific order by order ID
 *
 * 4. View all the users who have signed up in the last 24 hours
 *
 * 5. Lookup the details of a specific user by email address
 *
*/

// Dependecies
var server = require('./lib/server');
var cli = require('./lib/cli');

// Declare the app
var app = {};

// Initialize the app
app.init = function() {
  // Start the server
  server.init();

  // start the CLI, but make sure it starts last
  setTimeout(function() {
    cli.init();
  }, 50);
};

// Execute the init Function
app.init();

// Export the app
module.exports = app;
