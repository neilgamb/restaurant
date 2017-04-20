(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// IMPORT SHARED FUNCTION(S)

let shared = require('./shared');

// FUNCTION 1 | addItem(item): 
//  - Used in shared.menu() in 'load' event listener below
//  - For each object in /menu, creates 'div' element in the 'menu' 
//    section and populates the mustache template with the applicable 
//    properties
//  - On 'Kitchen' page, the button element that is created is an 
//    'change availability' button

function addKitchenItem(item){

    let avail;

    if (item.available === true){
        avail = "Available";
    } else {
        avail = "SOLD OUT";
    };

    let menuTemplate = document.querySelector('#menu-template').innerHTML;

    let parent = document.querySelector('.menu');
    let container = document.createElement('div');
    container.classList.add('menuItem');
    container.innerHTML = Mustache.render(menuTemplate, {
        name: item.name,
        description: item.description,
        price: item.price,
        available: avail,
    });

    parent.appendChild(container);


    let button = container.querySelector('.changeAvail');
    button.addEventListener('click', function(){
        let request = new XMLHttpRequest();
        request.open('POST', 'http://tiy-28202.herokuapp.com/menu/'+item.id);
        request.send(JSON.stringify({
            available: !item.available,
        }));
    });
};

// FUNCTION 2 |  getMenu()
//  - Retrieves data from /order endpoint

function getTables() {
    let request = new XMLHttpRequest();
    request.open('GET', 'http://tiy-28202.herokuapp.com/order');
    request.addEventListener('load', function(){

        let response = JSON.parse(request.responseText);

            for(let i = 0; i < response.length; i++){
                 if(response[i].in_progress === true){
                        addTable(response[i]);
                 }
            };
        });

    request.send();
}

// FUNCTION 3 | addItem(item): 
//  - Used in getTables() in 'load' event listener below
//  - For each object in /order, creates 'div' element in the 'orders' 
//    section and populates the mustache template with the applicable 
//    properties

function addTable(item) {

    let progress;

    if (item.in_progress === true){
        progress = "In Progress";
    };

    let ordersTemplate = document.querySelector('#orders-template').innerHTML;
    let parent = document.querySelector('.orders');
    let container = document.createElement('div');
    container.classList.add('table');
    container.innerHTML = Mustache.render(ordersTemplate, {
        tableName: item.table_id,
        in_progress: progress,
        items: item.items,
        });

    parent.appendChild(container);

    let button = container.querySelector('.complete');
    button.addEventListener('click', function(){
        let request = new XMLHttpRequest();
        request.open('POST', 'http://tiy-28202.herokuapp.com/order/'+item.table_id);
        request.send(JSON.stringify({
            in_progress: !item.in_progress,
            }));
        });
};

window.addEventListener('load', function() {
    shared.menuKitchen(addKitchenItem);
    getTables();
});

},{"./shared":2}],2:[function(require,module,exports){
// EXPORT SHARED FUNCTION(S) 

module.exports = {
    menu: getMenu,
    menuKitchen: getMenuKitchen,
};

// FUNCTION |  getMenu()
// Retrieves data from /menu endpoint
//     * used by Menu page only (only available items)

function getMenu(next){
    let request = new XMLHttpRequest();
    request.open('GET', 'http://tiy-28202.herokuapp.com/menu');
    request.addEventListener('load', function(){

        let response = JSON.parse(request.responseText);

            for(let i = 0; i < response.length; i++){
                    if (response[i].available === true){
                        next(response[i]);
                    };
            };
    });

    request.send();
};

// FUNCTION |  getMenuKitchen()
// Retrieves data from /menu endpoint
//     * used by Kitchen page only (all items)

function getMenuKitchen(next){
    let request = new XMLHttpRequest();
    request.open('GET', 'http://tiy-28202.herokuapp.com/menu');
    request.addEventListener('load', function(){

        let response = JSON.parse(request.responseText);

            for(let i = 0; i < response.length; i++){
                        next(response[i]);
            };
    });

    request.send();
};




},{}]},{},[1]);