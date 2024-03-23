import Link from "@tiptap/extension-link";
import { type Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  BoldIcon,
  CaseLowerIcon,
  CodeIcon,
  EraserIcon,
  Heading2Icon,
  Heading3Icon,
  Heading4Icon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
  QuoteIcon,
  XIcon,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Button } from "../ui/button";

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  const BUTTONS = [
    {
      name: "bold",
      icon: <BoldIcon size={20} />,
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive("bold"),
      tooltip: "Bold",
    },
    {
      name: "italic",
      icon: <ItalicIcon size={20} />,
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive("italic"),
      tooltip: "Italic",
    },
    {
      name: "paragraph",
      icon: <CaseLowerIcon size={20} />,
      action: () => editor.chain().focus().setParagraph().run(),
      isActive: editor.isActive("paragraph"),
      tooltip: "Paragraph",
    },
    {
      name: "h2",
      icon: <Heading2Icon size={20} />,
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive("heading", { level: 2 }),
      tooltip: "Heading 2",
    },
    {
      name: "h3",
      icon: <Heading3Icon size={20} />,
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: editor.isActive("heading", { level: 3 }),
      tooltip: "Heading 3",
    },
    {
      name: "h4",
      icon: <Heading4Icon size={20} />,
      action: () => editor.chain().focus().toggleHeading({ level: 4 }).run(),
      isActive: editor.isActive("heading", { level: 4 }),
      tooltip: "Heading 4",
    },
    {
      name: "list",
      icon: <ListIcon size={20} />,
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive("bulletList"),
      tooltip: "Bullet list",
    },
    {
      name: "ordered",
      icon: <ListOrderedIcon size={20} />,
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive("orderedList"),
      tooltip: "Ordered list",
    },
    {
      name: "code",
      icon: <CodeIcon size={20} />,
      action: () => editor.chain().focus().toggleCode().run(),
      isActive: editor.isActive("code"),
      tooltip: "Code",
    },
    {
      name: "quote",
      icon: <QuoteIcon size={20} />,
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: editor.isActive("blockquote"),
      tooltip: "Blockquote",
    },
    {
      name: "unlink",
      icon: <XIcon size={20} />,
      action: () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        editor.chain().focus().unsetLink().run();
      },
      tooltip: "Unlink",
    },
    {
      name: "eraser",
      icon: <EraserIcon size={20} />,
      action: () => editor.chain().focus().unsetAllMarks().run(),
      isActive: editor.isActive("eraser"),
      tooltip: "Clear all marks from selection",
    },
  ];

  return (
    <div className="flex space-x-2">
      {BUTTONS.map((button) => (
        <TooltipProvider key={button.name}>
          <Tooltip>
            <TooltipTrigger
              onClick={(e) => {
                e.preventDefault();
                button.action();
              }}
              asChild
            >
              <Button
                variant={button.isActive ? "secondary" : "outline"}
                size={"icon"}
              >
                {button.icon}
              </Button>
            </TooltipTrigger>

            <TooltipContent>
              <p>{button.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
};

interface EditorProps {
  readonly onChange: (value: string) => void;
  readonly value: string;
}

export const TipTap = ({ onChange, value }: EditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      Link.configure({
        openOnClick: false,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        validate: (href) => /^https?:\/\//.test(href),
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        spellcheck: "false",
        class:
          "rounded-md prose prose-gray lg:prose-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      },
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};
