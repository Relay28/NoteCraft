package com.jabi.notecraft.repository;

import com.jabi.notecraft.entity.NotificationEntity;
import com.jabi.notecraft.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<NotificationEntity, Long> {
    List<NotificationEntity> findByUserAndIsReadFalse(UserEntity user);
}
