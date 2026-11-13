import MovieList from '../components/MovieList.jsx'
import { useSavedMovies } from '../context/SavedMoviesContext.jsx'

export default function SavedMovies() {
  const { savedMovies } = useSavedMovies()

  return (
    <section>
      <h1>My Saved Movies</h1>
      <MovieList
        movies={savedMovies}
        loading={false}
        error=""
        emptyMessage="You haven't saved any movies yet. Save a movie to find it here."
      />
    </section>
  )
}
