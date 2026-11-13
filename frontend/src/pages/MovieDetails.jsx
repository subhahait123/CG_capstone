import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  backdropUrl, getErrorMessage, getMovie, posterUrl,
} from '../services/api.js'
import SaveMovieButton from '../components/SaveMovieButton.jsx'

const formatRuntime = (minutes) => (minutes ? `${Math.floor(minutes / 60)}h ${minutes % 60}m` : 'Not available')

export default function MovieDetails() {
  const { id } = useParams()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    setMovie(null)
    getMovie(id)
      .then((details) => !cancelled && setMovie(details))
      .catch((err) => !cancelled && setError(getErrorMessage(err)))
      .finally(() => !cancelled && setLoading(false))
    return () => { cancelled = true }
  }, [id])

  if (loading) return <p className="status" role="status">Loading…</p>
  if (error) return <p className="status error" role="alert">{error}</p>

  const backdrop = backdropUrl(movie.backdropPath)
  const poster = posterUrl(movie.posterPath)

  return (
    <article className="details">
      <Link className="back-link" to="/">← Back to movies</Link>
      {backdrop && (
        <div className="backdrop" style={{ backgroundImage: `url(${backdrop})` }} role="img" aria-label={`${movie.title} backdrop`} />
      )}
      <div className="details-main">
        {poster ? <img className="details-poster" src={poster} alt={`${movie.title} poster`} /> : <div className="no-poster details-poster">No poster</div>}
        <div className="details-text">
          <h1>{movie.title}</h1>
          <SaveMovieButton movie={movie} className="details-save" />
          {movie.tagline && <p className="tagline">{movie.tagline}</p>}
          <dl className="facts">
            <div><dt>Rating</dt><dd>★ {movie.rating ? movie.rating.toFixed(1) : 'N/A'} / 10</dd></div>
            <div><dt>Released</dt><dd>{movie.releaseDate || 'Not available'}</dd></div>
            <div><dt>Runtime</dt><dd>{formatRuntime(movie.runtime)}</dd></div>
            <div><dt>Genres</dt><dd>{movie.genres.length ? movie.genres.join(', ') : 'Not available'}</dd></div>
          </dl>
          <h2>Overview</h2>
          <p className="overview">{movie.overview || 'No description is available for this movie.'}</p>
        </div>
      </div>
    </article>
  )
}
