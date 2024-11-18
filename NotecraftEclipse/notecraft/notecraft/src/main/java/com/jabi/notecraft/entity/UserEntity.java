package com.jabi.notecraft.entity;


import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.OneToMany;

@Entity
public class UserEntity {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "userId")
	private int id;
	private String name;
	  
    private String password;

	@Column(unique = true)
    private String email;
    @Column(unique = true)
    private String username;
    
    @Lob
    private String profileImg;
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<NoteEntity> notes;
    
    @OneToMany(mappedBy = "sender", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<ChatEntity> sentChats;
    

    // Getters and setters for 'notes' field
    public List<NoteEntity> getNotes() {
        return notes;
    }

    public void setNotes(List<NoteEntity> notes) {
        this.notes = notes;
    }
    
    public List<ChatEntity> getSentChats() {
        return sentChats;
    }
    
    public void setSentChats(List<ChatEntity> sentChats) {
        this.sentChats = sentChats;
    }
  
    public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getProfileImg() {
		return profileImg;
	}
	public void setProfileImg(String profileImg) {
		this.profileImg = profileImg;
	}
	
   
 
    public UserEntity() {
        super();
    }
    public UserEntity(int id, String name, String password, String email, String username, String profileImg) {
        super();
        this.id=id;
        this.name=name;
        this.password=password;
        this.email=email;
        this.username=username;
        this.profileImg=profileImg;
    }
    
    
}