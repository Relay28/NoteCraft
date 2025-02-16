package com.jabi.notecraft.entity;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;

@Entity
public class TagEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int tagId;
    private String tagName;

    
    public TagEntity() {
    	super();
    }
    public TagEntity(int tagId, String tagName,List<NoteEntity> notes) {
    	super();
    	this.tagId=tagId;
    	this.tagName=tagName;
    	this.notes=notes;
    }
    public int getTagId() {
		return tagId;
	}
	@ManyToMany(mappedBy = "tags")
	@JsonIgnore
    private List<NoteEntity> notes=new ArrayList<>();

	public void setTagId(int tagId) {
		this.tagId = tagId;
	}

	public List<NoteEntity> getNotes() {
		return notes;
	}

	public void setNotes(List<NoteEntity> notes) {
		this.notes = notes;
	}

	public String getTagName() {
		return tagName;
	}



	public void setTagName(String tagName2) {
		this.tagName=tagName2;
		
	}
}

// Update NoteEntity

