/*
 * PIZZA Shop rest API
 *
 * Create router for API handlers
 *
*/

// Dependencies
var apihandlers = require('./api_handlers');

// Container object for module
var router = {};

router.defaultHandler = apihandlers.notFound;

router.publicHandler = apihandlers.public;

router.handlers = {
    '' : apihandlers.index,
    'account/create' : apihandlers.accountCreate,
    'account/edit' : apihandlers.accountEdit,
    'account/deleted' : apihandlers.accountDeleted,
    'account/history' : apihandlers.accountHistory,
    'session/create' : apihandlers.sessionCreate,
    'session/deleted' : apihandlers.sessionDeleted,
    'cart/all' : apihandlers.cartList,
    'cart/add' : apihandlers.cartAdd,
    'cart/edit' : apihandlers.cartEdit,
    'cart/checkout' : apihandlers.cartCheckout,
    'cart/payment' : apihandlers.cartPayment,
    'catalog/all' : apihandlers.catalogList,
    'ping' : apihandlers.ping,
    'api/users' : apihandlers.users,
    'api/tokens' : apihandlers.tokens,
    'api/offer' : apihandlers.offer,
    'api/shopping' : apihandlers.shopping,
    'api/checkout' : apihandlers.checkout,
    'api/payment' : apihandlers.payment,
    'api/orders' : apihandlers.orders,
    'favicon.ico' : apihandlers.favIcon,
    'public' : apihandlers.public
};

router.findHandler = function(path) {
    // if the request is within the public directory, use the public handler instead
    if (path.indexOf('public/') > -1) {
        return router.publicHandler;
    }

    if (typeof(router.handlers[path]) != 'undefined') {
        return router.handlers[path];
    }

    return router.defaultHandler;
};

// Export the module
module.exports = router;
