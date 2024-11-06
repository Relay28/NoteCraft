package com.jabi.notecraft.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.jabi.notecraft.entity.FileEntity;
import com.jabi.notecraft.service.FileService;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping(method=RequestMethod.GET,path="/api/files")
public class FileController {

    @Autowired
    FileService fileService;

    @PostMapping("/upload")
    public ResponseEntity<FileEntity> uploadFile(@RequestPart("file") MultipartFile file) {
        // Handle file and save it
        FileEntity savedFile = fileService.uploadFile(file);
        return ResponseEntity.ok(savedFile);
    }

    @GetMapping("/getAll")
    public List<FileEntity> getAllFiles() {
        return fileService.getAllFiles();
    }

    @PutMapping("/updateFile")
    public ResponseEntity<FileEntity> updateFile(@RequestParam int fileId, @RequestParam String newFileName) {
        FileEntity updatedFile = fileService.updateFile(fileId, newFileName);
        return ResponseEntity.ok(updatedFile);
    }

    @DeleteMapping("/delete/{id}")
    public String deleteFile(@PathVariable int id) {
        return fileService.deleteFile(id);
    }
}