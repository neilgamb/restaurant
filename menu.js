// IMPORT SHARED FUNCTION(S)
 
let shared = require('./shared');

// FUNCTION 1 | addItem(item): 
//  - Used in shared.menu() in 'load' event listener below
//  - For each object in /menu, creates 'div' element in the 'menu' 
//    section and populates the mustache template with the applicable 
//    properties
//  - On 'Menu' page, the button element that is created is an 'order'
//    button

function addMenuItem(item){
    let menuTemplate = document.querySelector('#menu-template').innerHTML;

    let parent = document.querySelector('.menu');
    let container = document.createElement('div');
    container.classList.add('menuItem');
    container.innerHTML = Mustache.render(menuTemplate, {
        name: item.name,
        description: item.description,
        price: item.price,
        available: item.available,
    });

    parent.appendChild(container);

    let button = container.querySelector('.order');
    button.addEventListener('click', function(){
        let request = new XMLHttpRequest();
        request.open('POST', 'http://tiy-28202.herokuapp.com/order');
        request.send(JSON.stringify({
            table_id: 'Neilson',
            menu_id: item.id,
        }));
    });
};

// FUNCTION 2 |  getBill()
//  - Retrieves data from /bill?table_id=<table_id> endpoint

function getBill() {
    let request = new XMLHttpRequest();
    request.open('GET', 'http://tiy-28202.herokuapp.com/bill?table_id=neilson');
    request.addEventListener('load', function(){

        let response = JSON.parse(request.responseText);

            for(let i = 0; i < response.items.length; i++){
                        addBill(response.items[i]);
            };
        });

    request.send();
}

// FUNCTION 3 | addBill(table): 
//  - Used in getTables() in 'load' event listener below
//  - For each object in /order, creates 'div' element in the 'orders' 
//    section and populates the mustache template with the applicable 
//    properties

function addBill(item) {

    let billTemplate = document.querySelector('#bill-template').innerHTML;
    let parent = document.querySelector('.bills');
    let container = document.createElement('div');
    container.classList.add('bill');
    container.innerHTML = Mustache.render(billTemplate, {
        description: item.name,
        price: item.price,
        });

    parent.appendChild(container);

};


window.addEventListener('load', function() {
    shared.menu(addMenuItem); 
    getBill();
});

