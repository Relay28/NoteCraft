package com.jabi.notecraft.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jabi.notecraft.entity.SubTaskEntity;

@Repository
public interface SubTaskRepository extends JpaRepository<SubTaskEntity, Integer> {
    public SubTaskEntity findBySubTaskName(String subTaskName);
}