import { Link } from 'react-router-dom'
import { posterUrl } from '../services/api.js'
import SaveMovieButton from './SaveMovieButton.jsx'

export default function MovieCard({ movie, children }) {
  const poster = posterUrl(movie.posterPath)

  return (
    <article className="card">
      <Link to={`/movie/${movie.id}`} className="card-link">
        {poster ? (
          <img src={poster} alt={`${movie.title} poster`} loading="lazy" />
        ) : (
          <div className="no-poster">No poster</div>
        )}
        <div className="card-body">
          <h3>{movie.title}</h3>
          <p className="meta">
            <span className="rating">★ {movie.rating ? movie.rating.toFixed(1) : 'N/A'}</span>
            <span>{movie.releaseDate || 'Release date unavailable'}</span>
          </p>
        </div>
      </Link>
      <SaveMovieButton movie={movie} />
      {children}
    </article>
  )
}
