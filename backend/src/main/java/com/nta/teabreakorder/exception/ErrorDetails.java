package com.nta.teabreakorder.exception;

import java.util.Date;

public class ErrorDetails {
    private Date timestamp;
    private String message;
    private String code;

    public ErrorDetails(Date timestamp, String message, String details) {
         super();
         this.timestamp = timestamp;
         this.message = message;
         this.code = details;
    }

    public Date getTimestamp() {
         return timestamp;
    }

    public String getMessage() {
         return message;
    }

    public String getDetails() {
         return code;
    }
}
