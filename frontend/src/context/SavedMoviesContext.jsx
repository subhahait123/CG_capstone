import { createContext, useContext, useState } from 'react'

const STORAGE_KEY = 'movie-explorer:saved-movies'
const SavedMoviesContext = createContext(null)

function readSavedMovies() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return { movies: [], error: '' }

    const movies = JSON.parse(stored)
    if (!Array.isArray(movies) || movies.some((movie) => movie?.id == null || typeof movie.title !== 'string')) {
      throw new Error('Stored movies have an invalid format.')
    }

    return { movies, error: '' }
  } catch {
    return {
      movies: [],
      error: 'Saved movies could not be loaded from this browser. Saving a movie may replace the unreadable saved data.',
    }
  }
}

export function SavedMoviesProvider({ children }) {
  const [state, setState] = useState(readSavedMovies)

  const toggleSavedMovie = (movie) => {
    const isSaved = state.movies.some((savedMovie) => String(savedMovie.id) === String(movie.id))
    const movies = isSaved
      ? state.movies.filter((savedMovie) => String(savedMovie.id) !== String(movie.id))
      : [...state.movies, movie]

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(movies))
      setState({ movies, error: '' })
    } catch {
      setState((current) => ({
        ...current,
        error: 'Saved movies could not be stored in this browser. Check your browser storage settings and try again.',
      }))
    }
  }

  return (
    <SavedMoviesContext.Provider value={{
      savedMovies: state.movies,
      storageError: state.error,
      toggleSavedMovie,
    }}>
      {children}
    </SavedMoviesContext.Provider>
  )
}

export function useSavedMovies() {
  const context = useContext(SavedMoviesContext)
  if (!context) throw new Error('useSavedMovies must be used within SavedMoviesProvider.')
  return context
}
