const API_KEY = "7cf8535c2aa2c745040de291475c23d2";
const IMG = "https://image.tmdb.org/t/p/w500";

// ---------- HOME ----------
if (document.getElementById("movie-grid")) {
  fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`)
    .then(res => res.json())
    .then(data => showMovies(data.results));
}

function showMovies(movies) {
  const grid = document.getElementById("movie-grid");
  grid.innerHTML = "";

  movies.forEach(m => {
    if (!m.poster_path) return;

    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <img src="${IMG + m.poster_path}">
      <h4>${m.title}</h4>
    `;
    div.onclick = () => {
      location.href = `details.html?id=${m.id}`;
    };
    grid.appendChild(div);
  });
}

// ---------- DETAILS ----------
if (document.getElementById("details")) {
  const id = new URLSearchParams(location.search).get("id");

  fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`)
    .then(res => res.json())
    .then(movie => loadDetails(movie));
}

function loadDetails(movie) {
  const box = document.getElementById("details");

  box.innerHTML = `
    <h2>${movie.title}</h2>
    <img src="${IMG + movie.poster_path}" class="poster">
    <p>${movie.overview}</p>

    <h3>Watch Online</h3>
    <iframe
      src="https://archive.org/embed/night_of_the_living_dead"
      width="100%"
      height="420"
      frameborder="0"
      allowfullscreen>
    </iframe>

    <p class="source">Source: Internet Archive (Public Domain)</p>
  `;
}
