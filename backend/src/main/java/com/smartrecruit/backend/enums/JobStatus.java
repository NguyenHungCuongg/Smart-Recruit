package com.smartrecruit.backend.enums;

public enum JobStatus {
    OPEN,      // Job đang  mở và có thể nhận ứng viên mới
    ACTIVE,    // Job đang được mở và có thể nhận ứng viên, nhưng có thể đang proccessing...
    CLOSED     // Job không còn nhận ứng viên mới
}
