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

import com.jabi.notecraft.entity.SubTaskEntity;
import com.jabi.notecraft.service.SubTaskService;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping(method = RequestMethod.GET, path = "/api/subtask")
public class SubTaskController {

    @Autowired
    SubTaskService subTaskService;

    // Endpoint to create a new SubTask
    @PostMapping("/postSubTaskRecord")
    public SubTaskEntity postSubTaskRecord(@RequestBody SubTaskEntity subTask) {
        return subTaskService.postSubTaskRecord(subTask);
    }

    // Endpoint to retrieve all SubTasks
    @GetMapping("/getSubTasksByTaskId")
    public List<SubTaskEntity> getSubTasksByTaskId(@RequestParam int taskId) {
        return subTaskService.getSubTasksByTaskId(taskId);
    }

    // Endpoint to update an existing SubTask
    @PutMapping("/putSubTaskDetails")
    public SubTaskEntity putSubTaskDetails(@RequestParam int id, @RequestBody SubTaskEntity newSubTaskDetails) {
        return subTaskService.putSubTaskDetails(id, newSubTaskDetails);
    }

    // Endpoint to delete a SubTask by ID
    @DeleteMapping("/deleteSubTask/{id}")
    public String deleteSubTask(@PathVariable int id) {
        return subTaskService.deleteSubTask(id);
    }
}