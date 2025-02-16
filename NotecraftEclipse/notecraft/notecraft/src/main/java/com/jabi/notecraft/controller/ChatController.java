package com.jabi.notecraft.controller;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;
import com.jabi.notecraft.entity.ChatEntity;
import com.jabi.notecraft.entity.MessageEntity;
import com.jabi.notecraft.entity.UserEntity;
import com.jabi.notecraft.repository.UserRepository;
import com.jabi.notecraft.service.ChatService;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/chat")
public class ChatController {
    @Autowired
    ChatService chatService;
    
    @Autowired
    UserRepository userRepo;
    
    @GetMapping("/print")
	public String print() {
		return "Hello, First";
	}

    // CREATE
    @PostMapping("/addChat")
    public ChatEntity addChat(@RequestBody ChatEntity chat) {
    	return chatService.createChatWithMessages(chat);
    }
    // Fetch chats specific to the logged-in user (sender or receiver)
    @GetMapping("/getUserChats/{userId}")
    public List<ChatEntity> getUserChats(@PathVariable int userId) {
        UserEntity user = userRepo.findById(userId)
            .orElseThrow(() -> new NoSuchElementException("User not found."));
        return chatService.getChatsByUser(user);
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
    public ResponseEntity<ChatEntity> addMessageToChat(
            @PathVariable int chatId,
            @RequestBody MessageEntity message) {
        try {
            ChatEntity updatedChat = chatService.addMessageToChat(chatId, message);
            return ResponseEntity.ok(updatedChat);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
    
    // DELETE: Delete a message from a chat
    @DeleteMapping("/{chatId}/deleteMessage/{messageId}")
    public String deleteMessageFromChat(@PathVariable int chatId, @PathVariable int messageId) {
        return chatService.deleteMessageFromChat(chatId, messageId);
    }
}