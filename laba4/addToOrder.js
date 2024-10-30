const noSelectionMessage = document.getElementById('no-selection-message');
let totalCost = 0; 
const totalCostElement = document.getElementById('total-cost'); 
let selectedSoup = null;
let selectedMain = null;
let selectedBeverage = null;

function addDishToOrder(event) {

    const dishElement = event.target.closest('.dish'); 
    const dishKeyword = dishElement.dataset.dish; 
    const selectedDish = dishes.find(dish => dish.keyword === dishKeyword); 


    let orderItem;
    if (selectedDish.category === 'soup') {
        orderItem = document.getElementById('soup-item');
        

        if (selectedSoup) {
            selectedSoup.style.borderColor = '';
        }
        selectedSoup = dishElement; 
    } else if (selectedDish.category === 'main') {
        orderItem = document.getElementById('main-item');
        

        if (selectedMain) {
            selectedMain.style.borderColor = ''; 
        }
        selectedMain = dishElement; 
    } else if (selectedDish.category === 'beverage') {
        orderItem = document.getElementById('beverage-item');
        

        if (selectedBeverage) {
            selectedBeverage.style.borderColor = ''; 
        }
        selectedBeverage = dishElement; 
    }


    dishElement.style.borderColor = 'tomato'; 


    document.querySelectorAll('.your-order p.hidden').forEach(header => {
        header.classList.remove('hidden');
    });


    noSelectionMessage.classList.add('hidden');


    const previousDishPrice = parseFloat(orderItem.dataset.price) || 0;
    orderItem.querySelector('.order-item').textContent = `${selectedDish.name} - ${selectedDish.price}₽`;
    orderItem.dataset.price = selectedDish.price; 


    totalCost += (selectedDish.price - previousDishPrice);


    totalCostElement.innerText = `Стоимость заказа: ${totalCost}₽`;
    totalCostElement.classList.remove('hidden'); 


    const soupItem = document.getElementById('soup-item');
    const mainItem = document.getElementById('main-item');
    const beverageItem = document.getElementById('beverage-item');


    if (soupItem.querySelector('.order-item').textContent.trim() === "") {
        soupItem.querySelector('.order-item').textContent = "Блюдо не выбрано";
    }
    if (mainItem.querySelector('.order-item').textContent.trim() === "") {
        mainItem.querySelector('.order-item').textContent = "Блюдо не выбрано";
    }
    if (beverageItem.querySelector('.order-item').textContent.trim() === "") {
        beverageItem.querySelector('.order-item').textContent = "Напиток не выбран";
    }
}



