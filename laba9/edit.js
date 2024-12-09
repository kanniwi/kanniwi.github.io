const API_URL_GET_ORDER = "https://edu.std-900.ist.mospolytech.ru/labs/api/orders";
const API_KEY = "7630fae5-737b-4cae-b85d-b7d7c246a48b";
const API_URL = "https://edu.std-900.ist.mospolytech.ru/labs/api/dishes";
let allOrders = [];

let dishes = [];

async function loadDishes() {
    try {
        const urlWithApiKey = `${API_URL}?api_key=${API_KEY}`;
        const response = await fetch(urlWithApiKey);

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Ошибка загрузки блюд:', errorData);
            alert(errorData.error || 'Ошибка загрузки блюд.');
            return;
        }
        dishes = await response.json();
        console.log('Блюда:', dishes);
    } catch (error) {
        console.error('Ошибка при загрузке блюд:', error);
        alert('Не удалось загрузить данные о блюдах. Попробуйте позже.');
    }
}

async function fetchAllOrders() {
    try {
        const urlWithApiKey = `${API_URL_GET_ORDER}?api_key=${API_KEY}`;
        const response = await fetch(urlWithApiKey);

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Ошибка загрузки заказов:', errorData);
            alert(errorData.error || 'Ошибка загрузки заказов.');
            return [];
        }
        return await response.json();
    } catch (error) {
        console.error('Ошибка при запросе заказов:', error);
        alert('Произошла ошибка при загрузке заказов. Попробуйте позже.');
        return [];
    }
}

function populateOrderTable(orderDataArray) {
    const tbody = document.querySelector('.orders-history tbody');
    tbody.innerHTML = '';

    orderDataArray.forEach((orderData, index) => {
        const categories = [
            { key: 'soup_id', label: '' },
            { key: 'main_course_id', label: '' },
            { key: 'salad_id', label: '' },
            { key: 'drink_id', label: '' },
            { key: 'dessert_id', label: '' }
        ];

        // Собираем состав заказа и рассчитываем общую цену
        let totalPrice = 0; // Инициализируем общую цену для текущего заказа
        const composition = categories
            .map(category => {
                const dishId = orderData[category.key];
                if (dishId) {
                    const dish = dishes.find(d => d.id === Number(dishId));
                    if (dish) {
                        totalPrice += dish.price; // Добавляем цену блюда к общей цене
                        return dish.name; // Возвращаем название блюда
                    }
                }
                return null; // Если блюда нет, возвращаем null
            })
            .filter(Boolean) // Убираем null
            .join(', '); // Соединяем названия блюд через запятую

        // Создаем строку для таблицы
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td> <!-- Порядковый номер вместо id -->
            <td>${new Date(orderData.created_at).toLocaleString()}</td>
            <td>${composition || 'Нет данных'}</td>
            <td>${totalPrice}₽</td> <!-- Используем вычисленную общую цену -->
            <td>${orderData.delivery_time || 'Не указано'}</td>
            <td>
                <button title="Просмотреть"><i class="icon-eye"></i></button>
                <button title="Редактировать"><i class="icon-edit"></i></button>
                <button title="Удалить"><i class="icon-trash"></i></button>
            </td>
        `;
        tbody.appendChild(row);
    });
}


async function loadAllOrders() {
    await loadDishes(); // Сначала загружаем блюда
    allOrders = await fetchAllOrders(); // Загружаем все заказы
    populateOrderTable(allOrders); // Наполняем таблицу
}

loadAllOrders();

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('order-modal');
    const closeModalButton = document.getElementById('close-modal-btn');
    const closeModalIcon = document.querySelector('.close-modal');

    // Функция для открытия модального окна
    function openModal(orderData) {
        if (!orderData) {
            console.error("Нет данных заказа для отображения");
            return;
        }
    
        // Заполняем модальное окно данными заказа
        document.getElementById('order-date').textContent = new Date(orderData.created_at).toLocaleString();
    
    
        document.getElementById('customer-name').textContent = orderData.name || 'Не указано';
        document.getElementById('delivery-address').textContent = orderData.delivery_address || 'Не указано';
        document.getElementById('delivery-time').textContent = orderData.delivery_time || 'Не указано';
        document.getElementById('customer-phone').textContent = orderData.phone || 'Не указано';
        document.getElementById('customer-email').textContent = orderData.email || 'Не указано';
        document.getElementById('order-comment').textContent = orderData.comment || 'Нет комментариев';
    
        // Обрабатываем состав заказа, включая супы
        const composition = [
            { label: 'Суп', id: 'soup_id' },          // Добавлен суп
            { label: 'Основное блюдо', id: 'main_course_id' },
            { label: 'Салат', id: 'salad_id' },
            { label: 'Напиток', id: 'drink_id' },
            { label: 'Десерт', id: 'dessert_id' }
        ]
            .map(category => {
                const dish = dishes.find(d => d.id === Number(orderData[category.id]));
                return dish ? `${category.label}: ${dish.name} (${dish.price}₽)` : null;
            })
            .filter(Boolean)
            .join('<br>');
    
        document.getElementById('order-details').innerHTML = composition || 'Нет данных';
        document.getElementById('order-total').textContent = orderData.total_price || '0';
    
        // Показываем модальное окно
        modal.classList.remove('hidden');
    }
    


    // Функция для закрытия модального окна
    function closeModal() {
        modal.classList.add('hidden');
    }

    // События закрытия модального окна
    closeModalButton.addEventListener('click', closeModal);
    closeModalIcon.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Добавляем обработчик событий на кнопки "Редактировать"
    document.querySelector('.orders-history').addEventListener('click', (event) => {
        const button = event.target.closest('.icon-edit');
        if (button) {
            const row = button.closest('tr'); // Находим строку, в которой находится кнопка
            const orderIndex = Number(row.querySelector('td:first-child').textContent) - 1; // Получаем индекс заказа

            // Получаем данные заказа из массива allOrders
            const orderData = allOrders[orderIndex];

            if (orderData) {
                openModal(orderData); // Открываем модальное окно с данными
            } else {
                console.error('Заказ не найден для индекса:', orderIndex);
            }
        }
    });
});


