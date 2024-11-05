package com.jabi.notecraft.entity;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

@Entity
public class ChatEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int chatId;

    private String sender;
    private String receiver;

    @OneToMany(mappedBy="chat", cascade = CascadeType.ALL, orphanRemoval = true) // A chat can have many messages
    @JsonManagedReference
    private List<MessageEntity> messages = new ArrayList<>(); // List of messages for the chat
    
    public ChatEntity() {
        super();
    }

    public ChatEntity(int chatId, String sender, String receiver, List<MessageEntity> messages) {
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

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
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