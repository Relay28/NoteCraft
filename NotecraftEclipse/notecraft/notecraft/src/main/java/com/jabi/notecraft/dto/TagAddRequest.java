package com.jabi.notecraft.dto;

public class TagAddRequest{
	 private int noteId;
    private String tagName;

    // Getters and setters
    public int getNoteId() { return noteId; }
    public void setNoteId(int noteId) { this.noteId = noteId; }
    public String getTagName() { return tagName; }
    public void setTagName(String tagName) { this.tagName = tagName; }
}