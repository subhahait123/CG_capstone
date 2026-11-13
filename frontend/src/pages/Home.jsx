import { useEffect, useState } from 'react'
import MovieList from '../components/MovieList.jsx'
import {
  getErrorMessage, getGenres, getMoviesByGenre, getPopular, getTrending,
} from '../services/api.js'

// Each section keeps its own loading and error state so one failure does not hide the others.
function useMovies(loader, deps = []) {
  const [state, setState] = useState({ movies: [], loading: true, error: '' })
  useEffect(() => {
    let cancelled = false
    setState({ movies: [], loading: true, error: '' })
    loader()
      .then((movies) => !cancelled && setState({ movies, loading: false, error: '' }))
      .catch((err) => !cancelled && setState({ movies: [], loading: false, error: getErrorMessage(err) }))
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return state
}

export default function Home() {
  const [genres, setGenres] = useState([])
  const [genreError, setGenreError] = useState('')
  const [selectedGenre, setSelectedGenre] = useState(null)

  useEffect(() => {
    getGenres().then(setGenres).catch((err) => setGenreError(getErrorMessage(err)))
  }, [])

  const popular = useMovies(getPopular)
  const trending = useMovies(getTrending)
  const filtered = useMovies(
    () => (selectedGenre ? getMoviesByGenre(selectedGenre.id) : Promise.resolve([])),
    [selectedGenre]
  )

  return (
    <>
      <section className="intro">
        <h1>Find your next movie night</h1>
        <p>Browse what is popular and trending, or pick a genre to narrow it down.</p>
      </section>

      <section aria-labelledby="genre-heading">
        <h2 id="genre-heading" className="visually-hidden">Genres</h2>
        {genreError && <p className="status error" role="alert">{genreError}</p>}
        <div className="chips">
          <button
            className={`chip ${!selectedGenre ? 'active' : ''}`}
            onClick={() => setSelectedGenre(null)}
            aria-pressed={!selectedGenre}
          >
            All
          </button>
          {genres.map((genre) => (
            <button
              key={genre.id}
              className={`chip ${selectedGenre?.id === genre.id ? 'active' : ''}`}
              onClick={() => setSelectedGenre(genre)}
              aria-pressed={selectedGenre?.id === genre.id}
            >
              {genre.name}
            </button>
          ))}
        </div>
      </section>

      {selectedGenre ? (
        <section>
          <h2>{selectedGenre.name}</h2>
          <MovieList
            movies={filtered.movies}
            loading={filtered.loading}
            error={filtered.error}
            emptyMessage={`No ${selectedGenre.name} movies found.`}
          />
        </section>
      ) : (
        <>
          <section>
            <h2>Popular</h2>
            <MovieList {...popular} />
          </section>
          <section>
            <h2>Trending this week</h2>
            <MovieList {...trending} />
          </section>
        </>
      )}
    </>
  )
}
