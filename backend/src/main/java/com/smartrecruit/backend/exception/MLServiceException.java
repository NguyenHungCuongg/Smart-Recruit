package com.smartrecruit.backend.exception;

public class MLServiceException extends RuntimeException {
    
    private final String errorCode;
    
    public MLServiceException(String message) {
        super(message);
        this.errorCode = "ML_SERVICE_ERROR";
    }
    
    public MLServiceException(String message, Throwable cause) {
        super(message, cause);
        this.errorCode = "ML_SERVICE_ERROR";
    }
    
    public MLServiceException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
    }
    
    public MLServiceException(String message, String errorCode, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
    }
    
    public String getErrorCode() {
        return errorCode;
    }
}
