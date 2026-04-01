package com.testgen.model;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
public class Project {

    @Id
    @GeneratedValue
    private UUID id;

    private String userId;
    private String name;
    private String description;

    public Project() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}