import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { type JSONContent } from '@tiptap/core';
import DragHandle from '@tiptap/extension-drag-handle-react';
import type { Node as ProseMirrorNode } from '@tiptap/pm/model';
import { EditorContent, useEditor, useEditorState } from '@tiptap/react';
import {
    ALargeSmallIcon,
    CircleIcon,
    CopyPlusIcon,
    GripVerticalIcon,
    MoveVerticalIcon,
    PaintbrushIcon,
    RemoveFormattingIcon,
    TrashIcon,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState, type ButtonHTMLAttributes, type HTMLAttributes, type PropsWithChildren } from 'react';
import { extenstions } from './config';
import { STYLE_COLORS } from './config/colors';
import { Toolbar } from './toolbar';

const DEFAULT_CONTENT = {
    type: 'doc',
    content: [
        {
            type: 'paragraph',
            attrs: {
                id: '540f9bb0-028b-4f78-a063-aa77c7ae5e0a',
                textAlign: 'left',
            },
        },
    ],
};

export function TextEditorButtonGroup({
    className,
    children,
    orientation = 'horizontal',
    ...props
}: PropsWithChildren<HTMLAttributes<HTMLDivElement> & { orientation?: 'horizontal' | 'vertical' } & { className?: string }>) {
    return (
        <div {...props} className={cn('text-editor-button-group', className)} data-orientation={orientation} role="group">
            {children}
        </div>
    );
}

export function TextEditorButton({
    children,
    className,
    ...props
}: PropsWithChildren<
    ButtonHTMLAttributes<HTMLButtonElement> & {
        className?: string;
    }
>) {
    return (
        <button className={cn('text-editor-button', className)} type="button" {...props}>
            {children}
        </button>
    );
}

export function TextEditorWrapper({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn('text-editor-wrapper', className)} {...props}>
            {children}
        </div>
    );
}

export function TextEditorHeaderActions({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn('text-editor-header-actions', className)} {...props}>
            {children}
        </div>
    );
}

export function TextEditorHeader({ children, className, ...props }: HTMLAttributes<HTMLElementTagNameMap['header']>) {
    return (
        <header className={cn('text-editor-header', className)} {...props}>
            {children}
        </header>
    );
}

export function TextEditorSeparator({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return <div className={cn('text-editor-separator', className)} {...props} />;
}

export type TextEditorProps = {
    content?: Record<string, unknown>;
    onSave?: (json: JSONContent) => void;
};

export function TextEditor({ content, onSave }: TextEditorProps) {
    const [isDirty, setIsDirty] = useState<boolean>(false);

    const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const initialHtmlRef = useRef('');

    const debouncedSetIsDirty = useCallback((value: boolean) => {
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }
        debounceTimeoutRef.current = setTimeout(() => {
            setIsDirty(value);
        }, 500);
    }, []);

    const editor = useEditor({
        extensions: extenstions,
        editorProps: {
            attributes: {
                class: 'text-editor-content pl-10 pt-4',
            },
        },
        immediatelyRender: false,
        content: content ?? DEFAULT_CONTENT,
        onUpdate: ({ editor }) => {
            debouncedSetIsDirty(editor.getHTML() !== initialHtmlRef.current);
        },
    });

    const { canUndo, canRedo } = useEditorState({
        editor,
        selector: (ctx) => ({
            canUndo: ctx.editor?.can().chain().focus().undo().run() ?? false,
            canRedo: ctx.editor?.can().chain().focus().redo().run() ?? false,
        }),
    }) ?? { canUndo: false, canRedo: false };

    // state management
    const [activeNode, setActiveNode] = useState<{
        node: ProseMirrorNode;
        pos: number;
    } | null>(null);

    const contentString = useMemo(() => JSON.stringify(content), [content]);

    useEffect(() => {
        if (editor) {
            initialHtmlRef.current = editor.getHTML();
        }
    }, [editor]);

    useEffect(() => {
        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (editor && content) {
            editor.commands.setContent(content, { emitUpdate: false });
            initialHtmlRef.current = editor.getHTML();
            setIsDirty(false);
        }
    }, [editor, contentString]);

    if (!editor) {
        return null;
    }

    const goToLastPositionOnCurrentNode = () => {
        const pos = Math.max(0, editor.state.selection.from - 1);
        editor.commands.focus(pos);
    };

    const handleSave = () => {
        const json = editor.getJSON();

        if (onSave) {
            onSave(json);
        }

        initialHtmlRef.current = editor.getHTML();
        setIsDirty(false);
    };

    return (
        <TextEditorWrapper className="border-x-0 border-b-0">
            <TextEditorHeader>
                <TextEditorHeaderActions>
                    <Toolbar editor={editor} isDirty={isDirty} canUndo={canUndo} canRedo={canRedo} onSave={handleSave} />
                </TextEditorHeaderActions>
            </TextEditorHeader>
            <EditorContent editor={editor} className="px-4" />
            <DragHandle
                editor={editor}
                computePositionConfig={{
                    placement: 'left-start',
                    strategy: 'absolute',
                }}
                onNodeChange={({ node, pos }) => {
                    if (!node || pos == null) {
                        setActiveNode(null);
                        return;
                    }

                    setActiveNode({ node, pos });
                }}
            >
                <TextEditorButtonGroup className="mr-1.5 pt-0.5 data-[orientation=horizontal]:gap-0.5">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <TextEditorButton className="px-0.5 py-1">
                                <MoveVerticalIcon className="size-3.5" />
                            </TextEditorButton>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                            <p>
                                <strong>Drag</strong> untuk pindah blok
                            </p>
                        </TooltipContent>
                    </Tooltip>

                    <DropdownMenu>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <DropdownMenuTrigger asChild>
                                    <TextEditorButton
                                        className="px-0.5 py-1"
                                        onClick={() => {
                                            if (activeNode) {
                                                editor.chain().focus().setNodeSelection(activeNode.pos).run();
                                            }
                                        }}
                                    >
                                        <GripVerticalIcon />
                                    </TextEditorButton>
                                </DropdownMenuTrigger>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="space-y-1 py-1 text-center">
                                <p>
                                    <strong>Klik</strong> untuk buka menu
                                </p>
                            </TooltipContent>
                        </Tooltip>
                        <DropdownMenuContent
                            onCloseAutoFocus={(e) => {
                                e.preventDefault();
                            }}
                            side="left"
                            className="z-11 w-40 rounded-md border border-line-brand bg-white p-1.5"
                        >
                            <DropdownMenuGroup>
                                <DropdownMenuLabel className="text-xs text-muted-foreground">Teks</DropdownMenuLabel>
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger>
                                        <PaintbrushIcon />
                                        Warna
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuPortal>
                                        <DropdownMenuSubContent>
                                            <DropdownMenuLabel className="text-sm text-gray-500">Teks</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            {STYLE_COLORS.map((text) => (
                                                <DropdownMenuItem
                                                    style={{ color: text.value }}
                                                    key={text.label}
                                                    onClick={() => {
                                                        editor.chain().focus().setColor(text.value).run();
                                                    }}
                                                >
                                                    <ALargeSmallIcon className="size-5" style={{ color: text.value }} />
                                                    Teks {text.label}
                                                </DropdownMenuItem>
                                            ))}
                                            <DropdownMenuSeparator />
                                            <DropdownMenuLabel className="text-sm text-gray-500">Latar Belakang</DropdownMenuLabel>
                                            {STYLE_COLORS.map((bg) => (
                                                <DropdownMenuItem
                                                    style={{ color: bg.value }}
                                                    key={bg.label}
                                                    onClick={() => {
                                                        editor.commands.toggleHighlight({ color: bg.value });
                                                        editor.commands.focus();
                                                    }}
                                                >
                                                    <CircleIcon className="size-5 stroke-none" style={{ fill: bg.value }} />
                                                    Latar Belakang {bg.label}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuSubContent>
                                    </DropdownMenuPortal>
                                </DropdownMenuSub>
                                <DropdownMenuItem onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}>
                                    <RemoveFormattingIcon />
                                    Reset Format
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => {
                                        const { from, to } = editor.state.selection;
                                        const slice = editor.state.doc.slice(from, to);
                                        editor.chain().focus().insertContentAt(to, slice.content).run();
                                    }}
                                >
                                    <CopyPlusIcon />
                                    Duplikasi Blok
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    variant="destructive"
                                    onClick={() => {
                                        if (activeNode) {
                                            editor
                                                .chain()
                                                .focus()
                                                .deleteRange({ from: activeNode.pos, to: activeNode.pos + activeNode.node.nodeSize })
                                                .run();
                                            goToLastPositionOnCurrentNode();
                                        }
                                    }}
                                >
                                    <TrashIcon />
                                    Hapus Blok
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TextEditorButtonGroup>
            </DragHandle>
            {/* <EditorBubbleMenu editor={editor} /> */}
        </TextEditorWrapper>
    );
}
