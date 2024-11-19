const dishes = [
    {
        keyword: "mushroomSoup",
        name: "Грибной суп-пюре",
        price: 185,
        category: "soup",
        count: "330 г",
        image: "/images/soups/mushroom_soup.jpg",
        kind: "veg"
    },
    {
        keyword: "tomyam",
        name: "Том ям с креветками",
        price: 650,
        category: "soup",
        count: "500 г",
        image: "/images/soups/tomyum.jpg",
        kind: "fish"
    },
    {
        keyword: "gazpacho",
        name: "Гаспачо",
        price: 195,
        category: "soup",
        count: "350 г",
        image: "/images/soups/gazpacho.jpg",
        kind: "veg"
    },
    {
        keyword: "norwegianSoup",
        name: "Норвежский суп",
        price: 270,
        category: "soup",
        count: "330 г",
        image: "/images/soups/norwegian_soup.jpg",
        kind: "fish"
    },
    {
        keyword: "ramen",
        name: "Рамен",
        price: 375,
        category: "soup",
        count: "425 г",
        image: "/images/soups/ramen.jpg",
        kind: "meat"
    },
    {
        keyword: "chicken",
        name: "Куриный суп",
        price: 330,
        category: "soup",
        count: "350 г",
        image: "/images/soups/chicken.jpg",
        kind: "meat"
    },
    {
        keyword: "friedPotatoes",
        name: "Жареная картошка с грибами",
        price: 150,
        category: "main",
        count: "250 г",
        image: "/images/main_course/friedpotatoeswithmushrooms1.jpg",
        kind: "veg"
    },
    {
        keyword: "lasagna",
        name: "Лазанья",
        price: 385,
        category: "main",
        count: "310 г",
        image: "/images/main_course/lasagna.jpg",
        kind: "meat"
    },
    {
        keyword: "chickenCutlets",
        name: "Котлеты из курицы с картофельным пюре",
        price: 225,
        category: "main",
        count: "280 г",
        image: "/images/main_course/chickencutletsandmashedpotatoes.jpg",
        kind: "meat"
    },
    {
        keyword: "fishRice",
        name: "Рыбная котлета с рисом и спаржей",
        price: 320,
        category: "main",
        count: "270 г",
        image: "/images/main_course/fishrice.jpg",
        kind: "fish"
    },
    {
        keyword: "pizza",
        name: "Пицца Маргарита",
        price: 450,
        category: "main",
        count: "470 г",
        image: "/images/main_course/pizza.jpg",
        kind: "veg"
    },
    {
        keyword: "shrimpPasta",
        name: "Паста с креветками",
        price: 340,
        category: "main",
        count: "280 г",
        image: "/images/main_course/shrimppasta.jpg",
        kind: "fish"
    },
    {
        keyword: "orangeJuice",
        name: "Апельсиновый сок",
        price: 120,
        category: "beverage",
        count: "300 мл",
        image: "/images/beverages/orangejuice.jpg",
        kind: "cold"
    },
    {
        keyword: "appleJuice",
        name: "Яблочный сок",
        price: 90,
        category: "beverage",
        count: "300 мл",
        image: "/images/beverages/applejuice.jpg",
        kind: "cold"
    },
    {
        keyword: "carrotJuice",
        name: "Морковный сок",
        price: 110,
        category: "beverage",
        count: "300 мл",
        image: "/images/beverages/carrotjuice.jpg",
        kind: "cold"
    },
    {
        keyword: "cappuccino",
        name: "Капучино",
        price: 180,
        category: "beverage",
        count: "300 мл",
        image: "/images/beverages/cappuccino.jpg",
        kind: "hot"
    },
    {
        keyword: "greenTea",
        name: "Зеленый чай",
        price: 100,
        category: "beverage",
        count: "300 мл",
        image: "/images/beverages/greentea.jpg",
        kind: "hot"
    },
    {
        keyword: "blackTea",
        name: "Черный чай",
        price: 90,
        category: "beverage",
        count: "300 мл",
        image: "/images/beverages/tea.jpg",
        kind: "hot"
    },
    {
        keyword: "saladWithEgg",
        name: "Корейский салат с овощами и яйцом",
        price: 330,
        category: "salad",
        count: "250 г",
        image: "/images/salads_starters/saladwithegg.jpg",
        kind: "veg"
    },
    {
        keyword: "caesar",
        name: "Цезарь с цыпленком",
        price: 370,
        category: "salad",
        count: "220 г",
        image: "/images/salads_starters/caesar.jpg",
        kind: "meat"
    },
    {
        keyword: "caprese",
        name: "Капрезе с моцареллой",
        price: 350,
        category: "salad",
        count: "235 г",
        image: "/images/salads_starters/caprese.jpg",
        kind: "veg"
    },
    {
        keyword: "tunaSalad",
        name: "Салат с тунцом",
        price: 480,
        category: "salad",
        count: "250 г",
        image: "/images/salads_starters/tunasalad.jpg",
        kind: "fish"
    },
    {
        keyword: "frenchFries1",
        name: "Картофель фри с соусом Цезарь",
        price: 280,
        category: "salad",
        count: "235 г",
        image: "/images/salads_starters/frenchfries1.jpg",
        kind: "veg"
    },
    {
        keyword: "frenchFries2",
        name: "Картофель фри с кетчупом",
        price: 260,
        category: "salad",
        count: "235 г",
        image: "/images/salads_starters/frenchfries2.jpg",
        kind: "veg"
    },
    {
        keyword: "baklava",
        name: "Пахлава",
        price: 220,
        category: "desserts",
        count: "300 г",
        image: "/images/desserts/baklava.jpg",
        kind: "average"
    },
    {
        keyword: "cheCheesecake",
        name: "Чизкейк",
        price: 240,
        category: "desserts",
        count: "125 г",
        image: "/images/desserts/checheesecake.jpg",
        kind: "small"
    },
    {
        keyword: "chocolateCheesecake",
        name: "Шоколадный чизкейк",
        price: 260,
        category: "desserts",
        count: "125 г",
        image: "/images/desserts/chocolateCheesecake.jpg",
        kind: "small"
    },
    {
        keyword: "chocolateCake",
        name: "Шоколадный торт",
        price: 270,
        category: "desserts",
        count: "140 г",
        image: "/images/desserts/chocolatecake.jpg",
        kind: "small"
    },
    {
        keyword: "donuts2",
        name: "Пончики (3 штуки)",
        price: 410,
        category: "desserts",
        count: "350 г",
        image: "/images/desserts/donuts2.jpg",
        kind: "average"
    },
    {
        keyword: "donuts",
        name: "Пончики (6 штук)",
        price: 650,
        category: "desserts",
        count: "700 г",
        image: "/images/desserts/donuts.jpg",
        kind: "big"
    }

];
