package com.jabi.notecraft.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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
import com.jabi.notecraft.service.ToDoListService;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping(method = RequestMethod.GET, path="/api/todolist")
public class ToDoListController {
	
	@Autowired
	ToDoListService tdlserv;
	
	@PostMapping("/postToDoListRecord")
	public ToDoListEntity postToDoListRecord(@RequestBody ToDoListEntity toDoList) {
		return tdlserv.postToDoListRecord(toDoList);
	}
	
	@GetMapping("/getAllToDoList")
	public List<ToDoListEntity>getAllToDoList(){
		return tdlserv.getAllToDoList();
	}
	
	@PutMapping("/putToDoListDetails")
	public ToDoListEntity putToDoListDetails(@RequestParam int id, @RequestBody ToDoListEntity newToDoListDetails) {
		return tdlserv.putToDoListDetails(id, newToDoListDetails);
	}
	
	@DeleteMapping("/deleteToDoList/{id}")
	public String deleteToDoList(@PathVariable int id) {
		return tdlserv.deleteToDoList(id);
	}
}
