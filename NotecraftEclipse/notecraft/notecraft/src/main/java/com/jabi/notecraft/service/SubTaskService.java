package com.jabi.notecraft.service;

import java.util.List;
import java.util.NoSuchElementException;

import javax.naming.NameNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jabi.notecraft.entity.SubTaskEntity;
import com.jabi.notecraft.repository.SubTaskRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class SubTaskService {
	@Autowired
	SubTaskRepository subTaskRepo;

	public SubTaskService() {
		super();
	}

	// Create a new SubTask record
	public SubTaskEntity postSubTaskRecord(SubTaskEntity subTask) {
        // Set the default value of isSubTaskCompleted to false for new subtasks
        subTask.setIsSubTaskCompleted(false);
        return subTaskRepo.save(subTask);
    }

	// Retrieve all SubTask records
	public List<SubTaskEntity> getAllSubTasks() {
        return subTaskRepo.findAll();
    }
	
	// Retrieve SubTasks by taskId
	public List<SubTaskEntity> getSubTasksByTaskId(int taskId) {
        return subTaskRepo.findByToDoList_taskID(taskId);
    }

	// Update an existing SubTask record
	public SubTaskEntity putSubTaskDetails(int id, SubTaskEntity newSubTaskDetails) throws NameNotFoundException {
        SubTaskEntity subTask = subTaskRepo.findById(id)
                .orElseThrow(() -> new NameNotFoundException("SubTask record not found"));
        
        subTask.setSubTaskName(newSubTaskDetails.getSubTaskName());
        
        return subTaskRepo.save(subTask);
    }

	// Delete a SubTask record
	public String deleteSubTask(int id) {
        if (subTaskRepo.findById(id).isPresent()) {
            subTaskRepo.deleteById(id);
            return "SubTask record successfully deleted!";
        } else {
            return "SubTask record not found!";
        }
    }
	
	public SubTaskEntity toggleSubTaskCompletion(int subTaskId) {
        SubTaskEntity subTask = subTaskRepo.findById(subTaskId)
                .orElseThrow(() -> new EntityNotFoundException("SubTask not found with id: " + subTaskId));

        // Toggle the completion status
        subTask.setIsSubTaskCompleted(!subTask.getIsSubTaskCompleted());
        return subTaskRepo.save(subTask);
    }
}