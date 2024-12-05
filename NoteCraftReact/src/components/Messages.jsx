  import React, {useState, useEffect} from 'react';
  import {Grid, List, ListItem, ListItemAvatar, Avatar, ListItemText, TextField, Typography, Paper, IconButton, Box, Dialog, DialogTitle, DialogContent, DialogActions, Button} from '@mui/material';
  import SendIcon from '@mui/icons-material/Send';
  import DeleteIcon from '@mui/icons-material/Delete'; // Import Delete Icon
  import axios from 'axios';
  import { useLocation } from 'react-router';
  import { useTheme } from './ThemeProvider';


  const API_BASE_URL = 'http://localhost:8081/api/chat';

  export default function Messages() {
    const [chats, setChats] = React.useState([]);
    const [selectedConversation, setSelectedConversation] = React.useState({
      receiver: '',
      receiverId: null,
      messages: [],
    });

    const [newMessage, setNewMessage] = React.useState("");
    const [isAddingChat, setIsAddingChat] = React.useState(false);
    const [editMessageId, setEditMessageId] = React.useState(null);
    const [isReceiverFinalized, setIsReceiverFinalized] = React.useState(false);
    
    const [openDialog, setOpenDialog] = React.useState(false);
    const [deleteTarget, setDeleteTarget] = React.useState({chatId:null, messageId:null});
    const [isMessageBoxDisabled, setIsMessageBoxDisabled] = useState(false);
    const location = useLocation();
    const personalInfo = location.state?.user || { id: '', username: '' };

    const [usernames, setUsernames] = React.useState([]); // To store fetched usernames
    const [filteredUsernames, setFilteredUsernames] = React.useState([]); // To store filtered suggestions
    const { darkMode, toggleTheme, theme } = useTheme();

    React.useEffect(() => {
      const loadChats = async () => {
        try {
          if (!personalInfo?.id) return;
          const response = await axios.get(`${API_BASE_URL}/getUserChats/${personalInfo.id}`);
    
          // No need to fetch receiver's username separately if it's part of the response
          const updatedChats = response.data.map((chat) => {
            chat.receiver = chat.receiver.username;  // Use the receiver's username directly
            return chat;
          });
    
          setChats(updatedChats);  // Update chats with receiver's usernames
        } catch (error) {
          console.error("Error loading chats:", error);
        }
      };
    
      loadChats();
    }, [personalInfo.id]);// Dependency on `personalInfo.id` instead of `personalInfo.username`

     const handleReceiverConfirm = async () => {
      const username = selectedConversation?.receiver?.trim();
      if (!username) {
        alert("Please enter a receiver's name.");
        return;
      }
    
      try {
        // Use the API to fetch the user details by username
        const response = await axios.get(`http://localhost:8081/api/user/getUserByUsername/${username}`);
        const user = response.data; // This will give you the full user data
    
        if (user) {
          // Update selectedConversation.receiver with the full user data
          setSelectedConversation((prev) => ({
            ...prev,
            receiver: user // Store the entire user object
          }));
    
          // Set finalized state and enable the message box
          setIsReceiverFinalized(true);
          setIsMessageBoxDisabled(false);
        } else {
          alert("User not found. Please choose a valid recipient.");
        }
      } catch (error) {
        console.error("Error confirming receiver:", error);
        alert("An error occurred while confirming the receiver.");
      }
    };
    
    
    const handleSendMessage = async () => {
      if (newMessage.trim() && selectedConversation?.receiver?.id) {
        const messageData = {
          sender: { id: personalInfo.id, username: personalInfo.username },
          recipient: { id: selectedConversation.receiver.id, username: selectedConversation.receiver.username },
          messageContent: newMessage.trim(),
          date: new Date().toISOString().split('T')[0], // Format the date (YYYY-MM-DD)
        };
    
        try {
          if (editMessageId) {
            // If we are editing an existing message, make an API call to update it
            await axios.put(`http://localhost:8081/api/message/putMessageDetails?messageId=${editMessageId}`, messageData);
            const updatedChat = await axios.get(`${API_BASE_URL}/getChatById/${selectedConversation.chatId}`);
            setSelectedConversation(updatedChat.data);
            setChats((prevChats) =>
              prevChats.map((chat) =>
                chat.chatId === selectedConversation.chatId ? { ...chat, messages: updatedChat.data.messages } : chat
              )
            );
            setEditMessageId(null); // Reset edit mode
          } else {
            // If no chatId exists, create a new chat using the /addChat API
            if (!selectedConversation?.chatId) {
              const chatData = {
                sender: { id: personalInfo.id, username: personalInfo.username },
                receiver: { id: selectedConversation.receiver.id, username: selectedConversation.receiver.username },
                messages: [
                  {
                    sender: { id: personalInfo.id, username: personalInfo.username },
                    recipient: { id: selectedConversation.receiver.id, username: selectedConversation.receiver.username },
                    messageContent: newMessage.trim(),
                    date: new Date().toISOString().split('T')[0], // Date in YYYY-MM-DD format
                  },
                ],
              };
    
              // Optimistically update the state to show the new chat immediately
              const newChat = {
                ...chatData,
                chatId: Date.now(), // Temporary chatId until API response
              };
              setChats((prevChats) => [...prevChats, newChat]);
              setSelectedConversation(newChat);

              // Call the /addChat API to create the new chat
              const response = await axios.post(`${API_BASE_URL}/addChat`, chatData);
              const createdChat = response.data;

              // Update the state with the real chat data after successful creation
              setChats((prevChats) =>
                prevChats.map((chat) =>
                  chat.chatId === newChat.chatId ? { ...chat, chatId: createdChat.chatId } : chat
                )
              );
              setSelectedConversation(createdChat);
            } else {
              // If there is an existing chat, just add the new message to it
              await axios.post(`${API_BASE_URL}/addMessageToChat/${selectedConversation.chatId}`, messageData);
              const updatedChat = await axios.get(`${API_BASE_URL}/getChatById/${selectedConversation.chatId}`);
              setSelectedConversation(updatedChat.data);
              setChats((prevChats) =>
                prevChats.map((chat) =>
                  chat.chatId === selectedConversation.chatId ? { ...chat, messages: updatedChat.data.messages } : chat
                )
              );
            }
          }
    
          setNewMessage(""); // Clear the message input after sending
        } catch (error) {
          console.error("Error sending or editing message:", error);
        }
      } else {
        alert("Please enter a message.");
      }
    };
    
    const handleAddChatClick = async () => {
      setIsAddingChat(true);
      setSelectedConversation({ receiver: '', receiverId: null, messages: [] });
      setNewMessage("");
      setIsReceiverFinalized(false);
      setIsMessageBoxDisabled(true);
    
      try {
        const response = await axios.get('http://localhost:8081/api/user/usernames');
        setUsernames(response.data);
      } catch (error) {
        console.error("Error fetching usernames:", error);
      }
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
        const response = await axios.get(`${API_BASE_URL}/getChatById/${conversation.chatId}`);
        const resolvedChat = response.data;
        
        // Check the response structure
        console.log('Resolved Chat:', resolvedChat);
    
        // Ensure receiver's username is present
        if (!resolvedChat.receiver) {
          const userResponse = await axios.get(
            `http://localhost:8081/api/user/getUsernameById/${resolvedChat.receiverId}`
          );
          resolvedChat.receiver = userResponse.data;
        }
        
        // Set the conversation data
        setSelectedConversation(resolvedChat);
      } catch (error) {
        console.error("Error fetching chat details:", error);
      }
    }; 
    console.log(selectedConversation);

    const closeConfirmationDialog = () => {
      setOpenDialog(false);
      setDeleteTarget({ chatId: null, messageId: null });
    };

    const handleDeleteClick = async () => {
      const { chatId, messageId } = deleteTarget;
      try {
        if (messageId) {
          // Delete the specific message
          await axios.delete(`${API_BASE_URL}/${chatId}/deleteMessage/${messageId}`);
    
          // Update local state by filtering out the deleted message
          setSelectedConversation((prev) => ({
            ...prev,
            messages: prev.messages.filter((msg) => msg.messageId !== messageId),
          }));
    
          // Update the chat list to reflect the change
          setChats((prevChats) =>
            prevChats.map((chat) =>
              chat.chatId === chatId
                ? { ...chat, messages: chat.messages.filter((msg) => msg.messageId !== messageId) }
                : chat
            )
          );
        } else {
          // Delete the entire chat
          await axios.delete(`${API_BASE_URL}/deleteChat/${chatId}`);
    
          // Remove the deleted chat from the chat list
          setChats((prevChats) => prevChats.filter((chat) => chat.chatId !== chatId));
    
          // Clear the selected conversation if it was the deleted chat
          if (selectedConversation?.chatId === chatId) {
            setSelectedConversation({ receiver: '', receiverId: null, messages: [] });
          }
        }
        closeConfirmationDialog();
      } catch (error) {
        console.error("Error deleting:", error);
      }
    };

    return (
      <Paper sx={{ height: '89%', display: 'flex', flexDirection: 'column', width:'98%'}}>
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
            {chats.map((conversation) => {
              if (!conversation.receiver || !conversation.sender) return null; // Ensure the conversation is valid

              // Extract usernames based on whether they are strings or objects
              const senderUsername = typeof conversation.sender === 'string' 
                ? conversation.sender 
                : conversation.sender.username;

              const receiverUsername = typeof conversation.receiver === 'string' 
                ? conversation.receiver 
                : conversation.receiver.username;

              // Check if the logged-in user is the sender or receiver and display the other person's username
              const displayName = personalInfo?.username === senderUsername 
                ? receiverUsername 
                : senderUsername;

              return (
                <ListItem key={conversation.chatId} button onClick={() => handleChatClick(conversation)}>
                  <ListItemAvatar>
                    <Avatar alt={displayName} />
                  </ListItemAvatar>
                  <ListItemText primary={displayName} secondary={conversation.lastMessage} />
                  <IconButton color="secondary" onClick={(e) => {
                    e.stopPropagation(); // Prevent the click from triggering the ListItem onClick
                    openConfirmationDialog(conversation.chatId);
                  }}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </ListItem>
              );
            })}
          </List>
            <Box sx={{ mt: 2, textAlign: 'center'}}>
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
                    onChange={(e) => {
                      const input = e.target.value;
                      setSelectedConversation((prev) => ({ ...prev, receiver: input }));
                      const suggestions = usernames.filter((username) =>
                        username.toLowerCase().startsWith(input.toLowerCase())
                      );
                      setFilteredUsernames(suggestions);
                    }}
                    disabled={isReceiverFinalized}
                  />
                  {!isReceiverFinalized && filteredUsernames.length > 0 && (
                    <List sx={{ maxHeight: 100, overflowY: 'auto', backgroundColor: '#f0f0f0' }}>
                      {filteredUsernames.map((username, index) => (
                        <ListItem
                          key={index}
                          button
                          onClick={() => {
                            setSelectedConversation((prev) => ({ ...prev, receiver: username }));
                            setFilteredUsernames([]); // Clear suggestions
                          }}
                        >
                          <ListItemText primary={username} />
                        </ListItem>
                      ))}
                    </List>
                  )}
                  {/* Confirm Button */}
                  <Box sx={{ mt: 1, textAlign: 'right' }}>
                    <button onClick={handleReceiverConfirm}>Confirm</button>
                  </Box>
                </>
              ) : (
                <Typography variant="h6">
                  {selectedConversation?.sender?.username === personalInfo?.username
                    ? selectedConversation?.receiver?.username
                    : selectedConversation?.sender?.username}
                </Typography>
              )}
            </Box>

            {/* Scrollable container for Messages List */}
            <div style={{ padding: '20px', overflowY: 'auto', flexGrow: 1, backgroundColor: '#E8F5E9' }}>
              <Box sx={{ mt: 2 }}>
                {Array.isArray(selectedConversation?.messages) && selectedConversation.messages.length > 0 ? (
                  selectedConversation.messages.map((msg) => {
                    const senderName = msg.sender?.username || 'Unknown';  // Access sender's username (with fallback)
                    
                    return (
                      <Box key={msg.messageId} sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: senderName === personalInfo.username ? 'flex-end' : 'flex-start',
                        marginBottom: '10px',
                        maxWidth: '100%',
                        borderRadius: '10px',
                        marginRight: senderName === personalInfo.username ? '0px' : 'auto',
                        marginLeft: senderName === personalInfo.username ? 'auto' : '0px',
                      }}>
                        <Typography variant="caption" sx={{ color: 'gray', marginTop: '5px' }}>
                          {senderName === personalInfo.username ? 'You' : senderName}
                        </Typography>
                        <Typography sx={{
                          padding: '10px',
                          backgroundColor: senderName === personalInfo.username ? '#C8E6C9' : '#E1F5FE',
                          borderRadius: '10px',
                          maxWidth: '70%',
                          wordWrap: 'break-word',
                        }}>
                          {msg.messageContent}
                        </Typography>
                        {senderName === personalInfo.username && ( // Only show edit and delete options for messages sent by the user
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
                    );
                  })
                ) : (
                  <Typography variant="body2" sx={{ color: 'gray' }}>
                    No messages yet. Start the conversation!
                  </Typography>
                )}
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