import { useSavedMovies } from '../context/SavedMoviesContext.jsx'

export default function SaveMovieButton({ movie, className = '' }) {
  const { savedMovies, toggleSavedMovie } = useSavedMovies()
  const isSaved = savedMovies.some((savedMovie) => String(savedMovie.id) === String(movie.id))

  return (
    <button
      type="button"
      className={`save-button ${isSaved ? 'saved' : ''} ${className}`.trim()}
      onClick={() => toggleSavedMovie(movie)}
      aria-label={`${isSaved ? 'Unsave' : 'Save'} ${movie.title}`}
      aria-pressed={isSaved}
    >
      {isSaved ? 'Unsave' : 'Save'}
    </button>
  )
}
