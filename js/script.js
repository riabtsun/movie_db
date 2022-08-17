const API_KEY = 'api_key=ef7f08c7d7bb272ebb445a077d85c315',
  BASE_URL = 'https://api.themoviedb.org/3',
  API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&' + API_KEY,
  IMG_URL = 'https://image.tmdb.org/t/p/w500',
  searchUrl = BASE_URL + '/search/movie?' + API_KEY,
  GENRES_URL = '/genre/movie/list?',

  main = document.querySelector('#main'),
  search = document.querySelector('.search'),
  tagsWrapper = document.querySelector('#tags')

let selectedGenre = []

tagsList()
function tagsList() {
  let genres = BASE_URL + GENRES_URL + API_KEY
  tagsWrapper.innerHTML = ``
  fetch(genres).then(res => res.json()).then(genresList => {
    setGenre(genresList.genres)
  })
}

function setGenre(tags) {
  tagsWrapper.innerHTML = ``
  tags.forEach(genres => {
    const tag = document.createElement('div')
    tag.classList.add('tag')
    tag.id = genres.id
    tag.innerText = genres.name
    tag.addEventListener('click', () => {
      if (setGenre.length === 0) {
        selectedGenre.push(genres.id)
      } else {
        if (selectedGenre.includes(genres.id)) {
          selectedGenre.forEach((id, index) => {
            if (id == genres.id) {
              selectedGenre.splice(index, 1)
              tag.classList.remove('selectedTag')
            }
          })
        } else {
          selectedGenre.push(genres.id)
          tag.classList.add('selectedTag')
        }
      }
      getMovies(API_URL + '&with_genres=' + encodeURI(selectedGenre.join(',')))
      highlightSelection()
    })
    tagsWrapper.append(tag)
  })
}

function highlightSelection() {
  const tags = document.querySelectorAll('.tag')
  tags.forEach(tags => {
    tags.classList.remove('selectedTag')
  })
  clearBtn()
  if (selectedGenre.length !== 0) {
    selectedGenre.forEach(id => {
      const highlightedTag = document.getElementById(id)
      highlightedTag.classList.add('selectedTag')
    })
  }

}

function clearBtn() {
  let clearBtn = document.getElementById('clear')
  if (clearBtn) {
    clearBtn.classList.add('selectedTag')
  } else {
    let clear = document.createElement('div')
    clear.classList.add('tag', 'selectedTag')
    clear.id = 'clear'
    clear.innerText = 'Clear x'
    clear.addEventListener('click', () => {
      selectedGenre = []
      let selectedBtn = document.querySelectorAll('.selectedTag')
      selectedBtn.forEach(btn => {
        btn.classList.remove('selectedTag')
      })
      getMovies(API_URL)
    })
    tagsWrapper.append(clear)
  }
}

getMovies(API_URL)

function getMovies(url) {
  fetch(url).then(res => res.json()).then(data => {
    if (data.results !== 0) {
      showMovies(data.results)
    } else {
      main.innerHTML = `<h1 class="no-results">No results Founds</h1>`
    }
  })
}

function showMovies(data) {
  main.innerHTML = ''

  data.forEach(movie => {
    const {title, poster_path, vote_average, overview, id} = movie
    const movieEl = document.createElement('div')
    movieEl.classList.add('movie')
    movieEl.innerHTML = `
      <a target="_blank" href="${'https://www.themoviedb.org/movie/' + id}">
          <img src="${poster_path ? IMG_URL + poster_path : 'https://via.placeholder.com/1080x1580'}" alt="${title}">
      </a>
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

search.addEventListener('input', () => {

  const searchTerm = search.value
  selectedGenre = []
  if (searchTerm) {
    getMovies(searchUrl + '&query=' + searchTerm)
  } else {
    getMovies(API_URL)
  }
})