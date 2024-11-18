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
import com.jabi.notecraft.repository.UserRepository;

@Service
public class ChatService {
    @Autowired
    ChatRepository chatRepo;
    
    @Autowired
    private UserRepository userRepo;
    
    

    public ChatEntity createChatWithMessages(ChatEntity chat) {
        // Validate if sender and receiver are provided
        if (chat.getSender() == null || chat.getReceiver() == null || chat.getReceiver().isEmpty()) {
            throw new IllegalArgumentException("Sender or receiver cannot be null or empty");
        }

        // Fetch sender and receiver user entities from the database
        UserEntity sender = userRepo.findById(chat.getSender().getId())
                .orElseThrow(() -> new NoSuchElementException("Sender not found."));
        
        // Fetch the receiver by username
        UserEntity receiverEntity = userRepo.findByUsername(chat.getReceiver())
                .orElseThrow(() -> new NoSuchElementException("Receiver not found."));

        chat.setSender(sender);  // Set sender
        chat.setReceiver(receiverEntity.getUsername());  // Set receiver as username

        // Ensure the messages list is initialized
        if (chat.getMessages() == null) {
            chat.setMessages(new ArrayList<>());
        }

        // Set the chat reference for each message
        for (MessageEntity message : chat.getMessages()) {
            message.setChat(chat);
        }

        // Save the chat (along with messages)
        return chatRepo.save(chat);
    }

    
//    //CREATE
//    public ChatEntity addMessageToChat(int chatId, MessageEntity newMessage) {
//        // Retrieve the chat by ID
//        Optional<ChatEntity> chatOptional = chatRepo.findById(chatId);
//
//        if (chatOptional.isPresent()) {
//            ChatEntity chat = chatOptional.get();
//            
//            // Set the chat reference in the new message
//            newMessage.setChat(chat);
//            
//            // Add the new message to the chat's list of messages
//            chat.getMessages().add(newMessage);
//            
//            // Save the new message
//            messageRepo.save(newMessage);
//            
//            // Save the updated chat (optional since the message is already saved)
//            return chatRepo.save(chat);
//        } else {
//            throw new RuntimeException("Chat with id " + chatId + " not found.");
//        }
//    }

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
        ChatEntity chat = getChatById(chatId); // Get the chat by ID
        message.setChat(chat); // Set the chat reference in the message
        chat.addMessage(message); // Link the message to the chat
        return chatRepo.save(chat); // Save the chat, which cascades the save to the message
    }

    // Delete a message inside a chat
    public String deleteMessageFromChat(int chatId, int messageId) {
        ChatEntity chat = getChatById(chatId);
        chat.removeMessageById(messageId); // Use existing method
        chatRepo.save(chat);
        return "Message with ID " + messageId + " removed from Chat with ID " + chatId;
    }
}