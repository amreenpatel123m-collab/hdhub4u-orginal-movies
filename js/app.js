const TMDB_KEY = "7cf8535c2aa2c745040de291475c23d2";
const TMDB_IMG = "https://image.tmdb.org/t/p/w500";
const moviesDiv = document.getElementById("movies");

// STEP 1: Internet Archive se movies lao
async function loadArchiveMovies() {
  const url = `
https://archive.org/advancedsearch.php?q=collection:(feature_films)+AND+mediatype:(movies)
&fl[]=identifier,title,year
&rows=20&page=1&output=json`;

  const res = await fetch(url);
  const data = await res.json();

  for (let item of data.response.docs) {
    await matchWithTMDB(item);
  }
}

// STEP 2: Har movie ko TMDB se match karo
async function matchWithTMDB(archiveMovie) {
  if (!archiveMovie.title) return;

  const searchURL = `
https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}
&query=${encodeURIComponent(archiveMovie.title)}
&year=${archiveMovie.year || ""}`;

  const res = await fetch(searchURL);
  const data = await res.json();

  if (data.results && data.results.length > 0) {
    const movie = data.results[0];
    showMovie(movie, archiveMovie.identifier);
  }
}

// STEP 3: Movie card show
function showMovie(movie, archiveId) {
  if (!movie.poster_path) return;

  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <img src="${TMDB_IMG + movie.poster_path}">
    <h3>${movie.title}</h3>
    <button>Watch Online</button>
  `;

  card.onclick = () => {
    location.href = `details.html?tmdb=${movie.id}&archive=${archiveId}`;
  };

  moviesDiv.appendChild(card);
}

loadArchiveMovies();
