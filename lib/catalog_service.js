/*
 * PIZZA Shop rest API
 *
 * Catalog service module
 *
*/

// Dependencies
var helpers = require('./helpers');
var errors = require('./errors');
var _data = require('./_data');
var _tokens = require('./_tokens');
var util = require('util');
var debugModule = util.debuglog('service');

// Container object for module
var service = {};

service.createPiizaCatalog = function(callback){
    var catalogPizza = [
        {
            "id" : "100",
            "name" : "FOCACCIA CON PARMIGIANO",
            "czech" : "pizza chléb s olivovým olejem,česnekem a parmezánem",
            "english" : "focaccia with olive oil,garlic and Parmesan cheese",
            "price" : "79"
        },
        {
            "id" : "101",
            "name" : "MARGHERITA",
            "czech" : "drcená rajčata,mozzarella,čerstvá bazalka",
            "english" : "passata,mozzarella,fresh basil",
            "price" : "135"
        },
        {
            "id" : "102",
            "name" : "FUNGHI",
            "czech" : "drcená rajčata,mozzarella,žampióny,česnek,oregano",
            "english" : "passata,mozzarella,champignons,garlic,oregano",
            "price" : "149"
        },
        {
            "id" : "103",
            "name" : "PROSCIUTTO",
            "czech" : "drcená rajčata,mozzarella,šunka,oregano",
            "english" : "passata,mozzarella,ham,oregano",
            "price" : "149"
        },
        {
            "id" : "104",
            "name" : "PROSCIUTTO E FUNGHI",
            "czech" : "drcená rajčata,mozzarella,žampióny,šunka,česnek,oregano",
            "english" : "passata,mozzarella,champignons,ham,garlic,oregano",
            "price" : "149"
        },
        {
            "id" : "105",
            "name" : "SALERNO",
            "czech" : "drcená rajčata,mozzarella,paprikový salám,oregano",
            "english" : "passata,mozzarella,spicy salami,oregano",
            "price" : "149"
        },
        {
            "id" : "106",
            "name" : "QUATTRO STAGIONI",
            "czech" : "drcená rajčata,mozzarella,šunka,paprikový salám,žampiony",
            "english" : "passata,mozzarella,ham,spicy salami,champignons",
            "price" : "175"
        },
        {
            "id" : "107",
            "name" : "PANCETTA",
            "czech" : "drcená rajčata,mozzarella,slanina,cibule,žampióny,kukuřice",
            "english" : "passata,mozzarella,bacon,onion,champignons,sweet corn",
            "price" : "169"
        },
        {
            "id" : "108",
            "name" : "HAWAII",
            "czech" : "drcená rajčata,mozzarella,šunka,ananas",
            "english" : "passata,mozzarella,ham,pineapple",
            "price" : "155"
        },
        {
            "id" : "109",
            "name" : "RAGUSA",
            "czech" : "smetana,mozzarella,kuřecí maso,kari,hrášek,žampiony",
            "english" : "cream,mozzarella,chicken,curry,peas,champignons",
            "price" : "175"
        },
        {
            "id" : "110",
            "name" : "TONNO",
            "czech" : "drcená rajčata,mozarella,tuňák,cibule,olivy,vejce",
            "english" : "passata,mozzarella,tuna fish,onion,olives,eggs",
            "price" : "175"
        },
        {
            "id" : "111",
            "name" : "VEGETARIANA",
            "czech" : "drcená rajčata, mozzarella, brokolice, kukuřice, černé olivy, červená paprika",
            "english" : "passata,mozzarella, broccoli, corn, black olives, red bell pepper",
            "price" : "155"
        },
        {
            "id" : "112",
            "name" : "PIZZA CON GAMBERETTI",
            "czech" : "smetana, mozzarella, krevety, kozí sýr, sušená rajčata, bazalkové pesto",
            "english" : "cream, mozzarella, shrimps, goat´s cheese, dried tomatoes, basil pesto",
            "price" : "205"
        },
        {
            "id" : "113",
            "name" : "CAPRICCIOSA",
            "czech" : "drcená rajčata,mozzarella,šunka,žampiony,artyčoky,olivy,oregáno",
            "english" : "passata,mozzarella,ham,champignons,artichokes,olives,oregano",
            "price" : "175"
        },
        {
            "id" : "114",
            "name" : "MESSICANA",
            "czech" : "drcená rajčata,mozzarella,paprikový salám,cibule,vejce,jalapenos papričky",
            "english" : "passata,mozzarella,spicy salami,onion,eggs,jalapenos",
            "price" : "165"
        },
        {
            "id" : "115",
            "name" : "QUATTRO FORMAGGI",
            "czech" : "smetana, mozzarella, ricotta, parmezán, gorgonzola",
            "english" : "cream, mozzarella, ricotta, gorgonzola, parmiggiano",
            "price" : "175"
        },
        {
            "id" : "116",
            "name" : "POPAY",
            "czech" : "drcená rajčata,mozzarella,slanina,listový špenát,cibule,česnek",
            "english" : "passata,mozzarella,bacon,spinach,onion,garlic",
            "price" : "169"
        },
        {
            "id" : "117",
            "name" : "BOLZANO",
            "czech" : "drcená rajčata,smetana,kuřecí maso,mozzarella,listový špenát,česnek",
            "english" : "passata,cream,chicken,mozarella,spinach,garlic",
            "price" : "175"
        },
        {
            "id" : "118",
            "name" : "AL CAPONE",
            "czech" : "smetana,mozzarella,listový špenát,šunka,vařené vejce natvrdo,česnek",
            "english" : "cream,mozzarella,spinach,ham,boiled egg,garlic",
            "price" : "165"
        },
        {
            "id" : "119",
            "name" : "SALAME VALPOLICELLA PICCANTE",
            "czech" : "drcená rajčata,salám Valpolicella,cibule,parmezán",
            "english" : "passata,Valpolicella salami,onion,Parmesan cheese",
            "price" : "165"
        },
        {
            "id" : "120",
            "name" : "PROSCIUTTO DI PARMA",
            "czech" : "drcená rajčata, mozzarella, parmská šunka, rukola, olivy",
            "english" : "passata, mozzarella, prosciutto di Parma, arugula, olives",
            "price" : "195"
        },
        {
            "id" : "121",
            "name" : "SALMONE E SPINACI",
            "czech" : "smetana, mozzarella, marinovaný losos, listový špenát, citron",
            "english" : "cream, mozzarella, marinated salmon, spinach, lemon",
            "price" : "195"
        },
        {
            "id" : "122",
            "name" : "CARPACCIO",
            "czech" : "smetana, mozzarella, tenké plátky marinované hovězí svíčkové, parmezán, kapari se stopkou, rukola, citron",
            "english" : "cream, mozzarella, marinated beef tenderloin slices, Parmesan cheese, capers, aragula, lemon",
            "price" : "195"
        }
   ];

    var offerCatalog = [];
    catalogPizza.forEach(function(pizza){
        var initObject = {
            'id' : pizza.id,
            'name' : pizza.name,
            'mixtureCzech' : pizza.czech,
            'mixtureEnglish' : pizza.english,
            'price' : helpers.getValidIntNumberOrFalse(pizza.price)
        };
        offerCatalog.push(initObject);
    });
    callback(offerCatalog);
};

service.createSweetCatalog = function(callback){
    var catalogSweet = [
        {
            "id" : "500",
            "name" : "FONDANT DI CIOCCOLATO",
            "czech" : "čokoládový fondant s limetkovo-smetanovou omáčkou a vanilkovou zmrzlinou",
            "english" : "chocolate fondant with lime-cream sauce and vanilla ice cream",
            "price" : "85"
        }
    ];

    var offerCatalog = [];
    catalogSweet.forEach(function(sweet){
        var initObject = {
            'id' : sweet.id,
            'name' : sweet.name,
            'mixtureCzech' : sweet.czech,
            'mixtureEnglish' : sweet.english,
            'price' : helpers.getValidIntNumberOrFalse(sweet.price)
        };
        offerCatalog.push(initObject);
    });
    callback(offerCatalog);
};

// SUCCESS: callback to caller (ok=false)
// FAILURE: callback to caller (err=errorObject)
service.initPiizaCatalog = function(callback){
    var pizzaCatalog = service.createPiizaCatalog(function(catalog){
        _data.read('catalog', 'pizzas', function(err, data){
            if (!err && data) {
                _data.delete('catalog', 'pizzas', function(err){
                    if (!err) {
                        _data.create('catalog', 'pizzas', catalog,function(err){
                            if (!err) {
                                helpers.debug_ok(debugModule, errors.OkCreate("The pizza's catalog deleted"));
                                callback(false);
                            }else{
                                callback(errors.ErrCreate("Could not create the pizza's catalog"));
                            }
                        });
                    }else{
                        callback(errors.ErrCreate("Could not delete the pizza's catalog"));
                    }
                });
            } else {
                _data.create('catalog', 'pizzas', catalog,function(err){
                    if (!err) {
                        callback(false);
                    }else{
                        callback(errors.ErrCreate("Could not create the pizza's catalog"));
                    }
                });
            }
        });
    });
};

// SUCCESS: callback to caller (ok=false)
// FAILURE: callback to caller (err=errorObject)
service.initSweetCatalog = function(callback){
    var pizzaCatalog = service.createSweetCatalog(function(catalog){
        _data.read('catalog', 'sweets', function(err, data){
            if (!err && data) {
                _data.delete('catalog', 'sweets', function(err){
                    if (!err) {
                        _data.create('catalog', 'sweets', catalog,function(err){
                            if (!err) {
                                helpers.debug_ok(debugModule, errors.OkCreate("The sweet's catalog deleted"));
                                callback(false);
                            }else{
                                callback(errors.ErrCreate("Could not create the sweet's catalog"));
                            }
                        });
                    }else{
                        callback(errors.ErrCreate("Could not delete the sweet's catalog"));
                    }
                });
            } else {
                _data.create('catalog', 'sweets', catalog,function(err){
                    if (!err) {
                        callback(false);
                    }else{
                        callback(errors.ErrCreate("Could not create the sweet's catalog"));
                    }
                });
            }
        });
    });
};

// Export the module
module.exports = service;
