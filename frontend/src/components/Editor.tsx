import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Image from '@tiptap/extension-image'

type EditorProps = {
  content: string
  setContent: (content: string) => void
}

export default function Editor({ content, setContent }: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
      }),
      Underline,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Image,
    ],
    content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML())
    },
  })

  if (!editor) return null

  const btnClass = (active: boolean) =>
    `px-2 py-1 rounded border text-sm select-none ${
      active ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 hover:bg-gray-100'
    }`

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-3 flex flex-wrap gap-2">
        <button onClick={() => editor.chain().focus().toggleBold().run()} className={btnClass(editor.isActive('bold'))}>
          <b>B</b>
        </button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className={btnClass(editor.isActive('italic'))}>
          <i>I</i>
        </button>
        <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={btnClass(editor.isActive('underline'))}>
          <u>U</u>
        </button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={btnClass(editor.isActive('heading', { level: 1 }))}>
          H1
        </button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btnClass(editor.isActive('heading', { level: 2 }))}>
          H2
        </button>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={btnClass(editor.isActive('bulletList'))}>
          • List
        </button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btnClass(editor.isActive('orderedList'))}>
          1. List
        </button>
        <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btnClass(editor.isActive('blockquote'))}>
          “Quote”
        </button>
        <button onClick={() => editor.chain().focus().toggleCode().run()} className={btnClass(editor.isActive('code'))}>
          {'</>'}
        </button>
        <button
          onClick={() => {
            const url = window.prompt('Enter URL')
            if (url) editor.chain().focus().setLink({ href: url }).run()
          }}
          className={btnClass(editor.isActive('link'))}
        >
          🔗 Link
        </button>
        <button onClick={() => editor.chain().focus().unsetLink().run()} className={btnClass(false)}>
          ❌ Unlink
        </button>
        <button onClick={() => editor.chain().focus().undo().run()} className={btnClass(false)}>
          ⎌ Undo
        </button>
        <button onClick={() => editor.chain().focus().redo().run()} className={btnClass(false)}>
          ↻ Redo
        </button>
        <button
          onClick={() => {
            const url = window.prompt('Enter image URL')
            if (url) editor.chain().focus().setImage({ src: url }).run()
          }}
          className={btnClass(false)}
        >
          🖼️ Image
        </button>
      </div>

      {/* Editor Content */}
      <EditorContent
        editor={editor}
        className="border rounded p-4 min-h-[150px] prose max-w-full focus:outline-none"
      />
    </div>
  )
}
