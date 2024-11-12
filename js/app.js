// --------------------- SELECTORES ---------------------
const menuBtn = document.querySelector('#menu');
const closeBtn = document.querySelector('#close');
const result = document.querySelector('#result');

// --------------------- EVENTOS ---------------------
window.addEventListener('load', () => {
    menuBtn.addEventListener('click', handle);
    closeBtn.addEventListener('click', handle);

    startApp();
})

// --------------------- FUNCIONES ---------------------
// Activar y desactivar menu de desplazamiento
function handle(event) {
    event.preventDefault();

    const navContent = document.querySelector('.navContent');
    navContent.classList.toggle('active');

    document.querySelector('body').classList.toggle('overflow', navContent.classList.contains('active'))
}


function startApp() {

    const select = document.querySelector('#categorias');
    select.addEventListener('change', selecCategory);

    const modal = document.querySelector('#modal');
    const closeModal = document.querySelector('#closeModal');
    closeModal.addEventListener('click', handleModal)
    
    getCategories()

    // obtener categorias
    function getCategories() {
        const url = "https://www.themealdb.com/api/json/v1/1/categories.php";

        fetch(url)
            .then(result => result.json())
            .then(result => showCategories(result.categories));
    }


    // muestra categorias en el select
    function showCategories(categories = []) {
        categories.forEach(category => {
            const option = document.createElement('OPTION');
            option.value = category.strCategory;
            option.textContent = category.strCategory;

            select.appendChild(option)
        })
    }

    // selecciona categoria
    function selecCategory(event) {

        if(event.target.value === '') {
            clearContainer(result)

            const image = document.createElement('IMG');
            image.src = "../img/ilustration.svg";
            image.width = "400";
            image.height = "400";
            result.appendChild(image)

            return;
        }

        const nameCategory = event.target.value;
        const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${nameCategory}`;
        
        fetch(url)
            .then(result => result.json())
            .then(result => showMeal(result.meals))
    }


    // agrega platos al html
    function showMeal(meals = []) {
        clearContainer(result)

        const recipeContent = document.createElement('SECTION');
        recipeContent.classList.add('recipeContent', 'wrapper');

        const title = document.createElement('H1');
        title.classList.add('title');
        title.textContent = "Resultados encontrados";

        result.append(title, recipeContent)

        // itera resultado
        meals.forEach(meal => {
            const {idMeal, strMeal, strMealThumb} = meal;

            const recipeCard = document.createElement('ARTICLE');
            recipeCard.classList.add('recipeCard');

            const recipeImg = document.createElement('IMG');
            recipeImg.src = strMealThumb;
            recipeImg.alt = `Imagen referencial del plato ${strMeal}`;

            const recipeName = document.createElement('H2');
            recipeName.textContent = strMeal;

            const recipeBtn = document.createElement('BUTTON');
            recipeBtn.classList.add('btn');
            recipeBtn.textContent = 'Ver receta';
            recipeBtn.onclick = () => selectRecipe(idMeal);

            recipeCard.append(recipeImg, recipeName, recipeBtn);
            recipeContent.appendChild(recipeCard)
        })
    }


    // selecciona receta
    function selectRecipe(id) {
        const url = `https://themealdb.com/api/json/v1/1/lookup.php?i=${id}`;

        fetch(url)
            .then(result => result.json())
            .then(result => showModal(result.meals[0]));
    }

    // muestra modal
    function showModal(recipe) {
        const { idMeal, strInstructions, strMealThumb, strMeal} = recipe;

        const modalTitle = document.querySelector('#modalTitle');
        const modalBody = document.querySelector('#modalBody');

        // inserta contenido personalizado al modal
        modalTitle.textContent = strMeal;
        modalBody.innerHTML = `
            <img src=${strMealThumb} alt="Imagen de referencia de ${strMeal}"/>
            <h3>Instrucciones</h3>
            <p>${strInstructions}</p>
            <h3>Ingredientes y cantidad</h3>
        `;


        // inserta ingredientes y cantidad
        const list = document.createElement('UL');

        for(let i = 1; i <= 20; i++) {
            if(recipe[`strIngredient${i}`]) {
                const ingrediente = recipe[`strIngredient${i}`];
                const cantidad = recipe[`strMeasure${i}`];

                const li = document.createElement('LI');
                li.textContent = `${ingrediente} - ${cantidad}`;

                list.appendChild(li);
            }
        }

        modalBody.appendChild(list);

        const modalButtons = document.querySelector('.modal_buttons');
        clearContainer(modalButtons);

        // crea los botones para el modal
        const btnSave = document.createElement('BUTTON');
        btnSave.textContent = "Guardar favorito";
        btnSave.ariaLabel = "Guardar receta como favorita";
        btnSave.classList.add('btn');
        btnSave.onclick = () => {

            if(existStorage(idMeal)) {
                return;
            }

            addFavorite({
                id: idMeal,
                name: strMeal,
                img: strMealThumb,
            })
        }

        const btnClose = document.createElement('BUTTON');
        btnClose.textContent = "Cerrar";
        btnClose.ariaLabel = "Cerrar receta";
        btnClose.classList.add('btn', 'cerrarbtn');
        btnClose.onclick = () => handleModal();

        modalButtons.append(btnSave, btnClose);

        handleModal();
    }


    // ------------ LOCAL STORAGE ------------

    
    function addFavorite(recipe) {
        // obtenemos datos del localStorage
        const favorite = JSON.parse(localStorage.getItem('favoritos')) ?? [];

        // Agregamos elementos al localStorage
        localStorage.setItem('favoritos', JSON.stringify([...favorite, recipe]));
    }


    function existStorage(id) {
        // obtenemos datos del localStorage
        const favorite = JSON.parse(localStorage.getItem('favoritos')) ?? [];

        // verificamos si existe
        return favorite.some(fav => fav.id === id);
    }


    // manipula modal
    function handleModal() {
        modal.classList.toggle('active');
        document.querySelector('body').classList.toggle('overflow', modal.classList.contains('active'))
    }


    // limpia resultado
    function clearContainer(container) {
        while(container.firstChild){
            container.removeChild(container.firstChild)
        }
    }
}
