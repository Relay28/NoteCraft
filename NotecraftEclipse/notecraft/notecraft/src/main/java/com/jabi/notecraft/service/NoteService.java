package com.jabi.notecraft.service;

import com.jabi.notecraft.entity.NoteEntity;
import com.jabi.notecraft.entity.UserEntity;
import com.jabi.notecraft.repository.NoteRepository;
import com.jabi.notecraft.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class NoteService {

    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private UserRepository userRepository;

    public NoteEntity insertNote(NoteEntity note, int userId) {
        UserEntity user = userRepository.findById(userId)
            .orElseThrow(() -> new NoSuchElementException("User not found with ID: " + userId));
        
        note.setUser(user);
        return noteRepository.save(note);
    }

    public List<NoteEntity> getAllNotes() {
        return noteRepository.findAll();
    }

    public NoteEntity getNoteById(int noteId) {
        return noteRepository.findById(noteId).orElseThrow(NoSuchElementException::new);
    }

    public NoteEntity updateNote(int noteid, NoteEntity newNote, int userId) {
        NoteEntity existingNote = getNoteById(noteid);

        UserEntity user = userRepository.findById(userId)
            .orElseThrow(() -> new NoSuchElementException("User not found with ID: " + userId));

        // Update note details and re-associate with user
        existingNote.setTitle(newNote.getTitle());
        existingNote.setDescription(newNote.getDescription());
        existingNote.setContent(newNote.getContent());
        existingNote.setDateCreated(newNote.getDateCreated());
        existingNote.setUser(user);

        return noteRepository.save(existingNote);
    }

    public String deleteNote(int noteId) {
        noteRepository.deleteById(noteId);
        return "Note deleted successfully.";
    }
}
