  import React, {useState, useEffect} from 'react';
  import {Grid, List, ListItem, ListItemAvatar, Avatar, ListItemText, TextField, Typography, Paper, IconButton, Box, Dialog, DialogTitle, DialogContent, DialogActions, Button} from '@mui/material';
  import SendIcon from '@mui/icons-material/Send';
  import DeleteIcon from '@mui/icons-material/Delete'; // Import Delete Icon
  import axios from 'axios';
  import { PersonalInfoContext } from './PersonalInfoProvider';
  import { useLocation, useNavigate } from 'react-router';


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
    const [isCheckingUser, setIsCheckingUser] = useState(false);
    const [userExists, setUserExists] = useState(true);
    const [isMessageBoxDisabled, setIsMessageBoxDisabled] = useState(false);
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");
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

    const HandleReceiverConfirm = () => {
      if (username.trim()) {
        // Check if the user exists before finalizing the receiver
        checkUserExists(username)
          .then((exists) => {
            if (exists) {
              // If the user exists, finalize the receiver
              setSelectedConversation({ ...selectedConversation, receiver: username });
              setIsReceiverFinalized(true);
              setIsMessageBoxDisabled(false); // Enable the message box
            } else {
              // Show error if user doesn't exist
              setError("User not found. Please choose a valid recipient.");
            }
          })
          .catch((error) => {
            console.error("Error confirming receiver:", error);
          });
      } else {
        setError("Please enter a valid username.");
      }
    };
    
    const handleSendMessage = async () => {
      if (newMessage.trim() && selectedConversation?.receiver) {
        setIsCheckingUser(true);
        setIsCheckingUser(false);
    
        if (!userExists) {
          alert("The user does not exist. Please choose a valid recipient.");
          return;
        }
    
        const newMessageData = {
          sender: personalInfo.username,  // Only include sender's username in the message
          recipient: selectedConversation.receiver,
          messageContent: newMessage.trim(),
          date: new Date().toISOString().split('T')[0],  // Format date to "YYYY-MM-DD"
        };
    
        try {
          if (selectedConversation?.chatId) {
            // Add message to an existing chat
            await axios.post(`${API_BASE_URL}/addMessageToChat/${selectedConversation.chatId}`, newMessageData);
            const updatedChat = await axios.get(`${API_BASE_URL}/getChatById/${selectedConversation.chatId}`);
            setSelectedConversation(updatedChat.data);
            
            // Update the chat list
            setChats((prevChats) =>
              prevChats.map((chat) =>
                chat.chatId === selectedConversation.chatId ? { ...chat, messages: updatedChat.data.messages } : chat
              )
            );
          } else {
            // Create a new chat if none exists
            console.log(personalInfo.id)
            const newChatData = {
              receiver: selectedConversation.receiver,
              sender: { 
                id: personalInfo.id,  // Include the sender's ID
                username: personalInfo.username  // Include the sender's username
              },
              messages: [{
                sender: personalInfo.username,  // Only include sender's username in the message
                recipient: selectedConversation.receiver,
                messageContent: newMessage.trim(),
                date: new Date().toISOString().split('T')[0],  // Format date to "YYYY-MM-DD"
              }],
            };
            
            const response = await axios.post(`${API_BASE_URL}/addChat`, newChatData);
            const createdChat = response.data;
            setChats((prevChats) => [...prevChats, createdChat]);
            setSelectedConversation(createdChat);
          }
    
          setNewMessage("");  // Clear the input
        } catch (error) {
          console.error("Error sending message:", error);
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

    const handleConfirmClick = async () => {
        try {
            // Using the updated backend API with boolean response
            const response = await axios.get(`http://localhost:8081/api/user/checkUser/${username}`);
            if (response.data) {
                // User exists, proceed to input message
                setError(""); // Clear any previous error
                // Here, show the message input box or proceed with chat creation
            } else {
                // User does not exist
                setError("User not found");
            }
        } catch (err) {
            console.error("Error checking user existence:", err);
            setError("Error checking user existence");
        }
    };

    return (
      <Paper sx={{ height: '80vh', display: 'flex', flexDirection: 'column', paddingLeft:'60px',ml:"5%", width:'130vh'}}>
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
            <div style={{ padding: '10px', overflowY: 'auto', flexGrow: 1, backgroundColor: '#E8F5E9'}}>
              <Box sx={{ mt: 2 }}>
                {selectedConversation?.messages?.map((msg) => (
                  <Box key={msg.messageId} sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: msg.sender === personalInfo.username ? 'flex-end' : 'flex-start',
                    marginBottom: '3px',
                    maxWidth: '100%',
                    borderRadius:'10px',
                    marginRight: msg.sender === personalInfo.username ? '10px' : '0px', // Adjust margin for sender
                    marginLeft: msg.sender === personalInfo.username ? '0px' : '10px', // Adjust margin for receiver
                    backgroundColor: msg.sender === personalInfo.username ? '#C8E6C9' : '#D1C4E9',
                    padding: '8px', // Reduced padding for smaller boxes
                  }}>
                    {/* Sender/Receiver Name */}
                    <Typography variant="body2" sx={{ fontWeight: 'bold', marginBottom: '5px' }}>
                      {msg.sender === personalInfo.username ? 'You' : msg.sender}
                    </Typography>

                    {/* Message Content */}
                    <Box sx={{
                      padding: '10px',
                      borderRadius: '10px',
                      backgroundColor: msg.sender === personalInfo.username ? '#C8E6C9' : '#D1C4E9',
                      maxWidth: '100%', // Ensures the box isn't too wide
                      wordBreak: 'break-word', // Prevents long words from overflowing
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
                <IconButton color="primary" onClick={handleSendMessage}disabled={isMessageBoxDisabled}>
                  <SendIcon />
                </IconButton>
              </Box>
            )}
          </Grid>
        </Grid>
      </Paper>
    );
  }