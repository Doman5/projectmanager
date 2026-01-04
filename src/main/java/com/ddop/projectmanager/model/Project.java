package com.ddop.projectmanager.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "projects")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creator_id")
    private User owner;

    @OneToMany(mappedBy = "project", fetch = FetchType.LAZY)
    private List<Sprint> sprints;

    @OneToMany(mappedBy = "project", fetch = FetchType.LAZY)
    private List<Issue> issues;
}
