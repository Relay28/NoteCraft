package com.jabi.notecraft.service;

import java.util.List;
import java.util.NoSuchElementException;

import javax.naming.NameNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jabi.notecraft.entity.SubTaskEntity;
import com.jabi.notecraft.repository.SubTaskRepository;

@Service
public class SubTaskService {
	@Autowired
	SubTaskRepository subTaskRepo;

	public SubTaskService() {
		super();
	}

	// Create a new SubTask record
	public SubTaskEntity postSubTaskRecord(SubTaskEntity subTask) {
		return subTaskRepo.save(subTask);
	}

	// Retrieve all SubTask records
	public List<SubTaskEntity> getAllSubTasks() {
		return subTaskRepo.findAll();
	}
	
	// Retrieve SubTasks by taskId
    public List<SubTaskEntity> getSubTasksByTaskId(int taskId) {
        return subTaskRepo.findByToDoList_taskID(taskId); // Calls the custom query method to filter by task ID
    }

	// Update an existing SubTask record
	@SuppressWarnings("finally")
	public SubTaskEntity putSubTaskDetails(int id, SubTaskEntity newSubTaskDetails) {
		SubTaskEntity subTask = new SubTaskEntity();
		
		try {
			subTask = subTaskRepo.findById(id).get();
			subTask.setSubTaskName(newSubTaskDetails.getSubTaskName());
			subTask.setSubTaskCompleted(newSubTaskDetails.isSubTaskCompleted());
		} catch (NoSuchElementException nex) {
			throw new NameNotFoundException("SubTask record not found");
		} finally {
			return subTaskRepo.save(subTask);
		}
	}

	// Delete a SubTask record
	public String deleteSubTask(int id) {
		String msg = "";

		if (subTaskRepo.findById(id).isPresent()) {
			subTaskRepo.deleteById(id);
			msg = "SubTask record successfully deleted!";
		} else {
			msg = "SubTask record not found!";
		}

		return msg;
	}
}