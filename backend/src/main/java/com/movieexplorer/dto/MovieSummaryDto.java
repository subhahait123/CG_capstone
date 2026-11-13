package com.movieexplorer.dto;

public record MovieSummaryDto(Long id, String title, String posterPath, Double rating, String releaseDate) {}
