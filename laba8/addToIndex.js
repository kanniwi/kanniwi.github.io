const API_URL = "https://edu.std-900.ist.mospolytech.ru/labs/api/dishes"; 
const API_KEY = "7630fae5-737b-4cae-b85d-b7d7c246a48b";
let dishes = []; 
const activeFilters = {};

document.addEventListener('DOMContentLoaded', () => {

    function highlightSelectedDish(dishElement) {
        const selectedSoupId = localStorage.getItem('selectedSoup');
        const selectedMainId = localStorage.getItem('selectedMain-course');
        const selectedBeverageId = localStorage.getItem('selectedDrink');
        const selectedDessertsId = localStorage.getItem('selectedDessert');
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
    
    function getPreviousDishPrice(category) {
        const selectedDishId = localStorage.getItem(`selected${category.charAt(0).toUpperCase() + category.slice(1)}`);
        console.log(selectedDishId);
        if (selectedDishId) {
            const previousDish = dishes.find(dish => dish.id == selectedDishId);
            return previousDish ? previousDish.price : 0;
        }
        return 0;
    }

    function addDishToOrder(event) {
        const dishElement = event.target.closest('.dish'); 
        const dishKeyword = dishElement.dataset.dish; 
        const selectedDish = dishes.find(dish => dish.keyword === dishKeyword); 
        // console.log(localStorage.getItem(`selected${category.charAt(0).toUpperCase() + category.slice(1)}`));

        let orderItem;
        let previousDishPrice = 0; 
    
        removeDishHighlight(selectedDish.category);

    
        // Получаем цену предыдущего блюда из localStorage для соответствующей категории
        
        previousDishPrice = getPreviousDishPrice(selectedDish.category);
        // Обновляем localStorage с выбранным блюдом
        if (selectedDish.category === 'soup') {
            selectedSoup = dishElement;
            localStorage.setItem('selectedSoup', selectedSoup.dataset.id);
        } else if (selectedDish.category === 'main-course') {
            selectedMain = dishElement;
            localStorage.setItem('selectedMain-course', selectedMain.dataset.id);
        } else if (selectedDish.category === 'drink') {
            selectedBeverage = dishElement;
            localStorage.setItem('selectedDrink', selectedBeverage.dataset.id);
        } else if (selectedDish.category === 'dessert') {
            selectedDesserts = dishElement;
            localStorage.setItem('selectedDessert', selectedDesserts.dataset.id);
        } else if (selectedDish.category === 'salad') {
            selectedSalad = dishElement;
            localStorage.setItem('selectedSalad', selectedSalad.dataset.id);
        }
        
    
        // Устанавливаем стиль для выбранного блюда
        dishElement.style.borderColor = 'tomato';  
        dishElement.dataset.price = selectedDish.price;
    
        // Обновляем итоговую стоимость
        totalCost += (selectedDish.price - previousDishPrice); 
    
        // Получаем элемент для отображения итоговой стоимости
        const totalCostElement = document.getElementById('total-cost');
    
        // Обновляем значение в span#total-cost
        totalCostElement.innerText = `${totalCost}₽`; 
    
        // Показываем блок с итоговой стоимостью, если цена больше 0
        const totalCostContainer = document.querySelector('.total-cost');
        if (totalCost > 0) {
            totalCostContainer.classList.remove('hidden');
        } else {
            totalCostContainer.classList.add('hidden');
        }
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
                if (totalCost > 0) {
                    totalCostElement.innerText = `${totalCost}₽`;  
                    document.querySelector('.total-cost')
                        .classList.remove('hidden');
                }
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
