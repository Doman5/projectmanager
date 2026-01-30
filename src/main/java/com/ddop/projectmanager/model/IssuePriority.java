package com.ddop.projectmanager.model;

public enum IssuePriority {
    LOW("Niski"),
    MEDIUM("Średni"),
    HIGH("Wysoki"),
    CRITICAL("Krytyczny");

    private final String label;

    IssuePriority(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
