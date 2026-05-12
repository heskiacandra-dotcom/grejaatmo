"use client";
// src/components/cms/TiptapEditor.tsx
import { useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold, Italic, Strikethrough, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Link as LinkIcon, Image as ImageIcon,
  Undo, Redo, Code, Minus, Trash2
} from "lucide-react";

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: { default: '100%' },
      align: { default: 'center' },
    }
  },
  renderHTML({ HTMLAttributes }) {
    const width = HTMLAttributes.width || '100%';
    const align = HTMLAttributes.align || 'center';
    
    let style = `width: ${width}; height: auto; max-width: 100%; border-radius: 0.5rem; transition: all 0.2s; cursor: pointer;`;
    
    if (align === 'left') {
      style += ` float: left; margin: 0.5rem 1.5rem 1rem 0;`;
    } else if (align === 'right') {
      style += ` float: right; margin: 0.5rem 0 1rem 1.5rem;`;
    } else {
      style += ` display: block; margin: 1rem auto; clear: both;`;
    }
    
    return ['img', { ...HTMLAttributes, style, draggable: "true" }];
  }
});

export function TiptapEditor({ content, onChange, placeholder = "Tulis konten berita di sini..." }: TiptapEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      CustomImage,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-gold underline" },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "tiptap-content prose-sacred focus:outline-none",
        style: "min-height: 400px; padding: 1.5rem;",
      },
    },
  });

  if (!editor) return null;

  const ToolbarButton = ({
    onClick,
    active = false,
    title,
    children,
  }: {
    onClick: () => void;
    active?: boolean;
    title: string;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      style={{
        padding: "0.4rem",
        borderRadius: "0.375rem",
        border: "none",
        background: active ? "rgba(201,168,76,0.2)" : "transparent",
        color: active ? "#C9A84C" : "#8B7355",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.15s ease",
      }}
      onMouseEnter={(e) => {
        if (!active) (e.currentTarget as HTMLButtonElement).style.background = "#F0E8D0";
      }}
      onMouseLeave={(e) => {
        if (!active) (e.currentTarget as HTMLButtonElement).style.background = "transparent";
      }}
    >
      {children}
    </button>
  );

  const Separator = () => (
    <div style={{ width: "1px", height: "20px", background: "#E2D8C0", margin: "0 0.25rem" }} />
  );

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "berita-content");
      
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      
      if (data.success && data.url) {
        editor.chain().focus().setImage({ src: data.url }).run();
      } else {
        alert("Gagal mengunggah gambar");
      }
    } catch {
      alert("Gagal mengunggah gambar");
    } finally {
      setUploadingImage(false);
      // Reset input so the same file can be uploaded again if needed
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const addImage = () => {
    // Open file dialog instead of prompt
    fileInputRef.current?.click();
  };

  const setLink = () => {
    const url = window.prompt("URL Link:");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="tiptap-editor">
      {/* Toolbar */}
      <div className="tiptap-toolbar" style={{ display: "flex", flexWrap: "wrap", gap: "0.125rem", padding: "0.5rem", borderBottom: "1px solid #E2D8C0", background: "#F5F0E4" }}>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Tebal">
          <Bold size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Miring">
          <Italic size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Coret">
          <Strikethrough size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive("code")} title="Kode">
          <Code size={15} />
        </ToolbarButton>

        <Separator />

        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })} title="Judul 1">
          <Heading1 size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="Judul 2">
          <Heading2 size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} title="Judul 3">
          <Heading3 size={15} />
        </ToolbarButton>

        <Separator />

        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Daftar Tidak Berurut">
          <List size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Daftar Berurut">
          <ListOrdered size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Kutipan">
          <Quote size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} active={false} title="Garis Pemisah">
          <Minus size={15} />
        </ToolbarButton>

        <Separator />

        <ToolbarButton onClick={setLink} active={editor.isActive("link")} title="Tambah Link">
          <LinkIcon size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={addImage} active={false} title={uploadingImage ? "Mengunggah..." : "Upload Gambar ke Konten"}>
          <ImageIcon size={15} style={{ opacity: uploadingImage ? 0.5 : 1 }} />
        </ToolbarButton>

        <Separator />

        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} active={false} title="Undo">
          <Undo size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} active={false} title="Redo">
          <Redo size={15} />
        </ToolbarButton>

        {/* Character count */}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", fontSize: "0.7rem", color: "#B09878", fontFamily: "Cinzel, serif", gap: "1rem" }}>
          
          {/* Image Resizer (only shows when image is selected) */}
          {editor.isActive('image') && (
            <div style={{ display: "flex", gap: "0.25rem", background: "rgba(201,168,76,0.1)", padding: "0.2rem 0.5rem", borderRadius: "0.5rem", alignItems: "center" }}>
              <span style={{ fontSize: "0.6rem", fontWeight: "bold", marginRight: "0.25rem", textTransform: "uppercase" }}>Ukuran:</span>
              {[
                { label: "Kecil", value: "25%" },
                { label: "Sedang", value: "50%" },
                { label: "Besar", value: "75%" },
                { label: "Penuh", value: "100%" },
              ].map((size) => (
                <button
                  key={size.value}
                  onClick={() => editor.chain().focus().updateAttributes('image', { width: size.value }).run()}
                  style={{
                    background: editor.getAttributes('image').width === size.value ? "#C9A84C" : "transparent",
                    color: editor.getAttributes('image').width === size.value ? "#FFF" : "#8B7355",
                    border: "none", borderRadius: "0.25rem", padding: "0.2rem 0.4rem", fontSize: "0.65rem", cursor: "pointer", fontWeight: 600
                  }}
                >
                  {size.label}
                </button>
              ))}
              
              {/* Custom Size Button */}
              <button
                onClick={() => {
                  const currentWidth = editor.getAttributes('image').width || '100%';
                  const customWidth = window.prompt("Masukkan ukuran kustom (contoh: 300px, 80%, dll):", currentWidth);
                  if (customWidth) {
                    editor.chain().focus().updateAttributes('image', { width: customWidth }).run();
                  }
                }}
                style={{
                  background: "transparent",
                  color: "#8B7355",
                  border: "1px solid rgba(201,168,76,0.3)", borderRadius: "0.25rem", padding: "0.2rem 0.4rem", fontSize: "0.65rem", cursor: "pointer", fontWeight: 600, marginLeft: "0.25rem"
                }}
              >
                Kustom
              </button>
            </div>
          )}

          {/* Image Aligner (only shows when image is selected) */}
          {editor.isActive('image') && (
            <div style={{ display: "flex", gap: "0.25rem", background: "rgba(201,168,76,0.1)", padding: "0.2rem 0.5rem", borderRadius: "0.5rem", alignItems: "center" }}>
              <span style={{ fontSize: "0.6rem", fontWeight: "bold", marginRight: "0.25rem", textTransform: "uppercase" }}>Posisi:</span>
              {[
                { label: "Kiri", value: "left" },
                { label: "Tengah", value: "center" },
                { label: "Kanan", value: "right" },
              ].map((pos) => (
                <button
                  key={pos.value}
                  onClick={() => editor.chain().focus().updateAttributes('image', { align: pos.value }).run()}
                  style={{
                    background: editor.getAttributes('image').align === pos.value ? "#C9A84C" : "transparent",
                    color: editor.getAttributes('image').align === pos.value ? "#FFF" : "#8B7355",
                    border: "none", borderRadius: "0.25rem", padding: "0.2rem 0.4rem", fontSize: "0.65rem", cursor: "pointer", fontWeight: 600
                  }}
                >
                  {pos.label}
                </button>
              ))}
            </div>
          )}

          {/* Delete Image Button */}
          {editor.isActive('image') && (
            <button
              onClick={() => editor.chain().focus().deleteSelection().run()}
              style={{
                background: "rgba(217,83,79,0.1)",
                color: "#D9534F",
                border: "none", borderRadius: "0.25rem", padding: "0.2rem 0.5rem", fontSize: "0.65rem", cursor: "pointer", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.25rem"
              }}
              title="Hapus Gambar"
            >
              <Trash2 size={12} /> Hapus
            </button>
          )}

          <span style={{ marginLeft: "auto" }}>{editor.storage.characterCount?.characters?.() || editor.getText().length} karakter</span>
        </div>
      </div>

      {/* Editor content */}
      <EditorContent editor={editor} />

      {/* Hidden File Input for Image Upload */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: "none" }}
      />
    </div>
  );
}
