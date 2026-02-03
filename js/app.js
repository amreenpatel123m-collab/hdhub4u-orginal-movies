const API_KEY = '7cf8535c2aa2c745040de291475c23d2';
let currentPage = 1;
const BASE_URL = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc`;
const SEARCH_URL = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=`;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

const movieGrid = document.getElementById('movie-grid');
const movieInput = document.getElementById('movieInput');
const searchBtn = document.getElementById('searchBtn');
const prev = document.getElementById('prev');
const next = document.getElementById('next');
const pageNumber = document.getElementById('pageNumber');

// Movie Load Function
async function loadMovies(url, page = 1) {
    const res = await fetch(`${url}&page=${page}`);
    const data = await res.json();
    displayMovies(data.results);
    currentPage = page;
    pageNumber.innerText = `Page ${currentPage}`;
    
    // Disable previous button on page 1
    prev.disabled = currentPage <= 1;
}

function displayMovies(movies) {
    movieGrid.innerHTML = '';
    movies.forEach(movie => {
        const { title, poster_path, vote_average } = movie;
        if (!poster_path) return;

        const card = document.createElement('div');
        card.classList.add('movie-card');
        card.innerHTML = `
            <div class="quality">Dual Audio | 720p</div>
            <img src="${IMG_URL + poster_path}" alt="${title}">
            <div class="movie-info">
                <h4>${title}</h4>
                <div class="btn-download">Download Now</div>
            </div>
        `;
        movieGrid.appendChild(card);
    });
    window.scrollTo(0,0); // Page badalne par upar le jaye
}

// Search Logic
searchBtn.addEventListener('click', () => {
    const query = movieInput.value;
    if(query) loadMovies(SEARCH_URL + query, 1);
});

// Next/Prev Buttons Logic
next.addEventListener('click', () => {
    loadMovies(BASE_URL, currentPage + 1);
});

prev.addEventListener('click', () => {
    if(currentPage > 1) loadMovies(BASE_URL, currentPage - 1);
});

// Initial Load
loadMovies(BASE_URL, 1);
                   
