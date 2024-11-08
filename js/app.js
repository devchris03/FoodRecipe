// ------------------- SELECTORES -------------------
const menuBtn = document.querySelector('#menu');
const closeBtn = document.querySelector('#close');
const select = document.querySelector('#categorias');
const result = document.querySelector('#result');

// ------------------- EVENTOS -------------------
window.addEventListener('load', () => {
    menuBtn.addEventListener('click', handle);
    closeBtn.addEventListener('click', handle);
    startApp();

})

// ------------------- FUNCIONES -------------------

// activa y desactiva menú dezplegable
function handle(event) {
    event.preventDefault();

    const navContent = document.querySelector('.navContent');
    navContent.classList.toggle('active');

    document.querySelector('body').classList.toggle('overflow', navContent.classList.contains('active'))
}


function startApp() {

    // EVENTO
    select.addEventListener('change', selectCategory)

    getCategory()

    // obtener categorias
    function getCategory() {
        const url = "https://www.themealdb.com/api/json/v1/1/categories.php";

        fetch(url)
            .then(result => result.json())
            .then(result => showCategories(result.categories))
    }

    // muestra categorias en el html
    function showCategories(categories = []) {
        categories.forEach(category => {
            const option = document.createElement('OPTION');
            option.value = category.strCategory;
            option.textContent = category.strCategory;

            select.appendChild(option)
        })
    }

    // obtiene lista de platos por categoria
    function selectCategory(event) {
        const nameCategory = event.target.value;
        const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${nameCategory}`;

        fetch(url)
            .then(result => result.json())
            .then(result => showRecipesList(result.meals))
    }


    function showRecipesList(showRecipesList = []) {

        const title = document.createElement('H1');
        title.textContent = "Resultados encontrados"
        title.classList.add('title')
        
        const recipeContent = document.createElement('SECTION');
        recipeContent.classList.add('recipeContent', 'wrapper');

        result.append(title, recipeContent);

        showRecipesList.forEach(recipe => {
            const {idMeal, strMeal, strMealThumb} = recipe;

            const recipeCard = document.createElement('ARTICLE');
            recipeCard.classList.add('recipeCard')
            
            const recipeImg = document.createElement('IMG');
            recipeImg.alt = `Imagen referencial de ${strMeal}`;
            recipeImg.src = strMealThumb;

            const recipeBody = document.createElement('DIV');

            const recipeName = document.createElement('H2');
            recipeName.textContent = strMeal;

            const recipeBtn = document.createElement('BUTTON');
            recipeBtn.classList.add('recipeBtn');
            recipeBtn.textContent = `Ver Receta`;


            // inyectar código al html
            recipeBody.append(recipeName, recipeBtn);
            recipeCard.append(recipeImg, recipeBody);
            recipeContent.appendChild(recipeCard);
        })
    }
}
