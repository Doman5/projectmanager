package com.ddop.projectmanager.model;

public enum IssueType {
    TASK("Task"),
    ERROR("Bug"),
    STORY("Story");

    private final String label;

    IssueType(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
