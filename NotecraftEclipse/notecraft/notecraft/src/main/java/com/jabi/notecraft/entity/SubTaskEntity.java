package com.jabi.notecraft.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class SubTaskEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int subTaskID;

	private String subTaskName;
	private Boolean isSubTaskCompleted = false;

	@ManyToOne
	@JoinColumn(name = "taskID", nullable = false)
	@JsonBackReference("todo-subtasks")
	private ToDoListEntity toDoList;

	public SubTaskEntity() {
		super();
	}

	public SubTaskEntity(int subTaskID, String subTaskName, boolean isSubTaskCompleted, ToDoListEntity toDoList) {
		super();
		this.subTaskID = subTaskID;
		this.subTaskName = subTaskName;
		this.isSubTaskCompleted = isSubTaskCompleted;
		this.toDoList = toDoList;
	}
	
	public int getSubTaskID() {
		return subTaskID;
	}

	public void setSubTaskID(int subTaskID) {
		this.subTaskID = subTaskID;
	}

	public String getSubTaskName() {
		return subTaskName;
	}

	public void setSubTaskName(String subTaskName) {
		this.subTaskName = subTaskName;
	}

	public boolean getIsSubTaskCompleted() {
		return isSubTaskCompleted;
	}

	public void setIsSubTaskCompleted(boolean isSubTaskCompleted) {
		this.isSubTaskCompleted = isSubTaskCompleted;
	}

	public ToDoListEntity getToDoList() {
		return toDoList;
	}

	public void setToDoList(ToDoListEntity toDoList) {
		this.toDoList = toDoList;
	}

}