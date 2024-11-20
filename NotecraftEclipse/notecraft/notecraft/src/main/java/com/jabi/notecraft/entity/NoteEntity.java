package com.jabi.notecraft.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;

@Entity
public class NoteEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int noteid;

    private String title;
    private String description;

    @Lob
    private String content; // Stores text and embedded image data

    private String dateCreated;

    public NoteEntity() {
        super();
    }
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference("user-notes") // Unique back-reference for UserEntity
    private UserEntity user;

    @ManyToOne
    @JoinColumn(name = "study_group_id", nullable = true)
    @JsonBackReference("study-group-notes") // Unique back-reference for StudyGroupEntity
    private StudyGroupEntity studyGroup;

    @Column(name = "is_group_note", nullable = false)
    private boolean isGroupNote = false;

    public boolean isGroupNote() {
        return isGroupNote;
    }

    public void setGroupNote(boolean isGroupNote) {
        this.isGroupNote = isGroupNote;
    }
    public StudyGroupEntity getStudyGroup() {
        return studyGroup;
    }

    public void setStudyGroup(StudyGroupEntity studyGroup) {
        this.studyGroup = studyGroup;
    }

    
    public UserEntity getUser() {
        return user;
    }
    
    

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public NoteEntity(int noteid, String title, String description, String content) {
        super();
        this.noteid = noteid;
        this.title = title;
        this.description = description;
        this.content = content;
    }

    public int getNoteid() {
        return noteid;
    }

    public void setNoteid(int noteid) {
        this.noteid = noteid;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(String dateCreated) {
        this.dateCreated = dateCreated;
    }
}
