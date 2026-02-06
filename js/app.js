const API_KEY = "7cf8535c2aa2c745040de291475c23d2";
const container = document.getElementById("movies");

// Internet Archive – public domain movies
const IA_URL = `
https://archive.org/advancedsearch.php?q=
mediatype:(movies)
AND collection:(feature_films)
&fl[]=identifier
&fl[]=title
&rows=24
&page=1
&output=json
`;

fetch(IA_URL)
.then(res => res.json())
.then(data => {
  data.response.docs.forEach(movie => {
    if(movie.title){
      searchTMDB(movie.title, movie.identifier);
    }
  });
});

function searchTMDB(title, identifier){
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(title)}`;

  fetch(url)
  .then(res => res.json())
  .then(data => {
    if(data.results && data.results.length > 0){
      const m = data.results[0];
      if(m.poster_path){
        showMovie(m.title, m.poster_path, identifier);
      }
    }
  });
}

function showMovie(title, poster, identifier){
  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <img src="https://image.tmdb.org/t/p/w500${poster}">
    <h3>${title}</h3>
  `;

  card.onclick = () => {
    window.location.href = `details.html?id=${identifier}`;
  };

  container.appendChild(card);
}
