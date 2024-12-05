package com.jabi.notecraft.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToMany;
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

    @ManyToMany
    @JoinTable(
        name = "note_tags",
        joinColumns = @JoinColumn(name = "note_id"),
        inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private List<TagEntity> tags;
    public List<TagEntity> getTags() {
		return tags;
	}
	public void setTags(List<TagEntity> tags) {
		this.tags = tags;
	}
	 public void addTag(TagEntity tag) {
	        if (!this.tags.contains(tag)) {
	            this.tags.add(tag);
	            tag.getNotes().add(this);
	        }
	    }

	    // Method to remove a tag
	    public void removeTag(TagEntity tag) {
	        this.tags.remove(tag);
	        tag.getNotes().remove(this);
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
