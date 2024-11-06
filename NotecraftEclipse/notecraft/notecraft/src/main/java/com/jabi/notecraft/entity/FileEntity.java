package com.jabi.notecraft.entity;

import jakarta.persistence.*;

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

    // Constructors
    public FileEntity() {}

    public FileEntity(int fileId, String fileName, String fileType, int size, byte[] fileData) {
        this.fileId = fileId;
        this.fileName = fileName;
        this.fileType = fileType;
        this.size = size;
        this.fileData = fileData;
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

    // Additional Methods if needed
}
