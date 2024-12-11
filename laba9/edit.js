const API_URL_GET_ORDER = "https://edu.std-900.ist.mospolytech.ru/labs/api/orders";
const API_KEY = "7630fae5-737b-4cae-b85d-b7d7c246a48b";
const API_URL = "https://edu.std-900.ist.mospolytech.ru/labs/api/dishes";
const API_URL_PUT = "https://edu.std-900.ist.mospolytech.ru/labs/api/orders";

let allOrders = [];
let dishes = [];

// Функции
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

    document.getElementById('order-modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('order-modal').classList.add('hidden');
}

function openDeleteConfirmModal(orderData, orderIndex) {
    const modal = document.getElementById('delete-confirm-modal');
    const confirmButton = document.getElementById('confirm-delete-btn');
    const cancelButton = document.getElementById('cancel-delete-btn');

    modal.classList.remove('hidden');

    // Удаляем предыдущие обработчики, если они есть
    confirmButton.onclick = null;
    cancelButton.onclick = null;

    // Назначаем обработчики для кнопок
    confirmButton.onclick = async () => {
        const isDeleted = await deleteOrder(orderData.id);
        if (isDeleted) {
            allOrders.splice(orderIndex, 1);
            populateOrderTable(allOrders);
        }
        modal.classList.add('hidden');
    };

    cancelButton.onclick = () => {
        modal.classList.add('hidden');
    };
}

function openEditModal(orderData, orderIndex) {
    const editModal = document.getElementById('edit-order-modal');

    // Установка значений в поля ввода для редактирования
    document.getElementById('edit-customer-name-input').value = orderData.full_name || '';
    document.getElementById('edit-delivery-address-input').value = orderData.delivery_address || '';
    document.getElementById('edit-delivery-type-asap').checked = !orderData.delivery_time;
    document.getElementById('edit-delivery-type-scheduled').checked = !!orderData.delivery_time;
    document.getElementById('edit-delivery-time-input').value = orderData.delivery_time || '';
    document.getElementById('edit-customer-phone-input').value = orderData.phone || '';
    document.getElementById('edit-customer-email-input').value = orderData.email || '';
    document.getElementById('edit-order-comment-input').value = orderData.comment || '';

    // Установка состава заказа и стоимости
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

    document.getElementById('edit-order-details').innerHTML = composition || 'Нет данных';
    document.getElementById('edit-order-total').textContent = `${totalPrice}`;

    // Показываем модальное окно
    editModal.classList.remove('hidden');

    // Сохраняем изменения
    document.getElementById('save-edit-order').onclick = async function () {
        const updatedOrder = {
            ...orderData,
            full_name: document.getElementById('edit-customer-name-input').value,
            delivery_address: document.getElementById('edit-delivery-address-input').value,
            delivery_time: document.getElementById('edit-delivery-type-scheduled').checked
                ? null
                : document.getElementById('edit-delivery-time-input').value,
            phone: document.getElementById('edit-customer-phone-input').value,
            email: document.getElementById('edit-customer-email-input').value,
            comment: document.getElementById('edit-order-comment-input').value,
        };
    
        const isUpdated = await updateOrder(orderData.id, updatedOrder);
        if (isUpdated) {
            allOrders[orderIndex] = updatedOrder;
            populateOrderTable(allOrders);
            editModal.classList.add('hidden');
        }
    };
    
}
    

function closeEditModal() {
    document.getElementById('edit-order-modal').classList.add('hidden');
}

async function updateOrder(orderId, updatedOrderData) {
    try {
        const response = await fetch(`${API_URL}/${orderId}?api_key=${API_KEY}`, { 
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedOrderData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Ошибка обновления заказа:", errorText);
            alert("Не удалось сохранить изменения. Попробуйте еще раз.");
            return false;
        }

        console.log("Успешное обновление заказа:", await response.json());
        alert("Изменения успешно сохранены!");
        return true;
    } catch (error) {
        console.error("Ошибка сети при обновлении заказа:", error);
        alert("Произошла ошибка сети. Проверьте соединение.");
        return false;
    }
}


async function deleteOrder(orderId) {
    try {
        const urlWithApiKey = `${API_URL_GET_ORDER}/${orderId}?api_key=${API_KEY}`;
        const response = await fetch(urlWithApiKey, { method: 'DELETE' });

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

async function updateOrder(orderId, updatedOrder) {
    try {
        const urlWithApiKey = `${API_URL_GET_ORDER}/${orderId}?api_key=${API_KEY}`;
        const response = await fetch(urlWithApiKey, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedOrder)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Ошибка при обновлении заказа:', errorData);
            alert(errorData.error || 'Не удалось обновить заказ.');
            return false;
        }

        console.log(`Заказ с ID ${orderId} успешно обновлен.`);
        return true;
    } catch (error) {
        console.error('Ошибка при обновлении заказа:', error);
        alert('Произошла ошибка при обновлении заказа. Попробуйте позже.');
        return false;
    }
}

async function loadAllOrders() {
    await loadDishes();
    allOrders = await fetchAllOrders();
    populateOrderTable(allOrders);
}


function initializeEventListeners() {
    document.getElementById('close-modal-btn').addEventListener('click', closeModal);
    document.querySelector('.close-modal').addEventListener('click', closeModal);

    document.querySelector('#edit-order-modal .close-modal').addEventListener('click', closeEditModal);
    document.querySelector('#cancel-edit-order').addEventListener('click', closeEditModal);


    document.querySelector('.orders-history').addEventListener('click', (event) => {
        const editButton = event.target.closest('button[title="Редактировать"]');
        const viewButton = event.target.closest('.icon-eye');
        const deleteButton = event.target.closest('button[title="Удалить"]');
    
        const row = event.target.closest('tr');
        if (!row) return;
        const orderIndex = Number(row.querySelector('td:first-child').textContent) - 1;
        const orderData = allOrders[orderIndex];
    
        if (editButton) {
            openEditModal(orderData, orderIndex);
        } else if (viewButton) {
            openModal(orderData);
        } else if (deleteButton && orderData) {
            openDeleteConfirmModal(orderData, orderIndex);
        }
    });
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    loadAllOrders();
    initializeEventListeners();
});
