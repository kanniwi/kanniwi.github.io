const API_URL = "https://edu.std-900.ist.mospolytech.ru/labs/api/dishes"; 
const API_KEY = "7630fae5-737b-4cae-b85d-b7d7c246a48b";
let dishes = []; 
const activeFilters = {};

document.addEventListener('DOMContentLoaded', () => {

    function highlightSelectedDish(dishElement) {
        const selectedSoupId = localStorage.getItem('selectedSoup');
        const selectedMainId = localStorage.getItem('selectedMain');
        const selectedBeverageId = localStorage.getItem('selectedBeverage');
        const selectedDessertsId = localStorage.getItem('selectedDesserts');
        const selectedSaladId = localStorage.getItem('selectedSalad');
    
        const selectedIds = [selectedSoupId, selectedMainId, 
            selectedBeverageId, selectedDessertsId, selectedSaladId];
    
        if (selectedIds.includes(dishElement.dataset.id)) {
            dishElement.style.borderColor = 'tomato';  
            totalCost += dishElement.price;  
        }
    }
    
    function removeDishHighlight(category) {
        const allDishes = document
            .querySelectorAll(`.grid-container.${category} .dish`);
        allDishes.forEach(dish => {
            dish.style.borderColor = '';  
        });
    }
    
    function addDishToOrder(event) {
        const dishElement = event.target.closest('.dish'); 
        const dishKeyword = dishElement.dataset.dish; 
        const selectedDish = dishes.find(dish => dish.keyword === dishKeyword); 
        let orderItem;
        let previousDishPrice = 0; 
    
       
        removeDishHighlight(selectedDish.category);
    
        if (selectedDish.category === 'soup') {
            orderItem = selectedSoup;
            selectedSoup = dishElement;
            localStorage.setItem('selectedSoup', selectedSoup.dataset.id);
        } else if (selectedDish.category === 'main-course') {
            orderItem = selectedMain;
            selectedMain = dishElement;
            localStorage.setItem('selectedMain', selectedMain.dataset.id);
        } else if (selectedDish.category === 'drink') {
            orderItem = selectedBeverage;
            selectedBeverage = dishElement;
            localStorage.setItem('selectedBeverage', 
                selectedBeverage.dataset.id);
        } else if (selectedDish.category === 'dessert') {
            orderItem = selectedDesserts;
            selectedDesserts = dishElement;
            localStorage.setItem('selectedDesserts', 
                selectedDesserts.dataset.id);
        } else if (selectedDish.category === 'salad') {
            orderItem = selectedSalad;
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
    }    


    function displayDishes() {
        const categories = ["soup", "main-course", "salad", "drink", "dessert"];
        let container;

        categories.forEach(category => {
            container = document.querySelector(`.grid-container.${category}`);
            container.innerHTML = ''; 

            const filteredDishes = dishes
                .filter(dish => dish.category === category)
                .sort((a, b) => a.name.localeCompare(b.name));

            filteredDishes.forEach(dish => {
                const dishElement = document.createElement('div');
                dishElement.classList.add('dish');
                dishElement.dataset.dish = dish.keyword;
                dishElement.dataset.kind = dish.kind;
                dishElement.dataset.id = dish.id;
                dishElement.price = dish.price;
                dishElement.innerHTML =
                    `<img src="${dish.image}" alt="${dish.name}">
                    <p>${dish.price}₽</p>
                    <p>${dish.name}</p>
                    <p>${dish.count}</p>
                    <button>Добавить</button>`;
                container.append(dishElement);
                dishElement.addEventListener('click', addDishToOrder);
                
                highlightSelectedDish(dishElement);
            });

        });
    }

    async function loadDishes() {
        try {
            const urlWithApiKey = `${API_URL}?api_key=${API_KEY}`;
            
            const response = await fetch(urlWithApiKey);
    
            if (!response.ok) {
                const errorData = await response.json();
                if (errorData.error) {
                    alert(errorData.error); 
                }
                throw new 
                Error('Ошибка загрузки данных: ' + response.statusText);
            }
            dishes = await response.json();
            displayDishes();
        } catch (error) {
            console.error('Ошибка загрузки блюд:', error);
            alert('Не удалось загрузить данные о блюдах. Попробуйте позже.');
        }
    }

    loadDishes();


});
