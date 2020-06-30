
/*
// --------------- Promises ---------------
const getUser = new Promise((resolve, reject) => {
    //llamar a una api
    setTimeout(() => {
        resolve('Todo gucci');
    }, 5000);
})

const getUserAll = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('Aqui tambien esta todo gucci');
    }, 3000);
})

getUser
    .then((message) => console.log(message))
    .catch((message) => console.log(message));

Promise.all([getUser, getUserAll])
    .then((message) => console.log(message))
    .catch(() => console.log('error'));
*/

/*
// --------------- Consumo API ---------------
$.ajax('https://jsonplaceholder.typicode.com/todos/1', {
    method: 'GET',
    success: (data) => { console.log('jQuery-ajax', data) },
    error: (error) => { console.log(error) }
});

fetch('https://jsonplaceholder.typicode.com/todos/1')
    .then((response) => response.json())
    .then(data => console.log('fetch', data))
    .catch(() => console.log('hubo un error'));

const getUsers = async () => {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
        const data = await response.json();
        console.log('async-await', data);
    } catch {
        console.log('hubo un error');
    }
}
getUsers();
*/

/*
// --------------- Selectores ---------------
const $home = $('#home .list'); //jQuery
const $home2 = document.getElementById('home'); //Vanilla JS
*/

const $container = document.getElementById('container');
const $form = document.getElementById('form');
const $found = document.getElementById('found');
const $actionContainer = document.querySelector('#action');
const $dramaContainer = document.getElementById('drama');
const $animationContainer = document.getElementById('animation');
//Modal
const $modal = document.getElementById('modal');
const $overlay = document.getElementById('overlay');
const $hideModal = document.getElementById('hide-modal');
const $modalTitle = $modal.querySelector('h1');
const $modalImg = $modal.querySelector('img');
const $modalDescription = $modal.querySelector('p');

const URL_BASE = 'https://yts.mx/api/v2/';
const TYPE_ACCION = 'list_movies.json?genre=action';
const TYPE_ANIMATION = 'list_movies.json?genre=animation';
const TYPE_DRAMA = 'list_movies.json?genre=drama';
const SEARCH_MOVIE = 'list_movies.json?limit=1&query_term=';

const getMovies = async (type) => {
    try {
        const response = await fetch(`${URL_BASE}${type}`);
        const json = await response.json();
        const movies = json.data.movies;
        return movies;
    } catch {
        console.log('error');
    }
}

const searchMovie = async (titleMovie) => {
    try {
        const response = await fetch(`${URL_BASE}${SEARCH_MOVIE}${titleMovie}`);
        const json = await response.json();
        const movies = json.data.movies;
        return movies[0];
    } catch {
        //throw new Error('No se encontró resultados'); -> para generar errores
        alert('No se encontraron resultados');
    }
}

const movieTemplate = (movie) => {
    return (
        `<div class="movie" data-id="${movie.id}">
            <img src="${movie.medium_cover_image}" alt="">
            <p>${movie.title_english}</p>
        </div>`
    )
}

const movieFoundTemplate = (movie) => {
    return (
        `<div class="found">
            <div class="found-image">
                <img src="${movie.medium_cover_image}" width="70" height="100" alt="">
            </div>
            <div class="found-content">
                <p class="found-title">Pelicula encontrada</p>
                <p class="found-album">${movie.title_english}</p>
            </div>
        </div>`
    )
}

const createTemplate = (HTMLString) => {
    const HTML = document.implementation.createHTMLDocument();
    HTML.body.innerHTML = HTMLString;
    return HTML.body.children[0]
}

const showModal = (movie) => {
    $overlay.classList.add('active');
    $modal.style.animation = 'modalIn .8s forwards'

    $modalImg.setAttribute('src', movie.medium_cover_image);
    $modalTitle.textContent = movie.title_english;
    $modalDescription.textContent = movie.description_full;
}

const hideModal = () => {
    $overlay.classList.remove('active');
    $modal.style.animation = 'modalOut .8s forwards'
}

const addEventClick = (element) => {
    element.addEventListener('click', showModal);
    //$('div').on('click', () => { });
}

const setAttributes = ($element, attributes) => {
    for (const attribute in attributes) {
        $element.setAttribute(attribute, attributes[attribute]);
    }
}

const renderMovies = (movies, container) => {
    container.children[0].remove();
    movies.forEach(movie => {
        const HTMLString = movieTemplate(movie)
        const movieElement = createTemplate(HTMLString);
        container.append(movieElement);

        const image = movieElement.querySelector('img');
        image.addEventListener('load', (event) => {
            event.target.classList.add('fadeIn')
        })
        movieElement.addEventListener('click', () => {
            //console.log(movieElement.dataset.id);
            showModal(movie)
        });
        $hideModal.addEventListener('click', hideModal);
    });
}

(async () => {
    let actionMovies = [];
    let animationMovies = [];
    let dramaMovies = [];

    $form.addEventListener('submit', async (event) => {
        event.preventDefault();
        $found.classList.add('active');
        const $loader = document.createElement('img');
        setAttributes($loader, {
            src: './src/img/loader.gif',
            height: 70,
            width: 70,
        })
        $found.append($loader);

        const formData = new FormData($form);
        const movie = await searchMovie(formData.get('name'));
        if (movie !== undefined) {
            const HTMLString = movieFoundTemplate(movie);
            $found.innerHTML = HTMLString;
        }
        $loader.remove();
    })

    actionMovies = JSON.parse(localStorage.getItem('actionMovies'));
    console.log('actionMovies', actionMovies)
    dramaMovies = JSON.parse(localStorage.getItem('dramaMovies'));
    console.log('dramaMovies', dramaMovies)
    animationMovies = JSON.parse(localStorage.getItem('animationMovies'));
    console.log('animationMovies', animationMovies)

    if (actionMovies === null || actionMovies === undefined) {
        actionMovies = await getMovies(TYPE_ACCION);
        renderMovies(actionMovies, $actionContainer);
        localStorage.setItem('actionMovies', JSON.stringify(actionMovies));
    } else {
        renderMovies(actionMovies, $actionContainer);
    }

    if (dramaMovies === null || dramaMovies === undefined) {
        dramaMovies = await getMovies(TYPE_DRAMA);
        renderMovies(dramaMovies, $dramaContainer);
        localStorage.setItem('dramaMovies', JSON.stringify(dramaMovies));
    } else {
        renderMovies(dramaMovies, $dramaContainer);
    }

    if (animationMovies === null || animationMovies === undefined) {
        animationMovies = await getMovies(TYPE_ANIMATION);
        renderMovies(animationMovies, $animationContainer);
        localStorage.setItem('animationMovies', JSON.stringify(animationMovies));
    } else {
        renderMovies(animationMovies, $animationContainer);
    }


})()












