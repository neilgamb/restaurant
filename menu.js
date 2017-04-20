// Function getMenu()
// ------------------------------------------------------ 
//    Retrieves data from /menu endpoint.  If item is 
//    available, call addItem(item)

function getMenu(){
    let request = new XMLHttpRequest();
    request.open('GET', 'http://tiy-28202.herokuapp.com/menu');
    request.addEventListener('load', function(){

        let response = JSON.parse(request.responseText);

            for(let i = 0; i < response.length; i++){
                    if (response[i].available === true){
                        addItem(response[i]);
                    };
            };
    });

    request.send();
};

// Function addItem()
// ------------------------------------------------------ 
//    For each available object in /menu, creates 'div' 
//    element in the 'menu' section and populates the mustache 
//    template with the applicable properties
//    On 'Menu' page, the button element that is created is an 
//    'Order' button

function addItem(item){
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
        console.log("est");
        request.open('POST', 'http://tiy-28202.herokuapp.com/order');
        request.send(JSON.stringify({
            table_id: 'neilson',
            menu_id: item.id,
        }));
    });
};

window.addEventListener('load', function() {
    getMenu(); 
});

