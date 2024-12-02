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
            localStorage.removeItem('selectedSoup');
        }
        selectedSoup = dishElement;
        localStorage.setItem('selectedSoup', selectedSoup.dataset.id);
    } else if (selectedDish.category === 'main-course') {
        orderItem = selectedMain;
        if (selectedMain) {
            selectedMain.style.borderColor = '';
            localStorage.removeItem('selectedMain');
        }
        selectedMain = dishElement;
        localStorage.setItem('selectedMain', selectedMain.dataset.id);
    } else if (selectedDish.category === 'drink') {
        orderItem = selectedBeverage;
        if (selectedBeverage) {
            selectedBeverage.style.borderColor = '';
            localStorage.removeItem('selectedBeverage');
        }
        selectedBeverage = dishElement;
        localStorage.setItem('selectedBeverage', selectedBeverage.dataset.id);
    } else if (selectedDish.category === 'dessert') {
        orderItem = selectedDesserts;        
        if (selectedDesserts) {
            selectedDesserts.style.borderColor = '';
            localStorage.removeItem('selectedDesserts');
        }
        selectedDesserts = dishElement;
        localStorage.setItem('selectedDesserts', selectedDesserts.dataset.id);
    } else if (selectedDish.category === 'salad') {
        orderItem = selectedSalad;        
        if (selectedSalad) {
            selectedSalad.style.borderColor = '';
            localStorage.removeItem('selectedSalad');
        }
        selectedSalad = dishElement;
        localStorage.setItem('selectedSalad', selectedSalad.dataset.id);
        
    }

    dishElement.style.borderColor = 'tomato'; 
    dishElement.dataset.price = selectedDish.price;
    if (orderItem !== null) {
        previousDishPrice = orderItem.price || 0;
    }
    totalCost += (selectedDish.price - previousDishPrice);
    document.querySelector('.total-cost').classList.remove('hidden');
    totalCostElement.innerText = `${totalCost}₽`;
    console.log(totalCost);

}
