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
    tbody.innerHTML = ''; // Очистка таблицы

    orderDataArray.forEach((orderData, index) => {
        const categories = [
            { key: 'soup_id', label: '' },
            { key: 'main_course_id', label: '' },
            { key: 'salad_id', label: '' },
            { key: 'drink_id', label: '' },
            { key: 'dessert_id', label: '' }
        ];

        let totalPrice = 0;
        const composition = categories
            .map(category => {
                const dishId = orderData[category.key];
                if (dishId) {
                    const dish = dishes.find(d => d.id === Number(dishId));
                    if (dish) {
                        totalPrice += dish.price;
                        return dish.name;
                    }
                }
                return null;
            })
            .filter(Boolean)
            .join(', ');

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${new Date(orderData.created_at).toLocaleString()}</td>
            <td>${composition || 'Нет данных'}</td>
            <td>${totalPrice}₽</td>
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
    await loadDishes(); 
    allOrders = await fetchAllOrders();
    populateOrderTable(allOrders); 
}

loadAllOrders();

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('order-modal');
    const closeModalButton = document.getElementById('close-modal-btn');
    const closeModalIcon = document.querySelector('.close-modal');

    function openModal(orderData) {
        if (!orderData) {
            console.error("Нет данных заказа для отображения");
            return;
        }
    
        document.getElementById('order-date').textContent = new Date(orderData.created_at).toLocaleString();
        document.getElementById('customer-name').textContent = orderData.full_name || 'Не указано';
        document.getElementById('delivery-address').textContent = orderData.delivery_address || 'Не указано';
        document.getElementById('delivery-time').textContent = orderData.delivery_time || 'Не указано';
        document.getElementById('customer-phone').textContent = orderData.phone || 'Не указано';
        document.getElementById('customer-email').textContent = orderData.email || 'Не указано';
        document.getElementById('order-comment').textContent = orderData.comment || 'Нет комментариев';
    
        const categories = [
            { label: 'Суп', id: 'soup_id' },
            { label: 'Основное блюдо', id: 'main_course_id' },
            { label: 'Салат', id: 'salad_id' },
            { label: 'Напиток', id: 'drink_id' },
            { label: 'Десерт', id: 'dessert_id' }
        ];
    
        let totalPrice = 0;
        const composition = categories
            .map(category => {
                const dish = dishes.find(d => d.id === Number(orderData[category.id]));
                if (dish) {
                    totalPrice += dish.price;
                    return `${category.label}: ${dish.name} (${dish.price}₽)`;
                }
                return null;
            })
            .filter(Boolean)
            .join('<br>');
    
        document.getElementById('order-details').innerHTML = composition || 'Нет данных';
        document.getElementById('order-total').textContent = `${totalPrice}`;
    
        modal.classList.remove('hidden');
    }

    function closeModal() {
        modal.classList.add('hidden');
    }

    closeModalButton.addEventListener('click', closeModal);
    closeModalIcon.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Обработчик на кнопку "Просмотреть"
    document.querySelector('.orders-history').addEventListener('click', (event) => {
        const button = event.target.closest('.icon-eye');
        if (button) {
            const row = button.closest('tr');
            const orderIndex = Number(row.querySelector('td:first-child').textContent) - 1;

            const orderData = allOrders[orderIndex];
            if (orderData) {
                openModal(orderData);
            } else {
                console.error('Заказ не найден для индекса:', orderIndex);
            }
        }
    });

    // Обработчик на кнопку "Удалить"
    document.querySelector('.orders-history').addEventListener('click', async (event) => {
        const deleteButton = event.target.closest('button[title="Удалить"]');
        // console.log(deleteButton);
        if (deleteButton) {
            const row = deleteButton.closest('tr');
            const orderIndex = Number(row.querySelector('td:first-child').textContent) - 1;

            const orderData = allOrders[orderIndex];

            if (orderData && confirm(`Вы уверены, что хотите удалить заказ №${orderIndex + 1}?`)) {
                const isDeleted = await deleteOrder(orderData.id);

                if (isDeleted) {
                    allOrders.splice(orderIndex, 1);
                    populateOrderTable(allOrders);
                }
            }
        }
    });
});

// Функция для удаления заказа
async function deleteOrder(orderId) {
    try {
        const urlWithApiKey = `${API_URL_GET_ORDER}/${orderId}?api_key=${API_KEY}`;
        const response = await fetch(urlWithApiKey, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Ошибка при удалении заказа:', errorData);
            alert(errorData.error || 'Не удалось удалить заказ.');
            return false;
        }

        console.log(`Заказ с ID ${orderId} успешно удален.`);
        return true;
    } catch (error) {
        console.error('Ошибка при удалении заказа:', error);
        alert('Произошла ошибка при удалении заказа. Попробуйте позже.');
        return false;
    }
}
