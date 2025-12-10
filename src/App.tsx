import {useEffect } from 'react';
import { Nav, Logo, Search, NumResults } from './Nav';
import {useState} from "react"
import { Main } from './Main';
import { BoxList, MovieList, WatchedMovies, Summary, watchedMoviesObj} from './BoxList';
import { Loader, ErrorMessage, GreetingMessage } from './Loader';
import { MovieDetails } from './MovieDetails';


function average(arr: number[]): number{
  return arr.reduce((acc, cur, _, arr) => acc + cur/arr.length, 0)
}

const KEY = "ed9cadce";


export default function App(){
  const [movies, setMovies] = useState<{imdbID: string,Title: string, Year: string,Poster: string}[]>([]);
  const [query, setQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [watchedMovies, setWatchedMovies] = useState<watchedMoviesObj[]>(function(){
    const storedValue = (localStorage.getItem("watched"));
    if(!storedValue)
      return [];
    return JSON.parse(storedValue);
  });
  

  function handleSelection(selectedId: string): void{
    setSelectedId(id => selectedId === id ? null : selectedId);
  }

  useEffect(function (){
    const controller = new AbortController();
    async function moviesData(){
      try{
        if(query.length < 3){
          setMovies([]);
          return;
        }
        const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`, {signal: controller.signal});
        const data = await res.json();
        console.log(data)
        if(!query.length){
          setError("");
          return;
        }
        setError("");
        setIsLoading(true);
        if(!res.ok)
          throw new Error("Failed to search: No internet connection");

        if(data.Response === "False"){
          setMovies([]);
          return
        }

        setMovies([...data.Search]);
        setError("");
      } catch(error: any){
        if(error.message !== "AbortError"){
          console.error(error.message);
          setError("Failed to search");
        }  
      } finally{
        setIsLoading(false);
      }
    }
    moviesData(); 
    if(query.length === 0) setError("");
    return function(){
      controller.abort();
    }
  }, [query])

  useEffect(function(){
      localStorage.setItem("watched", JSON.stringify(watchedMovies));
    }, [watchedMovies])

  return <div className='app'>
    <Nav>
      <Logo />
      <Search query={query} setQuery={setQuery} />
      <NumResults numOfMovies={movies.length}/>
    </Nav>

    <Main>
      <BoxList showBtn={!error && !isLoading && query.length !== 0}>
        {isLoading && !query.length && <Loader>Loading ...</Loader>}
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {!query.length && <GreetingMessage/>}
        {!error && !isLoading && query.length !== 0 && <MovieList movies={movies} selectedId={selectedId} onSelect={handleSelection}/>}
      </BoxList>

      <BoxList>
        {selectedId ?
        <MovieDetails id={selectedId} onClose={setSelectedId} watchedMovies={watchedMovies} onAddWatched={setWatchedMovies} key={selectedId}/>
         : 
        <>
          <Summary watchedMovies={watchedMovies}/>
          <WatchedMovies watchedMovies={watchedMovies} setWatchedMovies={setWatchedMovies}/>
        </>}
      </BoxList>
    </Main>
  </div>
}



export {average, KEY};



