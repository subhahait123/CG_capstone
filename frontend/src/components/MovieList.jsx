import MovieCard from './MovieCard.jsx'

/** Shows a loading, error, empty or grid state for a list of movies. */
export default function MovieList({ movies, loading, error, emptyMessage = 'No movies found.', renderAction }) {
  if (loading) return <p className="status" role="status">Loading…</p>
  if (error) return <p className="status error" role="alert">{error}</p>
  if (!movies || movies.length === 0) return <p className="status">{emptyMessage}</p>

  return (
    <div className="grid">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie}>
          {renderAction ? renderAction(movie) : null}
        </MovieCard>
      ))}
    </div>
  )
}
