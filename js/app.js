const API_KEY = '7cf8535c2aa2c745040de291475c23d2';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

let currentPage = 1;

async function loadMovies(page = 1) {
  const res = await fetch(
    `${BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc&page=${page}`
  );
  const data = await res.json();
  displayMovies(data.results);
}

function displayMovies(movies) {
  const grid = document.getElementById("movie-grid");
  grid.innerHTML = "";

  movies.forEach(movie => {
    if (!movie.poster_path) return;

    const card = document.createElement("div");
    card.className = "movie-card";
    card.onclick = () => {
      location.href = `details.html?id=${movie.id}&type=movie`;
    };

    card.innerHTML = `
      <div class="hindi-label">WATCH ONLINE</div>
      <img src="${IMG_URL + movie.poster_path}">
      <div class="movie-info">
        <h4>${movie.title}</h4>
        <div class="action-btns">
          <div class="btn-wt">Watch Online</div>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });
}

loadMovies();
