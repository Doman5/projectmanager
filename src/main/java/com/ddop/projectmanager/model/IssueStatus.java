package com.ddop.projectmanager.model;

public enum IssueStatus {
    BACKLOG("Backlog"),
    TODO("To do"),
    IN_PROGRESS("In progress"),
    DONE("Done");

    private final String label;

    IssueStatus(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
