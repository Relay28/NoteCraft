import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
// quillModules.js
export const createQuillModules = (handleImageUpload) => ({
    toolbar: {
        container: [
            [{ 'header': [1, 2, 3, false] }], 
            ['bold', 'italic', 'underline', 'strike'], 
            [{ 'list': 'ordered' }, { 'list': 'bullet' }], 
            [{ 'script': 'sub' }, { 'script': 'super' }], 
            [{ 'indent': '-1' }, { 'indent': '+1' }], 
            [{ 'direction': 'rtl' }],
            [{ 'size': ['small', false, 'large', 'huge'] }], 
            [{ 'color': [] }, { 'background': [] }], 
            [{ 'align': [] }],
            ['link', 'image'], 
            ['clean'] 
        ],
        handlers: {
            image: handleImageUpload
        }
    }
});
