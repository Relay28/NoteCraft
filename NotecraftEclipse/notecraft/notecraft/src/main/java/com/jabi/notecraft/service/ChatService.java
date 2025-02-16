package com.jabi.notecraft.service;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jabi.notecraft.entity.ChatEntity;
import com.jabi.notecraft.entity.MessageEntity;
import com.jabi.notecraft.entity.UserEntity;
import com.jabi.notecraft.repository.ChatRepository;
import com.jabi.notecraft.repository.MessageRepository;
import com.jabi.notecraft.repository.UserRepository;

@Service
public class ChatService {
    @Autowired
    ChatRepository chatRepo;
    
    @Autowired
    MessageRepository mrepo;
    
    @Autowired
    private UserRepository userRepo;
    
    
 // Fetch chats created by the user (sender) or where the user is the receiver
    public List<ChatEntity> getChatsByUser(UserEntity user) {
        return chatRepo.findBySenderOrReceiver(user);
    }


    public ChatEntity createChatWithMessages(ChatEntity chat) {
        if (chat.getSender() == null || chat.getReceiver() == null) {
            throw new IllegalArgumentException("Sender or receiver cannot be null.");
        }
        UserEntity sender = userRepo.findById(chat.getSender().getId())
            .orElseThrow(() -> new NoSuchElementException("Sender not found."));
        UserEntity receiver = userRepo.findById(chat.getReceiver().getId())
            .orElseThrow(() -> new NoSuchElementException("Receiver not found."));

        chat.setSender(sender);
        chat.setReceiver(receiver);

        if (chat.getMessages() != null) {
            chat.getMessages().forEach(message -> message.setChat(chat));
        }
        return chatRepo.save(chat);
    }

    // READ
    public List<ChatEntity> getAllChats() {
        return chatRepo.findAll();
    }

    // READ one chat by ID
    public ChatEntity getChatById(int chatId) {
        return chatRepo.findById(chatId).orElseThrow(() -> new NoSuchElementException("Chat not found."));
    }

    // UPDATE
    public ChatEntity updateChat(int chatId, ChatEntity newChatDetails) {
        ChatEntity existingChat = getChatById(chatId);
        existingChat.setSender(newChatDetails.getSender());
        existingChat.setReceiver(newChatDetails.getReceiver());
        
        // Clear the existing messages and add new ones
        existingChat.getMessages().clear();
        for (MessageEntity message : newChatDetails.getMessages()) {
            existingChat.addMessage(message); // Use the addMessage method
        }
        return chatRepo.save(existingChat);
    }

    // DELETE
    public String deleteChat(int chatId) {
        chatRepo.deleteById(chatId);
        return "Chat deleted successfully.";
    }

    // Add a message to a chat
    public ChatEntity addMessageToChat(int chatId, MessageEntity message) {
    	ChatEntity chat = chatRepo.findById(chatId)
                .orElseThrow(() -> new NoSuchElementException("Chat not found with id: " + chatId));

        message.setChat(chat); // Associate the message with the chat
        mrepo.save(message);   // Save the message first

        chat.getMessages().add(message); // Add the message to the chat
        return chatRepo.save(chat);      // Save the chat with the new message
    }

    // Delete a message inside a chat
    public String deleteMessageFromChat(int chatId, int messageId) {
        ChatEntity chat = chatRepo.findById(chatId)
            .orElseThrow(() -> new NoSuchElementException("Chat not found."));
        chat.getMessages().removeIf(msg -> msg.getMessageId() == messageId);
        chatRepo.save(chat);
        return "Message with ID " + messageId + " removed from chat.";
    }

}