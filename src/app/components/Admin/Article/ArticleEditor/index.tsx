"use client"

import { useEffect, useState } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"

interface ArticleEditorProps {
  value: string
  onChange: (value: string) => void
}

export default function ArticleEditor({ value, onChange }: ArticleEditorProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    editorProps: {
      attributes: {
        class: "prose min-h-[300px] p-4 border rounded-md bg-white",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    autofocus: false,
    editable: true,
    injectCSS: true,
    immediatelyRender: false,
  })

  // sync incoming value changes into editor without causing a loop
  useEffect(() => {
    if (!editor) return
    const current = editor.getHTML()
    if (value && value !== current) {
      editor.commands.setContent(value, { emitUpdate: false })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editor])

  if (!mounted || !editor) {
    return <p>Loading editor...</p>
  }

  return (
    <div>
      <div className="mb-2 flex gap-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="rounded border px-3 py-1 text-sm font-medium hover:bg-gray-100"
        >
          Bold
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="rounded border px-3 py-1 text-sm font-medium hover:bg-gray-100"
        >
          Italic
        </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  )
}
