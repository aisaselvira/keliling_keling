"use client"

import { useEffect, useState } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"

interface EditorProps {
  value: string
  onChange: (value: string) => void
}

export default function Editor({ value, onChange }: EditorProps) {
  const [mounted, setMounted] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    bulletList: false,
    orderedList: false,
  })
  const MAX_WORDS = 500

  useEffect(() => {
    setMounted(true)
  }, [])

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Tulis artikel di sini...",
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "min-h-[300px] p-4 border rounded-md bg-white text-black list-disc list-inside [&_ul]:list-disc [&_ol]:list-decimal [&_li]:ml-6 [&_li]:my-1",
      },
      handleDOMEvents: {
        beforeinput: (view, event: InputEvent) => {
          const text = view.state.doc.textContent || ""
          const currentWords = text.trim().split(/\s+/).filter(Boolean).length
          if (currentWords >= MAX_WORDS && event.inputType !== "deleteContentBackward") {
            event.preventDefault()
            return true
          }
          return false
        },
      },
    },
    onUpdate: ({ editor }) => {
      const text = editor.getText()
      const words = text.trim().split(/\s+/).filter(Boolean)
      setWordCount(words.length)
      if (words.length <= MAX_WORDS) {
        onChange(editor.getHTML())
      }
    },
    autofocus: false,
    editable: true,
    injectCSS: true,
    immediatelyRender: false,
    onSelectionUpdate: ({ editor }) => {
      setActiveFormats({
        bold: editor.isActive("bold"),
        italic: editor.isActive("italic"),
        bulletList: editor.isActive("bulletList"),
        orderedList: editor.isActive("orderedList"),
      })
    },
  })

  useEffect(() => {
    if (!editor) return
    const current = editor.getHTML()
    if (value && value !== current) {
      editor.commands.setContent(value, { emitUpdate: false })
      const plain = editor.getText()
      const words = plain.trim().split(/\s+/).filter(Boolean).length
      setWordCount(words)
    }
  }, [value, editor])

  if (!mounted || !editor) {
    return <p>Loading editor...</p>
  }

  const buttonClass = (isActive: boolean) =>
    `rounded border px-3 py-1 text-sm font-medium hover:bg-gray-100 ${
      isActive ? "bg-gray-300 font-semibold" : ""
    }`

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-2 flex gap-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={buttonClass(activeFormats.bold)}
        >
          Bold
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={buttonClass(activeFormats.italic)}
        >
          Italic
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={buttonClass(activeFormats.bulletList)}
        >
          Bullet List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={buttonClass(activeFormats.orderedList)}
        >
          Numbered List
        </button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />

      {/* Word count */}
      <div className="mt-2 text-sm text-gray-600">
        {wordCount} / {MAX_WORDS} kata
        {wordCount >= MAX_WORDS && (
          <span className="text-red-500 ml-2">Batas maksimum tercapai</span>
        )}
      </div>
    </div>
  )
}
