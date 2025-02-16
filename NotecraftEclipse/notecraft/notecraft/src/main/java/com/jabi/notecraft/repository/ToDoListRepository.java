package com.jabi.notecraft.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.jabi.notecraft.entity.StudyGroupEntity;
import com.jabi.notecraft.entity.ToDoListEntity;
import com.jabi.notecraft.entity.UserEntity;

@Repository
public interface ToDoListRepository extends JpaRepository<ToDoListEntity, Integer>{
	public ToDoListEntity findByTaskName(String taskName);
	List<ToDoListEntity> findByUser(UserEntity user);
	List<ToDoListEntity> findByUserAndStudyGroup(UserEntity user, StudyGroupEntity studyGroup);
	@Query("SELECT t FROM ToDoListEntity t WHERE t.deadline BETWEEN :now AND :future AND t.isCompleted = false")
	List<ToDoListEntity> findTasksWithUpcomingDeadlines(@Param("now") LocalDateTime now, @Param("future") LocalDateTime future);

}