const API_KEY = '7cf8535c2aa2c745040de291475c23d2';
const NEWS_KEY = '1f4f331fc0224ab5b2c2753ad618bea2'; 
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const currentYear = 2026; 

let currentPage = 1;
let currentUrl = BASE_URL + "/discover/movie?api_key=" + API_KEY + "&primary_release_year=" + currentYear + "&sort_by=popularity.desc";

const movieGrid = document.getElementById('movie-grid');
const pageNumText = document.getElementById('pageNumber');
const movieInput = document.getElementById('movieInput');
const suggestionBox = document.getElementById('suggestion-box');

async function loadMovies(url, page = 1) {
    try {
        const res = await fetch(url + "&page=" + page);
        const data = await res.json();
        if (data.results) {
            displayMovies(data.results);
            currentPage = page;
            pageNumText.innerText = "Page " + currentPage + " of 500";
        }
    } catch (err) { console.error("Fetch error"); }
}

function displayMovies(movies) {
    movieGrid.innerHTML = '';
    movies.forEach(movie => {
        const title = movie.title || movie.name;
        if (!movie.poster_path) return;
        const releaseDate = (movie.release_date || movie.first_air_date || '2026').split('-')[0];
        const card = document.createElement('div');
        card.classList.add('movie-card');
        card.onclick = function() { window.location.href = "details.html?id=" + movie.id + "&type=" + (movie.title ? 'movie' : 'tv'); };
        card.innerHTML = `
            <div class="hindi-label">HINDI DUBBED</div>
            <div class="quality">4K | 1080p</div>
            <img src="${IMG_URL + movie.poster_path}" alt="${title}">
            <div class="movie-info">
                <h4>${title} (${releaseDate})</h4>
                <div class="action-btns">
                    <div class="btn-dl">Download</div>
                    <div class="btn-wt">Watch Online</div>
                </div>
            </div>`;
        movieGrid.appendChild(card);
    });
}

movieInput.addEventListener('input', async () => {
    const query = movieInput.value;
    if (query.length > 2) {
        const res = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`);
        const data = await res.json();
        showSuggestions(data.results);
    } else {
        suggestionBox.style.display = 'none';
    }
});

function showSuggestions(list) {
    suggestionBox.innerHTML = '';
    list.slice(0, 5).forEach(item => {
        const div = document.createElement('div');
        div.innerHTML = item.title;
        div.onclick = () => { movieInput.value = item.title; suggestionBox.style.display = 'none'; };
        suggestionBox.appendChild(div);
    });
    suggestionBox.style.display = 'block';
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('active');
    document.getElementById('overlay').classList.toggle('active');
}

async function fetchLiveNews() {
    toggleSidebar();
    movieGrid.innerHTML = '<p style="color:white; text-align:center;">Loading...</p>';
    try {
        const res = await fetch(`https://newsapi.org/v2/everything?q=bollywood&apiKey=${NEWS_KEY}`);
        const data = await res.json();
        movieGrid.innerHTML = '<h2 style="width:100%; color:#ff9d00; text-align:center;">Latest News</h2>';
        data.articles.slice(0, 10).forEach(news => {
            const card = document.createElement('div');
            card.className = 'movie-card';
            card.innerHTML = `<img src="${news.urlToImage}" style="height:150px;"><div class="movie-info"><h4>${news.title}</h4></div>`;
            movieGrid.appendChild(card);
        });
    } catch(e) { console.log("News error"); }
}

loadMovies(currentUrl, 1);
