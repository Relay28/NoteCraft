package com.jabi.notecraft.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.jabi.notecraft.entity.NoteEntity;
@Repository
public interface NoteRepository extends JpaRepository<NoteEntity,Integer>{
	
	
}