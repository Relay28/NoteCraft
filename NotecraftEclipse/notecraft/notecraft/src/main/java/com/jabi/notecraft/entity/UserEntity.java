package com.jabi.notecraft.entity;


import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;

@Entity
public class UserEntity {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "userId")
	private int id;
	
	private String firstName;
	private String lastName;
	private Date birthdate;
    private String password;

	@Column(unique = true)
    private String email;
    @Column(unique = true)
    private String username;
    
    @Lob
    private String profileImg;
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserEntity that = (UserEntity) o;
        return id == that.id;
    }

    @Override
    public int hashCode() {
        return Integer.hashCode(id);
    }

    

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("user-notes") // Unique name for notes reference
    private List<NoteEntity> notes = new ArrayList<>();

    @OneToMany(mappedBy = "sender", cascade = CascadeType.ALL)
    @JsonIgnore // Matches the name in ChatEntity
    private List<ChatEntity> sentChats = new ArrayList<>();
    
    @OneToMany(mappedBy = "receiver", cascade = CascadeType.ALL)
    @JsonIgnore // Matches the name in ChatEntity
    private List<ChatEntity> receivedChats = new ArrayList<>();
    
    @OneToMany(mappedBy = "sender", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<MessageEntity> sentMessages;

    @OneToMany(mappedBy = "recipient", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<MessageEntity> receivedMessages;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("user-files") // Unique name for files
    private List<FileEntity> files = new ArrayList<>();


    @ManyToMany(mappedBy = "users", fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<StudyGroupEntity> studyGroups = new HashSet<>();

    public Set<StudyGroupEntity>  getStudyGroups() {
		return studyGroups;
	}

	public void setStudyGroups(Set<StudyGroupEntity> studyGroups) {
		this.studyGroups = studyGroups;
	}

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
    
    public List<ChatEntity> getReceivedChats() {
        return receivedChats;
    }

    public void setReceivedChats(List<ChatEntity> receivedChats) {
        this.receivedChats = receivedChats;
    }

    
    public List<FileEntity> getFiles() {
        return files;
    }

    public void setFiles(List<FileEntity> files) {
        this.files = files;
    }
  
    public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
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
	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public Date getBirthdate() {
		return birthdate;
	}

	public void setBirthdate(Date birthdate) {
		this.birthdate = birthdate;
	}

    public UserEntity() {
        super();
    }
    public UserEntity(int id, String firstName,String lastName, Date birthdate, String password, String email, String username, String profileImg) {
        super();
        this.id=id;
        this.birthdate = birthdate;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password=password;
        this.email=email;
        this.username=username;
        this.profileImg=profileImg;
    }
    
    
}