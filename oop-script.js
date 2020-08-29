//the API documentation site https://developers.themoviedb.org/3/

class App {
    static async run() {
        const movies = await APIService.fetchMovies()
        HomePage.renderMovies(movies);
    }
}

class APIService {
    static TMDB_BASE_URL = 'https://api.themoviedb.org/3';

    static async fetchMovies() {
        const url = APIService._constructUrl(`movie/now_playing`)
        const response = await fetch(url)
        const data = await response.json();
        return data.results.map(movie => new Movie(movie))
    }


    static async fetchActors() {

    }

    static async fetchMovie(movieId) {
        const url = APIService._constructUrl(`movie/${movieId}`)
        const response = await fetch(url)
        const data = await response.json()
        return new Movie(data)
    }
    static _constructUrl(path) {
        return `${this.TMDB_BASE_URL}/${path}?api_key=${atob('NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI=')}`;
    }

    static async fetchGenres(){
        const url = "https://api.themoviedb.org/3/genre/movie/list?api_key=542003918769df50083a13c415bbc602";
        const response = await fetch(url);
        const data = await response.json();
        return data.genres.map(g => new Genre(g)); 
    }
}

class Genre{
    constructor(genre){
        this.name = genre.name;
        this.id = genre.id;
    }
    
    static async getGenre(){
        const data = await APIService.fetchGenres();
        return data.map(el=> el.name);
    }
}


class HomePage {
    static container = document.getElementById('container');
    static renderMovies(movies) {
        movies.forEach(movie => {
            const movieDiv = document.createElement("div");
            const movieImage = document.createElement("img");
            movieImage.setAttribute("class","homeImg")
            movieImage.src = `${movie.backdropUrl}`;
            const movieTitle = document.createElement("h3");
            movieTitle.textContent = `${movie.title}`;
            movieImage.addEventListener("click", function() {
                Movies.run(movie);
            });

            movieDiv.appendChild(movieTitle);
            movieDiv.appendChild(movieImage);
            this.container.appendChild(movieDiv);
        })
    }
}
class NavBar{
     
    static async getNav(){
        const genres = await Genre.getGenre();
        document.getElementById("genres").innerHTML="";
        genres.forEach(genre=>{
            document.getElementById("genres").innerHTML += `<li>${genre}</li>`;
        })
    }
}


class Movies {
    static async run(movie) {
        const movieData = await APIService.fetchMovie(movie.id)
        MoviePage.renderMovieSection(movieData);
        APIService.fetchActors(movieData)

        document.getElementById('container').setAttribute("class","containerColumn");

    }
}

class MoviePage {
    static container = document.getElementById('container');
    static renderMovieSection(movie) {
        MovieSection.renderMovie(movie);
    }
}

class MovieSection {
    static renderMovie(movie) {
        MoviePage.container.innerHTML = `
      <div class="col">
        <div class="col-md-4">
          <img id="movie-backdrop" src=${movie.backdropUrl}> 
        </div>
        <div class="col-md-8">
          <h2 id="movie-title">${movie.title}</h2>
          <p id="genres">${movie.genres}</p>
          <p id="movie-release-date">${movie.releaseDate}</p>
          <p id="movie-runtime">${movie.runtime}</p>
          <h3>Overview:</h3>
          <p id="movie-overview">${movie.overview}</p>
        </div>
      </div>
      <h3>Actors:</h3>
    `;
    }
}


class Movie {
    static BACKDROP_BASE_URL = 'http://image.tmdb.org/t/p/w780';
    constructor(json) {
        this.id = json.id;
        this.title = json.title;
        this.releaseDate = json.release_date;
        this.runtime = json.runtime + " minutes";
        this.overview = json.overview;
        this.backdropPath = json.backdrop_path;
    }

    get backdropUrl() {
        return this.backdropPath ? Movie.BACKDROP_BASE_URL + this.backdropPath : "";
    }
}




document.querySelector("#about").addEventListener("click",(e)=>{
    const container = document.getElementById('container');
    container.setAttribute("class","containerColumn");
    container.innerHTML = '<p id="history"> It was a dream to built a page that shows all the information' +
    'for the movie lovers for Orçun and Knar. They were two movie fans that were serching for a good site to get information about movies.' +
    'After they searched for a lot of time and they could not find anything that was as perfect as they want it to be, they decided to build something magnificent (By the pressure of Ammar,' +
    'Halit and Luis). After living on a mauntain with 500 monks for 3 years they came up with this idea. The building process took 6 years and'+ 
    'finally now they are presenting you MOVIE-BUSTERS.<br> ENJOY :) </p>'
})


document.querySelector("#home").addEventListener("click",function load(){
    const container = document.getElementById('container');
    container.setAttribute("class","container");
    container.innerHTML  = " ";
    App.run();
    ;})

document.querySelector("#moviesBtn").addEventListener("click",function nav(){
    NavBar.getNav();
    if(document.querySelector("#genres").style.display == "block"){
        document.querySelector("#genres").style.display = "none";
      }
      else{
        document.querySelector("#genres").style.display ="block";
      }
      
    
})

document.addEventListener("DOMContentLoaded", App.run);