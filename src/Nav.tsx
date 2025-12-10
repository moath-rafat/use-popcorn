import React, { ReactNode, useEffect, useRef } from 'react';

export function Nav({ children }: { children: ReactNode; }) {
  return <div className='nav'>
    {children}
  </div>;
}
export function Logo() {
  return <strong className='logo'>🍿 usePopcorn</strong>;
}
export function Search({query, setQuery}: {query: string, setQuery: React.Dispatch<React.SetStateAction<string>>}) {
  const inputEl = useRef<HTMLInputElement | null>(null);

  useEffect(function(){
    
    function callBack(e: KeyboardEvent){
      if(document.activeElement === inputEl.current)
        return;

      if(e.code === "Enter")
        inputEl.current?.focus();
        setQuery("");
    }

    document.addEventListener("keydown", callBack)
    return function(){
      document.removeEventListener("keydown", callBack);
    }
  }, [setQuery])

  return <input placeholder='Search movies...' className='search' value={query} onChange={(e) => setQuery(e.target.value)} ref={inputEl}/>;
}
export function NumResults({numOfMovies}: {numOfMovies: number}) {
  return <p className='result'>Found <strong>{numOfMovies}</strong> results</p>;
}
