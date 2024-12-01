let totalCost = 0; 
const totalCostElement = document.getElementById('total-cost'); 
let selectedSoup = null;
let selectedMain = null;
let selectedBeverage = null;
let selectedSalad = null;
let selectedDesserts = null;

function addDishToOrder(event) {
    const dishElement = event.target.closest('.dish'); 
    const dishKeyword = dishElement.dataset.dish; 
    const selectedDish = dishes.find(dish => dish.keyword === dishKeyword); 
    let orderItem;
    let previousDishPrice = 0; 

    if (selectedDish.category === 'soup') {
        orderItem = selectedSoup;
        if (selectedSoup) {
            selectedSoup.style.borderColor = '';
            previousDishPrice = parseFloat(selectedSoup.dataset.price) || 0;
        }
        selectedSoup = dishElement;
    } else if (selectedDish.category === 'main-course') {
        orderItem = selectedMain;
        if (selectedMain) {
            selectedMain.style.borderColor = '';
            previousDishPrice = parseFloat(selectedMain.dataset.price) || 0;
        }
        selectedMain = dishElement;
    } else if (selectedDish.category === 'drink') {
        orderItem = selectedBeverage;
        if (selectedBeverage) {
            selectedBeverage.style.borderColor = '';
            previousDishPrice = parseFloat(selectedBeverage.dataset.price) || 0;
        }
        selectedBeverage = dishElement;
    } else if (selectedDish.category === 'dessert') {
        orderItem = selectedDesserts;        
        if (selectedDesserts) {
            selectedDesserts.style.borderColor = '';
            previousDishPrice = parseFloat(selectedDesserts.dataset.price) || 0;
        }
        selectedDesserts = dishElement;
    } else if (selectedDish.category === 'salad') {
        orderItem = selectedSalad;        
        if (selectedSalad) {
            selectedSalad.style.borderColor = '';
            previousDishPrice = parseFloat(selectedSalad.dataset.price) || 0;
        }
        selectedSalad = dishElement;
    }

    dishElement.style.borderColor = 'tomato'; 
    dishElement.dataset.price = selectedDish.price;

    totalCost += (selectedDish.price - previousDishPrice);

    totalCostElement.innerText = `${totalCost}₽`;

}
