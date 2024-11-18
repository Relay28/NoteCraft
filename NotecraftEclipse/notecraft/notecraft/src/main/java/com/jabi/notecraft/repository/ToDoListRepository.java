package com.jabi.notecraft.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jabi.notecraft.entity.ToDoListEntity;
import com.jabi.notecraft.entity.UserEntity;

@Repository
public interface ToDoListRepository extends JpaRepository<ToDoListEntity, Integer>{
	public ToDoListEntity findByTaskName(String taskName);
	List<ToDoListEntity> findByUser(UserEntity user);
}