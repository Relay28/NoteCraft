package com.jabi.notecraft.service;

import java.util.List;
import java.util.NoSuchElementException;

import javax.naming.NameNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jabi.notecraft.entity.ToDoListEntity;
import com.jabi.notecraft.repository.ToDoListRepository;

@Service
public class ToDoListService {
	@Autowired
	ToDoListRepository tdlrepo;
	
	public ToDoListService() {
		super();
	}
	
	public ToDoListEntity postToDoListRecord(ToDoListEntity toDoList) {
		return tdlrepo.save(toDoList);
	}
	
	public List<ToDoListEntity>getAllToDoList(){
		return tdlrepo.findAll();
	}
	
	@SuppressWarnings("finally")
	public ToDoListEntity putToDoListDetails(int id, ToDoListEntity newToDoListDetails) {
		ToDoListEntity toDoList = new ToDoListEntity();
		
		try {
			toDoList = tdlrepo.findById(id).get();
			
			toDoList.setTaskName(newToDoListDetails.getTaskName());
			toDoList.setDeadline(newToDoListDetails.getDeadline());
			toDoList.setTaskStarted(newToDoListDetails.getTaskStarted());
			toDoList.setTaskEnded(newToDoListDetails.getTaskEnded());
			toDoList.setIsCompleted(newToDoListDetails.getIsCompleted());
			toDoList.setCategory(newToDoListDetails.getCategory());
		}
		catch(NoSuchElementException nex) {
			throw new NameNotFoundException ("To-Do List record not found");
		}
		finally {
			return tdlrepo.save(toDoList);
		}
	}
	
	public String deleteToDoList(int id) {
		String msg = "";
		
		if(tdlrepo.findById(id) != null) {
			tdlrepo.deleteById(id);
			
			msg = "To-Do List record successfully deleted!";
		}
		else {
			msg = "To-Do List record not found!";
		}
		
		return msg;
	}
}