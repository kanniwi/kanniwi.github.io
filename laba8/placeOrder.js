const API_URL = "https://edu.std-900.ist.mospolytech.ru/labs/api/dishes"; 
const API_KEY = "7630fae5-737b-4cae-b85d-b7d7c246a48b";
let dishes = []; 

// Функция для удаления блюда из localStorage
function removeDishFromOrder(key, dishId) {
    localStorage.removeItem(key); // удаляем элемент из localStorage
}

// Функция для удаления блюда из секции "Ваш заказ"
function removeDishFromOrderSection(elementId, dishId) {
    const orderItem = document.getElementById(elementId);
    if (orderItem) {
        // Очищаем информацию о блюде в секции "Ваш заказ"
        orderItem.querySelector('.order-item').textContent = '';
        orderItem.dataset.price = '';
    }
}

// Функция для обновления итоговой стоимости
function updateTotalCost() {
    let totalCost = 0;
    const categories = [
        'selectedSoup', 'selectedMain-course', 
        'selectedSalad', 'selectedDrink', 'selectedDessert'
    ];
    
    categories.forEach(category => {
        const dishId = localStorage.getItem(category);
        if (dishId) {
            const selectedDish = dishes
                .find(dish => dish.id === Number(dishId));
            if (selectedDish) {
                totalCost += selectedDish.price;
            }
        }
    });

    const totalCostElement = document.getElementById('total-cost');
    totalCostElement.textContent = `Стоимость заказа: ${totalCost}₽`;
}


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
                    <button class="remove-dish-button">Удалить</button>
                `;

                gridContainer.appendChild(dishElement);


                dishElement.querySelector('.remove-dish-button')
                    .addEventListener('click', function () {
                        removeDishFromOrder(category.key, selectedDish.id);
                        dishElement.remove(); // удаляем блюдо из DOM
                        removeDishFromOrderSection(category.elementId, 
                            selectedDish.id);
                        updateTotalCost(); // обновляем итоговую стоимость
                    });

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

document.querySelector('form').addEventListener('submit', function (event) {
    const notification = document.createElement('div');
    document.body.appendChild(notification);
    notification.style.position = 'fixed';
    notification.style.top = '50%';
    notification.style.left = '50%';
    notification.style.transform = 'translate(-50%, -50%)';
    notification.style.backgroundColor = '#fff';
    notification.style.border = '1px solid #ccc';
    notification.style.padding = '20px';
    notification.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    notification.style.textAlign = 'center';

    const closeNotification = () => {
        notification.remove();
    };

    const soupId = localStorage.getItem('selectedSoup');
    const mainId = localStorage.getItem('selectedMain-course');
    const saladId = localStorage.getItem('selectedSalad');
    const beverageId = localStorage.getItem('selectedDrink');
    const dessertId = localStorage.getItem('selectedDessert');


    if (!soupId && !mainId && !saladId && !beverageId && !dessertId) {
        notification.innerHTML = `
            <p>Вы не выбрали ни одного блюда.</p>
            <button id="close-notification">Окей &#128076</button>
        `;
        document.getElementById('close-notification')
            .addEventListener('click', closeNotification);
        event.preventDefault();
        return;
    }

    if (((mainId || (soupId && saladId)) && !beverageId)) {
        notification.innerHTML = `
            <p>Выберите напиток</p>
            <button id="close-notification">Окей &#128076</button>
        `;
        document.getElementById('close-notification')
            .addEventListener('click', closeNotification);
        event.preventDefault();
        return;
    }

    if (soupId && (!saladId && !mainId)) {
        notification.innerHTML = `
            <p>Выберите главное блюдо/салат/стартер</p>
            <button id="close-notification">Окей &#128076</button>
        `;
        document.getElementById('close-notification')
            .addEventListener('click', closeNotification);
        event.preventDefault();
        return;
    }

    if (saladId && (!soupId && !mainId)) {
        notification.innerHTML = `
            <p>Выберите суп или главное блюдо</p>
            <button id="close-notification">Окей &#128076</button>
        `;
        document.getElementById('close-notification')
            .addEventListener('click', closeNotification);
        event.preventDefault();
        return;
    }

    if ((saladId || dessertId) && (!mainId && !soupId)) {
        notification.innerHTML = `
            <p>Выберите главное блюдо</p>
            <button id="close-notification">Окей &#128076</button>
        `;
        document.getElementById('close-notification')
            .addEventListener('click', closeNotification);
        event.preventDefault();
        return;
    }

    document.getElementById('hidden-soup-keyword').value = soupId || '';
    document.getElementById('hidden-main-keyword').value = mainId || '';
    document.getElementById('hidden-salad-keyword').value = saladId || '';
    document.getElementById('hidden-beverage-keyword').value = beverageId || '';
    document.getElementById('hidden-dessert-keyword').value = dessertId || '';
});

loadDishes();

