import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { Editor } from '@tiptap/react';
import { useEditorState } from '@tiptap/react';
import {
    AlignCenterIcon,
    AlignJustifyIcon,
    AlignLeftIcon,
    AlignRightIcon,
    BoldIcon,
    CheckIcon,
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
    type LucideIcon,
} from 'lucide-react';
import { useCallback, type ReactNode } from 'react';
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
    const { activeBlockLabel, activeBlockIcon } = useEditorState({
        editor,
        selector: (ctx) => {
            const active = blockTypes.find((b) => b.isActive(ctx.editor)) ?? blockTypes[0];
            return {
                activeBlockLabel: active.label,
                activeBlockIcon: active.icon,
            };
        },
    });

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <TextEditorButton className="gap-1 pr-1.5 text-xs font-medium">
                    {activeBlockIcon}
                    <span className="hidden sm:inline">{activeBlockLabel}</span>
                    <ChevronDownIcon className="size-3 opacity-50" />
                </TextEditorButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-44">
                {blockTypes.map((block) => (
                    <DropdownMenuItem key={block.label} className={cn(block.isActive(editor) && 'bg-accent')} onSelect={() => block.action(editor)}>
                        {block.icon}
                        <span className="flex-1">{block.label}</span>
                        {block.isActive(editor) && <CheckIcon className="size-4 text-blue-600" />}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export type ToolbarButtonItem = { label: string; icon: LucideIcon; value: string; isActive: boolean; shortcut?: string };

export function TextAlignmentButton({ editor }: { editor: Editor }) {
    const { isAlignCenter, isAlignLeft, isAlignRight, isAlignJustify } = useEditorState({
        editor,
        selector: (ctx) => ({
            isAlignLeft: ctx.editor.isActive({ textAlign: 'left' }),
            isAlignCenter: ctx.editor.isActive({ textAlign: 'center' }),
            isAlignRight: ctx.editor.isActive({ textAlign: 'right' }),
            isAlignJustify: ctx.editor.isActive({ textAlign: 'justify' }),
        }),
    });

    const alignments: ToolbarButtonItem[] = [
        { label: 'Rata Kiri', icon: AlignLeftIcon, value: 'left', isActive: isAlignLeft, shortcut: 'Ctrl/⌘ + Shift + L' },
        { label: 'Rata Tengah', icon: AlignCenterIcon, value: 'center', isActive: isAlignCenter, shortcut: 'Ctrl/⌘ + Shift + E' },
        { label: 'Rata Kanan', icon: AlignRightIcon, value: 'right', isActive: isAlignRight, shortcut: 'Ctrl/⌘ + Shift + R' },
        { label: 'Rata Kiri-Kanan', icon: AlignJustifyIcon, value: 'justify', isActive: isAlignJustify, shortcut: 'Ctrl/⌘ + Shift + J' },
    ];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <TextEditorButton className="gap-1 pr-1.5" title="Rata Teks">
                    {alignments.map(({ isActive, icon: Icon }) => isActive && <Icon key={Icon.name} className="size-4" />)}
                    <ChevronDownIcon className="size-3 opacity-50" />
                </TextEditorButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-44 flex-col gap-y-1 p-1">
                {alignments.map(({ label, value, icon: Icon, isActive, shortcut }) => (
                    <DropdownMenuItem
                        key={value}
                        className={cn(isActive && 'bg-accent')}
                        onClick={() => editor?.chain().focus().setTextAlign(value).run()}
                    >
                        <Icon className="size-4" />
                        <span className="flex-1" title={`${shortcut}`}>
                            {label}
                        </span>
                        {isActive && <CheckIcon className="size-4 text-blue-600" />}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

// ─── Link dialog ────────────────────────────────────────────────────────────

export function LinkButton({ editor, isActive }: { editor: Editor; isActive: boolean }) {
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
        <TextEditorButton onClick={setLink} data-active={isActive || undefined} title="Tautan">
            <LinkIcon />
        </TextEditorButton>
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
    // Subscribe to editor state changes so toolbar buttons re-render on formatting changes
    const state = useEditorState({
        editor,
        selector: (ctx) => ({
            isBold: ctx.editor.isActive('bold'),
            isItalic: ctx.editor.isActive('italic'),
            isUnderline: ctx.editor.isActive('underline'),
            isStrike: ctx.editor.isActive('strike'),
            isCode: ctx.editor.isActive('code'),
            isHighlight: ctx.editor.isActive('highlight'),
            isLink: ctx.editor.isActive('link'),
            isBulletList: ctx.editor.isActive('bulletList'),
            isOrderedList: ctx.editor.isActive('orderedList'),
            isTaskList: ctx.editor.isActive('taskList'),
            isBlockquote: ctx.editor.isActive('blockquote'),
            isCodeBlock: ctx.editor.isActive('codeBlock'),
        }),
    });

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
                    data-active={state.isBold || undefined}
                    title="Tebal (Ctrl+B)"
                >
                    <BoldIcon />
                </TextEditorButton>
                <TextEditorButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    data-active={state.isItalic || undefined}
                    title="Miring (Ctrl+I)"
                >
                    <ItalicIcon />
                </TextEditorButton>
                <TextEditorButton
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    data-active={state.isUnderline || undefined}
                    title="Garis Bawah (Ctrl+U)"
                >
                    <UnderlineIcon />
                </TextEditorButton>
                <TextEditorButton
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    data-active={state.isStrike || undefined}
                    title="Coret (Ctrl+Shift+S)"
                >
                    <StrikethroughIcon />
                </TextEditorButton>
                <TextEditorButton
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    data-active={state.isCode || undefined}
                    title="Kode Inline"
                >
                    <CodeIcon />
                </TextEditorButton>
                <TextEditorButton
                    onClick={() => editor.chain().focus().toggleHighlight().run()}
                    data-active={state.isHighlight || undefined}
                    title="Sorot"
                >
                    <HighlighterIcon />
                </TextEditorButton>
            </TextEditorButtonGroup>

            <TextEditorSeparator />

            {/* Link */}
            <LinkButton editor={editor} isActive={state.isLink} />

            <TextEditorSeparator />

            {/* Alignment */}
            <TextEditorButtonGroup>
                <TextAlignmentButton editor={editor} />

                <TextEditorButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    data-active={state.isBulletList || undefined}
                    title="Daftar Bullet"
                >
                    <ListIcon />
                </TextEditorButton>
                <TextEditorButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    data-active={state.isOrderedList || undefined}
                    title="Daftar Nomor"
                >
                    <ListOrderedIcon />
                </TextEditorButton>
                <TextEditorButton
                    onClick={() => editor.chain().focus().toggleTaskList().run()}
                    data-active={state.isTaskList || undefined}
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
                    data-active={state.isBlockquote || undefined}
                    title="Kutipan"
                >
                    <QuoteIcon />
                </TextEditorButton>
                <TextEditorButton
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    data-active={state.isCodeBlock || undefined}
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
