package com.jabi.notecraft.service;

import java.util.List;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jabi.notecraft.entity.UserEntity;
import com.jabi.notecraft.repository.UserRepository;

@Service
public class UserService {
    @Autowired
    private UserRepository urepo;

    // Constructor
    public UserService() {
        super();
    }

    public UserEntity insertUserRecord(UserEntity user) {
        if (user.getUsername() == null || user.getUsername().isEmpty()) {
            throw new IllegalArgumentException("Username cannot be null or empty");
        }
        if (user.getEmail() == null || user.getEmail().isEmpty()) {
            throw new IllegalArgumentException("Email cannot be null or empty");
        }

        if (isUsernameTaken(user.getUsername())) {
            throw new IllegalArgumentException("Username is already taken");
        }
        if (isEmailTaken(user.getEmail())) {
            throw new IllegalArgumentException("Email is already registered");
        }

        return urepo.save(user);
    }

    // Read of CRUD
    public List<UserEntity> getAllUsers() {
        return urepo.findAll();
    }

    
    public UserEntity putUserDetails(int id, UserEntity newUserDetails, MultipartFile profileImg) {
        UserEntity user = urepo.findById(id).orElseThrow(() -> new NoSuchElementException("User " + id + " not found"));

        // Update user details from newUserDetails
        if (newUserDetails.getName() != null) {
            user.setName(newUserDetails.getName());
        }
        if (newUserDetails.getUsername() != null) {
            user.setUsername(newUserDetails.getUsername());
        }
        if (newUserDetails.getPassword() != null) {
            user.setPassword(newUserDetails.getPassword());
        }
        if (newUserDetails.getEmail() != null) {
            user.setEmail(newUserDetails.getEmail());
        }

        // Save profile image if provided
        if (profileImg != null && !profileImg.isEmpty()) {
            saveProfileImage(profileImg, user);
        }

        // Save the updated user entity to the repository
        return urepo.save(user);
    }

    private void saveProfileImage(MultipartFile profileImg, UserEntity user) {
        try {
            String folder = "uploads/profileImages/";
            String filename = System.currentTimeMillis() + "_" + profileImg.getOriginalFilename(); // Avoid duplicate names

            Path path = Paths.get(folder + filename);
            Files.createDirectories(path.getParent());
            Files.write(path, profileImg.getBytes());

            user.setProfileImg(filename); // Store the filename in the user entity
        } catch (IOException e) {
            throw new RuntimeException("Failed to save profile image: " + e.getMessage(), e);
        }
    }


    public String deleteUser(int id) {
        String msg = "";
        if (urepo.findById(id) != null) {
            urepo.deleteById(id);
            msg = "User Record successfully deleted!";
        } else {
            msg = id + " NOT FOUND!";
        }
        return msg;
    }

    // New method for finding a user by username and password
    public Optional<UserEntity> findByUsernameAndPassword(String username, String password) {
        return urepo.findByUsernameAndPassword(username, password);
    }
    
    public boolean isUsernameTaken(String username) {
        return urepo.existsByUsername(username);
    }

    public boolean isEmailTaken(String email) {
        return urepo.existsByEmail(email);
    }

    public UserEntity insertUserRecord1(UserEntity user) {
        if (isUsernameTaken(user.getUsername())) {
            throw new IllegalArgumentException("Username is already taken");
        }
        if (isEmailTaken(user.getEmail())) {
            throw new IllegalArgumentException("Email is already registered");
        }
        return urepo.save(user);
    }

	
}
