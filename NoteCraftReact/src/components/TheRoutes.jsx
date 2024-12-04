import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import NonAuthLayout from './NonAuthLayout';
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
import NotFound from './NotFound';
import StudyGroupPage from './StudyGroupPage';
import GroupDetailsPage from './GroupDetails';
import { PersonalInfoContext } from './PersonalInfoProvider';



const TheRoutes = () => {
  const { personalInfo } = useContext(PersonalInfoContext);
  return (
    <Routes>
      {/* NonAuthLayout */}
      <Route element={<NonAuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignIn />} />
      </Route>

      {/* AuthLayout */}
      <Route element={<AuthLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/notes" element={<Note />} />
        <Route path="/notes/new" element={<NoteForm />} />
        <Route path="/notes/edit/:noteId" element={<NoteForm />} />
        <Route path="/files" element={<Files />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/myprofile" element={<Profile personalInfo={personalInfo} />} />
        <Route path="/myprofile/edit" element={<EditProfile />} />
        <Route path="/todolist" element={<Todolist />} />
        <Route path="/add-task" element={<AddTask />} />
        <Route path="/edit-task" element={<AddTask />} />
        <Route path="/task" element={<TaskDetail />} />
        <Route path="/group" element={<StudyGroupPage />} />
        <Route path="/group-details/:groupId" element={<GroupDetailsPage />} />
      </Route>

      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default TheRoutes;
