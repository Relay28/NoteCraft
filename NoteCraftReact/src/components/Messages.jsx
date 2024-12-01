  import React, {useState, useEffect} from 'react';
  import {Grid, List, ListItem, ListItemAvatar, Avatar, ListItemText, TextField, Typography, Paper, IconButton, Box, Dialog, DialogTitle, DialogContent, DialogActions, Button} from '@mui/material';
  import SendIcon from '@mui/icons-material/Send';
  import DeleteIcon from '@mui/icons-material/Delete'; // Import Delete Icon
  import axios from 'axios';
  import { useLocation } from 'react-router';


  const API_BASE_URL = 'http://localhost:8081/api/chat';

  export default function Messages() {
    const [chats, setChats] = React.useState([]);
    const [selectedConversation, setSelectedConversation] = React.useState(null);
    const [newMessage, setNewMessage] = React.useState("");
    const [isAddingChat, setIsAddingChat] = React.useState(false);
    const [editMessageId, setEditMessageId] = React.useState(null);
    const [isReceiverFinalized, setIsReceiverFinalized] = React.useState(false);
    
    const [openDialog, setOpenDialog] = React.useState(false);
    const [deleteTarget, setDeleteTarget] = React.useState({chatId:null, messageId:null});
    const [userExists, setUserExists] = useState(true);
    const [isMessageBoxDisabled, setIsMessageBoxDisabled] = useState(false);
    const location = useLocation();
    const personalInfo = location.state?.user || { id: '', username: '' };
   

    React.useEffect(() => {
      const loadChats = async () => {
        try {
          if (!personalInfo.id) {
            console.error("User information is not available.");
            return;
          }
    
          // Fetch chats where the user is either the sender or the receiver
          const response = await axios.get(`${API_BASE_URL}/getChatsByUser`, {
            params: { userId: personalInfo.id }  // Pass the user id as a request parameter
          });
    
          setChats(response.data);
        } catch (error) {
          console.error("Error loading chats for user:", error);
        }
      };
    
      loadChats();
    }, [personalInfo.id]); // Dependency on `personalInfo.id` instead of `personalInfo.username`

    const handleReceiverConfirm = async () => {
      const username = selectedConversation?.receiver?.trim();
      if (!username) {
        alert("Please enter a receiver's name.");
        return;
      }
    
      const userExists = await checkUserExists(username);
      if (userExists) {
        setIsReceiverFinalized(true);
      } else {
        alert("User not found. Please choose a valid recipient.");
      }
    };
    
    const handleSendMessage = async () => {
      if (newMessage.trim() && selectedConversation?.receiver) {
        if (editMessageId) {
          // Edit existing message
          try {
            const updatedMessages = selectedConversation.messages.map((msg) =>
              msg.messageId === editMessageId ? { ...msg, messageContent: newMessage.trim() } : msg
            );
    
            const updatedChat = { ...selectedConversation, messages: updatedMessages };
    
            // Update backend
            await axios.put(`${API_BASE_URL}/updateChat/${selectedConversation.chatId}`, updatedChat);
    
            // Update local state
            setSelectedConversation(updatedChat);
            setChats((prevChats) =>
              prevChats.map((chat) =>
                chat.chatId === selectedConversation.chatId ? updatedChat : chat
              )
            );
    
            // Clear edit state
            setEditMessageId(null);
            setNewMessage("");
          } catch (error) {
            console.error("Error updating message:", error);
          }
        } else {
          // Add new message logic (unchanged)
          const newMessageData = {
            sender: personalInfo.username,
            recipient: selectedConversation.receiver,
            messageContent: newMessage.trim(),
            date: new Date().toISOString().split('T')[0],
          };
    
          try {
            if (selectedConversation?.chatId) {
              await axios.post(`${API_BASE_URL}/addMessageToChat/${selectedConversation.chatId}`, newMessageData);
              const updatedChat = await axios.get(`${API_BASE_URL}/getChatById/${selectedConversation.chatId}`);
              setSelectedConversation(updatedChat.data);
    
              setChats((prevChats) =>
                prevChats.map((chat) =>
                  chat.chatId === selectedConversation.chatId ? { ...chat, messages: updatedChat.data.messages } : chat
                )
              );
            } else {
              const newChatData = {
                receiver: selectedConversation.receiver,
                sender: {
                  id: personalInfo.id,
                  username: personalInfo.username,
                },
                messages: [newMessageData],
              };
    
              const response = await axios.post(`${API_BASE_URL}/addChat`, newChatData);
              const createdChat = response.data;
              setChats((prevChats) => [...prevChats, createdChat]);
              setSelectedConversation(createdChat);
            }
            setNewMessage("");
          } catch (error) {
            console.error("Error sending message:", error);
          }
        }
      } else {
        alert("Please enter a message.");
      }
    };    
    
    const handleAddChatClick = () => {
      setIsAddingChat(true);
      setSelectedConversation({ receiver: '', messages: [] }); // Initialize a new conversation with an empty receiver
      setNewMessage(""); // Clear any previous message input
      setIsReceiverFinalized(false); // Ensure receiver is not yet finalized
      setIsMessageBoxDisabled(true); // Disable message box until the receiver is confirmed
    };
    
    const handleEditClick = (messageId, currentContent) => {
      setEditMessageId(messageId); // Track the message being edited
      setNewMessage(currentContent); // Populate the bottom input box
    };

    const openConfirmationDialog = (chatId, messageId = null) => {
      setDeleteTarget({ chatId, messageId });
      setOpenDialog(true);
    };

    const handleChatClick = async (conversation) => {
      try {
        // Fetch the chat details from the server (if necessary)
        const response = await axios.get(`${API_BASE_URL}/getChatById/${conversation.chatId}`);
        setSelectedConversation(response.data); // Set the selected chat data
      } catch (error) {
        console.error("Error fetching chat details:", error);
      }
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

    const checkUserExists = async (username) => {
        try {
          const response = await axios.get(`http://localhost:8081/api/user/checkUser/${username}`);
          console.log(response.data);
          const userExists = response.data;
          setUserExists(userExists);
          setIsMessageBoxDisabled(!userExists);
          if (!userExists) alert("User not found. You cannot send a message.");
          return userExists;
        } catch (error) {
          console.error("Error checking user existence:", error);
          alert("An error occurred while checking the user.");
          setUserExists(false);
          setIsMessageBoxDisabled(true);
          return false;
        }
      };

    return (
      <Paper sx={{ height: '80vh', display: 'flex', flexDirection: 'column', paddingLeft:'60px',ml:"1%", width:'130vh'}}>
        {/* Dialog for Delete Confirmation */}
        <Dialog open={openDialog} onClose={closeConfirmationDialog}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>Are you sure you want to delete this {deleteTarget.messageId ? "message" : "chat"}?</DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={closeConfirmationDialog} color="error">Cancel</Button>
            <Button variant="contained" onClick={handleDeleteClick} color="primary">Yes</Button>
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
                <button variant="contained" onClick={handleAddChatClick}>Add Chat</button>
            </Box>
          </Grid>

          {/* Right column - Messages List */}
          <Grid item xs={8} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Fixed container for Receiver's Name */}
            <Box sx={{ padding: '10px', backgroundColor: '#E8F5E9', position: 'sticky', top: 0, zIndex: 1 }}>
              {isAddingChat && !isReceiverFinalized ? (
                <>
                  {/* Input for Receiver's Name */}
                  <TextField
                    variant="outlined"
                    fullWidth
                    placeholder="Enter receiver's name"
                    value={selectedConversation?.receiver || ''}
                    onChange={(e) => setSelectedConversation((prev) => ({ ...prev, receiver: e.target.value }))}
                    disabled={isReceiverFinalized}
                  />
                  {/* Confirm Button */}
                  <Box sx={{ mt: 1, textAlign: 'right' }}>
                    <button onClick={handleReceiverConfirm}>Confirm</button>
                  </Box>
                </>
              ) : (
                <Typography variant="h6">{selectedConversation?.receiver}</Typography>
              )}
            </Box>

            {/* Scrollable container for Messages List */}
            <div style={{ padding: '20px', overflowY: 'auto', flexGrow: 1, backgroundColor: '#E8F5E9'}}>
              <Box sx={{ mt: 2 }}>
              {selectedConversation?.messages?.map((msg) => (
                  <Box key={msg.messageId} sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: msg.sender === personalInfo.username ? 'flex-end' : 'flex-start',
                    marginBottom: '10px',
                    maxWidth: '100%',
                    borderRadius: '10px',
                    marginRight: msg.sender === personalInfo.username ? '0px' : 'auto',
                    marginLeft: msg.sender === personalInfo.username ? 'auto' : '0px',
                  }}>
                    <Typography variant="caption" sx={{ color: 'gray', marginTop: '5px' }}>
                      {msg.sender === personalInfo.username ? 'You' : msg.sender}
                    </Typography>
                    <Typography sx={{
                      padding: '10px',
                      backgroundColor: msg.sender === personalInfo.username ? '#C8E6C9' : '#E1F5FE',
                      borderRadius: '10px',
                      maxWidth: '70%',
                      wordWrap: 'break-word',
                    }}>
                      {msg.messageContent}
                    </Typography>
                    {msg.sender === personalInfo.username && ( // Only show edit and delete options for messages sent by the user
                      <Box sx={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                        <Typography
                          variant="body2"
                          sx={{ color: 'gray', cursor: 'pointer' }}
                          onClick={() => handleEditClick(msg.messageId, msg.messageContent)}
                        >
                          Edit
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: 'gray', cursor: 'pointer' }}
                          onClick={() => openConfirmationDialog(selectedConversation.chatId, msg.messageId)}
                        >
                          Delete
                        </Typography>
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>
            </div>

            {/* Bottom section - New Message Box */}
            {(selectedConversation && (isReceiverFinalized || selectedConversation.receiver)) && (
              <Box sx={{ display: 'flex', padding: 2, borderTop: '1px solid #ccc' }}>
                <TextField
                  label="New Message"
                  variant="outlined"
                  placeholder="Type a message"
                  fullWidth
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  sx={{ marginRight: '10px' }}
                />
                {editMessageId && (
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => {
                      setEditMessageId(null); // Clear the edit state
                      setNewMessage(""); // Clear the message box content
                    }}
                    sx={{ marginRight: '10px' }}
                  >
                    Cancel
                  </Button>
                )}
                <IconButton
                  color="primary"
                  onClick={handleSendMessage}
                  disabled={isMessageBoxDisabled}
                >
                  <SendIcon />
                </IconButton>
              </Box>
            )}
          </Grid>
        </Grid>
      </Paper>
    );
  }