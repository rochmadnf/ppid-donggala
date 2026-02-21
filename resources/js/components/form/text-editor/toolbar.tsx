import { cn } from '@/lib/utils';
import type { Editor } from '@tiptap/react';
import {
    AlignCenterIcon,
    AlignJustifyIcon,
    AlignLeftIcon,
    AlignRightIcon,
    BoldIcon,
    ChevronDownIcon,
    CodeIcon,
    Heading1Icon,
    Heading2Icon,
    Heading3Icon,
    HighlighterIcon,
    ItalicIcon,
    LinkIcon,
    ListIcon,
    ListOrderedIcon,
    ListTodoIcon,
    MinusIcon,
    PilcrowIcon,
    QuoteIcon,
    RedoIcon,
    RemoveFormattingIcon,
    SaveIcon,
    SquareCodeIcon,
    StrikethroughIcon,
    UnderlineIcon,
    UndoIcon,
} from 'lucide-react';
import { useCallback, useRef, useState, type ReactNode } from 'react';
import { TextEditorButton, TextEditorButtonGroup, TextEditorSeparator } from './index';

// ─── Block type selector (Notion-like heading/paragraph picker) ─────────────

interface BlockTypeItem {
    label: string;
    icon: ReactNode;
    action: (editor: Editor) => void;
    isActive: (editor: Editor) => boolean;
}

const blockTypes: BlockTypeItem[] = [
    {
        label: 'Teks',
        icon: <PilcrowIcon className="size-4" />,
        action: (editor) => editor.chain().focus().setParagraph().run(),
        isActive: (editor) => editor.isActive('paragraph') && !editor.isActive('heading'),
    },
    {
        label: 'Heading 1',
        icon: <Heading1Icon className="size-4" />,
        action: (editor) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
        isActive: (editor) => editor.isActive('heading', { level: 1 }),
    },
    {
        label: 'Heading 2',
        icon: <Heading2Icon className="size-4" />,
        action: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
        isActive: (editor) => editor.isActive('heading', { level: 2 }),
    },
    {
        label: 'Heading 3',
        icon: <Heading3Icon className="size-4" />,
        action: (editor) => editor.chain().focus().toggleHeading({ level: 3 }).run(),
        isActive: (editor) => editor.isActive('heading', { level: 3 }),
    },
];

export function BlockTypeSelector({ editor }: { editor: Editor }) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const activeBlock = blockTypes.find((b) => b.isActive(editor)) ?? blockTypes[0];

    return (
        <div className="relative" ref={containerRef}>
            <TextEditorButton onClick={() => setOpen(!open)} className="gap-1 pr-1.5 text-xs font-medium" aria-expanded={open}>
                {activeBlock.icon}
                <span className="hidden sm:inline">{activeBlock.label}</span>
                <ChevronDownIcon className="size-3 opacity-50" />
            </TextEditorButton>
            {open && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                    <div className="absolute top-full left-0 z-50 mt-1 w-44 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                        {blockTypes.map((block) => (
                            <button
                                key={block.label}
                                type="button"
                                className={cn(
                                    'flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm transition-colors hover:bg-gray-100',
                                    block.isActive(editor) && 'bg-blue-50 text-blue-700',
                                )}
                                onClick={() => {
                                    block.action(editor);
                                    setOpen(false);
                                }}
                            >
                                {block.icon}
                                {block.label}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

// ─── Link dialog ────────────────────────────────────────────────────────────

export function LinkButton({ editor }: { editor: Editor }) {
    const setLink = useCallback(() => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('Masukkan URL:', previousUrl);

        // cancelled
        if (url === null) return;

        // empty - remove link
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }, [editor]);

    return (
        <TextEditorButton onClick={setLink} className={cn(editor.isActive('link') && 'is-active')} title="Tautan">
            <LinkIcon />
        </TextEditorButton>
    );
}

// ─── Text Alignment Buttons ─────────────────────────────────────────────────

export function AlignmentButtons({ editor }: { editor: Editor }) {
    return (
        <TextEditorButtonGroup>
            <TextEditorButton
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                className={cn(editor.isActive({ textAlign: 'left' }) && 'is-active')}
                title="Rata Kiri"
            >
                <AlignLeftIcon />
            </TextEditorButton>
            <TextEditorButton
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                className={cn(editor.isActive({ textAlign: 'center' }) && 'is-active')}
                title="Rata Tengah"
            >
                <AlignCenterIcon />
            </TextEditorButton>
            <TextEditorButton
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                className={cn(editor.isActive({ textAlign: 'right' }) && 'is-active')}
                title="Rata Kanan"
            >
                <AlignRightIcon />
            </TextEditorButton>
            <TextEditorButton
                onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                className={cn(editor.isActive({ textAlign: 'justify' }) && 'is-active')}
                title="Rata Kiri-Kanan"
            >
                <AlignJustifyIcon />
            </TextEditorButton>
        </TextEditorButtonGroup>
    );
}

// ─── Full Toolbar ───────────────────────────────────────────────────────────

interface ToolbarProps {
    editor: Editor;
    canUndo: boolean;
    canRedo: boolean;
    onSave?: () => void;
}

export function Toolbar({ editor, canUndo, canRedo, onSave }: ToolbarProps) {
    return (
        <>
            {/* Save */}
            <TextEditorButton onClick={onSave} title="Simpan">
                <SaveIcon />
            </TextEditorButton>

            <TextEditorSeparator />

            {/* Undo / Redo */}
            <TextEditorButtonGroup>
                <TextEditorButton onClick={() => editor.chain().focus().undo().run()} disabled={!canUndo} title="Undo">
                    <UndoIcon />
                </TextEditorButton>
                <TextEditorButton onClick={() => editor.chain().focus().redo().run()} disabled={!canRedo} title="Redo">
                    <RedoIcon />
                </TextEditorButton>
            </TextEditorButtonGroup>

            <TextEditorSeparator />

            {/* Block type */}
            <BlockTypeSelector editor={editor} />

            <TextEditorSeparator />

            {/* Inline formatting */}
            <TextEditorButtonGroup>
                <TextEditorButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={cn(editor.isActive('bold') && 'is-active')}
                    title="Tebal (Ctrl+B)"
                >
                    <BoldIcon />
                </TextEditorButton>
                <TextEditorButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={cn(editor.isActive('italic') && 'is-active')}
                    title="Miring (Ctrl+I)"
                >
                    <ItalicIcon />
                </TextEditorButton>
                <TextEditorButton
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={cn(editor.isActive('underline') && 'is-active')}
                    title="Garis Bawah (Ctrl+U)"
                >
                    <UnderlineIcon />
                </TextEditorButton>
                <TextEditorButton
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={cn(editor.isActive('strike') && 'is-active')}
                    title="Coret (Ctrl+Shift+S)"
                >
                    <StrikethroughIcon />
                </TextEditorButton>
                <TextEditorButton
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    className={cn(editor.isActive('code') && 'is-active')}
                    title="Kode Inline"
                >
                    <CodeIcon />
                </TextEditorButton>
                <TextEditorButton
                    onClick={() => editor.chain().focus().toggleHighlight().run()}
                    className={cn(editor.isActive('highlight') && 'is-active')}
                    title="Sorot"
                >
                    <HighlighterIcon />
                </TextEditorButton>
            </TextEditorButtonGroup>

            <TextEditorSeparator />

            {/* Link */}
            <LinkButton editor={editor} />

            <TextEditorSeparator />

            {/* Alignment */}
            <AlignmentButtons editor={editor} />

            <TextEditorSeparator />

            {/* Lists */}
            <TextEditorButtonGroup>
                <TextEditorButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={cn(editor.isActive('bulletList') && 'is-active')}
                    title="Daftar Bullet"
                >
                    <ListIcon />
                </TextEditorButton>
                <TextEditorButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={cn(editor.isActive('orderedList') && 'is-active')}
                    title="Daftar Nomor"
                >
                    <ListOrderedIcon />
                </TextEditorButton>
                <TextEditorButton
                    onClick={() => editor.chain().focus().toggleTaskList().run()}
                    className={cn(editor.isActive('taskList') && 'is-active')}
                    title="Daftar Tugas"
                >
                    <ListTodoIcon />
                </TextEditorButton>
            </TextEditorButtonGroup>

            <TextEditorSeparator />

            {/* Block elements */}
            <TextEditorButtonGroup>
                <TextEditorButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={cn(editor.isActive('blockquote') && 'is-active')}
                    title="Kutipan"
                >
                    <QuoteIcon />
                </TextEditorButton>
                <TextEditorButton
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    className={cn(editor.isActive('codeBlock') && 'is-active')}
                    title="Blok Kode"
                >
                    <SquareCodeIcon />
                </TextEditorButton>
                <TextEditorButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Garis Pemisah">
                    <MinusIcon />
                </TextEditorButton>
            </TextEditorButtonGroup>

            <TextEditorSeparator />

            {/* Clear formatting */}
            <TextEditorButton onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} title="Hapus Format">
                <RemoveFormattingIcon />
            </TextEditorButton>
        </>
    );
}
