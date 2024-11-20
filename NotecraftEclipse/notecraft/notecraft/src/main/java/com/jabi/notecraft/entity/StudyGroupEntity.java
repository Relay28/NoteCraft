package com.jabi.notecraft.entity;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;

@Entity
@JsonIdentityInfo(
    generator = ObjectIdGenerators.PropertyGenerator.class,
    property = "groupId"
)
public class StudyGroupEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int groupId;

    private String groupName;

    private String description;
    
    
    @ManyToMany
    @JoinTable(
        name = "study_group_users",
        joinColumns = @JoinColumn(name = "group_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
   // @JsonManagedReference("studyGroup-users") // Managed side
    private Set<UserEntity> users = new HashSet<>();


    @OneToMany(mappedBy = "studyGroup", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("study-group-notes") // Unique name for study group notes
    private List<NoteEntity> notes = new ArrayList<>();

    @OneToMany(mappedBy = "studyGroup", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("study-group-todo-lists") // Unique name for to-do lists
    private List<ToDoListEntity> toDoLists = new ArrayList<>();

    @OneToMany(mappedBy = "studyGroup", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("study-group-chats") // Unique name for chats
    private List<ChatEntity> groupChats = new ArrayList<>();

    @OneToMany(mappedBy = "studyGroup", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("study-group-files") // Unique name for files
    private List<FileEntity> files = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    @JsonBackReference("study-group-owner") // Back-reference for the owner
    private UserEntity owner;

    
    public StudyGroupEntity() {}

    public StudyGroupEntity(int groupId, String groupName, String description) {
        super();
        this.groupId = groupId;
        this.groupName = groupName;
        this.description = description;
    }

    // Getters and Setters
    public int getGroupId() {
        return groupId;
    }

    public void setGroupId(int groupId) {
        this.groupId = groupId;
    }

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public  Set<UserEntity> getUsers() {
        return users;
    }

    public void setUsers( Set<UserEntity> users) {
        this.users = users;
    }

    public List<NoteEntity> getNotes() {
        return notes;
    }

    public void setNotes(List<NoteEntity> notes) {
        this.notes = notes;
    }

    public List<ToDoListEntity> getToDoLists() {
        return toDoLists;
    }

    public void setToDoLists(List<ToDoListEntity> toDoLists) {
        this.toDoLists = toDoLists;
    }

    public List<ChatEntity> getGroupChats() {
        return groupChats;
    }

    public void setGroupChats(List<ChatEntity> groupChats) {
        this.groupChats = groupChats;
    }

    public List<FileEntity> getFiles() {
        return files;
    }

    public void setFiles(List<FileEntity> files) {
        this.files = files;
    }
    public UserEntity getOwner() {
    	return owner;
    }

	public void setOwner(UserEntity owner2) {
		this.owner=owner2;
		
	}
}
