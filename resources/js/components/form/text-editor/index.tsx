import { cn } from '@/lib/utils';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import Typography from '@tiptap/extension-typography';
import { Placeholder } from '@tiptap/extensions';
import { EditorContent, useEditor, useEditorState } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { ButtonHTMLAttributes, HTMLAttributes, PropsWithChildren } from 'react';
import { EditorBubbleMenu } from './bubble-menu';
import './index.css';
import { SlashCommand } from './slash-command';
import { Toolbar } from './toolbar';

export function TextEditorButtonGroup({
    children,
    orientation = 'horizontal',
    ...props
}: HTMLAttributes<HTMLDivElement> & { orientation?: 'horizontal' | 'vertical' }) {
    return (
        <div className="text-editor-button-group" data-orientation={orientation} role="group" {...props}>
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
    variant?: 'notion';
    content?: Record<string, unknown>;
    onSave?: (json: Record<string, unknown>) => void;
};

export function TextEditor({ variant = 'notion', content, onSave }: TextEditorProps) {
    const defaultContent = {
        type: 'doc',
        content: [
            {
                type: 'paragraph',
                content: [],
            },
        ],
    };

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                undoRedo: {
                    depth: 30,
                },
            }),
            Placeholder.configure({
                placeholder: ({ node }) => {
                    if (node.type.name === 'heading') {
                        return `Heading ${node.attrs.level}`;
                    }
                    return "Ketik '/' untuk perintah, atau mulai menulis...";
                },
                includeChildren: true,
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
                defaultAlignment: 'left',
            }),
            Highlight.configure({
                multicolor: true,
            }),
            TaskList,
            TaskItem.configure({
                nested: true,
            }),
            Image.configure({
                inline: false,
                allowBase64: true,
            }),
            TextStyle,
            Color,
            Typography,
            SlashCommand,
        ],
        editorProps: {
            attributes: {
                class: 'text-editor-content focus:outline-none outline-none caret-blue-500',
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

    if (variant === 'notion') {
        return (
            <TextEditorWrapper>
                <TextEditorHeader>
                    <TextEditorHeaderActions>
                        <Toolbar editor={editor} canUndo={canUndo} canRedo={canRedo} onSave={handleSave} />
                    </TextEditorHeaderActions>
                </TextEditorHeader>
                <EditorContent editor={editor} className="p-4" />
                <EditorBubbleMenu editor={editor} />
            </TextEditorWrapper>
        );
    }
}
