const dishes = JSON.parse(localStorage.getItem('dishes')) || [];

function displaySelectedDishes() {
    console.log("Загружаем выбранные блюда...");
    const container = document.querySelector('.grid-container');
    container.innerHTML = '';

    const selectedDishes = JSON
        .parse(localStorage.getItem('selectedDishes')) || {};
    console.log("Выбранные блюда из localStorage:", selectedDishes);

    const selectedDishIds = Object.values(selectedDishes);
    console.log("Идентификаторы выбранных блюд:", selectedDishIds);

    const selectedDishObjects = dishes
        .filter(dish => selectedDishIds.includes(dish.id));
    console.log("Соответствующие объекты блюд:", selectedDishObjects);

    selectedDishObjects.forEach(dish => {
        const dishElement = document.createElement('div');
        dishElement.classList.add('dish');
        dishElement.dataset.dish = dish.id;
        dishElement.innerHTML = `
            <img src="${dish.image}" alt="${dish.name}">
            <p>${dish.price}₽</p>
            <p>${dish.name}</p>
            <p>${dish.count || 1} шт.</p>
        `;
        container.append(dishElement);
    });
}
displaySelectedDishes();
