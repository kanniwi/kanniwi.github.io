// Получаем элементы select
const soupSelect = document.getElementById('soup');
const mainDishSelect = document.getElementById('main-dish');
const beverageSelect = document.getElementById('beverage');
const orderMessage = document.getElementById('order-message');

// Скрываем все поля формы изначально
soupSelect.style.display = 'none';
mainDishSelect.style.display = 'none';
beverageSelect.style.display = 'none';

// Функция для обновления состояния формы
function updateOrderVisibility() {
    // Проверяем, выбрано ли хотя бы одно блюдо
    const isAnyDishSelected = soupSelect.value || mainDishSelect.value || beverageSelect.value;

    // Если ничего не выбрано, показываем сообщение
    if (!isAnyDishSelected) {
        orderMessage.style.display = 'block'; // Показываем сообщение
        soupSelect.style.display = 'none';
        mainDishSelect.style.display = 'none';
        beverageSelect.style.display = 'none';
    } else {
        orderMessage.style.display = 'none'; // Скрываем сообщение
        soupSelect.style.display = 'block'; // Показываем выбор
        mainDishSelect.style.display = 'block'; // Показываем выбор
        beverageSelect.style.display = 'block'; // Показываем выбор
    }
}

// Добавляем обработчики событий на изменения в селектах
soupSelect.addEventListener('change', updateOrderVisibility);
mainDishSelect.addEventListener('change', updateOrderVisibility);
beverageSelect.addEventListener('change', updateOrderVisibility);

// Инициализируем видимость при загрузке страницы
updateOrderVisibility();
