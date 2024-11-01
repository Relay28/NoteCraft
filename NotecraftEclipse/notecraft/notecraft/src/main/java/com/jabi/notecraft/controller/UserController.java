package com.jabi.notecraft.controller;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.web.multipart.MultipartFile;
import java.util.Optional;

import javax.naming.NameNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.jabi.notecraft.dto.LoginRequest;
import com.jabi.notecraft.entity.UserEntity;
import com.jabi.notecraft.service.UserService;
import com.jabi.notecraft.util.JwtResponse;
import com.jabi.notecraft.util.JwtUtils;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping(method = RequestMethod.GET, path = "/api/user")
public class UserController {
    @Autowired
    UserService userv;

    @Autowired
    JwtUtils jwtUtils;

    // Create of CRUD
    @PostMapping("/insertUserRecord")
    public UserEntity insertUserRecord(@RequestBody UserEntity user) throws NameNotFoundException {
        return userv.insertUserRecord(user);
    }

    // Read of CRUD
    @GetMapping("/getAllUsers")
    public List<UserEntity> getAllUsers() {
        return userv.getAllUsers();
    }

//    @PutMapping("/putUserDetails")
//    public UserEntity putUserDetails(@RequestParam int id, @RequestBody UserEntity newUserDetails) {
//        return userv.putUserDetails(id, newUserDetails);
//    }
    
//    @PutMapping("/putUserDetails")
//    public ResponseEntity<UserEntity> putUserDetails(
//            @RequestParam int id,
//            @RequestParam(value = "profileImg", required = false) MultipartFile profileImg,
//            @RequestBody UserEntity newUserDetails) {
//        
//        try {
//            // Call the service to update user details
//            UserEntity updatedUser = userv.putUserDetails(id, newUserDetails, profileImg);
//            return ResponseEntity.ok(updatedUser); // Return 200 OK with the updated user
//        } catch (RuntimeException e) {
//            // Return 404 if user not found or 500 for other errors
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
//        }
//    }
    
    @PutMapping("/putUserDetails")
    public ResponseEntity<UserEntity> putUserDetails(
            @RequestParam int id,
            @RequestParam(value = "profileImg", required = false) MultipartFile profileImg,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "username", required = false) String username,
            @RequestParam(value = "email", required = false) String email,
            @RequestParam(value = "password", required = false) String password) {
        
        UserEntity newUserDetails = new UserEntity();
        newUserDetails.setName(name);
        newUserDetails.setUsername(username);
        newUserDetails.setEmail(email);
        newUserDetails.setPassword(password);

        try {
            UserEntity updatedUser = userv.putUserDetails(id, newUserDetails, profileImg);
            return ResponseEntity.ok(updatedUser); 
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); 
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }




    @DeleteMapping("/deleteUserDetails/{id}")
    public String deleteUser(@PathVariable int id) {
        return userv.deleteUser(id);
    }

    // New Login Endpoint for Secure Authentication
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        Optional<UserEntity> userOpt = userv.findByUsernameAndPassword(
                loginRequest.getUsername(), loginRequest.getPassword());

        if (userOpt.isPresent()) {
            // Generate JWT token
            String jwt = jwtUtils.generateJwtToken(userOpt.get().getUsername());
            return ResponseEntity.ok(new JwtResponse(jwt));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }
}
