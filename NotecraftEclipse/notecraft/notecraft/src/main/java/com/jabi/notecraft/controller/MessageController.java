package com.jabi.notecraft.controller;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jabi.notecraft.entity.ChatEntity;
import com.jabi.notecraft.entity.MessageEntity;
import com.jabi.notecraft.repository.ChatRepository;
import com.jabi.notecraft.service.MessageService;

@RestController
@RequestMapping(method = RequestMethod.GET,path="/api/message")
public class MessageController {
	@Autowired
	MessageService mserv;
	
	@Autowired
	private ChatRepository chatRepo;
	
	@GetMapping("/print")
	public String print() {
		return "Hello, First";
	}
	//CREATE
	@PostMapping("/addMessage")
	public MessageEntity postTaskRecord(@RequestBody MessageEntity message) {
		return mserv.addMessage(message);
	}
	//READ
	@GetMapping("/getAllMessages")
	public List<MessageEntity>getAllMessages(){
		return mserv.getAllMessages();
	}
	//READ VERSION 2
	@GetMapping("/getAllMessagesV2")
    public String getAllMessagesV2() {
        List<MessageEntity> messages = mserv.getAllMessages();
        StringBuilder response = new StringBuilder();

        for(int i = 0; i < messages.size(); i++) {
            MessageEntity message= messages.get(i);
            response.append("Sender: " + message.getSender()+ "<br>")
                    .append("Recipient: " + message.getRecipient() + "<br>")
                    .append("Message Content: " + message.getMessageContent() + "<br>")
                    .append("Date Sent: " + message.getDate() + "<br><br>");
        }

        return response.toString();
    }
	//UPDATE
	@PutMapping("/putMessageDetails")
	public ResponseEntity<MessageEntity> putMessageDetails(@RequestParam int messageId, @RequestBody MessageEntity newMessageDetails) {
	    try {
	        MessageEntity updatedMessage = mserv.putMessageDetails(messageId, newMessageDetails);
	        return ResponseEntity.ok(updatedMessage);
	    } catch (NoSuchElementException e) {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
	    }
	}
	
	//DELETE
	@DeleteMapping("/deleteMessage/{messageId}")
	public String deleteMessage(@PathVariable int messageId) {
		return mserv.deleteMessage(messageId);
	}
	
	@GetMapping("/getAllMessagesOfChat/{chatId}")
    public List<MessageEntity> getChatMessages(@PathVariable int chatId) {
        ChatEntity chat = chatRepo.findById(chatId)
            .orElseThrow(() -> new NoSuchElementException("Chat not found."));
        return mserv.getAllMessages().stream()
            .filter(msg -> msg.getChat().equals(chat))
            .toList();
    }
}