package com.jabi.notecraft.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jabi.notecraft.entity.ToDoListEntity;

@Repository
public interface ToDoListRepository extends JpaRepository<ToDoListEntity, Integer>{
	public ToDoListEntity findByTaskName(String taskName);
}