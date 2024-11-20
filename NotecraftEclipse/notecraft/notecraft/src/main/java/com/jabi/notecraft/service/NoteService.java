package com.jabi.notecraft.service;

import com.jabi.notecraft.entity.NoteEntity;
import com.jabi.notecraft.entity.StudyGroupEntity;
import com.jabi.notecraft.entity.UserEntity;
import com.jabi.notecraft.repository.NoteRepository;
import com.jabi.notecraft.repository.StudyGroupRepository;
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

    @Autowired
    private StudyGroupRepository studyGroupRepository;

    // Insert a personal note
    public NoteEntity insertNote(NoteEntity note, int userId) {
        UserEntity user = userRepository.findById(userId)
            .orElseThrow(() -> new NoSuchElementException("User not found with ID: " + userId));

        note.setUser(user);
        note.setGroupNote(false); // Ensure it's marked as a personal note
        return noteRepository.save(note);
    }

    // Insert a group note
    public NoteEntity insertNoteWithGroup(NoteEntity note, int userId, int studyGroupId) {
        UserEntity user = userRepository.findById(userId)
            .orElseThrow(() -> new NoSuchElementException("User not found with ID: " + userId));

        StudyGroupEntity studyGroup = studyGroupRepository.findById(studyGroupId)
            .orElseThrow(() -> new NoSuchElementException("Study Group not found with ID: " + studyGroupId));

        note.setUser(user);
        note.setStudyGroup(studyGroup); // Associate note with the study group
        note.setGroupNote(true); // Mark as group-specific
        return noteRepository.save(note);
    }

    // Fetch only personal notes for a specific user
    public List<NoteEntity> getPersonalNotesByUserId(int userId) {
        System.out.println("Fetching notes for user ID: " + userId);
        List<NoteEntity> notes = noteRepository.findByUser_IdAndIsGroupNoteFalse(userId);
        System.out.println("Notes retrieved: " + notes.size());
        return notes;
    }

    
    

    // Fetch all notes belonging to a group
    public List<NoteEntity> getGroupNotes(int studyGroupId) {
        return noteRepository.findByStudyGroup_GroupId(studyGroupId);
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
