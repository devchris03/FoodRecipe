// ------------------- SELECTORES -------------------
const menuBtn = document.querySelector('#menu');
const closeBtn = document.querySelector('#close');
const selectCategorias = document.querySelector('#categorias');

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

            selectCategorias.appendChild(option)
        })
    }
}
