import { cn } from '@/lib/utils';
import type { Editor } from '@tiptap/react';
import { BubbleMenu as TiptapBubbleMenu } from '@tiptap/react/menus';
import { BoldIcon, CodeIcon, HighlighterIcon, ItalicIcon, LinkIcon, StrikethroughIcon, UnderlineIcon } from 'lucide-react';
import { useCallback } from 'react';

interface EditorBubbleMenuProps {
    editor: Editor;
}

export function EditorBubbleMenu({ editor }: EditorBubbleMenuProps) {
    const setLink = useCallback(() => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('Masukkan URL:', previousUrl);

        if (url === null) return;

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }, [editor]);

    return (
        <TiptapBubbleMenu
            editor={editor}
            options={{
                placement: 'top',
            }}
        >
            <div className="bubble-menu">
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={cn('bubble-menu-button', editor.isActive('bold') ? 'is-active' : '')}
                    title="Tebal"
                >
                    <BoldIcon />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={cn('bubble-menu-button', editor.isActive('italic') ? 'is-active' : '')}
                    title="Miring"
                >
                    <ItalicIcon />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={cn('bubble-menu-button', editor.isActive('underline') ? 'is-active' : '')}
                    title="Garis Bawah"
                >
                    <UnderlineIcon />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={cn('bubble-menu-button', editor.isActive('strike') ? 'is-active' : '')}
                    title="Coret"
                >
                    <StrikethroughIcon />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    className={cn('bubble-menu-button', editor.isActive('code') ? 'is-active' : '')}
                    title="Kode"
                >
                    <CodeIcon />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHighlight().run()}
                    className={cn('bubble-menu-button', editor.isActive('highlight') ? 'is-active' : '')}
                    title="Sorot"
                >
                    <HighlighterIcon />
                </button>
                <div className="bubble-menu-separator" />
                <button
                    type="button"
                    onClick={setLink}
                    className={cn('bubble-menu-button', editor.isActive('link') ? 'is-active' : '')}
                    title="Tautan"
                >
                    <LinkIcon />
                </button>
            </div>
        </TiptapBubbleMenu>
    );
}
