const API_KEY = '7cf8535c2aa2c745040de291475c23d2';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const currentYear = 2026; 

let currentPage = 1;
let currentUrl = BASE_URL + "/discover/movie?api_key=" + API_KEY + "&primary_release_year=" + currentYear + "&sort_by=popularity.desc";

const movieGrid = document.getElementById('movie-grid');
const pageNumText = document.getElementById('pageNumber');

async function loadMovies(url, page = 1) {
    try {
        const res = await fetch(url + "&page=" + page);
        const data = await res.json();
        if (data.results) {
            displayMovies(data.results);
            currentPage = page;
            pageNumText.innerText = "Page " + currentPage + " of 7000";
        }
    } catch (err) {
        console.error("Movie fetch failed");
    }
}

function displayMovies(movies) {
    movieGrid.innerHTML = '';
    movies.forEach(movie => {
        const title = movie.title || movie.name;
        if (!movie.poster_path) return;
        const releaseDate = (movie.release_date || movie.first_air_date || '2026').split('-')[0];
        const card = document.createElement('div');
        card.classList.add('movie-card');
        card.onclick = function() {
            window.location.href = "details.html?id=" + movie.id + "&type=" + (movie.title ? 'movie' : 'tv');
        };
        card.innerHTML = 
            '<div class="hindi-label">HINDI DUBBED</div>' +
            '<div class="quality">4K | 1080p</div>' +
            '<img src="' + IMG_URL + movie.poster_path + '" alt="' + title + '">' +
            '<div class="movie-info">' +
                '<h4>' + title + ' (' + releaseDate + ')</h4>' +
                '<div class="action-btns">' +
                    '<div class="btn-dl">Download</div>' +
                    '<div class="btn-wt">Watch Online</div>' +
                '</div>' +
            '</div>';
        movieGrid.appendChild(card);
    });
    window.scrollTo(0,0);
}

// Search and Filter logic
function filterMovies(type) {
    if(type === 'bollywood') {
        currentUrl = BASE_URL + "/discover/movie?api_key=" + API_KEY + "&with_original_language=hi&primary_release_year=" + currentYear;
    } else if(type === 'south') {
        currentUrl = BASE_URL + "/discover/movie?api_key=" + API_KEY + "&with_original_language=te|ta|ml|kn&primary_release_year=" + currentYear;
    } else if(type === 'series') {
        currentUrl = BASE_URL + "/discover/tv?api_key=" + API_KEY + "&first_air_date_year=" + currentYear;
    } else {
        currentUrl = BASE_URL + "/discover/movie?api_key=" + API_KEY + "&primary_release_year=" + currentYear + "&sort_by=popularity.desc";
    }
    loadMovies(currentUrl, 1);
}

document.getElementById('searchBtn').addEventListener('click', function() {
    const term = document.getElementById('movieInput').value;
    if(term.trim()) {
        currentUrl = BASE_URL + "/search/movie?api_key=" + API_KEY + "&query=" + encodeURIComponent(term);
        loadMovies(currentUrl, 1);
    }
});

document.getElementById('next').addEventListener('click', function() { loadMovies(currentUrl, currentPage + 1); });
document.getElementById('prev').addEventListener('click', function() { if(currentPage > 1) loadMovies(currentUrl, currentPage - 1); });

// News Fetching Fix
async function fetchCinemaNews() {
    const newsGrid = document.getElementById('news-grid');
    if (!newsGrid) return;

    const rssUrl = 'https://timesofindia.indiatimes.com/rssfeeds/1081479906.cms';
    // Adding a cache-buster (timestamp) to avoid old data
    const apiUrl = "https://api.rss2json.com/v1/api.json?rss_url=" + encodeURIComponent(rssUrl) + "&t=" + new Date().getTime();

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data && data.status === 'ok') {
            newsGrid.innerHTML = ''; // Loading spinner removed
            data.items.slice(0, 6).forEach(item => {
                const card = document.createElement('div');
                card.className = 'news-card';
                
                // Sanitizing description
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = item.description;
                const text = tempDiv.textContent || tempDiv.innerText || "";
                const shortDesc = text.substring(0, 100) + "...";

                card.innerHTML = 
                    '<div>' +
                        '<h3>' + item.title + '</h3>' +
                        '<p>' + shortDesc + '</p>' +
                    '</div>' +
                    '<a href="' + item.link + '" target="_blank" class="read-more">Read Full Story →</a>';
                
                newsGrid.appendChild(card);
            });
        } else {
            throw new Error("API Limit");
        }
    } catch (error) {
        console.error("News error:", error);
        newsGrid.innerHTML = '<p style="color:#ff4444; padding:20px;">News is currently unavailable. Please check back later.</p>';
    }
}

// Initial Calls
loadMovies(currentUrl, 1);
fetchCinemaNews();
