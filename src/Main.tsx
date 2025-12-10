import { ReactNode } from 'react';

function Main({ children }: { children: ReactNode; }) {
  return <div className='main'>
    <div className='main-container'>
      {children}
    </div>
  </div>;
}


type movieProps = {
  imgPath: string;
  movieTitle: string;
  id: string;
  year?: string;
  ratings?: {imdbRating: number, userRating: number, runTime: number};
  selectedId?: string | null
  onSelect?: Function;
  handleDelete?: Function
};
function Movie({ imgPath, movieTitle, year, ratings, id, selectedId, onSelect, handleDelete}: movieProps) {
  return <div className='movie' role='button' style={{cursor: ratings ? "": "pointer"}} onClick={() => onSelect && onSelect(id)}>
    <img src={`${imgPath}`} alt='poster' className='poster' />
    <div className='description'>
      <strong>{movieTitle}</strong>
      <p>{year && year}</p>
      {ratings && <div className='movie-ratings'>
        <p>⭐ {ratings.imdbRating}</p>
        <p>🌟 {ratings.userRating}</p>
        <p>⌛ {ratings.runTime}</p>
        <button style={{width: "16px", height: "16px", paddingRight: "1px", paddingTop: "1px", textAlign: "center", borderRadius: "8px", borderStyle: "none", backgroundColor: "red", cursor: "pointer"}} onClick={() => handleDelete && handleDelete(id)}>X</button>
        </div>}
    </div>
  </div>
}


export {Movie, Main};