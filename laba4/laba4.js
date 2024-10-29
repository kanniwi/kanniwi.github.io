const dishes = [
    {
        keyword: "gazpacho",
        name: "Гаспачо",
        price: 195,
        category: "soup",
        count: "350 г",
        image: "/images/gazpacho.jpg"
    },
    {
        keyword: "mushroomSoup",
        name: "Грибной суп-пюре",
        price: 185,
        category: "soup",
        count: "330 г",
        image: "/images/mushroom_soup.jpg"
    },
    {
        keyword: "norwegianSoup",
        name: "Норвежский суп",
        price: 270,
        category: "soup",
        count: "330 г",
        image: "/images/norwegian_soup.jpg"
    },
    {
        keyword: "friedPotatoes",
        name: "Жареная картошка с грибами",
        price: 150,
        category: "main",
        count: "250 г",
        image: "/images/friedpotatoeswithmushrooms1.jpg"
    },
    {
        keyword: "lasagna",
        name: "Лазанья",
        price: 385,
        category: "main",
        count: "310 г",
        image: "/images/lasagna.jpg"
    },
    {
        keyword: "chickenCutlets",
        name: "Котлеты из курицы с картофельным пюре",
        price: 225,
        category: "main",
        count: "280 г",
        image: "/images/chickencutletsandmashedpotatoes.jpg"
    },
    {
        keyword: "orangeJuice",
        name: "Апельсиновый сок",
        price: 120,
        category: "beverage",
        count: "300 мл",
        image: "/images/orangejuice.jpg"
    },
    {
        keyword: "appleJuice",
        name: "Яблочный сок",
        price: 90,
        category: "beverage",
        count: "300 мл",
        image: "/images/applejuice.jpg"
    },
    {
        keyword: "carrotJuice",
        name: "Морковный сок",
        price: 110,
        category: "beverage",
        count: "300 мл",
        image: "/images/carrotjuice.jpg"
    }
];


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

            const addButton = dishElement.querySelector('button');
            addButton.addEventListener('click', addDishToOrder);
        });
    });
}

let totalCost = 0;
const orderList = document.querySelector('.your-order');
let totalCostElement; 

const soupSelect = document.getElementById('soup');
const mainDishSelect = document.getElementById('main-dish');
const beverageSelect = document.getElementById('beverage');

const noSelectionMessage = document.getElementById('no-selection-message');

function addDishToOrder(event) {
    
    const dishElement = event.target.closest('.dish');
    const keyword = dishElement.dataset.dish; 
    const selectedDish = dishes.find(dish => dish.keyword === keyword);

    
    let selectElement;
    if (selectedDish.category === 'soup') {
        selectElement = document.getElementById('soup');
    } else if (selectedDish.category === 'main') {
        selectElement = document.getElementById('main-dish');
    } else if (selectedDish.category === 'beverage') {
        selectElement = document.getElementById('beverage');
    }

    
    if (selectElement.value) {
        const previousKeyword = selectElement.value; 
        const previousDish = dishes.find(dish => dish.keyword === previousKeyword); 
        if (previousDish) {
            totalCost -= previousDish.price; 
            
            
            const previousDishElement = document.querySelector(`.dish[data-dish="${previousKeyword}"]`);
            if (previousDishElement) {
                previousDishElement.style.borderColor = ''; 
            }
        }
    }

   
    totalCost += selectedDish.price;
    
    
    if (!totalCostElement) {
        totalCostElement = document.createElement('p');
        totalCostElement.classList.add('total-cost');
        orderList.appendChild(totalCostElement); 
    }

    
    totalCostElement.innerText = `Итоговая стоимость: ${totalCost}₽`;

    
    dishElement.style.borderColor = 'tomato'; 


    if (selectElement) {
        selectElement.value = keyword; 
    }

    const labels = document.querySelectorAll('label.hidden');
    const selects = document.querySelectorAll('select.hidden');

    
    
    labels.forEach(label => label.classList.remove('hidden'));
    selects.forEach(select => select.classList.remove('hidden'));
    noSelectionMessage.classList.add('hidden');


}


displayDishes();




// --------------------------------------------------------------------------------------------------------


