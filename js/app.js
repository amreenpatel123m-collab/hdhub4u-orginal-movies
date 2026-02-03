const API_KEY = '7cf8535c2aa2c745040de291475c23d2';
let currentPage = 1;
let currentUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc`;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

const movieGrid = document.getElementById('movie-grid');
const pageNumText = document.getElementById('pageNumber');

// Movie Details dikhane ke liye function
function showDetails(id) {
    window.open(`https://www.themoviedb.org/movie/${id}`, '_blank');
}

// Movies Load Karne ka Function
async function loadMovies(url, page = 1) {
    const res = await fetch(`${url}&page=${page}`);
    const data = await res.json();
    displayMovies(data.results);
    currentPage = page;
    pageNumText.innerText = `Page ${currentPage} of 500`;
}

function displayMovies(movies) {
    movieGrid.innerHTML = '';
    movies.forEach(movie => {
        const { title, poster_path, id, release_date } = movie;
        if (!poster_path) return;

        const card = document.createElement('div');
        card.classList.add('movie-card');
        // Click karne par TMDB detail page khulega
        card.onclick = () => showDetails(id); 
        
        card.innerHTML = `
            <div class="quality">720p | 1080p</div>
            <img src="${IMG_URL + poster_path}" alt="${title}">
            <div class="movie-info">
                <h4>${title} (${release_date ? release_date.split('-')[0] : ''})</h4>
                <div class="btn-download">Download</div>
            </div>
        `;
        movieGrid.appendChild(card);
    });
    window.scrollTo(0,0);
}

// Categories Filter System
function filterMovies(type) {
    if(type === 'bollywood') {
        currentUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_original_language=hi`;
    } else if(type === 'hollywood') {
        currentUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_original_language=en`;
    } else if(type === 'south') {
        currentUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_keywords=south_india`;
    } else if(type === 'series') {
        currentUrl = `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}`;
    } else {
        currentUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc`;
    }
    loadMovies(currentUrl, 1);
}

// Search
document.getElementById('searchBtn').addEventListener('click', () => {
    const term = document.getElementById('movieInput').value;
    if(term) {
        currentUrl = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${term}`;
        loadMovies(currentUrl, 1);
    }
});

// Pagination
document.getElementById('next').addEventListener('click', () => loadMovies(currentUrl, currentPage + 1));
document.getElementById('prev').addEventListener('click', () => { if(currentPage > 1) loadMovies(currentUrl, currentPage - 1); });

loadMovies(currentUrl, 1);
