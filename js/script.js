const API_KEY = 'api_key=ef7f08c7d7bb272ebb445a077d85c315',
  BASE_URL = 'https://api.themoviedb.org/3',
  API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&' + API_KEY,
  IMG_URL = 'https://image.tmdb.org/t/p/w500',
  searchUrl = BASE_URL + '/search/movie?' + API_KEY,

  main = document.querySelector('#main'),
  form = document.querySelector('#form')
search = document.querySelector('.search')

getMovies(API_URL)

function getMovies(url) {

  fetch(url).then(res => res.json()).then(data => {
    showMovies(data.results)
    console.log(data.results)
  })
}

function showMovies(data) {
  main.innerHTML = ''

  data.forEach(movie => {
    const {title, poster_path, vote_average, overview} = movie
    const movieEl = document.createElement('div')
    movieEl.classList.add('movie')
    movieEl.innerHTML = `
     <img src="${IMG_URL + poster_path}" alt="${title}">
        <div class="movie-info">
            <h3 class="movie-title">${title}</h3>
            <span class="${getColor(vote_average)}">${vote_average}</span>
        </div>
        <div class="overview">
            <h3>Overview</h3>
            ${overview}
        </div>
    `
    main.appendChild(movieEl)
  })
}

function getColor(vote) {
  if (vote >= 8) {
    return 'green'
  } else if (vote >= 5) {
    return 'orange'
  } else {
    return 'red'
  }
}

form.addEventListener('submit', e => {
  e.preventDefault();

  const searchTerm = search.value

  if (searchTerm) {
    getMovies(searchUrl + '&query=' + searchTerm)
  } else {
    getMovies(API_URL)
  }
})