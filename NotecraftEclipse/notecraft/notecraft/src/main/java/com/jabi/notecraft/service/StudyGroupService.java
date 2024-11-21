package com.jabi.notecraft.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jabi.notecraft.entity.StudyGroupEntity;
import com.jabi.notecraft.entity.UserEntity;
import com.jabi.notecraft.repository.StudyGroupRepository;
import com.jabi.notecraft.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class StudyGroupService {

    @Autowired
    private StudyGroupRepository studyGroupRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public StudyGroupEntity addUsersToGroup(int groupId, List<Integer> userIds) {
        // Fetch the study group
        StudyGroupEntity studyGroup = studyGroupRepository.findById(groupId)
                .orElseThrow(() -> new NoSuchElementException("Study Group not found with ID: " + groupId));

        // Fetch and validate the users
        List<UserEntity> users = userRepository.findAllById(userIds);
        if (users.isEmpty()) {
            throw new NoSuchElementException("No valid users found for the provided IDs.");
        }

        
        // Add users to the group, ensuring no duplicates
        Set<UserEntity> existingUsers = studyGroup.getUsers();
        if (existingUsers == null) {
            existingUsers = new HashSet<>();
        }
        existingUsers.addAll(users); // Add users to the existing set
        studyGroup.setUsers(existingUsers);

        // Save the updated study group
        return studyGroupRepository.save(studyGroup);
    }
    
    public List<StudyGroupEntity> getGroupsForUser(UserEntity user) {
        return studyGroupRepository.findAllGroupsForUser(user);
    }
    public StudyGroupEntity createStudyGroup(StudyGroupEntity studyGroup) {
        // Ensure the owner exists in the database
        UserEntity owner = userRepository.findById(studyGroup.getOwner().getId())
                .orElseThrow(() -> new RuntimeException("Owner not found with ID: " + studyGroup.getOwner().getId()));
        studyGroup.setOwner(owner);

        // Ensure all users exist in the database
        Set<UserEntity> existingUsers =new HashSet<>();
        for (UserEntity user : studyGroup.getUsers()) {
            UserEntity existingUser = userRepository.findById(user.getId())
                    .orElseThrow(() -> new RuntimeException("User not found with ID: " + user.getId()));
            existingUsers.add(existingUser);
        }
        studyGroup.setUsers(existingUsers);

        // Save the study group
        return studyGroupRepository.save(studyGroup);
    }
    public StudyGroupEntity transferOwnership(int groupId, int currentOwnerId, int newOwnerId) {
        // Fetch the study group
        StudyGroupEntity group = studyGroupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Study group not found with ID: " + groupId));
        
        // Validate current owner
        if (group.getOwner().getId() != currentOwnerId) {
            throw new SecurityException("Only the current owner can transfer ownership.");
        }

        // Validate new owner exists in the group
        UserEntity newOwner = userRepository.findById(newOwnerId)
                .orElseThrow(() -> new RuntimeException("New owner not found with ID: " + newOwnerId));

        if (!group.getUsers().contains(newOwner)) {
            throw new RuntimeException("New owner must be a member of the group.");
        }

        // Transfer ownership
        group.setOwner(newOwner);

        // Save and return the updated group
        return studyGroupRepository.save(group);
    }


    public StudyGroupEntity removeUsersFromGroup(int groupId, List<Integer> userIds, int ownerId) {
        // Fetch the group
        StudyGroupEntity group = studyGroupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found with ID: " + groupId));
        
        // Check if the requester is the current owner
        if (group.getOwner().getId() != ownerId) {
            throw new SecurityException("Only the owner can remove users.");
        }
        
        // Ensure the users being removed are part of the group
        List<UserEntity> usersToRemove = userRepository.findAllById(userIds);
        if (!group.getUsers().containsAll(usersToRemove)) {
            throw new RuntimeException("Some users to be removed are not part of the group.");
        }
        
        // Remove the users from the group
        group.getUsers().removeAll(usersToRemove);

        // Save and return updated group
        return studyGroupRepository.save(group);
    }


    // Get all study groups
    public List<StudyGroupEntity> getAllStudyGroups() {
        return studyGroupRepository.findAll();
    }

    // Get a study group by ID
    public StudyGroupEntity getStudyGroupById(int groupId) {
        return studyGroupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Study Group with ID " + groupId + " not found"));
    }

    // Get study groups by owner
    public List<StudyGroupEntity> getStudyGroupsByOwner(int ownerId) {
        UserEntity owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("Owner with ID " + ownerId + " not found"));
        return studyGroupRepository.findByOwner(owner);
    }

    // Update a study group
    public StudyGroupEntity updateStudyGroup(int groupId, String groupName, String description) {
        StudyGroupEntity studyGroup = studyGroupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Study Group with ID " + groupId + " not found"));
        studyGroup.setGroupName(groupName);
        studyGroup.setDescription(description);
        return studyGroupRepository.save(studyGroup);
    }

    // Delete a study group
 // Delete a study group (only if the requester is the owner)
    public void deleteStudyGroup(int groupId, int userId) {
        // Fetch the group by ID
        StudyGroupEntity group = studyGroupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Study Group with ID " + groupId + " not found"));
        
        // Check if the user requesting the deletion is the owner
        if (group.getOwner().getId() != userId) {
            throw new SecurityException("Only the owner can delete the group.");
        }
        
        // Proceed with deletion if the user is the owner
        studyGroupRepository.deleteById(groupId);
    }

}
