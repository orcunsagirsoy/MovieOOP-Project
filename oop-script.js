//the API documentation site https://developers.themoviedb.org/3/

class App {
    static async run() {
        const movies = await APIService.fetchMovies()
        HomePage.renderMovies(movies);
        NavBar.getNav();

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
        const url =  APIService._constructUrl(`genre/movie/list`);
        const response = await fetch(url);
        const data = await response.json();
        return data.genres.map(g => new Genre(g)); 
    }
    static async fetchActors() {
        const url = APIService._constructUrl(`person/popular`);
        const response = await fetch(url);
        const data = await response.json();
        return data.results.map(actor => new Actor(actor))
    }

    static async fetchPopular(){
        const url = APIService._constructUrl(`movie/popular`);
        const response = await fetch(url);
        const data = await response.json();
        return  data.results.map(movie => new Movie(movie));
    }
    
    static async fetchLatest(){
        try{
            const url = APIService._constructUrl(`movie/latest`);
        const response = await fetch(url);
        const data = await response.json();
        return  data.results.map(movie => new Movie(movie));
        }
        catch(err){
            HomePage.container.innerHTML = "";
            return ;
        }
    }
    static async fetchTopRated(){
        const url = APIService._constructUrl(`movie/top_rated`);
        const response = await fetch(url);
        const data = await response.json();
        return  data.results.map(movie => new Movie(movie));
    }
    static async fetchNowPlaying(){
        const url = APIService._constructUrl(`movie/now_playing`);
        const response = await fetch(url);
        const data = await response.json();
        return  data.results.map(movie => new Movie(movie));
    }
    static async fetchUpcoming(){
        const url = APIService._constructUrl(`movie/upcoming`);
        const response = await fetch(url);
        const data = await response.json();
        return  data.results.map(movie => new Movie(movie));
    }
}

class NavBar{
    static async getNav(){
        this.getGenre();
    }
    static async getFilter(){

    }
    static async getGenre(){
        const genres = await Genre.getGenre();
        document.getElementById("genres").innerHTML="";
        genres.forEach(genre=>{
            document.getElementById("genres").innerHTML += `<li class="dropdown-item">${genre}</li>`;
        })
    }
}
class FilteredPage{
    static async getPopular(){
        const movies = await APIService.fetchPopular();
        HomePage.container.innerHTML = "";
        container.setAttribute("class","container");
        HomePage.renderMovies(movies);
    }
    static async getLatest(){
        const movies = await APIService.fetchLatest();
        HomePage.container.innerHTML = "";
        container.setAttribute("class","container");
        HomePage.renderMovies(movies);
    }
    static async getTopRated(){
        const movies = await APIService.fetchTopRated();
        HomePage.container.innerHTML = "";
        container.setAttribute("class","container");
        HomePage.renderMovies(movies);
    }
    static async getNowPlaying() {
        const movies = await APIService.fetchNowPlaying();
        HomePage.container.innerHTML = "";
        container.setAttribute("class","container");
        HomePage.renderMovies(movies);
    }
    static async getUpcoming() {
        const movies = await APIService.fetchUpcoming();
        HomePage.container.innerHTML = "";
        container.setAttribute("class","container");
        HomePage.renderMovies(movies);
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

class Actors {
    static async run(actor) {
        ActorPage.renderActorSection(actor);
        document.getElementById('container').setAttribute("class","containerColumn");
    }

}
class ActorPage {
    static container = document.getElementById('container');
    static renderActorSection(actor) {
        ActorSection.renderActor(actor);
    }
}

class ActorSection {
    static renderActor(actor) {

        ActorPage.container.innerHTML = `
      <div class="col">
        <div class="col-md-4">
           <img id="actor-profile" src=${actor.profileUrl}> 
        </div>
        <div class="col-md-8">
          <h2 id="actor-name">${actor.name}</h2>
          <p id="popularity">${actor.popularity}</p>
          <p id="actor-gender">${actor.gender}</p>
        </div>
      </div>
    `;
    }
}

class Actor {
    static PROFILE_PATH_URL = "http://image.tmdb.org/t/p/w780";
    constructor(json){
        this.name = json.name;
        this.gender = json.gender;
        this.id = json.id;
        this.popularity = json.popularity;
        this.profilePath = json.profile_path;
        // console.log(this.profilePath)
    }

    get profileUrl() {
        return this.profilePath ? Actor.PROFILE_PATH_URL + this.profilePath : "";
    }
}

class ActorsPage {
    static container = document.getElementById('container');
    static renderActors(actors) {
        actors.forEach(actor => {
            const actorDiv = document.createElement("div");
            const actorImage = document.createElement("img");
            actorImage.setAttribute("class","homeImg")
            actorImage.src = `${actor.profileUrl}`;
            const actorName = document.createElement("h3");
            actorName.textContent = `${actor.name}`;
            actorImage.addEventListener("click", function() {
                Actors.run(actor);
            });

            actorDiv.appendChild(actorName);
            actorDiv.appendChild(actorImage);
            this.container.appendChild(actorDiv);
        })
    }
    static async getActors(){
        const actors = await APIService.fetchActors();
        const container = document.getElementById('container');
        container.setAttribute("class","container");
        container.innerHTML  = " ";
        ActorsPage.renderActors(actors);
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
class Movies {
    static async run(movie) {
        const movieData = await APIService.fetchMovie(movie.id)
        MoviePage.renderMovieSection(movieData);
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

//Event Listeners Start


document.querySelector("#navActors").addEventListener("click", (e) => {
    ActorsPage.getActors();
})



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
    
document.querySelector("#popular").addEventListener("click", (e)=>{
    FilteredPage.getPopular();
})

document.querySelector("#latest").addEventListener("click", (e)=>{
    FilteredPage.getLatest();
})

document.querySelector("#topRated").addEventListener("click", (e)=>{
    FilteredPage.getTopRated();
})

document.querySelector("#upComing").addEventListener("click", (e)=>{
    FilteredPage.getUpcoming();
})

document.querySelector("#nowPlaying").addEventListener("click", (e)=>{
    FilteredPage.getNowPlaying();
})

document.querySelector("#moviesBtn").addEventListener("mouseover",function(){
    NavBar.getNav();
     document.querySelector("#genres").style.display ="block";
     document.querySelector("#genres").addEventListener("mouseover",function(){
        document.querySelector("#genres").style.display ="block";
     })
     document.querySelector("#genres").addEventListener("mouseout",function nav(){
        NavBar.getNav();
         document.querySelector("#genres").style.display ="none";
    })

})
document.querySelector("#moviesBtn").addEventListener("mouseout",function nav(){
    NavBar.getNav();
     document.querySelector("#genres").style.display ="none";
})

document.querySelector("#filterBtn").addEventListener("mouseover",function nav(){
        document.querySelector("#filter").style.display ="block";
        document.querySelector("#filter").addEventListener("mouseover",function(){
            document.querySelector("#filter").style.display ="block";
         })
         document.querySelector("#filter").addEventListener("mouseout",function nav(){
            NavBar.getNav();
             document.querySelector("#filter").style.display ="none";
        })
})
document.querySelector("#filterBtn").addEventListener("mouseout",function nav(){
    document.querySelector("#filter").style.display ="none";
})


document.addEventListener("DOMContentLoaded", App.run);