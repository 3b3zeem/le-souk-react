import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function RichTextField({ value, onChange, dir = "ltr" }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || "<p></p>",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div
      dir={dir}
      className="border rounded-lg border-gray-300 focus:outline-none"
      style={{ height: "200px", overflow: "auto" }}
    >
      <EditorContent
        editor={editor}
        className="focus:outline-none focus:border-transparent focus:ring-0"
        style={{ border: "none", outline: "none" }}
      />
    </div>
  );
}
