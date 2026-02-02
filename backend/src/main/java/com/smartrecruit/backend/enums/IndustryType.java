package com.smartrecruit.backend.enums;

/**
 * Enum representing different industry sectors for job positions.
 * This allows the system to handle recruitment across multiple domains,
 * not just IT/Software development.
 */
public enum IndustryType {
    IT("Information Technology"),
    MARKETING("Marketing & Advertising"),
    SALES("Sales & Business Development"),
    ACCOUNTING("Accounting & Finance"),
    HEALTHCARE("Healthcare & Medical"),
    FINANCE("Finance & Banking"),
    EDUCATION("Education & Training"),
    MANUFACTURING("Manufacturing & Production"),
    HOSPITALITY("Hospitality & Tourism"),
    RETAIL("Retail & E-commerce"),
    CONSTRUCTION("Construction & Engineering"),
    LEGAL("Legal & Compliance"),
    HR("Human Resources"),
    LOGISTICS("Logistics & Supply Chain"),
    OTHER("Other");

    private final String displayName;

    IndustryType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
