// ------------------------- SELECTORES -------------------------
const menuBtn = document.querySelector('#menu');
const closeBtn = document.querySelector('#close');
const nav = document.querySelector('.navContent');

// ------------------------- EVENTOS -------------------------
window.addEventListener('load', () => {
    menuBtn.addEventListener('click', handle);
    closeBtn.addEventListener('click', handle);
})

// ------------------------- FUNCIONES -------------------------

// activa y desactiva menu desplegable
function handle(event) {
    event.preventDefault();

    nav.classList.toggle('active');

    // verifica el menu esta activado
    document.querySelector('body').classList.toggle('overflow', nav.classList.contains('active'));
}
