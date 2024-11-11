import * as React from 'react';
import {Grid, List, ListItem, ListItemAvatar, Avatar, ListItemText, TextField, Typography, Paper, IconButton, Box, Dialog, DialogTitle, DialogContent, DialogActions, Button} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete'; // Import Delete Icon
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api/chat';

export default function Messages() {
  const [chats, setChats] = React.useState([]);
  const [selectedConversation, setSelectedConversation] = React.useState(null);
  const [newMessage, setNewMessage] = React.useState("");
  const [isAddingChat, setIsAddingChat] = React.useState(false);
  const [editMessageId, setEditMessageId] = React.useState(null);
  const [editMessageContent, setEditMessageContent] = React.useState("");
  const [isReceiverFinalized, setIsReceiverFinalized] = React.useState(false);
  
  const [openDialog, setOpenDialog] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState({chatId:null, messageId:null});
  const [openEditConfirmDialog, setOpenEditConfirmDialog] = React.useState(false);

  React.useEffect(() => {
    const loadChats = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/getAllChats`);
        setChats(response.data);
      } catch (error) {
        console.error("Error loading chats:", error);
      }
    };
    
    loadChats();
  }, []);

  const handleChatClick = async (conversation) => {
    setSelectedConversation(null); // Reset first to prevent overlap
    try {
      const response = await axios.get(`${API_BASE_URL}/getChatById/${conversation.chatId}`);
      setSelectedConversation(response.data);
    } catch (error) {
      console.error("Error loading conversation:", error);
    }
  };

  const handleAddChatClick = () => {
    setSelectedConversation({ receiver: '', messages: [] });
    setIsAddingChat(true);
    setIsReceiverFinalized(false);
  };

  const handleReceiverConfirm=()=>{
    setIsReceiverFinalized(true);
  }

  const handleSendMessage = async () => {
    if (newMessage.trim() && selectedConversation?.receiver) {
      const newMessageData = {
        sender: 'default', // Adjust this as needed
        recipient: selectedConversation.receiver,
        messageContent: newMessage.trim(),
        date: '2024-11-11', // Use a dynamic date if needed
      };
  
      try {
        if (selectedConversation?.chatId) {
          // Add the message to an existing chat
          await axios.post(`${API_BASE_URL}/addMessageToChat/${selectedConversation.chatId}`, newMessageData);
  
          // Reload the chat from the backend to ensure consistency
          const updatedChat = await axios.get(`${API_BASE_URL}/getChatById/${selectedConversation.chatId}`);
          const updatedMessages = updatedChat.data.messages; // Define updatedMessages here
          setSelectedConversation(updatedChat.data);
  
          // Update the chat list with the latest chat data
          setChats((prevChats) =>
            prevChats.map((chat) =>
              chat.chatId === selectedConversation.chatId ? { ...chat, messages: updatedMessages } : chat
            )
          );
        } else {
          // Creating a new chat
          const newChatData = {
            receiver: selectedConversation.receiver,
            sender: 'default',
            messages: [newMessageData],
          };
  
          const response = await axios.post(`${API_BASE_URL}/addChat`, newChatData);
          const createdChat = response.data; // Assuming the API returns the newly created chat
  
          // Add the new chat to the chat list and select it
          setChats((prevChats) => [...prevChats, createdChat]);
          setSelectedConversation(createdChat);
        }
  
        // Clear the new message input
        setNewMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };
  
  

  const handleEditClick = (messageId, currentContent) => {
    setEditMessageId(messageId);
    setEditMessageContent(currentContent);
  };

  const handleEditChange = (e) => {
    setEditMessageContent(e.target.value);
  };

  const handleEditSubmit = async () => {
    setOpenEditConfirmDialog(true);
  };

  const handleEditCancel = () => {
    setEditMessageId(null);
    setEditMessageContent("");
  };

  const confirmEditSubmit = async () => {
    if (selectedConversation && editMessageContent && editMessageId) {
      try {
        const updatedMessages = selectedConversation.messages.map((msg) =>
          msg.messageId === editMessageId ? { ...msg, messageContent: editMessageContent } : msg
        );
  
        const updatedChat = { ...selectedConversation, messages: updatedMessages };
        
        // Send the update to the backend
        await axios.put(`${API_BASE_URL}/updateChat/${selectedConversation.chatId}`, updatedChat);
        
        // Update the selected conversation and clear edit state
        setSelectedConversation(updatedChat);
        setEditMessageId(null);
        setEditMessageContent("");
  
        // Update chat list with edited message
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat.chatId === selectedConversation.chatId ? updatedChat : chat
          )
        );
  
        // Close confirmation dialog
        setOpenEditConfirmDialog(false);
      } catch (error) {
        console.error("Error updating message:", error);
      }
    }
  };

  const closeEditConfirmDialog = () => {
    setOpenEditConfirmDialog(false);
  };

  const openConfirmationDialog = (chatId, messageId = null) => {
    setDeleteTarget({ chatId, messageId });
    setOpenDialog(true);
  };

  const closeConfirmationDialog = () => {
    setOpenDialog(false);
    setDeleteTarget({ chatId: null, messageId: null });
  };

  const handleDeleteClick = async () => {
    const {chatId, messageId} = deleteTarget;
    try {
      if (messageId) {
        // Check if the message exists in the selected conversation
        const messageExists = selectedConversation?.messages?.some((msg) => msg.messageId === messageId);
        if (messageExists) {
          // Delete specific message
          await axios.delete(`${API_BASE_URL}/${chatId}/deleteMessage/${messageId}`);
  
          // Reload the updated chat from the backend to ensure consistency
          const updatedChat = await axios.get(`${API_BASE_URL}/getChatById/${chatId}`);
          setSelectedConversation(updatedChat.data);
  
          // Update the chat list to reflect the change
          setChats((prevChats) =>
            prevChats.map((chat) =>
              chat.chatId === chatId ? updatedChat.data : chat
            )
          );
        }
      } else {
        // Delete the entire chat if no messageId is provided
        await axios.delete(`${API_BASE_URL}/deleteChat/${chatId}`);
  
        // Remove the deleted chat from the chat list
        setChats((prevChats) => prevChats.filter((chat) => chat.chatId !== chatId));
  
        // Clear the selected conversation if it was the deleted chat
        if (selectedConversation?.chatId === chatId) {
          setSelectedConversation(null);
        }
      }
      closeConfirmationDialog();
    } catch (error) {
      console.error("Error deleting:", error);
    }
  }; 

  return (
    <Paper sx={{ height: '82vh', display: 'flex', flexDirection: 'column', paddingLeft:'60px', marginLeft:30, width:'130vh'}}>
      {/* Dialog for Delete Confirmation */}
      <Dialog open={openDialog} onClose={closeConfirmationDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this {deleteTarget.messageId ? "message" : "chat"}?</DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={closeConfirmationDialog} color="error">Cancel</Button>
          <Button variant="contained" onClick={handleDeleteClick} color="primary">Yes</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Confirmation Dialog */}
      <Dialog open={openEditConfirmDialog} onClose={closeEditConfirmDialog}>
        <DialogTitle>Confirm Edit</DialogTitle>
        <DialogContent>Are you sure you want to edit this message?</DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => { handleEditCancel(); closeEditConfirmDialog(); }} color="error">Cancel</Button>
          <Button variant="contained" onClick={confirmEditSubmit} color="primary">Yes</Button>
        </DialogActions>
      </Dialog>

      <Grid container sx={{ flex: 1, overflow:'auto' }}>
        {/* Left column - Conversations List */}
        <Grid item xs={4} sx={{ borderRight: '1px solid #ccc', padding: '10px', overflow:'auto', height:'100%' }}>
          <List>
            {chats.map((conversation) => (
              <ListItem key={conversation.chatId} button onClick={() => handleChatClick(conversation)}>
                <ListItemAvatar>
                  <Avatar alt={conversation.receiver} />
                </ListItemAvatar>
                <ListItemText primary={conversation.receiver} secondary={conversation.lastMessage} />
                <IconButton color="secondary" onClick={(e) => {
                  e.stopPropagation(); // Prevent the click from triggering the ListItem onClick
                  openConfirmationDialog(conversation.chatId);
                }}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </ListItem>
            ))}
          </List>
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <button onClick={handleAddChatClick}>Add Chat</button>
          </Box>
        </Grid>

        {/* Right column - Messages List */}
        <Grid item xs={8} sx={{ display: 'flex', flexDirection: 'column', height:'100%' }}>
          <div style={{ padding: '10px', backgroundColor: '#E8F5E9', overflowY: 'auto', flexGrow: 1 }}>
            
            {isAddingChat && !isReceiverFinalized ? (
              <>
                {/* Input for Receiver's Name */}
                <TextField
                  variant="outlined"
                  fullWidth
                  placeholder="Enter receiver's name"
                  value={selectedConversation?.receiver || ''}
                  onChange={(e) => setSelectedConversation((prev) => ({ ...prev, receiver: e.target.value }))}
                />
                {/* Confirm Button */}
                <Box sx={{ mt: 1, textAlign: 'right' }}>
                  <button onClick={handleReceiverConfirm}>Confirm</button>
                </Box>
              </>
            ) : (
              <>
                {/* Display Receiver's Name */}
                <Typography variant="h6">{selectedConversation?.receiver}</Typography>

                {/* Message list display */}
                <Box sx={{ mt: 2 }}>
                  {selectedConversation?.messages?.map((msg) => (
                    <Box key={msg.messageId} sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: msg.sender === selectedConversation.sender ? 'flex-end' : 'flex-start',
                      marginBottom: '3px',
                      maxWidth: '100%',
                      marginRight: msg.sender === selectedConversation.sender ? '20px' : '0px',
                      padding:'10px'
                    }}>
                      
                      {/* Sender/Receiver Name */}
                      <Typography variant="body2" sx={{ fontWeight: 'bold', marginBottom: '5px' }}>
                        {msg.sender === selectedConversation.sender ? 'You' : msg.sender}
                      </Typography>

                      {/* Message Content */}
                      <Box sx={{
                          padding: '10px',
                          borderRadius: '10px',
                          backgroundColor: msg.sender === selectedConversation.sender ? '#D1C4E9' : '#C8E6C9',
                        }}>
                          {editMessageId === msg.messageId ? (
                            <>
                              <TextField
                                value={editMessageContent}
                                onChange={handleEditChange}
                                variant="outlined"
                                size="small"
                                fullWidth
                                sx={{ marginBottom: '5px' }}
                              />
                              <Box sx={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                                <Button variant='contained' onClick={handleEditCancel} color="error" size="small">
                                  Cancel
                                </Button>
                                <IconButton color="primary" onClick={handleEditSubmit}>
                                  <SendIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            </>
                          ) : (
                            <Typography variant="body1">{msg.messageContent}</Typography>
                          )}
                        </Box>

                      {/* Edit and Delete Options */}
                      <Box sx={{ color: 'gray', display: 'flex', gap: '10px', marginTop: '5px' }}>
                        {editMessageId === msg.messageId ? null : (
                          <>
                            <span style={{ cursor: 'pointer' }} onClick={() => handleEditClick(msg.messageId, msg.messageContent)}>Edit</span>
                            <span style={{ cursor: 'pointer' }} onClick={() => openConfirmationDialog(selectedConversation.chatId, msg.messageId)}>Delete</span>
                          </>
                        )}
                      </Box>
                    </Box>
                  ))}
                </Box>
              </>
            )}
          </div>
          
          {/* Bottom section - New Message Box */}
          {(selectedConversation && (isReceiverFinalized || selectedConversation.receiver)) && (
            <Box sx={{ display: 'flex', padding: 2, borderTop: '1px solid #ccc' }}>
              <TextField
                variant="outlined"
                placeholder="Type a message"
                fullWidth
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                sx={{ marginRight: '10px' }}
              />
              <IconButton color="primary" onClick={handleSendMessage}>
                <SendIcon />
              </IconButton>
            </Box>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
}