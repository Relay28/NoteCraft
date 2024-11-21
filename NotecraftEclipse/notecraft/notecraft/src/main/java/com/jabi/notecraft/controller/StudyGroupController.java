package com.jabi.notecraft.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.jabi.notecraft.dto.CreateStudyGroupRequest;
import com.jabi.notecraft.entity.FileEntity;
import com.jabi.notecraft.entity.NoteEntity;
import com.jabi.notecraft.entity.StudyGroupEntity;
import com.jabi.notecraft.entity.ToDoListEntity;
import com.jabi.notecraft.entity.UserEntity;
import com.jabi.notecraft.service.FileService;
import com.jabi.notecraft.service.NoteService;
import com.jabi.notecraft.service.StudyGroupService;
import com.jabi.notecraft.service.ToDoListService;
import com.jabi.notecraft.service.UserService;

@RestController
@RequestMapping("/api/study-groups")
public class StudyGroupController {

    @Autowired
    private NoteService noteService;

    @Autowired
    private FileService fileService;

    @Autowired
    private ToDoListService toDoListService;
    
    @Autowired
    private StudyGroupService studyGroupService;

    // Create a new study group
//    @PostMapping("/createStudyGroup")
//    public StudyGroupEntity createStudyGroup(@RequestBody StudyGroupEntity studyGroup) {
//    	return studyGroupService.createStudyGroup(null, null, 0)
//    }
    
    @PostMapping("/{studyGroupId}/add-note")
    public ResponseEntity<NoteEntity> addNoteWithGroup(
            @PathVariable int studyGroupId,
            @RequestParam int userId,
            @RequestBody NoteEntity note) {
        NoteEntity createdNote = noteService.insertNoteWithGroup(note, userId, studyGroupId);
        return ResponseEntity.ok(createdNote);
    }

    // Upload a file to a study group
    @PostMapping("/{studyGroupId}/add-file")
    public ResponseEntity<FileEntity> uploadFileWithGroup(
            @PathVariable int studyGroupId,
            @RequestParam int userId,
            @RequestParam MultipartFile file) {
        FileEntity uploadedFile = fileService.uploadFileWithGroup(file, userId, studyGroupId);
        return ResponseEntity.ok(uploadedFile);
    }

    // Add a to-do list to a study group
    @PostMapping("/{studyGroupId}/add-todo")
    public ResponseEntity<ToDoListEntity> addToDoListWithGroup(
            @PathVariable int studyGroupId,
            @RequestParam int userId,
            @RequestBody ToDoListEntity toDoList) {
        ToDoListEntity createdToDoList = toDoListService.postToDoListWithGroup(toDoList, userId, studyGroupId);
        return ResponseEntity.ok(createdToDoList);
    }
    @PostMapping("/createStudyGroup")
    public ResponseEntity<StudyGroupEntity> createStudyGroup(@RequestBody StudyGroupEntity studyGroup) {
        StudyGroupEntity savedGroup = studyGroupService.createStudyGroup(studyGroup);
        return ResponseEntity.ok(savedGroup);
    }	

    @PostMapping("/{groupId}/add-users")
    public ResponseEntity<StudyGroupEntity> addUsersToGroup(
            @PathVariable int groupId,
            @RequestBody List<Integer> userIds) {
        StudyGroupEntity updatedGroup = studyGroupService.addUsersToGroup(groupId, userIds);
        return ResponseEntity.ok(updatedGroup);
    }
    


    // Get all study groups
    @GetMapping("/getAllStudyGroups")
    public ResponseEntity<List<StudyGroupEntity>> getAllStudyGroups() {
        List<StudyGroupEntity> studyGroups = studyGroupService.getAllStudyGroups();
        return ResponseEntity.ok(studyGroups);
    }
    
 // Get study groups by member
    @Autowired
    private UserService userService; // Inject UserService

    @GetMapping("/getGroupsForUser/{userId}")
    public ResponseEntity<List<StudyGroupEntity>> getGroupsForUser(@PathVariable int userId) {
        // Retrieve the user entity from the database
        UserEntity user = userService.findById(userId);
        if (user == null) {
            return ResponseEntity.notFound().build(); // Return 404 if user not found
        }

        // Fetch groups for the user
        List<StudyGroupEntity> groups = studyGroupService.getGroupsForUser(user);
        return ResponseEntity.ok(groups);
    }


    // Get a study group by ID
    @GetMapping("getStudyGroupById/{groupId}")
    public ResponseEntity<StudyGroupEntity> getStudyGroupById(@PathVariable int groupId) {
        StudyGroupEntity studyGroup = studyGroupService.getStudyGroupById(groupId);
        return ResponseEntity.ok(studyGroup);
    }

    // Get study groups by owner
    @GetMapping("getStudyGroupByOwner/owner/{ownerId}")
    public ResponseEntity<List<StudyGroupEntity>> getStudyGroupsByOwner(@PathVariable int ownerId) {
        List<StudyGroupEntity> studyGroups = studyGroupService.getStudyGroupsByOwner(ownerId);
        return ResponseEntity.ok(studyGroups);
    }

    // Update a study group
    @PutMapping("updateStudyGroup/{groupId}")
    public ResponseEntity<StudyGroupEntity> updateStudyGroup(
            @PathVariable int groupId,
            @RequestParam String groupName,
            @RequestParam String description) {
        StudyGroupEntity updatedGroup = studyGroupService.updateStudyGroup(groupId, groupName, description);
        return ResponseEntity.ok(updatedGroup);
    }
    
    @PutMapping("/{groupId}/transfer-ownership")
    public ResponseEntity<StudyGroupEntity> transferOwnership(
            @PathVariable int groupId, 
            @RequestBody Map<String, Integer> ownershipData) {
        int newOwnerId = ownershipData.get("newOwnerId");
        int currentOwnerId = ownershipData.get("currentOwnerId");
        StudyGroupEntity updatedGroup = studyGroupService.transferOwnership(groupId, newOwnerId, currentOwnerId);
        return ResponseEntity.ok(updatedGroup);
    }


 // Delete a study group - Only the owner can delete the group
 // Delete a study group (only if the requester is the owner)
    @DeleteMapping("deleteStudyGroup/{groupId}")
    public ResponseEntity<Void> deleteStudyGroup(@PathVariable int groupId, @RequestParam int userId) {
        // Call service to delete the group with ownership check
        studyGroupService.deleteStudyGroup(groupId, userId);
        return ResponseEntity.noContent().build();
    }


    
    @DeleteMapping("/{groupId}/remove-users")
    public ResponseEntity<StudyGroupEntity> removeUsersFromGroup(
            @PathVariable int groupId, 
            @RequestBody List<Integer> userIds, 
            @RequestParam int ownerId) {
        StudyGroupEntity updatedGroup = studyGroupService.removeUsersFromGroup(groupId, userIds, ownerId);
        return ResponseEntity.ok(updatedGroup);
    }

}
