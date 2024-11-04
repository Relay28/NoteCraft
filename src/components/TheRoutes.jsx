import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Note from './Note';
import NoteForm from './NoteForm';

const TheRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Note />} />
      <Route path="/new-note" element={<NoteForm />} />
      <Route path="/edit-note/:noteId" element={<NoteForm />} />
    </Routes>
  );
};

export default TheRoutes;
