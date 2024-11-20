package com.jabi.notecraft.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class MessageEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int messageId;

	private String sender;
	private String recipient;
	private String messageContent;
	private String date;
	
	@ManyToOne
	@JoinColumn(name = "chat_id")
	@JsonBackReference("chat-messages") // Match the name in ChatEntity
	private ChatEntity chat;

	public MessageEntity() {
		super();
	}
	public MessageEntity(int messageId, String sender, String recipient, String messageContent, String date, ChatEntity chat) {
		super();
		this.messageId=messageId;
		this.sender=sender;
		this.recipient=recipient;
		this.messageContent=messageContent;
		this.date=date;
		this.chat=chat;
	}
	public ChatEntity getChat() {
		return chat;
	}
	
	public void setChat(ChatEntity chat) {
		this.chat=chat;
	}
	
	public void setMessageId(int messageId) {
		this.messageId = messageId;
	}
	public int getMessageId() {
		return messageId;
	}
	public String getSender() {
		return sender;
	}
	public void setSender(String sender) {
		this.sender=sender;
	}
	public String getRecipient() {
		return recipient;
	}
	public void setRecipient(String recipient) {
		this.recipient=recipient;
	}
	public String getMessageContent() {
		return messageContent;
	}
	public void setMessageContent(String messageContent) {
		this.messageContent=messageContent;
	}
	public String getDate() {
		return date;
	}
	public void setDate(String date) {
		this.date=date;
	}
}