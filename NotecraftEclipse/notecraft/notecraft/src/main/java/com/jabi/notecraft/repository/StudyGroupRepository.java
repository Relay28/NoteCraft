package com.jabi.notecraft.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.jabi.notecraft.entity.StudyGroupEntity;
import com.jabi.notecraft.entity.UserEntity;
import java.util.List;

public interface StudyGroupRepository extends JpaRepository<StudyGroupEntity, Integer> {
    List<StudyGroupEntity> findByOwner(UserEntity owner);
}
