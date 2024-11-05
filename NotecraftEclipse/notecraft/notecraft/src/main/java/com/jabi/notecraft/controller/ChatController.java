package com.jabi.notecraft.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.jabi.notecraft.entity.ChatEntity;
import com.jabi.notecraft.entity.MessageEntity;
import com.jabi.notecraft.service.ChatService;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/chat")
public class ChatController {
    @Autowired
    ChatService chatService;
    
    @GetMapping("/print")
	public String print() {
		return "Hello, First";
	}

    // CREATE
    @PostMapping("/addChat")
    public ChatEntity addChat(@RequestBody ChatEntity chat) {
    	return chatService.createChatWithMessages(chat);
    }

    // READ
    @GetMapping("/getAllChats")
    public List<ChatEntity> getAllChats() {
        return chatService.getAllChats();
    }

    @GetMapping("/getChatById/{chatId}")
    public ChatEntity getChatById(@PathVariable int chatId) {
        return chatService.getChatById(chatId);
    }

    // UPDATE
    @PutMapping("/updateChat/{chatId}")
    public ChatEntity updateChat(@PathVariable int chatId, @RequestBody ChatEntity chatDetails) {
        return chatService.updateChat(chatId, chatDetails);
    }

    // DELETE
    @DeleteMapping("/deleteChat/{chatId}")
    public String deleteChat(@PathVariable int chatId) {
        return chatService.deleteChat(chatId);
    }

    // ADD MESSAGE TO CHAT
    @PostMapping("/addMessageToChat/{chatId}")
    public ChatEntity addMessageToChat(@PathVariable int chatId, @RequestBody MessageEntity message) {
        return chatService.addMessageToChat(chatId, message);
    }
    
    // DELETE: Delete a message from a chat
    @DeleteMapping("/{chatId}/deleteMessage/{messageId}")
    public String deleteMessageFromChat(@PathVariable int chatId, @PathVariable int messageId) {
        return chatService.deleteMessageFromChat(chatId, messageId);
    }
}