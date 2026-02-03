const API_KEY = '7cf8535c2aa2c745040de291475c23d2';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const currentYear = 2026; 

let currentPage = 1;
// 2026 ki popularity ke hisab se movies load hongi
let currentUrl = `${BASE_URL}/discover/movie?api_key=${API_KEY}&primary_release_year=${currentYear}&sort_by=popularity.desc`;

const movieGrid = document.getElementById('movie-grid');
const pageNumText = document.getElementById('pageNumber');

async function loadMovies(url, page = 1) {
    const res = await fetch(`${url}&page=${page}`);
    const data = await res.json();
    
    if (data.results) {
        displayMovies(data.results);
        currentPage = page;
        // User ko 7000 pages dikhayega
        pageNumText.innerText = `Page ${currentPage} of 7000`;
    }
}

function displayMovies(movies) {
    movieGrid.innerHTML = '';
    movies.forEach(movie => {
        const title = movie.title || movie.name;
        if (!movie.poster_path) return;

        const card = document.createElement('div');
        card.classList.add('movie-card');
        card.onclick = () => window.location.href = `details.html?id=${movie.id}&type=${movie.title ? 'movie' : 'tv'}`;
        
        card.innerHTML = `
            <div class="hindi-label">HINDI DUBBED</div>
            <div class="quality">4K | 1080p</div>
            <img src="${IMG_URL + movie.poster_path}" alt="${title}">
            <div class="movie-info">
                <h4>${title} (${(movie.release_date || movie.first_air_date || '2026').split('-')[0]})</h4>
                <div class="action-btns">
                    <div class="btn-dl">Download</div>
                    <div class="btn-wt">Watch Online</div>
                </div>
            </div>
        `;
        movieGrid.appendChild(card);
    });
    window.scrollTo(0,0);
}

// Category Filtering logic
function filterMovies(type) {
    if(type === 'bollywood') {
        currentUrl = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_original_language=hi&primary_release_year=${currentYear}`;
    } else if(type === 'south') {
        currentUrl = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_original_language=te|ta|ml|kn&primary_release_year=${currentYear}`;
    } else if(type === 'series') {
        currentUrl = `${BASE_URL}/discover/tv?api_key=${API_KEY}&first_air_date_year=${currentYear}`;
    } else {
        currentUrl = `${BASE_URL}/discover/movie?api_key=${API_KEY}&primary_release_year=${currentYear}&sort_by=popularity.desc`;
    }
    loadMovies(currentUrl, 1);
}

// Search Logic
document.getElementById('searchBtn').addEventListener('click', () => {
    const term = document.getElementById('movieInput').value;
    if(term.trim()) {
        currentUrl = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(term)}`;
        loadMovies(currentUrl, 1);
    }
});

// Pagination Logic
document.getElementById('next').addEventListener('click', () => loadMovies(currentUrl, currentPage + 1));
document.getElementById('prev').addEventListener('click', () => { if(currentPage > 1) loadMovies(currentUrl, currentPage - 1); });

loadMovies(currentUrl, 1);
     // Ye function Popular aur Upcoming movies ko TMDB se mangwayega
async function fetchSpecial(type) {
    currentUrl = `${BASE_URL}/movie/${type}?api_key=${API_KEY}`;
    loadMovies(currentUrl, 1);
    }
            
