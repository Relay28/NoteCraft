package com.jabi.notecraft.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class ToDoListEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int taskID;
	
	private String taskName;
	
    private String description;
	
	private String deadline;
	private String taskStarted;
	private String taskEnded;
	private boolean isCompleted;
	private String category;
	
	public ToDoListEntity() {
		super();
	}
	
	public ToDoListEntity(int taskID, String taskName, String description, String deadline,
			String taskStarted, String taskEnded, boolean isCompleted,
			String category) {
		super();
		this.taskID = taskID;
		this.taskName = taskName;
		this.description = description;
		this.deadline = deadline;
		this.taskStarted = taskStarted;
		this.taskEnded = taskEnded;
		this.isCompleted = isCompleted;
		this.category = category;
	}
	
	public int getTaskID() {
		return taskID;
	}
	
	public String getTaskName() {
		return taskName;
	}
	
	public void setTaskName(String taskName) {
		this.taskName = taskName;
	}
	
	public String getDescription() {
		return description;
	}
	
	public void setDescription(String description) {
		this.description = description;
	}
	
	public String getDeadline() {
		return deadline;
	}
	
	public void setDeadline(String deadline) {
		this.deadline = deadline;
	}
	
	public String getTaskStarted() {
		return taskStarted;
	}
	
	public void setTaskStarted(String taskStarted) {
		this.taskStarted = taskStarted;
	}
	
	public String getTaskEnded() {
		return taskEnded;
	}
	
	public void setTaskEnded(String taskEnded) {
		this.taskEnded = taskEnded;
	}
	
	public boolean getIsCompleted() {
		return isCompleted;
	}
	
	public void setIsCompleted(boolean isCompleted) {
		this.isCompleted = isCompleted;
	}
	
	public String getCategory() {
		return category;
	}
	
	public void setCategory(String category) {
		this.category = category;
	}
}