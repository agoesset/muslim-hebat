import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";

export function RichTextEditor({ value, onChange, placeholder = "Tulis konten di sini..." }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  React.useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  if (!editor) return null;

  const btn = (action, label, activeCheck) => (
    <button
      type="button"
      onClick={action}
      className="rte-btn"
      style={{ background: activeCheck ? "var(--ink)" : "transparent", color: activeCheck ? "var(--bg)" : "var(--ink)" }}
    >
      {label}
    </button>
  );

  return (
    <div className="rte-wrap">
      <div className="rte-toolbar">
        {btn(() => editor.chain().focus().toggleBold().run(), "B", editor.isActive("bold"))}
        {btn(() => editor.chain().focus().toggleItalic().run(), "I", editor.isActive("italic"))}
        {btn(() => editor.chain().focus().toggleUnderline().run(), "U", editor.isActive("underline"))}
        <span className="rte-divider" />
        {btn(() => editor.chain().focus().toggleHeading({ level: 2 }).run(), "H2", editor.isActive("heading", { level: 2 }))}
        {btn(() => editor.chain().focus().toggleHeading({ level: 3 }).run(), "H3", editor.isActive("heading", { level: 3 }))}
        <span className="rte-divider" />
        {btn(() => editor.chain().focus().toggleBulletList().run(), "• List", editor.isActive("bulletList"))}
        {btn(() => editor.chain().focus().toggleOrderedList().run(), "1. List", editor.isActive("orderedList"))}
        <span className="rte-divider" />
        {btn(() => editor.chain().focus().setTextAlign("left").run(), "←", editor.isActive({ textAlign: "left" }))}
        {btn(() => editor.chain().focus().setTextAlign("center").run(), "↔", editor.isActive({ textAlign: "center" }))}
        {btn(() => editor.chain().focus().setTextAlign("right").run(), "→", editor.isActive({ textAlign: "right" }))}
        <span className="rte-divider" />
        {btn(() => editor.chain().focus().toggleBlockquote().run(), '\"', editor.isActive('blockquote'))}
        {btn(() => editor.chain().focus().undo().run(), "↩", false)}
        {btn(() => editor.chain().focus().redo().run(), "↪", false)}
      </div>
      <EditorContent editor={editor} className="rte-content" placeholder={placeholder} />
    </div>
  );
}
