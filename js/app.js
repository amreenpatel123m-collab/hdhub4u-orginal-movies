const API_KEY = '7cf8535c2aa2c745040de291475c23d2';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

const movieGrid = document.getElementById('movie-grid');
const movieInput = document.getElementById('movieInput');
const searchBtn = document.getElementById('searchBtn');

async function getMovies(url) {
    const res = await fetch(url);
    const data = await res.json();
    showMovies(data.results);
}

function showMovies(movies) {
    movieGrid.innerHTML = '';
    movies.forEach(movie => {
        const { title, poster_path, vote_average } = movie;
        if(!poster_path) return;
        const movieEl = document.createElement('div');
        movieEl.style.cssText = "background:#1a1a1a; border:1px solid #333; position:relative; border-radius:5px; overflow:hidden; transition:0.3s;";
        movieEl.innerHTML = `
            <div style="position:absolute; top:5px; left:5px; background:#e50914; font-size:10px; padding:3px; font-weight:bold; border-radius:3px; color:white;">720p | 1080p</div>
            <img src="${IMG_URL + poster_path}" style="width:100%; display:block;">
            <div style="padding:10px; text-align:center;">
                <h4 style="font-size:13px; margin:5px 0; color:white; height:35px; overflow:hidden;">${title}</h4>
                <div style="background:#e50914; color:white; padding:5px; font-size:12px; font-weight:bold; cursor:pointer; border-radius:3px;">DOWNLOAD</div>
            </div>
        `;
        movieGrid.appendChild(movieEl);
    });
}

searchBtn.addEventListener('click', () => {
    const term = movieInput.value;
    if(term) getMovies(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${term}`);
});

getMovies(`${BASE_URL}/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}`);
      
