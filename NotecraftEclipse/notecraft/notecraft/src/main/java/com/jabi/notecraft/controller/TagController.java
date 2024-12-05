package com.jabi.notecraft.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.jabi.notecraft.dto.TagAddRequest;
import com.jabi.notecraft.entity.NoteEntity;
import com.jabi.notecraft.entity.TagEntity;
import com.jabi.notecraft.service.TagService;

@RestController
@RequestMapping("/api/tags")
public class TagController {
    @Autowired
    private TagService tagService;

    @PostMapping("/create")
    public TagEntity createTag(@RequestParam String tagName) {
        return tagService.createOrFindTag(tagName);
    }

    @PostMapping("/addToNote")
    public NoteEntity addTagToNote(@RequestBody TagAddRequest request) {
        return tagService.addTagToNote(request.getNoteId(), request.getTagName());
    }

    @DeleteMapping("/removeFromNote")
    public NoteEntity removeTagFromNote(
        @RequestParam int noteId, 
        @RequestParam int tagId
    ) {
        return tagService.removeTagFromNote(noteId, tagId);
    }

    @GetMapping("/getNotesByTag")
    public List<NoteEntity> getNotesByTag(@RequestParam String tagName) {
        return tagService.getNotesByTag(tagName);
    }


}

