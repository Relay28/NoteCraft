package com.jabi.notecraft.service;

import com.jabi.notecraft.entity.FileEntity;
import com.jabi.notecraft.repository.FileRepository;
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
    
    private static final String UPLOAD_DIRECTORY = "D:\\CIT Files\\3rdYear\\CSIT327 - IM 2\\Githubfolder\\NoteCraft\\NotecraftStorage";

    public FileEntity uploadFile(MultipartFile file) {
        FileEntity fileEntity = new FileEntity();
        fileEntity.setFileName(file.getOriginalFilename());
        fileEntity.setFileType(file.getContentType());
        fileEntity.setSize((int) file.getSize());

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

    public List<FileEntity> getAllFiles() {
        return fileRepository.findAll();
    }

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
