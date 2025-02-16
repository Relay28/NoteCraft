package com.jabi.notecraft.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jabi.notecraft.entity.TagEntity;

public interface TagRepository extends JpaRepository<TagEntity, Integer> {
	  Optional<TagEntity> findByTagName(String tagName);
	}