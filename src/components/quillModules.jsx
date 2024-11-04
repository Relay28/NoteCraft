import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export const createQuillModules = (handleImageUpload) => ({
    toolbar: {
        container: [
            // Formatting buttons
            [{ 'header': [1, 2, 3, false] }], // Header sizes
            ['bold', 'italic', 'underline', 'strike'], // Bold, italic, underline, strikethrough
            [{ 'list': 'ordered' }, { 'list': 'bullet' }], // Ordered and unordered lists
            [{ 'script': 'sub' }, { 'script': 'super' }], // Subscript and superscript
            [{ 'indent': '-1' }, { 'indent': '+1' }], // Indent
            [{ 'direction': 'rtl' }], // Text direction
            [{ 'size': ['small', false, 'large', 'huge'] }], // Font size
            [{ 'color': [] }, { 'background': [] }], // Text and background color
            [{ 'align': [] }], // Text alignment

            // Link and image handling
            ['link', 'image'],

            // Clear formatting
            ['clean'] // Remove formatting
        ],
        handlers: {
            image: handleImageUpload // Custom handler for image uploads
        }
    }
});
