package com.ddop.projectmanager.model;

public enum IssueType {
    TASK("Zadanie"),
    ERROR("Błąd"),
    STORY("Historia");

    private final String label;

    IssueType(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
