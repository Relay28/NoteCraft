package com.jabi.notecraft.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.jabi.notecraft.entity.ChatEntity;
import com.jabi.notecraft.entity.UserEntity;

@Repository
public interface ChatRepository extends JpaRepository<ChatEntity, Integer> {
    public ChatEntity findByChatId(int chatId);
    List<ChatEntity> findAllBySenderOrReceiver(UserEntity sender, String receiverUsername);
}