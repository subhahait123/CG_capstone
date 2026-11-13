package com.movieexplorer.exception;

public class TmdbApiException extends RuntimeException {
    public TmdbApiException(String message) { super(message); }
}
