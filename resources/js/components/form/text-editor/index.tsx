import { cn } from '@/lib/utils';
import TextAlign from '@tiptap/extension-text-align';
import { Placeholder } from '@tiptap/extensions';
import { EditorContent, useEditor, useEditorState } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { RedoIcon, SaveIcon, UndoIcon } from 'lucide-react';
import type { ButtonHTMLAttributes, HTMLAttributes, PropsWithChildren } from 'react';
import './index.css';

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
};

export function TextEditor({ variant = 'notion' }: TextEditorProps) {
    const initContent = {
        type: 'doc',
        content: [
            {
                type: 'heading',
                attrs: {
                    level: 1,
                },
                content: [
                    {
                        type: 'text',
                        text: 'Profil Singkat',
                    },
                ],
            },
            {
                type: 'paragraph',
                attrs: {
                    textAlign: 'justify',
                },
                content: [
                    {
                        type: 'text',
                        text: 'Keterbukaan Informasi menjadi hal yang sangat penting untuk mewujudkan ',
                    },
                    {
                        type: 'text',
                        marks: [
                            {
                                type: 'italic',
                            },
                        ],
                        text: 'Good Governance',
                    },
                    {
                        type: 'text',
                        text: ' dalam mendorong tata kelola pemerintahan yang baik, transparan, partisipatif dan dapat dipertanggungjawabkan.',
                    },
                ],
            },
        ],
    };
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                undoRedo: {
                    depth: 15,
                },
            }),
            Placeholder.configure({ placeholder: `Mulai menulis..., Ketik '/' untuk perintah` }),
            TextAlign.configure({
                types: ['paragraph'],
                defaultAlignment: 'justify',
            }),
        ],
        editorProps: {
            attributes: {
                class: 'focus:outline-none outline-none caret-blue-500',
            },
        },
        immediatelyRender: import.meta.env.VITE_APP_ENV === 'production' ? false : true,
        content: initContent,
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

    if (variant === 'notion') {
        return (
            <TextEditorWrapper>
                <TextEditorHeader>
                    <TextEditorHeaderActions>
                        <TextEditorButton
                            onClick={() => {
                                console.log(editor.getJSON());
                            }}
                        >
                            <SaveIcon />
                        </TextEditorButton>
                        <TextEditorSeparator />
                        <TextEditorButton onClick={() => editor.chain().focus().undo().run()} disabled={!canUndo}>
                            <UndoIcon />
                        </TextEditorButton>
                        <TextEditorButton onClick={() => editor.chain().focus().redo().run()} disabled={!canRedo}>
                            <RedoIcon />
                        </TextEditorButton>
                    </TextEditorHeaderActions>
                </TextEditorHeader>
                <EditorContent editor={editor} className="p-4" />
            </TextEditorWrapper>
        );
    }
}
