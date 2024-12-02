const API_URL = "https://edu.std-900.ist.mospolytech.ru/labs/api/dishes"; 
const API_KEY = "7630fae5-737b-4cae-b85d-b7d7c246a48b";
let dishes = []; 

function displayOrderFromLocalStorage() {
    if (!dishes || dishes.length === 0) {
        console.error('Блюда еще не загружены.');
        return;
    }

    const gridContainer = document.querySelector('.grid-container');
    gridContainer.innerHTML = '';
    const categories = [
        { key: 'selectedSoup', elementId: 
            'soup-item', headerClass: 'soup-header' },
        { key: 'selectedMain-course', elementId: 
            'main-item', headerClass: 'main-header' },
        { key: 'selectedSalad', elementId: 
            'salad-item', headerClass: 'salad-header' },
        { key: 'selectedDrink', elementId: 
            'beverage-item', headerClass: 'beverage-header' },
        { key: 'selectedDessert', elementId: 
            'desserts-item', headerClass: 'desserts-header' }
    ];

    let totalCost = 0;
    const totalCostElement = document.getElementById('total-cost');
    const noSelectionMessage = document.getElementById('no-selection-message');
    let hasSelection = false;

    categories.forEach(category => {
        const dishId = localStorage.getItem(category.key);
    
        if (dishId) {
            const selectedDish = dishes
                .find(dish => dish.id === Number(dishId));
    
            if (selectedDish) {
                hasSelection = true;
                const dishElement = document.createElement('div');
                dishElement.classList.add('dish');
                dishElement.dataset.dish = selectedDish.keyword;
                dishElement.dataset.kind = selectedDish.kind;
                dishElement.dataset.id = selectedDish.id;
                dishElement.price = selectedDish.price;
    
                dishElement.innerHTML = `
                    <img src="${selectedDish.image}" alt="${selectedDish.name}">
                    <p>${selectedDish.price}₽</p>
                    <p>${selectedDish.name}</p>
                    <p>${selectedDish.count || 0}</p>
                    <button>Удалить</button>
                `;

                gridContainer.appendChild(dishElement);
    
                // обновляем секцию ваш заказ
                const orderItem = document.getElementById(category.elementId);
                orderItem.querySelector('.order-item').textContent = 
                `${selectedDish.name} - ${selectedDish.price}₽`;
                orderItem.dataset.price = selectedDish.price;
                
                document.querySelectorAll('.your-order p.hidden')
                    .forEach(header => {
                        header.classList.remove('hidden');
                    });
    
                totalCost += selectedDish.price;
            }
        }
    });
    

    if (hasSelection) {
        noSelectionMessage.classList.add('hidden');
        totalCostElement.textContent = `Стоимость заказа: ${totalCost}₽`;
        totalCostElement.classList.remove('hidden');
    } else {
        noSelectionMessage.classList.remove('hidden');
        totalCostElement.classList.add('hidden');
    }
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
        displayOrderFromLocalStorage();
    } catch (error) {
        console.error('Ошибка загрузки блюд:', error);
        alert('Не удалось загрузить данные о блюдах. Попробуйте позже.');
    }
}

loadDishes();