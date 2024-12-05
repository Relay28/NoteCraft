package com.jabi.notecraft.service;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jabi.notecraft.entity.NoteEntity;
import com.jabi.notecraft.entity.TagEntity;
import com.jabi.notecraft.repository.NoteRepository;
import com.jabi.notecraft.repository.TagRepository;

@Service
public class TagService {
    @Autowired
    private TagRepository tagRepository;
    
    @Autowired
    private NoteRepository noteRepository;

    @Transactional
    public TagEntity createOrFindTag(String tagName) {
        return tagRepository.findByTagName(tagName)
            .orElseGet(() -> {
                TagEntity newTag = new TagEntity();
                newTag.setTagName(tagName);
                return tagRepository.save(newTag);
            });
    }

    @Transactional
    public NoteEntity addTagToNote(int noteId, String tagName) {
        NoteEntity note = noteRepository.findById(noteId)
            .orElseThrow(() -> new NoSuchElementException("Note not found"));

        TagEntity tag = createOrFindTag(tagName);

        if (!note.getTags().contains(tag)) {
            note.getTags().add(tag);
            tag.getNotes().add(note);
        }

        return noteRepository.save(note);
    }

    @Transactional
    public NoteEntity removeTagFromNote(int noteId, int tagId) {
        NoteEntity note = noteRepository.findById(noteId)
            .orElseThrow(() -> new NoSuchElementException("Note not found"));

        note.getTags().removeIf(tag -> tag.getTagId() == tagId);
        return noteRepository.save(note);
    }

    public List<NoteEntity> getNotesByTag(String tagName) {
        return noteRepository.findByTags_TagName(tagName);
    }
}