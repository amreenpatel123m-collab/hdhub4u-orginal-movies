// ================= CONFIG =================
const API_KEY = '7cf8535c2aa2c745040de291475c23d2';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const currentYear = 2026;

let currentPage = 1;
let currentUrl =
  `${BASE_URL}/discover/movie?api_key=${API_KEY}&primary_release_year=${currentYear}&sort_by=popularity.desc`;

// ================= ELEMENTS =================
const movieGrid = document.getElementById('movie-grid');
const pageNumText = document.getElementById('pageNumber');
const movieInput = document.getElementById('movieInput');
const suggestionBox = document.getElementById('suggestion-box');

// ================= SIDEBAR ELEMENTS (ADDED) =================
const hamburger = document.getElementById("hamburger");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const closeSidebar = document.getElementById("closeSidebar");
const openNewsBtn = document.getElementById("openNews");
const sidebarNews = document.getElementById("sidebar-news");

// ================= SIDEBAR LOGIC (ADDED) =================
hamburger.onclick = () => {
  sidebar.classList.add("active");
  overlay.classList.add("active");
};

closeSidebar.onclick = () => {
  sidebar.classList.remove("active");
  overlay.classList.remove("active");
};

overlay.onclick = () => {
  sidebar.classList.remove("active");
  overlay.classList.remove("active");
};

openNewsBtn.onclick = () => {
  if (sidebarNews.style.display === "none" || sidebarNews.style.display === "") {
    sidebarNews.style.display = "block";
  } else {
    sidebarNews.style.display = "none";
  }
};

// ================= LOAD MOVIES =================
async function loadMovies(url, page = 1) {
  try {
    const res = await fetch(`${url}&page=${page}`);
    const data = await res.json();

    if (data.results) {
      displayMovies(data.results);
      currentPage = page;
      pageNumText.innerText = `Page ${currentPage}`;
    }
  } catch (err) {
    console.error('Movie fetch failed', err);
  }
}

// ================= DISPLAY MOVIES =================
function displayMovies(movies) {
  movieGrid.innerHTML = '';

  movies.forEach(movie => {
    if (!movie.poster_path) return;

    const title = movie.title || movie.name;
    const releaseDate =
      (movie.release_date || movie.first_air_date || currentYear)
        .split('-')[0];

    const card = document.createElement('div');
    card.className = 'movie-card';

    card.onclick = () => {
      window.location.href =
        `details.html?id=${movie.id}&type=${movie.title ? 'movie' : 'tv'}`;
    };

    card.innerHTML = `
      <div class="hindi-label">HINDI DUBBED</div>
      <div class="quality">4K | 1080p</div>
      <img src="${IMG_URL + movie.poster_path}" alt="${title}">
      <div class="movie-info">
        <h4>${title} (${releaseDate})</h4>
        <div class="action-btns">
          <div class="btn-dl">Download</div>
          <div class="btn-wt">Watch Online</div>
        </div>
      </div>
    `;

    movieGrid.appendChild(card);
  });

  window.scrollTo(0, 0);
}

// ================= SEARCH SUGGESTIONS =================
movieInput.addEventListener('input', async () => {
  const term = movieInput.value.trim();

  if (term.length < 2) {
    suggestionBox.style.display = 'none';
    return;
  }

  try {
    const res = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(term)}`
    );
    const data = await res.json();

    suggestionBox.innerHTML = '';

    if (data.results?.length) {
      data.results.slice(0, 6).forEach(movie => {
        const div = document.createElement('div');
        div.className = 'suggestion-item';

        div.innerHTML = `
          <img src="${movie.poster_path ? IMG_URL + movie.poster_path : 'https://via.placeholder.com/30x40'}">
          <span>${movie.title} (${(movie.release_date || 'N/A').split('-')[0]})</span>
        `;

        div.onclick = () => {
          movieInput.value = movie.title;
          suggestionBox.style.display = 'none';
          performSearch();
        };

        suggestionBox.appendChild(div);
      });

      suggestionBox.style.display = 'block';
    }
  } catch {
    console.log('Suggestion error');
  }
});

// hide suggestion on outside click
document.addEventListener('click', e => {
  if (e.target !== movieInput) {
    suggestionBox.style.display = 'none';
  }
});

// ================= SEARCH =================
function performSearch() {
  const term = movieInput.value.trim();
  if (!term) return;

  currentUrl =
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(term)}`;
  loadMovies(currentUrl, 1);
}

document.getElementById('searchBtn').addEventListener('click', performSearch);

// ================= FILTERS =================
function filterMovies(type) {
  if (type === 'bollywood') {
    currentUrl =
      `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_original_language=hi&primary_release_year=${currentYear}`;
  } else if (type === 'south') {
    currentUrl =
      `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_original_language=te|ta|ml|kn&primary_release_year=${currentYear}`;
  } else if (type === 'series') {
    currentUrl =
      `${BASE_URL}/discover/tv?api_key=${API_KEY}&first_air_date_year=${currentYear}`;
  } else if (type === 'hollywood') {
    currentUrl =
      `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_original_language=en&primary_release_year=${currentYear}`;
  } else {
    currentUrl =
      `${BASE_URL}/discover/movie?api_key=${API_KEY}&primary_release_year=${currentYear}&sort_by=popularity.desc`;
  }

  loadMovies(currentUrl, 1);
}

// ================= PAGINATION =================
document.getElementById('next').onclick = () =>
  loadMovies(currentUrl, currentPage + 1);

document.getElementById('prev').onclick = () => {
  if (currentPage > 1) loadMovies(currentUrl, currentPage - 1);
};

// ================= INIT =================
loadMovies(currentUrl, 1);
