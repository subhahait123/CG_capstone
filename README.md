# Movie Explorer

A movie discovery application built with React, Spring Boot, and the TMDB API. The Spring Boot backend is the only component that uses the TMDB API key. Saved movies are stored in the browser's localStorage; no database or backend API changes are required.

## Features

- Home page with popular and weekly trending movies
- Movie search with an empty-results message
- Genre list and genre-based movie filtering
- Movie details including poster, backdrop, overview, release date, rating, genres, and runtime when available
- Save and remove favourite movies, retained in browser storage
- My Saved Movies page with an empty state
- Responsive movie cards, loading states, and visible error messages

## Project structure

```text
movie-explorer/
├── backend/
│   ├── .mvn/wrapper/              Maven Wrapper configuration and JAR
│   ├── mvnw.cmd                   Windows Maven Wrapper launcher
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/movieexplorer/
│       │   ├── config/            AppConfig, CorsConfig
│       │   ├── controller/        MovieController
│       │   ├── dto/               GenreDto, MovieDetailsDto, MovieSummaryDto
│       │   ├── exception/         API error handling and exceptions
│       │   └── service/           TmdbService
│       └── resources/application.properties
└── frontend/
    ├── package.json
    └── src/
        ├── components/            Footer, MovieCard, MovieList, Navbar, SaveMovieButton
        ├── context/               SavedMoviesContext
        ├── pages/                 Home, MovieDetails, SavedMovies, Search
        ├── services/api.js
        ├── App.jsx
        └── index.css
```

## Requirements

- JDK 21
- Node.js 18 or newer
- A TMDB API key

Maven is downloaded and run by the included Maven Wrapper. A global Maven installation is not needed.

## Configure the TMDB API key

1. Request an API key from [TMDB](https://www.themoviedb.org/settings/api).
2. Create a local backend environment file:

   ```powershell
   Set-Location .\backend
   Copy-Item .env.example .env
   ```

3. Edit `backend\.env` and replace `your_tmdb_api_key` with your key. `.env` is ignored by Git.

Spring Boot loads `backend\.env` automatically when started from the `backend` directory. The value is not included in frontend code or exposed as a frontend environment variable. An operating-system `TMDB_API_KEY` environment variable can also be used and takes precedence over the local file. If the key is unset, movie endpoints return a clear configuration error.

## Run on Windows

Start the backend from a PowerShell terminal:

```powershell
Set-Location .\backend
.\mvnw.cmd spring-boot:run
```

The wrapper uses the Maven 3.9.9 distribution pinned in `backend\.mvn\wrapper\maven-wrapper.properties`; a global Maven installation is not used. The first wrapper invocation downloads that distribution. The backend listens on `http://localhost:8080`, and its endpoints are available under `http://localhost:8080/api/movies`.

In a second PowerShell terminal, start the frontend:

```powershell
Set-Location .\frontend
npm install
npm run dev
```

Open `http://localhost:5173`. The frontend calls the local backend at `http://localhost:8080/api` by default. To change it, copy `frontend\.env.example` to `frontend\.env` and edit `VITE_API_URL`.

## Backend API

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/movies/popular` | Popular movies |
| GET | `/api/movies/trending` | Movies trending this week |
| GET | `/api/movies/search?query=avatar` | Search by title |
| GET | `/api/movies/genres` | Movie genres |
| GET | `/api/movies/genre/{genreId}` | Movies in a genre |
| GET | `/api/movies/{id}` | Movie details |

## Verify the application

Run the frontend production build:

```powershell
Set-Location .\frontend
npm run build
```

Run the backend tests/package build with the wrapper:

```powershell
Set-Location .\backend
.\mvnw.cmd test
```

With both servers running and a valid TMDB key, verify in the browser:

1. Home shows popular and trending movie posters, titles, release dates, and ratings.
2. Search for a known title and then a nonsense title; confirm results and the no-movies message.
3. Select a genre; confirm only movies in that genre are shown. Select **All** to return to the home sections.
4. Open a movie card; confirm details and **Back to movies** navigation.
5. Stop the backend and confirm the frontend displays a connection error; restore it and confirm loading completes.
6. Save a movie from a card and from its details page; confirm it appears under **My Saved Movies** and remains after refreshing. Remove it and confirm the empty-state message appears when no saved movies remain.

TMDB provides the movie information and imagery. This product uses the TMDB API but is not endorsed or certified by TMDB.
