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
import Todolist from './Todolist';
import AddTask from './AddTask';
import TaskDetail from './TaskDetail';

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

      {/* ToDo List Routes */}
      <Route path="/todolist" element={<Todolist />} />
      <Route path="/add-task" element={<AddTask />} />
      <Route path="/edit-task" element={<AddTask />} />
      <Route path="/task" element={<TaskDetail />} />
    </Routes>
  );
};

export default TheRoutes;
