package com.jabi.notecraft.service;

import java.util.List;
import java.util.NoSuchElementException;

import javax.naming.NameNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jabi.notecraft.entity.StudyGroupEntity;
import com.jabi.notecraft.entity.SubTaskEntity;
import com.jabi.notecraft.entity.ToDoListEntity;
import com.jabi.notecraft.entity.UserEntity;
import com.jabi.notecraft.repository.StudyGroupRepository;
import com.jabi.notecraft.repository.SubTaskRepository;
import com.jabi.notecraft.repository.ToDoListRepository;
import com.jabi.notecraft.repository.UserRepository;

@Service
public class ToDoListService {
	@Autowired
	ToDoListRepository tdlrepo;
	
	@Autowired
	UserRepository urepo;
	
	@Autowired
	SubTaskRepository strepo;
	
	 @Autowired
	  private StudyGroupRepository studyGroupRepository;
	
	public ToDoListService() {
		super();
	}
	
	public ToDoListEntity postToDoListRecord(ToDoListEntity toDoList, int userId) {
		UserEntity user = urepo.findById(userId)
	            .orElseThrow(() -> new NoSuchElementException("User not found with ID: " + userId));
		
		if (toDoList.getSubTasks() != null) {
	        // Make sure each subtask has the correct toDoList reference
	        toDoList.getSubTasks().forEach(subTask -> subTask.setToDoList(toDoList));
	    }
		toDoList.setUser(user);
	    return tdlrepo.save(toDoList);
	}
	
	public ToDoListEntity postToDoListWithGroup(ToDoListEntity toDoList, int userId, int studyGroupId) {
	    UserEntity user = urepo.findById(userId)
	        .orElseThrow(() -> new NoSuchElementException("User not found with ID: " + userId));

	    StudyGroupEntity studyGroup = studyGroupRepository.findById(studyGroupId)
	        .orElseThrow(() -> new NoSuchElementException("Study Group not found with ID: " + studyGroupId));

	    if (toDoList.getSubTasks() != null) {
	        toDoList.getSubTasks().forEach(subTask -> subTask.setToDoList(toDoList));
	    }

	    toDoList.setUser(user);
	    toDoList.setStudyGroup(studyGroup); // Associate to-do list with the study group

	    return tdlrepo.save(toDoList);
	}

	public List<ToDoListEntity>getAllToDoList(int userId){
		UserEntity user = urepo.findById(userId)
	            .orElseThrow(() -> new NoSuchElementException("User not found with ID: " + userId));

	        return tdlrepo.findByUser(user);
	}
	
	public ToDoListEntity putToDoListDetails(int id, ToDoListEntity newToDoListDetails, int userId) {
        ToDoListEntity existingToDoList = tdlrepo.findById(id)
            .orElseThrow(() -> new NoSuchElementException("To-Do List record not found with ID: " + id));

        UserEntity user = urepo.findById(userId)
            .orElseThrow(() -> new NoSuchElementException("User not found with ID: " + userId));

        // Verify if the ToDoList belongs to the user
        if (!existingToDoList.getUser().equals(user)) {
            throw new SecurityException("To-Do List record does not belong to the user with ID: " + userId);
        }

        // Update details
        existingToDoList.setTaskName(newToDoListDetails.getTaskName());
        existingToDoList.setDeadline(newToDoListDetails.getDeadline());
        existingToDoList.setTaskStarted(newToDoListDetails.getTaskStarted());
        existingToDoList.setTaskEnded(newToDoListDetails.getTaskEnded());
        existingToDoList.setIsCompleted(newToDoListDetails.getIsCompleted());
        existingToDoList.setCategory(newToDoListDetails.getCategory());

        return tdlrepo.save(existingToDoList);
    }
	
	public String deleteToDoList(int id, int userId) {
        ToDoListEntity toDoList = tdlrepo.findById(id)
            .orElseThrow(() -> new NoSuchElementException("To-Do List record not found with ID: " + id));

        UserEntity user = urepo.findById(userId)
            .orElseThrow(() -> new NoSuchElementException("User not found with ID: " + userId));

        // Verify if the ToDoList belongs to the user
        if (!toDoList.getUser().equals(user)) {
            throw new SecurityException("To-Do List record does not belong to the user with ID: " + userId);
        }

        tdlrepo.delete(toDoList);
        return "To-Do List record successfully deleted!";
    }
	
	public void deleteSubTask(int taskId, int subTaskId) {
	    ToDoListEntity toDoList = tdlrepo.findById(taskId)
	        .orElseThrow(() -> new NoSuchElementException("Task not found with ID: " + taskId));
	    
	    SubTaskEntity subTask = toDoList.getSubTasks().stream()
	        .filter(st -> st.getSubTaskID() == subTaskId)
	        .findFirst()
	        .orElseThrow(() -> new NoSuchElementException("Subtask not found with ID: " + subTaskId));
	    
	    toDoList.getSubTasks().remove(subTask);
	    strepo.delete(subTask); // Assuming subTaskRepo exists
	    tdlrepo.save(toDoList); // Persist changes
	}
	
	public SubTaskEntity toggleSubTaskCompletion(int taskId, int subTaskId) {
	    ToDoListEntity toDoList = tdlrepo.findById(taskId)
	        .orElseThrow(() -> new NoSuchElementException("Task not found with ID: " + taskId));
	    
	    SubTaskEntity subTask = toDoList.getSubTasks().stream()
	        .filter(st -> st.getSubTaskID() == subTaskId)
	        .findFirst()
	        .orElseThrow(() -> new NoSuchElementException("Subtask not found with ID: " + subTaskId));
	    
	    // Toggle the isComplete status
	    subTask.setIsSubTaskCompleted(!subTask.getIsSubTaskCompleted());
	    
	    // Save the updated subtask
	    strepo.save(subTask);
	    
	    return subTask;
	}
}