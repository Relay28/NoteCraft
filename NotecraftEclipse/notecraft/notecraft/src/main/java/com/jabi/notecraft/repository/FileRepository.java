package com.jabi.notecraft.repository;

import com.jabi.notecraft.entity.FileEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FileRepository extends JpaRepository<FileEntity, Integer> {

    // Fetch files by user ID
    List<FileEntity> findByUserId(int userId);
}