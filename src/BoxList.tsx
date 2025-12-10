import React, { ReactNode, useState } from 'react';
import { average} from './App';
import { Button } from './Loader';
import { Movie } from './Main';


function BoxList({children, showBtn=true}: {children: ReactNode, showBtn?: boolean}) {
  const [isOpen, setIsOpen] = useState(true);

  return <div className='box-list'>
    {isOpen && children}
    {showBtn && <Button isOpen={isOpen} onClick={() => setIsOpen(is => !is)} />}
  </div>;
}

type moviesObj = {
  movies: {imdbID: string,Title: string, Year: string,Poster: string}[]
  selectedId: string | null;
  onSelect: Function
}

function MovieList({ movies, selectedId, onSelect }: moviesObj){
  return <>
    {movies.map(movie => <Movie imgPath={movie.Poster} movieTitle={movie.Title} year={`📆 ${movie.Year}`} key={movie.imdbID} selectedId={selectedId} onSelect={onSelect} id={movie.imdbID}/>)}
  </>
}



type watchedMoviesObj = {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  runtime: number;
  imdbRating: number;
  userRating: number;
}

function WatchedMovies({watchedMovies, setWatchedMovies}: {watchedMovies: watchedMoviesObj[], setWatchedMovies: React.Dispatch<React.SetStateAction<watchedMoviesObj[]>>}){
  function handleDelete(id: string){
    setWatchedMovies(watchedMovies => watchedMovies.filter(mov => mov.imdbID !== id));
  }

  return <>
    {watchedMovies.map(watchedMovie => <Movie 
        imgPath={watchedMovie.Poster}
        movieTitle={watchedMovie.Title}
        ratings={{imdbRating: watchedMovie.imdbRating, userRating: watchedMovie.userRating, runTime: watchedMovie.runtime}}
        key={watchedMovie.imdbID}
        id={watchedMovie.imdbID}
        handleDelete={handleDelete}/>)}
  </>
}


function Summary({ watchedMovies }: { watchedMovies: watchedMoviesObj[] }) {
  const numOfWatcedMovies = watchedMovies.length;
  const imdbRatingAverage = average(watchedMovies.map(movie => movie.imdbRating));
  const userRatingAverage = average(watchedMovies.map(movie => movie.userRating));
  const runTimeAverage = average(watchedMovies.map(movie => movie.runtime));

  return <div className='summury'>
    <strong className='summury-title'>MOVIES YOU WATCHED</strong>
    <div className='average'>
      <strong>🎥 {numOfWatcedMovies} {numOfWatcedMovies === 1 ? "movie" : "movies"}</strong>
      <strong>⭐ {imdbRatingAverage.toFixed(2)}</strong>
      <strong>🌟 {userRatingAverage.toFixed(2)}</strong>
      <strong>⌛ {runTimeAverage.toFixed(2)} min</strong>
    </div>
  </div>
}


export {Summary, MovieList, BoxList, WatchedMovies};
export type { watchedMoviesObj, moviesObj};