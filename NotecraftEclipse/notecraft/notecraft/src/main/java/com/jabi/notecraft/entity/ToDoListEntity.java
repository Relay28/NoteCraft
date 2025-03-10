package com.jabi.notecraft.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

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
	
	@OneToMany(mappedBy = "toDoList", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@JsonManagedReference("todo-subtasks") // Unique name for sub-tasks
	private List<SubTaskEntity> subTasks;

	@ManyToOne
	@JoinColumn(name = "user_id", nullable = false)
	@JsonBackReference("user-todo-lists") // Unique back-reference for UserEntity
	private UserEntity user;

	@ManyToOne
	@JoinColumn(name = "study_group_id", nullable = true)
	@JsonBackReference("study-group-todo-lists") // Unique back-reference for StudyGroupEntity
	private StudyGroupEntity studyGroup;


	public StudyGroupEntity getStudyGroup() {
	    return studyGroup;
	}

	public void setStudyGroup(StudyGroupEntity studyGroup) {
	    this.studyGroup = studyGroup;
	}

	
	public ToDoListEntity() {
		super();
	}
	
	public ToDoListEntity(int taskID, String taskName, String description, String deadline,
			String taskStarted, String taskEnded, boolean isCompleted,
			String category, List<SubTaskEntity> subTasks) {
		super();
		this.taskID = taskID;
		this.taskName = taskName;
		this.description = description;
		this.deadline = deadline;
		this.taskStarted = taskStarted;
		this.taskEnded = taskEnded;
		this.isCompleted = isCompleted;
		this.category = category;
		this.subTasks = subTasks;
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
	
	public List<SubTaskEntity> getSubTasks() {
		return subTasks;
	}

	public void setSubTasks(List<SubTaskEntity> subTasks) {
		this.subTasks = subTasks;
	}
	
	public UserEntity getUser() {
		return user;
	}
	
	public void setUser(UserEntity user) {
		this.user = user;
	}
}