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
import Color from '@tiptap/extension-color';
import DragHandle from '@tiptap/extension-drag-handle-react';
import Highlight from '@tiptap/extension-highlight';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import Typography from '@tiptap/extension-typography';
import UniqueID from '@tiptap/extension-unique-id';
import { Placeholder } from '@tiptap/extensions';
import { EditorContent, useEditor, useEditorState } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
    ALargeSmallIcon,
    CircleIcon,
    CopyPlusIcon,
    GripVerticalIcon,
    MoveVerticalIcon,
    PaintbrushIcon,
    RemoveFormattingIcon,
    RepeatIcon,
    TrashIcon,
} from 'lucide-react';
import { useState, type ButtonHTMLAttributes, type HTMLAttributes, type PropsWithChildren } from 'react';
import { CustomImage } from './custom-image';
import { Toolbar } from './toolbar';

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

export function TextEditorHeader({ children, className, ...props }: HTMLAttributes<HTMLHeadElement>) {
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
    variant?: 'default';
    content?: Record<string, unknown>;
    onSave?: (json: Record<string, unknown>) => void;
};

export function TextEditor({ variant = 'default', content, onSave }: TextEditorProps) {
    const defaultContent = {
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

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                undoRedo: {
                    depth: 30,
                },
                link: {
                    openOnClick: false,
                    autolink: true,
                    defaultProtocol: 'https',
                    protocols: ['http', 'https', 'mailto'],
                },
            }),
            Placeholder.configure({
                placeholder: ({ node }) => {
                    if (node.type.name === 'heading') {
                        return `Heading ${node.attrs.level}`;
                    }
                    return 'Mulai menulis...';
                },
                includeChildren: true,
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph', 'image'],
                defaultAlignment: 'left',
            }),
            Highlight.configure({
                multicolor: true,
            }),
            TaskList,
            TaskItem.configure({
                nested: true,
            }),
            CustomImage.configure({
                inline: false,
                allowBase64: true,
                resize: {
                    enabled: true,
                    directions: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
                    minWidth: 50,
                    minHeight: 50,
                    alwaysPreserveAspectRatio: true,
                },
            }),
            TextStyle,
            Color,
            Typography,
            UniqueID.configure({
                types: ['heading', 'paragraph'],
                attributeName: 'nid',
            }),
        ],
        editorProps: {
            attributes: {
                class: 'text-editor-content pl-10 pt-4',
            },
        },
        immediatelyRender: import.meta.env.VITE_APP_ENV === 'production' ? false : true,
        content: content ?? defaultContent,
    });

    const { canUndo, canRedo } = useEditorState({
        editor,
        selector: (ctx) => {
            return {
                canUndo: ctx.editor.can().chain().focus().undo().run(),
                canRedo: ctx.editor.can().chain().focus().redo().run(),
            };
        },
    });

    // state management
    const [activeNode, setActiveNode] = useState<{ node: any; pos: number } | null>(null);

    if (!editor) {
        return null;
    }

    const handleSave = () => {
        const json = editor.getJSON();
        if (onSave) {
            onSave(json);
        } else {
            console.log(json);
        }
    };

    const goToLastPositionOnCurrentNode = () => {
        const { $from } = editor.state.selection;
        const endPos = $from.end($from.depth);

        editor.commands.focus(endPos);
    };

    return (
        <TextEditorWrapper className="border-x-0 border-b-0">
            <TextEditorHeader>
                <TextEditorHeaderActions>
                    <Toolbar editor={editor} canUndo={canUndo} canRedo={canRedo} onSave={handleSave} />
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
                                            <DropdownMenuItem className="text-red-500">
                                                <ALargeSmallIcon className="size-5 text-red-500" />
                                                Teks Merah
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="text-gray-700"
                                                onClick={() => {
                                                    editor.chain().focus().setColor('var(--color-gray-700)').run();
                                                }}
                                            >
                                                <ALargeSmallIcon className="size-5 text-gray-700" />
                                                Teks Default
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="text-blue-500"
                                                onClick={() => {
                                                    editor.chain().focus().setColor('var(--color-blue-500)').run();
                                                }}
                                            >
                                                <ALargeSmallIcon className="size-5 text-blue-500" />
                                                Teks Biru
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuLabel className="text-sm text-gray-500">Latar Belakang</DropdownMenuLabel>
                                            <DropdownMenuItem
                                                className="text-blue-500"
                                                onClick={() => {
                                                    editor.commands.toggleHighlight({ color: 'var(--color-blue-300)' });
                                                    editor.commands.focus();
                                                }}
                                            >
                                                <CircleIcon className="size-5 fill-blue-300 stroke-blue-400" />
                                                Latar Belakang Biru
                                            </DropdownMenuItem>
                                        </DropdownMenuSubContent>
                                    </DropdownMenuPortal>
                                </DropdownMenuSub>
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger>
                                        <RepeatIcon />
                                        Ubah jadi
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuPortal>
                                        <DropdownMenuSubContent>
                                            <DropdownMenuItem>Red</DropdownMenuItem>
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
