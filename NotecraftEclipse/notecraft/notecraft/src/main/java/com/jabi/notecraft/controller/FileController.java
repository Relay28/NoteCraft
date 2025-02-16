package com.jabi.notecraft.controller;

import java.io.File;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.core.io.Resource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.multipart.MultipartFile;
import com.jabi.notecraft.entity.FileEntity;
import com.jabi.notecraft.service.FileService;



@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/files")
public class FileController {

    @Autowired
    private FileService fileService;

    // File upload endpoint with userId
    @PostMapping("/upload")
    public ResponseEntity<FileEntity> uploadFile(@RequestPart("file") MultipartFile file, @RequestParam int userId) {
        // Handle file and save it
        FileEntity savedFile = fileService.uploadFile(file, userId);
        return ResponseEntity.ok(savedFile);
    }
    @GetMapping("/download/{fileId}")
    public ResponseEntity<Resource> downloadFile(@PathVariable int fileId) {
        File file = fileService.getFileById(fileId);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + file.getName() + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(new FileSystemResource(file));
    }

    @GetMapping("/getFilesByUser/{userId}")
    public List<FileEntity> getFilesByUserId(@PathVariable int userId) {
        return fileService.getFilesByUserId(userId); // Fetch only files for the logged-in user
    }

    // Get all files
    @GetMapping("/getAll")
    public List<FileEntity> getAllFiles() {
        return fileService.getAllFiles();
    }

    // Update file name
    @PutMapping("/updateFile")
    public ResponseEntity<FileEntity> updateFile(@RequestParam int fileId, @RequestParam String newFileName) {
        FileEntity updatedFile = fileService.updateFile(fileId, newFileName);
        return ResponseEntity.ok(updatedFile);
    }

    // Delete file
    @DeleteMapping("/delete/{id}")
    public String deleteFile(@PathVariable int id) {
        return fileService.deleteFile(id);
    }
}
