import { useEffect, useState } from "react"
import { KEY } from "./App";
import { ErrorMessage, Loader } from "./Loader";
import { watchedMoviesObj } from "./BoxList";
import Star from "./Star";

type movieDetailsProps = {
  id: string | null
  onClose: React.Dispatch<React.SetStateAction<string | null>>,
  watchedMovies: watchedMoviesObj[],
  onAddWatched: React.Dispatch<React.SetStateAction<watchedMoviesObj[]>>
}

type Movie = {
  Actors: string,
  Awards: string,
  Country: string,
  Director: string,
  Genre: string,
  Language: string,
  Metascore: string,
  Plot: string,
  Poster: string,
  Rated: string,
  Ratings: Array<{Source: string, Value: string}>,
  Released: string,
  Response: string,
  Runtime: string,
  Title: string,
  Type: string,
  Writer: string,
  Year: string,
  imdbID: string,
  imdbRating: string,
  imdbVotes: string,
  totalSeasons: string,
}

export function MovieDetails({id, onClose, watchedMovies, onAddWatched}: movieDetailsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [userRatingStars, setUserRating] = useState<number>(0);
  const isMovieNot = isError || !movie || movie.Response === "False";
  const title = movie?.Title;


  useEffect(function(){
    if(!title) return;
    document.title = "MOVIE | " + title;

    return function(){
      document.title = "usePopcorn";
      console.log("Clean up " + title);
    }
  }, [title])

  useEffect(function(){
    function callBack(e: KeyboardEvent){
      if(e.code === "Escape")
        onClose(null);
    } 
    document.addEventListener("keydown", callBack);

    return function(){
      document.removeEventListener("keydown", callBack);
    }
  }, [onClose])

  useEffect(function(){
    async function movieDetailsFetcher(){
      try{
        setIsError(false);
        setIsLoading(true);
        const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${id}`)
        if(!res.ok)
          throw new Error();
        const data = await res.json();
        setIsLoading(false);
        setMovie(data);
      } catch(err: any){
        setIsLoading(false);
        setIsError(true);
      }
    }
    movieDetailsFetcher();
  }, [id, onClose])

  function handleAdd(movie: Movie){
    // type watchedMoviesObj = {
    //   imdbID: string;
    //   Title: string;
    //   Year: string;
    //   Poster: string;
    //   runtime: number;
    //   imdbRating: number;
    //   userRating: number;
    // }
    const newWatched = {
      imdbID: movie.imdbID,
      Title: movie.Title,
      Year: movie.Year,
      Poster: movie.Poster,
      runtime: Number(movie.Runtime.split(" ")[0]),
      imdbRating: Number(movie.imdbRating),
      userRating: userRatingStars
    }
    onAddWatched(watchedMovies => [...watchedMovies, newWatched])
    onClose(null);
  }

  const paragraphStyles = {
    paddingLeft: "25px", 
    fontSize: "14px",
    paddingBottom: "15px"
  }

  return <div className="details-container">
    {isError && <ErrorMessage>Could not get movie details</ErrorMessage>}
    {isLoading && <Loader>Loading ...</Loader>}
    {!isMovieNot && !isLoading && <>

      <div className="header">
        <img src={movie.Poster} style={{width: "150px" ,height: "230px", aspectRatio: "auto"}} alt="movie poster"/>
        <div className="">
          <h1 style={{padding: "25px", fontSize: "27px"}}>{movie.Title}</h1>
          <p style={paragraphStyles}>{movie.Released} &bull; {movie.Runtime}</p>
          <p style={paragraphStyles}>{movie.Genre}</p>
          <p style={paragraphStyles}>⭐ {movie.imdbRating} IMDB Rating</p>
        </div>
        <button style={{width: "30px", height: "30px", borderRadius: "50%", cursor: "pointer", position: "absolute", left: "8px", top: "8px"}} onClick={() => onClose(null)}>
          &larr;</button>
      </div>


      <div className="movie-authors-description">
        <div style={{padding: "25px", marginTop: "50px", marginBottom: "25px", backgroundColor: "#22272c", width: "75%"}}>
          {!watchedMovies.some(mov => mov.imdbID === movie.imdbID) ? <>
            <Star size={24} starsNum={10} onSetRating={setUserRating}/>
            <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
              {userRatingStars > 0 && <button 
              style={{marginTop: "10px", padding: "7px 120px", cursor: "pointer", backgroundColor: "blueviolet", borderRadius: "60px", color: "white", borderStyle: "none", fontSize: "16px"}}
              onClick={() => handleAdd(movie)}>
                + Add to list
              </button>}
            </div>
          </>: <p style={{fontSize: "14px"}}>
              You already rated this movie: {watchedMovies.find(mov => mov.imdbID === id)?.userRating}<span>⭐</span>
            </p>}
        </div>
        <p style={{fontSize: "14px", width: "75%", paddingBottom: "20px", paddingTop: "15px"}}>{movie.Plot}</p>
        <p style={{fontSize: "14px", width: "75%", paddingBottom: "20px"}}>Starring {movie.Actors}</p>
      </div>

    </>}
  </div>
}


