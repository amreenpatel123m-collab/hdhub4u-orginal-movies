const API_KEY = "7cf8535c2aa2c745040de291475c23d2";
const IMG = "https://image.tmdb.org/t/p/w500";

const moviesDiv = document.getElementById("movies");

if (moviesDiv) {
  fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}`)
    .then(res => res.json())
    .then(data => {
      data.results.forEach(movie => {
        const card = document.createElement("div");
        card.className = "movie-card";
        card.innerHTML = `
          <img src="${IMG + movie.poster_path}">
          <h3>${movie.title}</h3>
        `;
        card.onclick = () => {
          location.href = `details.html?id=${movie.id}`;
        };
        moviesDiv.appendChild(card);
      });
    });
}

// DETAILS PAGE
const params = new URLSearchParams(location.search);
const movieId = params.get("id");

if (movieId && document.getElementById("title")) {
  fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`)
    .then(res => res.json())
    .then(movie => {
      document.getElementById("title").innerText = movie.title;
      document.getElementById("overview").innerText = movie.overview;
      document.getElementById("poster").innerHTML =
        `<img src="${IMG + movie.poster_path}">`;

      document.getElementById("watchBtn").onclick = () => {
        searchArchive(movie.title);
      };
    });
}

function searchArchive(title) {
  fetch(`https://archive.org/advancedsearch.php?q=${encodeURIComponent(title)}&fl[]=identifier&rows=1&page=1&output=json`)
    .then(res => res.json())
    .then(data => {
      if (data.response.docs.length > 0) {
        const id = data.response.docs[0].identifier;
        document.getElementById("player").innerHTML = `
          <iframe src="https://archive.org/embed/${id}"
          width="100%" height="500" frameborder="0" allowfullscreen></iframe>`;
      } else {
        document.getElementById("player").innerText =
          "Movie not available legally.";
      }
    });
          }
