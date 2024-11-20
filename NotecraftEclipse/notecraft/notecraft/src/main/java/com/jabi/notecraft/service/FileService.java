package com.jabi.notecraft.service;

import com.jabi.notecraft.entity.FileEntity;
import com.jabi.notecraft.entity.StudyGroupEntity;
import com.jabi.notecraft.entity.UserEntity;
import com.jabi.notecraft.repository.FileRepository;
import com.jabi.notecraft.repository.StudyGroupRepository;
import com.jabi.notecraft.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;

@Service
public class FileService {

    @Autowired
    FileRepository fileRepository;
    
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private StudyGroupRepository studyGroupRepository;
    
    private static final String UPLOAD_DIRECTORY = "C:\\Users\\Rae Addison Duque\\Documents\\CSIT340\\REACT NOTECRAFT\\gitnotecraft\\Finale\\NoteCraft\\NoteCraftStorage";

    // Upload a file
    public FileEntity uploadFile(MultipartFile file, int userId) {
        // Fetch the UserEntity from the database
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Create a new FileEntity and set its properties
        FileEntity fileEntity = new FileEntity();
        fileEntity.setFileName(file.getOriginalFilename());
        fileEntity.setFileType(file.getContentType());
        fileEntity.setSize((int) file.getSize());
        fileEntity.setUser(user); // Set the actual UserEntity, not just the userId

        try {
            // Save the file to the specified directory
            String filePath = UPLOAD_DIRECTORY + "/" + file.getOriginalFilename();
            file.transferTo(new java.io.File(filePath));
            fileRepository.save(fileEntity);
        } catch (IOException e) {
            throw new RuntimeException("File upload failed!", e);
        }

        return fileEntity;
    }

    public FileEntity uploadFileWithGroup(MultipartFile file, int userId, int studyGroupId) {
        UserEntity user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        StudyGroupEntity studyGroup = studyGroupRepository.findById(studyGroupId)
            .orElseThrow(() -> new RuntimeException("Study Group not found"));

        FileEntity fileEntity = new FileEntity();
        fileEntity.setFileName(file.getOriginalFilename());
        fileEntity.setFileType(file.getContentType());
        fileEntity.setSize((int) file.getSize());
        fileEntity.setUser(user);
        fileEntity.setStudyGroup(studyGroup); // Associate file with the study group

        try {
            String filePath = UPLOAD_DIRECTORY + "/" + file.getOriginalFilename();
            file.transferTo(new File(filePath));
            return fileRepository.save(fileEntity);
        } catch (IOException e) {
            throw new RuntimeException("File upload failed!", e);
        }
    }

    // Get all files uploaded by a specific user
    public List<FileEntity> getFilesByUserId(int userId) {
        return fileRepository.findByUserId(userId); // Use the custom query method
    }

    // Get all files (for admin or general listing)
    public List<FileEntity> getAllFiles() {
        return fileRepository.findAll();
    }

    // Update the file name
    public FileEntity updateFile(int fileId, String newFileName) {
        FileEntity existingFile = fileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("File not found"));

        String oldFileName = existingFile.getFileName();
        
        // Prepare file objects for renaming
        File oldFile = new File(UPLOAD_DIRECTORY + "/" + oldFileName);
        File newFile = new File(UPLOAD_DIRECTORY + "/" + newFileName);

        // Rename the file on disk
        if (oldFile.renameTo(newFile)) {
            existingFile.setFileName(newFileName); // Update the file name in the database
            return fileRepository.save(existingFile); // Save the updated entity to the database
        } else {
            throw new RuntimeException("Failed to rename file on disk");
        }
    }
    
    public File getFileById(int fileId) {
        FileEntity fileEntity = fileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("File not found"));

        String filePath = UPLOAD_DIRECTORY + "/" + fileEntity.getFileName();
        File file = new File(filePath);

        if (!file.exists()) {
            throw new RuntimeException("File not found on disk");
        }
        return file;
    }

    // Delete the file
    public String deleteFile(int id) {
        FileEntity fileEntity = fileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("File not found"));
        
        // Get the file name and prepare the file object
        String fileName = fileEntity.getFileName();
        File fileToDelete = new File(UPLOAD_DIRECTORY + "/" + fileName);
        
        // Delete the file from the disk
        if (fileToDelete.delete()) {
            fileRepository.deleteById(id); // Remove the file entry from the database
            return "File deleted successfully!";
        } else {
            throw new RuntimeException("Failed to delete file from disk");
        }
    }
}
