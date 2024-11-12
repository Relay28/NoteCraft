import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Note from './Note';
import NoteForm from './NoteForm';
import SignIn from './Register';
import Home from './Home';
import Profile from './Profile';
import EditProfile from './Edit';
import Login from './Login';
import Files from './Files';
import Todolist from './Todolist';
import AddTask from './AddTask';
import TaskDetail from './TaskDetail';
import Messages from './Messages';
import NotFound from './NotFound'; // Import NotFound component

const TheRoutes = () => {
  return (
    <Routes>
      {/* Login as the index route */}
      <Route path="/login" element={<Login />} index />
      <Route path="/register" element={<SignIn />} index />

      {/* Authenticated routes with Home layout */}
      <Route element={<Home />}>
        <Route path="/notes">
          <Route index element={<Note />} />
          <Route path="new" element={<NoteForm />} />
          <Route path="edit/:noteId" element={<NoteForm />} />
        </Route>

        {/* Other main routes */}
        <Route path="/files" element={<Files />} />
        <Route path="/messages" element={<Messages />} />
        
        <Route path="/home">
          <Route index element={<Home />} />
          <Route path="myprofile" element={<Profile />} />
          <Route path="myprofile/edit" element={<EditProfile />} />
        </Route>

        {/* ToDo List Routes */}
        <Route path="/todolist" element={<Todolist />} />
        <Route path="/add-task" element={<AddTask />} />
        <Route path="/edit-task" element={<AddTask />} />
        <Route path="/task" element={<TaskDetail />} />
      </Route>

      {/* 404 Route outside Home layout */}
      <Route path="*" element={<NotFound />} /> {/* Catch-all for unmatched routes */}
    </Routes>
  );
};

export default TheRoutes;
