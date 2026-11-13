package com.movieexplorer.controller;

import com.movieexplorer.dto.GenreDto;
import com.movieexplorer.dto.MovieDetailsDto;
import com.movieexplorer.dto.MovieSummaryDto;
import com.movieexplorer.service.TmdbService;
import java.util.List;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/movies")
public class MovieController {

    private final TmdbService tmdbService;

    public MovieController(TmdbService tmdbService) {
        this.tmdbService = tmdbService;
    }

    @GetMapping("/popular")
    public List<MovieSummaryDto> popular() { return tmdbService.getPopular(); }

    @GetMapping("/trending")
    public List<MovieSummaryDto> trending() { return tmdbService.getTrending(); }

    @GetMapping("/search")
    public List<MovieSummaryDto> search(@RequestParam String query) { return tmdbService.search(query); }

    @GetMapping("/genres")
    public List<GenreDto> genres() { return tmdbService.getGenres(); }

    @GetMapping("/genre/{genreId}")
    public List<MovieSummaryDto> byGenre(@PathVariable int genreId) { return tmdbService.getByGenre(genreId); }

    @GetMapping("/{id}")
    public MovieDetailsDto details(@PathVariable long id) { return tmdbService.getDetails(id); }
}
