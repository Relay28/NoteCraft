package com.jabi.notecraft.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.jabi.notecraft.entity.StudyGroupEntity;
import com.jabi.notecraft.entity.UserEntity;
import java.util.List;

public interface StudyGroupRepository extends JpaRepository<StudyGroupEntity, Integer> {
    List<StudyGroupEntity> findByOwner(UserEntity owner);
    @Query("SELECT sg FROM StudyGroupEntity sg " +
    	       "LEFT JOIN sg.users u " +
    	       "WHERE sg.owner = :user OR u = :user")
    	List<StudyGroupEntity> findAllGroupsForUser(@Param("user") UserEntity user);

}
