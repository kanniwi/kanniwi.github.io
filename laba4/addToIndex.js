document.addEventListener('DOMContentLoaded', () => {
    function displayDishes() {
        const categories = ["soup", "main", "beverage"];
        let container;

        categories.forEach(category => {
            container = document.querySelector(`.grid-container.${category}`);
            const filteredDishes = dishes
                .filter(dish => dish.category === category)
                .sort((a, b) => a.name.localeCompare(b.name));

            filteredDishes.forEach(dish => {
                const dishElement = document.createElement('div');
                dishElement.classList.add('dish');
                dishElement.dataset.dish = dish.keyword; 
                dishElement.innerHTML = `
                    <img src="${dish.image}" alt="${dish.name}">
                    <p>${dish.price}₽</p>
                    <p>${dish.name}</p>
                    <p>${dish.count}</p>
                    <button>Добавить</button>
                `;
                container.append(dishElement);
                dishElement.addEventListener('click', addDishToOrder);
            });
        });
    }
    displayDishes();
});
