import React from 'react';
import { Routes, Route ,Navigate} from 'react-router-dom';
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
import StudyGroupPage from './StudyGroupPage';
import GroupDetailsPage from './GroupDetails';

const TheRoutes = () => {
  return (
    <Routes>
      {/* Login as the index route */}

      {/* Redirect the root path to /login */}
      {/* <Route path="" element={<Navigate to="/login" replace />} />
 */}

      <Route path="/login" element={ <Login />} index />
      <Route path="/register" element={<SignIn />} index />

      {/* Authenticated routes with Home layout */}
      <Route path="/home" element={<Home/>}/>
   
        <Route path="/notes">
          <Route index element={<Note />} />
          <Route path="new" element={<NoteForm />} />
          <Route path="edit/:noteId" element={<NoteForm />} />
        </Route>

        {/* Other main routes */}
        <Route path="/files" element={<Files />} />
        <Route path="/messages" element={<Messages />} />
        
       
          <Route path="/myprofile" element={<Profile />} />
          <Route path="/myprofile/edit" element={<EditProfile />} />
        

        {/* ToDo List Routes */}
        <Route path="/todolist" element={<Todolist />} />
        <Route path="/add-task" element={<AddTask />} />
        <Route path="/edit-task" element={<AddTask />} />
        <Route path="/task" element={<TaskDetail />} />
   
      <Route path="/group" element={<StudyGroupPage />}/>
      <Route path="/group-details/:groupId" element={<GroupDetailsPage />} />
      {/* 404 Route outside Home layout */}
      <Route path="*" element={<NotFound />} /> {/* Catch-all for unmatched routes */}
    </Routes>
  );
};

export default TheRoutes;
