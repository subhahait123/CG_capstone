package com.movieexplorer.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.movieexplorer.dto.GenreDto;
import com.movieexplorer.dto.MovieDetailsDto;
import com.movieexplorer.dto.MovieSummaryDto;
import com.movieexplorer.exception.ResourceNotFoundException;
import com.movieexplorer.exception.TmdbApiException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

/** Talks to TMDB. The API key stays here on the server. */
@Service
public class TmdbService {

    private final RestClient restClient;
    private final String apiKey;

    public TmdbService(RestClient tmdbRestClient, @Value("${tmdb.api.key}") String apiKey) {
        this.restClient = tmdbRestClient;
        this.apiKey = apiKey;
    }

    public List<MovieSummaryDto> getPopular() {
        return toSummaries(get("/movie/popular", Map.of()));
    }

    public List<MovieSummaryDto> getTrending() {
        return toSummaries(get("/trending/movie/week", Map.of()));
    }

    public List<MovieSummaryDto> search(String query) {
        if (query == null || query.isBlank()) {
            throw new IllegalArgumentException("query must not be empty");
        }
        return toSummaries(get("/search/movie", Map.of("query", query.trim())));
    }

    public List<MovieSummaryDto> getByGenre(int genreId) {
        return toSummaries(get("/discover/movie",
                Map.of("with_genres", String.valueOf(genreId), "sort_by", "popularity.desc")));
    }

    public List<GenreDto> getGenres() {
        List<GenreDto> genres = new ArrayList<>();
        for (JsonNode g : get("/genre/movie/list", Map.of()).path("genres")) {
            genres.add(new GenreDto(g.path("id").asInt(), g.path("name").asText()));
        }
        return genres;
    }

    public MovieDetailsDto getDetails(long id) {
        JsonNode m = get("/movie/" + id, Map.of());
        List<String> genres = new ArrayList<>();
        for (JsonNode g : m.path("genres")) {
            genres.add(g.path("name").asText());
        }
        return new MovieDetailsDto(
                m.path("id").asLong(),
                m.path("title").asText(),
                emptyToNull(textOrNull(m, "tagline")),
                m.path("overview").asText(""),
                textOrNull(m, "poster_path"),
                textOrNull(m, "backdrop_path"),
                emptyToNull(textOrNull(m, "release_date")),
                round(m.path("vote_average").asDouble(0)),
                m.path("runtime").isNumber() && m.path("runtime").asInt() > 0 ? m.path("runtime").asInt() : null,
                genres);
    }

    // ---- helpers ----

    private JsonNode get(String path, Map<String, String> params) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new TmdbApiException("TMDB API key is not configured. Set the TMDB_API_KEY environment variable.");
        }
        try {
            JsonNode body = restClient.get()
                    .uri(builder -> {
                        builder.path(path).queryParam("api_key", apiKey).queryParam("language", "en-US");
                        params.forEach((key, value) -> builder.queryParam(key, value));
                        return builder.build();
                    })
                    .retrieve()
                    .body(JsonNode.class);
            if (body == null) {
                throw new TmdbApiException("TMDB returned an empty response");
            }
            return body;
        } catch (HttpClientErrorException.NotFound e) {
            throw new ResourceNotFoundException("Movie not found");
        } catch (HttpClientErrorException.Unauthorized e) {
            throw new TmdbApiException("TMDB rejected the API key. Check TMDB_API_KEY.");
        } catch (RestClientException e) {
            throw new TmdbApiException("Could not reach TMDB. Please try again later.");
        }
    }

    private List<MovieSummaryDto> toSummaries(JsonNode body) {
        List<MovieSummaryDto> movies = new ArrayList<>();
        for (JsonNode m : body.path("results")) {
            movies.add(new MovieSummaryDto(
                    m.path("id").asLong(),
                    m.path("title").asText(),
                    textOrNull(m, "poster_path"),
                    round(m.path("vote_average").asDouble(0)),
                    emptyToNull(textOrNull(m, "release_date"))));
        }
        return movies;
    }

    private String textOrNull(JsonNode node, String field) {
        JsonNode value = node.path(field);
        return value.isNull() || value.isMissingNode() ? null : value.asText();
    }

    private String emptyToNull(String value) {
        return value == null || value.isBlank() ? null : value;
    }

    private double round(double value) {
        return Math.round(value * 10.0) / 10.0;
    }
}
