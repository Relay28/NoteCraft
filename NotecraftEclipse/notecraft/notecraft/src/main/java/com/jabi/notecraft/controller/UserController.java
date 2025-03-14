package com.jabi.notecraft.controller;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

import org.springframework.web.multipart.MultipartFile;
import java.util.Optional;
import org.springframework.web.bind.annotation.CrossOrigin;
//import javax.naming.NameNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.jabi.notecraft.dto.LoginRequest;
import com.jabi.notecraft.entity.UserEntity;
import com.jabi.notecraft.repository.UserRepository;
import com.jabi.notecraft.service.UserService;
import com.jabi.notecraft.util.JwtResponse;
import com.jabi.notecraft.util.JwtUtils;
import org.springframework.security.core.context.SecurityContextHolder;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@CrossOrigin(origins = "http://localhost:5173", methods = {RequestMethod.POST, RequestMethod.GET, RequestMethod.PUT, RequestMethod.DELETE})

@RequestMapping(method = RequestMethod.GET, path = "/api/user")
public class UserController {
    @Autowired
    UserService userv;

    @Autowired
    JwtUtils jwtUtils;
    
    @PostMapping("/insertUserRecord")
    public ResponseEntity<?> insertUserRecord(@RequestBody UserEntity user) {
        try {
            UserEntity savedUser = userv.insertUserRecord(user);
            return ResponseEntity.ok(savedUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error occurred while registering the user");
        }
    }

    @GetMapping("/search")
    public List<UserEntity> searchUsers(@RequestParam String username) {
        return userv.searchUsersByUsername(username);
    }

    @GetMapping("/checkAvailability")
    public ResponseEntity<?> checkAvailability(@RequestParam(required = false) String username, 
                                               @RequestParam(required = false) String email) {
        if (username != null && !username.isEmpty()) {
            boolean isUsernameTaken = userv.isUsernameTaken(username);
            return ResponseEntity.ok().body(Map.of("available", !isUsernameTaken));
        }
        if (email != null && !email.isEmpty()) {
            boolean isEmailTaken = userv.isEmailTaken(email);
            return ResponseEntity.ok().body(Map.of("available", !isEmailTaken));
        }
        return ResponseEntity.badRequest().body("Please provide either a username or email to check.");
    }


    
    // Read of CRUD
    @GetMapping("/getAllUsers")
    public List<UserEntity> getAllUsers() {
        return userv.getAllUsers();
    }

    
    @PutMapping("/putUserDetails")
    public ResponseEntity<UserEntity> putUserDetails(
            @RequestParam int id,
            @RequestParam(value = "profileImg", required = false) MultipartFile profileImg,
            @RequestParam(value = "birthdate", required = false) String birthdateStr,
            @RequestParam(value = "firstName", required = false) String firstName,
            @RequestParam(value = "lastName", required = false) String lastName,
            @RequestParam(value = "username", required = false) String username,
            @RequestParam(value = "email", required = false) String email,
            @RequestParam(value = "password", required = false) String password) {

        UserEntity newUserDetails = new UserEntity();
        newUserDetails.setFirstName(firstName);
        newUserDetails.setLastName(lastName);
        newUserDetails.setUsername(username);
        newUserDetails.setEmail(email);
        newUserDetails.setPassword(password);

        // Parse the birthdate
        Date birthdate = null;
        if (birthdateStr != null) {
            try {
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                birthdate = sdf.parse(birthdateStr);
            } catch (ParseException e) {
                return ResponseEntity.badRequest().body(null); // Invalid date format
            }
        }
        newUserDetails.setBirthdate(birthdate);

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
    
    
    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser(HttpServletRequest request) {
        String token = jwtUtils.extractJwtFromRequest(request);

        if (token == null || !jwtUtils.validateJwtToken(token)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid token");
        }

        // Add token to a blacklist or remove it from a database
        boolean isRevoked = jwtUtils.revokeJwtToken(token);
        
        if (isRevoked) {
            // Clear the security context
            SecurityContextHolder.clearContext();
            return ResponseEntity.ok("User logged out successfully");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to revoke the token");
        }
    }
    
    @GetMapping("/checkUser/{username}")
    public ResponseEntity<Boolean> checkUser(@PathVariable String username) {
        boolean exists = userv.doesUserExist(username);
        return ResponseEntity.ok(exists);
    }
    @GetMapping("/usernames")
    public ResponseEntity<List<String>> getAllUsernames() {
        List<String> usernames = userv.getAllUsernames();
        return ResponseEntity.ok(usernames);
    }
    @GetMapping("/getUserByUsername/{username}")
    public UserEntity getUserByUsername(@PathVariable String username) {
    	return userv.getUserByUsername(username);
    }
}