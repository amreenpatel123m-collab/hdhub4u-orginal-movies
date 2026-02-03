const API_KEY = '7cf8535c2aa2c745040de291475c23d2';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

let currentPage = 1;
let currentUrl = `${BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc`;

const movieGrid = document.getElementById('movie-grid');
const pageNumText = document.getElementById('pageNumber');

// Movie Details dikhane ke liye function (Ab ye aapke details.html par jayega)
function showDetails(id, type = 'movie') {
    window.location.href = `details.html?id=${id}&type=${type}`;
}

// Movies Load Karne ka Function
async function loadMovies(url, page = 1) {
    try {
        const res = await fetch(`${url}&page=${page}`);
        const data = await res.json();
        
        // Check kar rahe hain ki data sahi hai ya nahi
        if (data.results && data.results.length > 0) {
            // Agar URL mein '/tv' hai toh type 'tv' pass karenge
            const type = url.includes('/tv') ? 'tv' : 'movie';
            displayMovies(data.results, type);
            currentPage = page;
            pageNumText.innerText = `Page ${currentPage} of ${data.total_pages > 500 ? 500 : data.total_pages}`;
        } else {
            movieGrid.innerHTML = `<h2 style="padding: 20px;">No results found.</h2>`;
        }
    } catch (error) {
        console.error("Data load karne mein error:", error);
    }
}

function displayMovies(movies, type) {
    movieGrid.innerHTML = '';
    movies.forEach(movie => {
        // TV series mein 'name' hota hai, movies mein 'title'
        const title = movie.title || movie.name;
        const releaseDate = movie.release_date || movie.first_air_date;
        const poster_path = movie.poster_path;
        const id = movie.id;

        if (!poster_path) return;

        const card = document.createElement('div');
        card.classList.add('movie-card');
        
        // Click karne par hamara showDetails function chalega
        card.onclick = () => showDetails(id, type); 
        
        card.innerHTML = `
            <div class="quality">720p | 1080p</div>
            <img src="${IMG_URL + poster_path}" alt="${title}" loading="lazy">
            <div class="movie-info">
                <h4>${title} (${releaseDate ? releaseDate.split('-')[0] : 'N/A'})</h4>
                <div class="btn-download">Download</div>
            </div>
        `;
        movieGrid.appendChild(card);
    });
    window.scrollTo(0,0);
}

// Categories Filter System (Working Hindi/South Filters)
function filterMovies(type) {
    if(type === 'bollywood') {
        currentUrl = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_original_language=hi`;
    } else if(type === 'hollywood') {
        currentUrl = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_original_language=en`;
    } else if(type === 'south') {
        // South Hindi ke liye Telugu, Tamil, aur Malayalam filter use kiya hai
        currentUrl = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_original_language=te|ta|ml|kn`;
    } else if(type === 'series') {
        currentUrl = `${BASE_URL}/discover/tv?api_key=${API_KEY}&sort_by=popularity.desc`;
    } else {
        currentUrl = `${BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc`;
    }
    loadMovies(currentUrl, 1);
}

// Search Function
document.getElementById('searchBtn').addEventListener('click', () => {
    const term = document.getElementById('movieInput').value;
    if(term.trim()) {
        // Search query ko encode kar rahe hain taki space se error na aaye
        currentUrl = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(term)}`;
        loadMovies(currentUrl, 1);
    }
});

// Pagination
document.getElementById('next').addEventListener('click', () => loadMovies(currentUrl, currentPage + 1));
document.getElementById('prev').addEventListener('click', () => { 
    if(currentPage > 1) loadMovies(currentUrl, currentPage - 1); 
});

// Initial Load
loadMovies(currentUrl, 1);
                
