import { Routes, Route, Link } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Search from './pages/Search.jsx'
import MovieDetails from './pages/MovieDetails.jsx'
import SavedMovies from './pages/SavedMovies.jsx'
import { SavedMoviesProvider, useSavedMovies } from './context/SavedMoviesContext.jsx'

function AppContent() {
  const { storageError } = useSavedMovies()

  return (
    <div className="app">
      <Navbar />
      <main className="container">
        {storageError && <p className="status error" role="alert">{storageError}</p>}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/saved" element={<SavedMovies />} />
          <Route
            path="*"
            element={
              <p className="status">
                Page not found. <Link to="/">Go back home</Link>
              </p>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <SavedMoviesProvider>
      <AppContent />
    </SavedMoviesProvider>
  )
}
