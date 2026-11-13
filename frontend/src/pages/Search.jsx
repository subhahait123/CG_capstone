import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import MovieList from '../components/MovieList.jsx'
import { getErrorMessage, searchMovies } from '../services/api.js'

export default function Search() {
  const [params] = useSearchParams()
  const query = (params.get('query') || '').trim()
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!query) {
      setMovies([])
      setLoading(false)
      setError('')
      return undefined
    }
    let cancelled = false
    setLoading(true)
    setError('')
    searchMovies(query)
      .then((result) => !cancelled && setMovies(result))
      .catch((err) => !cancelled && (setMovies([]), setError(getErrorMessage(err))))
      .finally(() => !cancelled && setLoading(false))
    return () => { cancelled = true }
  }, [query])

  if (!query) {
    return <p className="status">Type a movie title in the search bar to get started.</p>
  }

  return (
    <section>
      <h1>Results for “{query}”</h1>
      <MovieList
        movies={movies}
        loading={loading}
        error={error}
        emptyMessage={`No movies found for “${query}”. Try a different title.`}
      />
    </section>
  )
}
