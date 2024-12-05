package com.jabi.notecraft.controller;

import com.jabi.notecraft.entity.NoteEntity;
import com.jabi.notecraft.service.NoteService;
import com.jabi.notecraft.service.TagService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/note")
public class NoteController {

    @Autowired
    private NoteService noteService;
    @Autowired
    private TagService tagService;
    
    // Insert a personal note
    @PostMapping("/insertNote")
    public NoteEntity insertNote(@RequestBody NoteEntity note, @RequestParam("userId") int userId) {
        return noteService.insertNote(note, userId);
    }
    @PostMapping("/addTag")
    public NoteEntity addTagToNote(
        @RequestParam int noteId, 
        @RequestParam String tagName
    ) {
        return tagService.addTagToNote(noteId, tagName);
    }

    @GetMapping("/byTag")
    public List<NoteEntity> getNotesByTag(@RequestParam String tagName) {
        return tagService.getNotesByTag(tagName);
    }
    // Insert a group note
    @PostMapping("/insertGroupNote")
    public NoteEntity insertNoteWithGroup(
            @RequestBody NoteEntity note, 
            @RequestParam("userId") int userId, 
            @RequestParam("studyGroupId") int studyGroupId) {
        return noteService.insertNoteWithGroup(note, userId, studyGroupId);
    }

    @GetMapping("/getNotesByUser")
    public List<NoteEntity> getNotesByUser(@RequestParam int userId) {
        return noteService.getPersonalNotesByUserId(userId);
    }

    // Fetch all group notes for a study group
    @GetMapping("/getGroupNotes")
    public List<NoteEntity> getGroupNotes(@RequestParam("studyGroupId") int studyGroupId) {
        return noteService.getGroupNotes(studyGroupId);
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

    // Update an existing note
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
