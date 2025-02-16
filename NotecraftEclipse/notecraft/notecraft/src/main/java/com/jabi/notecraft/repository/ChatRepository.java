package com.jabi.notecraft.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.jabi.notecraft.entity.ChatEntity;
import com.jabi.notecraft.entity.UserEntity;

@Repository
public interface ChatRepository extends JpaRepository<ChatEntity, Integer> {
    public ChatEntity findByChatId(int chatId);
    @Query("SELECT c FROM ChatEntity c WHERE c.sender = :user OR c.receiver = :user")
    List<ChatEntity> findBySenderOrReceiver(@Param("user") UserEntity user);
}