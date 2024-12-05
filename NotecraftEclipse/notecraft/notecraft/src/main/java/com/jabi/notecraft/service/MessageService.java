package com.jabi.notecraft.service;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jabi.notecraft.entity.MessageEntity;
import com.jabi.notecraft.repository.MessageRepository;

@Service
public class MessageService {{
	}
	@Autowired
	MessageRepository mrepo;
	public MessageService() {
		super();
		// TODO Auto-generated constructor stub
	}
	//CREATE
	public MessageEntity addMessage(MessageEntity message) {
        return mrepo.save(message);
    }
	//READ
	public List<MessageEntity> getAllMessages(){
		return mrepo.findAll();
	}
	//UPDATE
	public MessageEntity putMessageDetails(int messageId, MessageEntity newMessageDetails) {
		MessageEntity existingMessage = mrepo.findById(messageId)
	            .orElseThrow(() -> new NoSuchElementException("Message not found with id: " + messageId));

	    existingMessage.setMessageContent(newMessageDetails.getMessageContent());
	    existingMessage.setDate(newMessageDetails.getDate());
	    return mrepo.save(existingMessage);
	}
	//DELETE
	public String deleteMessage(int messageId) {
		String msg="";
		if(mrepo.findById(messageId)!= null) {
			mrepo.deleteById(messageId);
			msg="Message Record successfully deleted.";
		} else {
			msg=messageId+" NOT FOUND!";
		}
		return msg;
	}
}
