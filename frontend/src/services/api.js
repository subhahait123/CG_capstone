import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  timeout: 15000,
})

export const posterUrl = (path) => (path ? `https://image.tmdb.org/t/p/w500${path}` : null)
export const backdropUrl = (path) => (path ? `https://image.tmdb.org/t/p/w1280${path}` : null)

/** Turns any Axios failure into a message that is safe to show on screen. */
export function getErrorMessage(error) {
  if (error.response?.data?.message) return error.response.data.message
  if (error.code === 'ECONNABORTED') return 'The server took too long to respond.'
  if (!error.response) return 'Cannot reach the backend. Check that it is running on port 8080.'
  return 'Something went wrong. Please try again.'
}

export const getPopular = () => api.get('/movies/popular').then((r) => r.data)
export const getTrending = () => api.get('/movies/trending').then((r) => r.data)
export const searchMovies = (query) =>
  api.get('/movies/search', { params: { query } }).then((r) => r.data)
export const getMovie = (id) => api.get(`/movies/${id}`).then((r) => r.data)
export const getGenres = () => api.get('/movies/genres').then((r) => r.data)
export const getMoviesByGenre = (genreId) => api.get(`/movies/genre/${genreId}`).then((r) => r.data)
