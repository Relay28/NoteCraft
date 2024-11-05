import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Note from './Note';
import NoteForm from './NoteForm';
import SignIn from './Register';
import Home from './Home';
import Profile from './Profile';
import EditProfile from './Edit';
import Login from './Login';
import Files from './Files'; // Import the File component

const TheRoutes = () => {
  return (
    <Routes>
      <Route path="/note" element={<Note />} />
      <Route path="/new-note" element={<NoteForm />} />
      <Route path="/edit-note/:noteId" element={<NoteForm />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<SignIn />} />
      <Route path="/files" element={<Files />} /> {/* Add route for the File component */}
      
      <Route path="/home" element={<Home />}>
        <Route path="myprofile" element={<Profile />} />
        <Route path="myprofile/edit" element={<EditProfile />} />
      </Route>
    </Routes>
  );
};

export default TheRoutes;
