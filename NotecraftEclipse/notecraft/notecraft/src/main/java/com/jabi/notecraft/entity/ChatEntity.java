package com.jabi.notecraft.entity;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

@Entity
public class ChatEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int chatId;

    @ManyToOne
    @JsonBackReference("user-sent-chats")
    @JoinColumn(name = "sender_id")
    private UserEntity sender;

    private String receiver;

    @OneToMany(mappedBy = "chat", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("chat-messages")
    private List<MessageEntity> messages;

    @ManyToOne
    @JoinColumn(name = "study_group_id", nullable = true)
    @JsonBackReference("study-group-chats")
    private StudyGroupEntity studyGroup;

    public StudyGroupEntity getStudyGroup() {
        return studyGroup;
    }

    public void setStudyGroup(StudyGroupEntity studyGroup) {
        this.studyGroup = studyGroup;
    }

    
    public ChatEntity() {
        super();
        this.messages = new ArrayList<>();
    }

    	
    public ChatEntity(int chatId, UserEntity sender, String receiver, List<MessageEntity> messages) {
    	super();
        this.chatId = chatId;
        this.sender = sender;
        this.receiver = receiver;
        this.messages = messages;
    }

    // Getters and setters
    public int getChatId() {
        return chatId;
    }

    public void setChatId(int chatId) {
        this.chatId = chatId;
    }

    public UserEntity getSender() {
        return sender;
    }

    public void setSender(UserEntity sender) {
        this.sender = sender;
    }

    public String getReceiver() {
        return receiver;
    }

    public void setReceiver(String receiver) {
        this.receiver = receiver;
    }

    public List<MessageEntity> getMessages() {
        return messages;
    }

    public void setMessages(List<MessageEntity> messages) {
        this.messages = messages;
    }
    
    // Add method to remove a message by ID
    public void removeMessageById(int messageId) {
    	if (messages != null) {
            messages.removeIf(message -> message.getMessageId() == messageId);
        }
    }
    // Method to add a message to the chat
    public void addMessage(MessageEntity message) {
    	if (message != null) {
            message.setChat(this);
            messages.add(message);
        }
    }
}