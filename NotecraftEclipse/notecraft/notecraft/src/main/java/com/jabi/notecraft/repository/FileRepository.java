package com.jabi.notecraft.repository;

import com.jabi.notecraft.entity.FileEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FileRepository extends JpaRepository<FileEntity, Integer> {
    // Custom query methods can be added here if needed
}
