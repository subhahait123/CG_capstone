import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const [text, setText] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    const query = text.trim()
    if (query) navigate(`/search?query=${encodeURIComponent(query)}`)
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">Movie Explorer</Link>
        <nav className="nav-links">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/saved">My Saved Movies</NavLink>
        </nav>
        <form className="search-form" onSubmit={handleSubmit} role="search">
          <input
            type="search"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Search movies by title"
            aria-label="Search movies by title"
          />
          <button type="submit">Search</button>
        </form>
      </div>
    </header>
  )
}
