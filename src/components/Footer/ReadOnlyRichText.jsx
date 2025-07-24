import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function ReadOnlyRichText({ value, dir = "ltr" }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || "<p></p>",
    editable: false,
  });

  if (!editor) return null;

  return (
    <div
      dir={dir}
      style={{ height: "auto", overflow: "auto" }}
    >
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none text-gray-800"
      />
    </div>
  );
}
