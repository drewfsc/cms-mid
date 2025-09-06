/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';


import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Undo, 
  Redo,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react';
import { useCallback } from 'react';

interface WysiwygEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

const WysiwygEditor: React.FC<WysiwygEditorProps> = ({
  content,
  onChange,
  placeholder = 'Start typing...',
  className = ''
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4',
      },
    },
  });

  const toggleBold = useCallback(() => {
    editor?.chain().focus().toggleBold().run();
  }, [editor]);

  const toggleItalic = useCallback(() => {
    editor?.chain().focus().toggleItalic().run();
  }, [editor]);

  const toggleBulletList = useCallback(() => {
    editor?.chain().focus().toggleBulletList().run();
  }, [editor]);

  const toggleOrderedList = useCallback(() => {
    editor?.chain().focus().toggleOrderedList().run();
  }, [editor]);

  const toggleBlockquote = useCallback(() => {
    editor?.chain().focus().toggleBlockquote().run();
  }, [editor]);

  const setHeading = useCallback((level: 1 | 2 | 3) => {
    editor?.chain().focus().toggleHeading({ level }).run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className={`border border-gray-300 rounded-lg ${className}`}>
      {/* Toolbar */}
      <div className="border-b border-gray-300 p-3 flex flex-wrap gap-2 bg-gray-50">
        <div className="flex items-center space-x-1 border-r border-gray-300 pr-2 mr-2">
          <button
            onClick={() => setHeading(1)}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-300' : ''}`}
            type="button"
          >
            <Type className="w-4 h-4" />
          </button>
          <button
            onClick={() => setHeading(2)}
            className={`p-2 rounded hover:bg-gray-200 text-sm font-semibold ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-300' : ''}`}
            type="button"
          >
            H2
          </button>
          <button
            onClick={() => setHeading(3)}
            className={`p-2 rounded hover:bg-gray-200 text-sm font-semibold ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-300' : ''}`}
            type="button"
          >
            H3
          </button>
        </div>

        <div className="flex items-center space-x-1 border-r border-gray-300 pr-2 mr-2">
          <button
            onClick={toggleBold}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-gray-300' : ''}`}
            type="button"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={toggleItalic}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-gray-300' : ''}`}
            type="button"
          >
            <Italic className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center space-x-1 border-r border-gray-300 pr-2 mr-2">
          <button
            onClick={toggleBulletList}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-gray-300' : ''}`}
            type="button"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={toggleOrderedList}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-gray-300' : ''}`}
            type="button"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            onClick={toggleBlockquote}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('blockquote') ? 'bg-gray-300' : ''}`}
            type="button"
          >
            <Quote className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => editor.chain().focus().undo().run()}
            className="p-2 rounded hover:bg-gray-200"
            disabled={!editor.can().undo()}
            type="button"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            className="p-2 rounded hover:bg-gray-200"
            disabled={!editor.can().redo()}
            type="button"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="min-h-[200px] bg-white">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default WysiwygEditor;