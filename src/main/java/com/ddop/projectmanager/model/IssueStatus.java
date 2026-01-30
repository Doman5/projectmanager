package com.ddop.projectmanager.model;

public enum IssueStatus {
    BACKLOG("Backlog"),
    TODO("Do zrobienia"),
    IN_PROGRESS("W toku"),
    DONE("Zrobione");

    private final String label;

    IssueStatus(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
