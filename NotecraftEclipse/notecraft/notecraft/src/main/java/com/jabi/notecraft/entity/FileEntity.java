package com.jabi.notecraft.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "files")
public class FileEntity {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private int fileId;
    
    private String fileName;
    private String fileType;
    private int size;
    
    @Lob
    private byte[] fileData; // Store the file's binary data (optional)

    // Add the user association here
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonBackReference("user-files") // Unique back-reference for UserEntity
    private UserEntity user;;
    
    @ManyToOne
    @JoinColumn(name = "study_group_id", nullable = true)
    @JsonBackReference("study-group-files") // Unique back-reference for StudyGroupEntity
    private StudyGroupEntity studyGroup;
    
    public StudyGroupEntity getStudyGroup() {
        return studyGroup;
    }

    public void setStudyGroup(StudyGroupEntity studyGroup) {
        this.studyGroup = studyGroup;
    }

    // Constructors
    public FileEntity() {}

    public FileEntity(int fileId, String fileName, String fileType, int size, byte[] fileData, UserEntity user) {
        this.fileId = fileId;
        this.fileName = fileName;
        this.fileType = fileType;
        this.size = size;
        this.fileData = fileData;
        this.user = user;
    }

    // Getters and Setters
    public int getFileId() {
        return fileId;
    }

    public void setFileId(int fileId) {
        this.fileId = fileId;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }

    public byte[] getFileData() {
        return fileData;
    }

    public void setFileData(byte[] fileData) {
        this.fileData = fileData;
    }

    // Getter and setter for user
    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }
}
