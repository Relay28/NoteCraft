package com.jabi.notecraft.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jabi.notecraft.entity.ToDoListEntity;
import com.jabi.notecraft.entity.SubTaskEntity;
import com.jabi.notecraft.service.ToDoListService;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping(method = RequestMethod.GET, path="/api/todolist")
public class ToDoListController {
	
	@Autowired
	ToDoListService tdlserv;
	
	@PostMapping("/postToDoListRecord")
	public ToDoListEntity postToDoListRecord(@RequestBody ToDoListEntity toDoList, @RequestParam("userId") int userId) {
		return tdlserv.postToDoListRecord(toDoList, userId);
	}
	
	@GetMapping("/getAllToDoList")
	public List<ToDoListEntity>getAllToDoList(@RequestParam int userId){
		return tdlserv.getAllToDoList(userId);
	}
	
	@PutMapping("/putToDoListDetails")
	public ToDoListEntity putToDoListDetails(@RequestParam int id, @RequestBody ToDoListEntity newToDoListDetails, @RequestParam int userId) {
		return tdlserv.putToDoListDetails(id, newToDoListDetails, userId);
	}
	
	@PutMapping("/updateTaskEnded")
	public ToDoListEntity updateTaskEnded(@RequestParam int id, @RequestBody ToDoListEntity newToDoListDetails, @RequestParam int userId) {
		return tdlserv.updateTaskEnded(id, newToDoListDetails, userId);
	}
	
	@DeleteMapping("/deleteToDoList/{id}")
	public String deleteToDoList(@PathVariable int id, @RequestParam int userId) {
		return tdlserv.deleteToDoList(id, userId);
	}
	
	@DeleteMapping("/deleteSubTask/{taskId}/{subTaskId}")
	public ResponseEntity<String> deleteSubTask(@PathVariable int taskId, @PathVariable int subTaskId) {
		tdlserv.deleteSubTask(taskId, subTaskId);
	    return ResponseEntity.ok("Subtask deleted successfully");
	}
	
	@PutMapping("/toggleSubTaskCompletion/{taskId}/{subTaskId}")
	public SubTaskEntity toggleSubTaskCompletion(@PathVariable int taskId, @PathVariable int subTaskId) {
	    return tdlserv.toggleSubTaskCompletion(taskId, subTaskId);
	}
}