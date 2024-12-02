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
    
    public NoteEntity editNoteWithGroup(int noteId, NoteEntity newNote, int userId, int studyGroupId) {
        // Fetch the existing note
        NoteEntity existingNote = getNoteById(noteId);

        // Fetch the associated user
        UserEntity user = userRepository.findById(userId)
            .orElseThrow(() -> new NoSuchElementException("User not found with ID: " + userId));

        // Fetch the associated study group
        StudyGroupEntity studyGroup = studyGroupRepository.findById(studyGroupId)
            .orElseThrow(() -> new NoSuchElementException("Study Group not found with ID: " + studyGroupId));

        // Update note properties
        existingNote.setTitle(newNote.getTitle());
        existingNote.setDescription(newNote.getDescription());
        existingNote.setContent(newNote.getContent());
        existingNote.setDateCreated(newNote.getDateCreated());
        existingNote.setUser(user);
        existingNote.setStudyGroup(studyGroup);

        return noteRepository.save(existingNote);
    }

    /**
     * Delete all notes associated with a specific study group.
     * 
     * @param studyGroupId the ID of the study group
     * @return success message
     */
    public String deleteNoteGroup(int studyGroupId) {
        // Fetch all notes associated with the study group
        List<NoteEntity> groupNotes = noteRepository.findByStudyGroup_GroupId(studyGroupId);

        if (groupNotes.isEmpty()) {
            throw new NoSuchElementException("No notes found for Study Group with ID: " + studyGroupId);
        }

        // Delete all notes in the study group
        noteRepository.deleteAll(groupNotes);

        return "All notes for Study Group ID " + studyGroupId + " have been deleted successfully.";
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
