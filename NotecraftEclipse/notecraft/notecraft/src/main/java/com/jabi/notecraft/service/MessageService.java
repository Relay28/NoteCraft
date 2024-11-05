package com.jabi.notecraft.service;

import java.util.List;
import java.util.NoSuchElementException;

import javax.naming.NameNotFoundException;

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
	@SuppressWarnings("finally")
	public MessageEntity putMessageDetails(int messageId, MessageEntity newMessageDetails) {
		MessageEntity msg=new MessageEntity();
		try {
			msg=mrepo.findById(messageId).get();
			msg.setSender(newMessageDetails.getSender());
			msg.setRecipient(newMessageDetails.getRecipient());
			msg.setMessageContent(newMessageDetails.getMessageContent());
			msg.setDate(newMessageDetails.getDate());
		} catch(NoSuchElementException nex) {
			throw new NameNotFoundException("Message "+ messageId +"not found.");
		} finally {
			return mrepo.save(msg);
		}
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