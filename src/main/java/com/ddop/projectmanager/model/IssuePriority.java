package com.ddop.projectmanager.model;

public enum IssuePriority {
    LOW("Low"),
    MEDIUM("Medium"),
    HIGH("High"),
    CRITICAL("Critical");

    private final String label;

    IssuePriority(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
