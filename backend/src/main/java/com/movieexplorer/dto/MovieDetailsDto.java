package com.movieexplorer.dto;

import java.util.List;

public record MovieDetailsDto(Long id, String title, String tagline, String overview, String posterPath,
                              String backdropPath, String releaseDate, Double rating, Integer runtime,
                              List<String> genres) {}
