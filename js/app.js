const API_KEY = "7cf8535c2aa2c745040de291475c23d2";

const movies = [
  { title: "Night of the Living Dead", id: "night_of_the_living_dead" },
  { title: "Plan 9 from Outer Space", id: "plan_9_from_outer_space" },
  { title: "The Last Man on Earth", id: "last_man_on_earth_1964" },
  { title: "His Girl Friday", id: "his_girl_friday" },
  { title: "Charade", id: "charade_1963" },
  { title: "Sherlock Holmes", id: "sherlock_holmes_1939" }
];

const container = document.getElementById("movies");

movies.forEach(movie => {
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(movie.title)}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (data.results && data.results[0] && data.results[0].poster_path) {
        const poster = data.results[0].poster_path;

        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          <img src="https://image.tmdb.org/t/p/w500${poster}">
          <h3>${movie.title}</h3>
        `;

        card.onclick = () => {
          window.location.href = `details.html?id=${movie.id}`;
        };

        container.appendChild(card);
      }
    });
});
