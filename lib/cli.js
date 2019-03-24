/*
 * PIZZA Shop Admin CLI
 *
 * cli related functions
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

*/

// Dependencies
var helpers = require('./helpers');
var readline = require('readline');
var cliscr = require('./cli_screen');
var util = require('util');
var debugModule = util.debuglog('cli');
var events = require('events');
class _events extends events{};
var e = new _events();
var _data = require('./_data');

// Container object for module
var cli = {};

// Input handlers
e.on('man', (str, callback) => {
  cli.responders.help(callback);
});

e.on('help', (str, callback) => {
  cli.responders.help(callback);
});

e.on('cls', (str, callback) => {
  cli.responders.cls(callback);
});

e.on('exit', (str, callback) => {
  cli.responders.exit();
});

e.on('list menu', (str, callback) => {
  cli.responders.listMenu(callback);
});

e.on('list orders', (str, callback) => {
  cli.responders.listOrders(str, callback);
});

e.on('more order info', (str, callback) => {
  cli.responders.moreOrderInfo(str, callback);
});

e.on('list users', (str, callback) => {
  cli.responders.listUsers(str, callback);
});

e.on('more user info', (str, callback) => {
  cli.responders.moreUserInfo(str, callback);
});

// Responder object
cli.responders = {};

cli.responders.help = (callback) => {
  // * 1. View all the current menu items
  // * 2. View all the recent orders in the system (orders placed in the last 24 hours)
  // * 3. Lookup the details of a specific order by order ID
  // * 4. View all the users who have signed up in the last 24 hours
  // * 5. Lookup the details of a specific user by email address
  var commands = {
    'exit' : 'Kill the CLI and rest of the application',
    'man' : 'Show this help page',
    'help' : 'Alias for the "man" command',
    'cls' : 'Clear output screen',
    'list menu' : 'Show list of all the current menu items' ,
    'list orders --all' : 'Show list of the all or recent orders in the system (orders placed in the last 24 hours)',
    'more order info --(orderId)' : 'Show the details of a specific order by order ID',
    'list users -all' : 'Show list of all or recent users (users who have signed up in the last 24 hours)',
    'more user info --(userId)' : 'Show details of a specific user by email address'
  };

  // Show a header for the help page that is as wide as the screen
  cliscr.showHeader('PIZZA Shop Admin CLI manual');
  // Show each command, followed by its explanation, in white and yellow respectivelly
  for (var key in commands){
    if(commands.hasOwnProperty(key)){
      var value = commands[key];
      var line = '\x1b[33m'+key+'\x1b[0m';
      var padding = 60 - line.length;
      for (i = 0; i < padding; i++){
        line += ' ';
      }
      line += value;
      console.log(line);
      cliscr.verticalSpace();
    }
  }
  cliscr.verticalSpace();
  // End with another horizontal line
  cliscr.horizontalLine();
  callback();
};

cli.responders.cls = (callback) => {
  cliscr.clearScreen();
  callback();
};

cli.responders.listMenu = (callback) => {
  // Show a header for the help page that is as wide as the screen
  cliscr.showHeader('PIZZA Shop MENU');
  _data.listFilesAsync('catalog')
    .then(_data.readFilesArrayAsync)
    .then((catalogData) => {
      return catalogData.map((catalogItem) => {
        var mixtureArr = catalogItem.mixtureEnglish.split(',');
        var mistureStr = mixtureArr.join('\n');
        var line = 'ID: ' + catalogItem.id + ' Name: ' + catalogItem.name + '\nDescription (Mixture): ' + mistureStr;
        return line;
      });
    })
    .then((lines) => {
      lines.forEach((line) => cliscr.printLine(line));
    })
    .then(() => callback())
    .catch((err) => {
      helpers.debug_err(debugModule, err);
      callback();
    });
};

cli.responders.listOrders = (str, callback) => {
  // Show a header for the help page that is as wide as the screen
  var filterDate = new Date(Date.now());
  filterDate.setUTCHours(-24,0,0,0);

  var arr = str.split('--');
  var allFlag = typeof(arr[1]) == 'string' && arr[1].trim() == 'all' ? true : false;

  cliscr.showHeader('LIST ORDERS');
  _data.listFilesAsync('orders')
    .then(_data.readFilesObjectAsync)
    .then((ordersData) => {
      return ordersData.map((ordersItem) => {
        var orderDateObject = helpers.DateStrToObject(ordersItem.orderDate);
        if (allFlag || (orderDateObject && orderDateObject.getTime() > filterDate.getTime()))
        {
          var orderDateFormat = helpers.DateInLocalFormat(ordersItem.orderDate);
          var line = 'ID: ' + ordersItem.orderNumber + ' Customer\'s Name: ' + ordersItem.customerName + ' Order\'s date: ' + orderDateFormat;
          return line;
        }
        else
        {
          return '';
        }
      })
      .reduce((agr, val) => (val !== '' ? agr.concat(val) : agr), []);
    })
    .then((lines) => {
      lines.forEach((line) => cliscr.printLine(line));
      return lines;
    })
    .then((lines) => {
      if (lines.length > 0) {
        var line = 'Total '+ lines.length + ' orders';
        if (!allFlag) {
          line += ' in the last 24 hours';
        }
        cliscr.printLine(line);
      }
      else
      {
        var line = 'No orders to show ...';
        cliscr.printLine(line);
      }
    })
    .then(() => callback())
    .catch((err) => {
      helpers.debug_err(debugModule, err);
      callback();
    });
}

cli.responders.moreOrderInfo = (str, callback) => {
  // Show a header for the help page that is as wide as the screen
  cliscr.showHeader('ORDER\'S DETAILS');
  // Get the orderId from the command string
  var arr = str.split('--');
  var orderId = typeof(arr[1]) == 'string' && arr[1].trim().length > 0 ? arr[1] : false;
  if (orderId){
    // Lookup the order data
    _data.readObjectAsync('orders',orderId)
    .then((orderData) => cliscr.printObject(orderData))
    .then(() => callback())
    .catch((err) => {
      helpers.debug_err(debugModule, err);
      callback();
    });
  }
  else
  {
    callback();
  }
}

cli.responders.listUsers = (str, callback) => {
  // Show a header for the help page that is as wide as the screen
  var filterDate = new Date(Date.now());
  filterDate.setUTCHours(-24,0,0,0);

  var arr = str.split('--');
  var allFlag = typeof(arr[1]) == 'string' && arr[1].trim() == 'all' ? true : false;

  cliscr.showHeader('LIST USERS');
  var usersAsync = _data.listFilesAsync('users')
    .then(_data.readFilesObjectAsync)
    .then((usersData) => {
      return usersData.map((usersItem) => {
        var userDateObject = helpers.DateStrToObject(usersItem.signedDate);
        if (allFlag || (userDateObject && userDateObject.getTime() > filterDate.getTime()))
        {
          var userDateFormat = helpers.DateInLocalFormat(usersItem.signedDate);
          var line = 'Email: ' + usersItem.email + ' User\'s Name: ' + usersItem.fullName + ' Date of sign up: ' + userDateFormat;
          return line;
        }
        else
        {
          return '';
        }
      })
      .reduce((agr, val) => (val !== '' ? agr.concat(val) : agr), []);
    })
    .then((lines) => {
      lines.forEach((line) => cliscr.printLine(line));
      return lines;
    })
    .then((lines) => {
      if (lines.length > 0) {
        var line = 'Total '+ lines.length + ' users';
        if (!allFlag) {
          line += ' new signed in the last 24 hours';
        }
        cliscr.printLine(line);
      }
      else
      {
        var line = 'No users to show ...';
        cliscr.printLine(line);
      }
    })
    .then(() => callback())
    .catch((err) => {
      helpers.debug_err(debugModule, err);
      callback();
    });
}

cli.responders.moreUserInfo = (str, callback) => {
  // Show a header for the help page that is as wide as the screen
  cliscr.showHeader('USER\'S DETAIL');
  // Get the userId from the command string
  var arr = str.split('--');
  var userId = typeof(arr[1]) == 'string' && arr[1].trim().length > 0 ? arr[1] : false;
  if (userId){
    // Lookup the user data
    _data.readObjectAsync('users',userId)
    .then((userData) => {
      // Remove password from userData object
      delete userData.hashedPassword;
      cliscr.printObject(userData);
    })
    .then(() => callback())
    .catch((err) => {
      helpers.debug_err(debugModule, err);
      callback();
    });
  }
  else
  {
    callback();
  }
}

cli.responders.exit = () => {
  // Show a header for the help page that is as wide as the screen
  cliscr.showHeader('PIZZA Shop Admin CLI exiting...');
  process.exit(0);
};

// Input processor
cli.processInput = (str, callback) => {
  str = helpers.getNonEmptyStringOrFalse(str);
  // Only process the input if the user actually wrote anything. Otherwise ignore.
  if (str) {
    // Codify the unique strings, that identify the unique questions allowed to be asked
    // * 1. View all the current menu items
    // * 2. View all the recent orders in the system (orders placed in the last 24 hours)
    // * 3. Lookup the details of a specific order by order ID
    // * 4. View all the users who have signed up in the last 24 hours
    // * 5. Lookup the details of a specific user by email address
    var uniqueInputs = [
      'man',
      'help',
      'exit',
      'list menu',
      'list orders',
      'more order info',
      'list users',
      'more user info',
      'cls'
    ];

    // Go through the possible inputs, emit an event when match is found.
    var matchFound = false;
    var counter = 0;
    uniqueInputs.some((input) => {
      if(str.toLowerCase().indexOf(input) > -1){
        matchFound = true;
        // Emit an event matching the unique input, and include the full string given by user
        e.emit(input,str,callback);
        return true;
      }
    });
    if (!matchFound) {
      console.log('Sorry, try again.');
    }
  }
};

// init script
cli.init = () => {
  // Send the start message to the console in dark blue
  console.log('\x1b[34m%s\x1b[0m','The CLI is running');

  // Start the interface
  var _interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'cli>'
  });

  // Create an initial prompt
  _interface.prompt();

  // Handle each line of input separatelly
  _interface.on('line', (str) => {
    // Send to the input processor
    cli.processInput(str, () => {
      // re-initialize the prompt afterwards
      _interface.prompt();
    });
  });

  // if the user stops the CLI, kill the associated process
  _interface.on('close', () => {
    process.exit(0);
  });

};

// export the module
module.exports = cli;
