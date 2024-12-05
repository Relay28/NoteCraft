package com.jabi.notecraft.repository;

import java.util.List;
import java.util.Optional;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.jabi.notecraft.entity.UserEntity;


@Repository
public interface UserRepository extends JpaRepository<UserEntity, Integer> {
    Optional<UserEntity> findByUsernameAndPassword(String username, String password);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    @Query("SELECT u.username FROM UserEntity u ORDER BY u.username ASC")
    List<String> findAllUsernames();
    UserEntity findByUsername(String username);;
}
