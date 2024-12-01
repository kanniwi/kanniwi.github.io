const API_URL = "https://edu.std-900.ist.mospolytech.ru/labs/api/dishes"; 
const API_KEY = "7630fae5-737b-4cae-b85d-b7d7c246a48b";
let dishes = []; 
const activeFilters = {};
document.addEventListener('DOMContentLoaded', () => {

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
                console.log(dish);
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
            });

        });
    }

    function filterDishesByKind(category, kind, button) {
        const dishesInCategory = document
            .querySelectorAll(`.grid-container.${category} .dish`);

        if (activeFilters[category] === kind) {
            activeFilters[category] = null;
            dishesInCategory.forEach(dish => dish.classList.remove('hidden'));
            button.classList.remove('active-category');
        } else {
            activeFilters[category] = kind;
            dishesInCategory.forEach(dish => {
                if (dish.dataset.kind === kind) {
                    dish.classList.remove('hidden');
                } else {
                    dish.classList.add('hidden');
                }
            });
            const categoryButtons = button
                .parentElement.querySelectorAll('button');
            categoryButtons.forEach(btn => btn.classList
                .remove('active-category'));
            button.classList.add('active-category');
        }
    }

    const filterButtons = document.querySelectorAll('.menu-category button');
    filterButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const selectedKind = event.target.innerText;
            const kindMap = {
                "вегетарианское": "veg",
                "вегетарианский": "veg",
                "мясное": "meat",
                "мясной": "meat",
                "рыбное": "fish",
                "рыбный": "fish",
                "холодный": "cold",
                "горячий": "hot",
                "маленькая порция": "small",
                "средняя порция": "average",
                "большая порция": "big"
            };
            const category = event.target.closest('.menu-section')
                .querySelector('.grid-container').classList[1];

            filterDishesByKind(category, kindMap[selectedKind], event.target);
        });
    });

    async function loadDishes() {
        try {
            const response = await 
            fetch(API_URL);
            if (!response.ok) {
                throw new 
                Error('Ошибка загрузки данных: ' + response.statusText);
            }
            dishes = await response.json();
            // console.log(dishes);
            displayDishes(); 
        } catch (error) {
            console.error('Ошибка загрузки блюд:', error);
            alert('Не удалось загрузить данные о блюдах. Попробуйте позже.');
        }
    }

    loadDishes(); 
   
});
