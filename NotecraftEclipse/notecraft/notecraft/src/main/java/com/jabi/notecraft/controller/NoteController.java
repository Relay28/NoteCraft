package com.jabi.notecraft.controller;

import com.jabi.notecraft.entity.NoteEntity;
import com.jabi.notecraft.service.NoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/note")
public class NoteController {

    @Autowired
    private NoteService noteService;

    // Insert a note with mixed content (text and embedded images)
    @PostMapping("/insertNote")
    public NoteEntity insertNote(@RequestBody NoteEntity note, @RequestParam("userId") int userId) {
        return noteService.insertNote(note, userId);
    }

    
 // Fetch notes specific to a user by userId
    @GetMapping("/getNotesByUser")
    public List<NoteEntity> getNotesByUser(@RequestParam int userId) {
        return noteService.getNotesByUserId(userId);
    }


    // Get all notes
    @GetMapping("/getAllNotes")
    public List<NoteEntity> getAllNotes() {
        return noteService.getAllNotes();
    }

    // Get a specific note by ID
    @GetMapping("/getNoteById/{noteId}")
    public NoteEntity getNoteById(@PathVariable int noteId) {
        return noteService.getNoteById(noteId);
    }

    // Update an existing note, including its mixed content
    @PutMapping("/updateNote")
    public NoteEntity updateNote(@RequestParam int noteid, @RequestBody NoteEntity newNote, @RequestParam int userId) {
        return noteService.updateNote(noteid, newNote, userId);
    }

    // Delete a note by ID
    @DeleteMapping("/deleteNote/{id}")
    public String deleteNote(@PathVariable int id) {
        return noteService.deleteNote(id);
    }
}
