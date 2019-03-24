/*
 * PIZZA Shop rest API
 *
 * cart functions
 *
*/

// Dependencies

// Container object for module
var lib = {};

lib.recalculateCart = function(cart){
  cart.totalCount = 0;
  cart.totalPrice = 0;
  cart.cartItems.forEach(function(item){
    cart.totalCount++;
    cart.totalPrice += item.price;
  });
  return cart;
};

lib.createEmptyCart = function(emailParam){
    var emptyCart = {
      'userEmail' : emailParam,
      'totalCount' : 0,
      'totalPrice' : 0,
      'cartItems' : []
    };
    return emptyCart;
};

lib.createInvoice = function(orderNumber, orderDate, userData, cartData){
    var invoice = {
      'orderNumber' : orderNumber,
      'orderDate' : orderDate,
      'customerName' : userData.fullName,
      'customerEmail' : userData.email,
      'shipToAddress' : userData.address,
      'totalCharge' : cartData.totalPrice,
      'totalQuantity' : cartData.totalCount,
      'orderItems' : cartData.cartItems
    };
    return invoice;
};

// Export the module
module.exports = lib;
