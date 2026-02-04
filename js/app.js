const API_KEY = '7cf8535c2aa2c745040de291475c23d2'; // TMDB Key
const NEWS_KEY = '1f4f331fc0224ab5b2c2753ad618bea2'; // Aapki New API Key
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

let currentPage = 1;
let currentUrl = `${BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc`;

// Sidebar Toggle
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const closeMenu = document.getElementById('closeMenu');

function toggleSidebar() {
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

menuToggle.onclick = toggleSidebar;
closeMenu.onclick = toggleSidebar;
overlay.onclick = toggleSidebar;

// 1. Movie Loading Function (Purana Logic)
async function loadMovies(url, page = 1) {
    const movieGrid = document.getElementById('movie-grid');
    movieGrid.innerHTML = '<div class="spinner"></div>';
    try {
        const res = await fetch(`${url}&page=${page}`);
        const data = await res.json();
        displayMovies(data.results);
        currentPage = page;
        document.getElementById('pageNumber').innerText = "Page " + currentPage;
    } catch (err) { console.error("Error loading movies"); }
}

function displayMovies(movies) {
    const movieGrid = document.getElementById('movie-grid');
    movieGrid.innerHTML = '';
    movies.forEach(movie => {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.onclick = () => window.location.href = `details.html?id=${movie.id}&type=${movie.title ? 'movie' : 'tv'}`;
        card.innerHTML = `
            <div class="hindi-label">HINDI DUBBED</div>
            <img src="${movie.poster_path ? IMG_URL + movie.poster_path : 'https://via.placeholder.com/200x300'}">
            <div class="movie-info">
                <h4>${movie.title || movie.name}</h4>
                <div class="action-btns"><div class="btn-dl">Download</div><div class="btn-wt">Watch</div></div>
            </div>`;
        movieGrid.appendChild(card);
    });
}

// 2. NEW: News API Function (Using your Key)
async function fetchLiveNews() {
    toggleSidebar(); // Menu band karein
    const movieGrid = document.getElementById('movie-grid');
    movieGrid.innerHTML = '<div class="spinner"></div><p style="text-align:center;width:100%">Loading Latest Bollywood & Cricket News...</p>';
    
    const url = `https://newsapi.org/v2/everything?q=bollywood+cricket&language=hi&sortBy=publishedAt&apiKey=${NEWS_KEY}`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        movieGrid.innerHTML = '<h2 style="width:100%; text-align:center; color:#ff9d00; margin:20px 0;">🔥 Live Cinema & Sports News</h2>';
        
        data.articles.slice(0, 18).forEach(article => {
            const card = document.createElement('div');
            card.className = 'movie-card';
            card.style.height = "auto";
            card.innerHTML = `
                <span class="news-tag" style="position:absolute; top:10px; left:10px; background:#ff9d00; padding:2px 5px; color:black; font-size:10px; border-radius:3px; z-index:10;">LATEST NEWS</span>
                <img src="${article.urlToImage || 'https://via.placeholder.com/300x200'}" style="height:150px; object-fit:cover;">
                <div class="movie-info" style="text-align:left; padding:10px;">
                    <h4 style="font-size:12px; height:auto; color:white;">${article.title}</h4>
                    <p style="font-size:10px; color:#aaa; margin:5px 0;">Source: ${article.source.name}</p>
                    <a href="${article.url}" target="_blank" style="color:#ff9d00; font-size:11px; text-decoration:none; font-weight:bold;">READ MORE →</a>
                </div>`;
            movieGrid.appendChild(card);
        });
    } catch (e) {
        movieGrid.innerHTML = '<p style="text-align:center;width:100%">News currently unavailable. Try later!</p>';
    }
}

// Search, Filter & Pagination Logic (Purana)
function filterMovies(type) {
    if(type === 'bollywood') currentUrl = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_original_language=hi`;
    else if(type === 'series') currentUrl = `${BASE_URL}/discover/tv?api_key=${API_KEY}`;
    else currentUrl = `${BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc`;
    loadMovies(currentUrl, 1);
}

document.getElementById('next').onclick = () => loadMovies(currentUrl, currentPage + 1);
document.getElementById('prev').onclick = () => { if(currentPage > 1) loadMovies(currentUrl, currentPage - 1); };

loadMovies(currentUrl, 1);
                          
