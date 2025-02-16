package com.jabi.notecraft.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jabi.notecraft.entity.ChatEntity;
import com.jabi.notecraft.entity.MessageEntity;

@Repository
public interface MessageRepository extends JpaRepository<MessageEntity, Integer>{
	public MessageEntity findByMessageId(int messageId);
	List<MessageEntity> findByChat(ChatEntity chat);
}