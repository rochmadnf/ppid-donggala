import type { Editor } from '@tiptap/react';
import { useEditorState } from '@tiptap/react';
import { BubbleMenu as TiptapBubbleMenu } from '@tiptap/react/menus';
import { BoldIcon, CodeIcon, HighlighterIcon, ItalicIcon, LinkIcon, StrikethroughIcon, UnderlineIcon } from 'lucide-react';
import { useCallback } from 'react';

interface EditorBubbleMenuProps {
    editor: Editor;
}

export function EditorBubbleMenu({ editor }: EditorBubbleMenuProps) {
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
        }),
    });

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
                    className="bubble-menu-button"
                    data-active={state.isBold || undefined}
                    title="Tebal"
                >
                    <BoldIcon />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className="bubble-menu-button"
                    data-active={state.isItalic || undefined}
                    title="Miring"
                >
                    <ItalicIcon />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className="bubble-menu-button"
                    data-active={state.isUnderline || undefined}
                    title="Garis Bawah"
                >
                    <UnderlineIcon />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className="bubble-menu-button"
                    data-active={state.isStrike || undefined}
                    title="Coret"
                >
                    <StrikethroughIcon />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    className="bubble-menu-button"
                    data-active={state.isCode || undefined}
                    title="Kode"
                >
                    <CodeIcon />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHighlight().run()}
                    className="bubble-menu-button"
                    data-active={state.isHighlight || undefined}
                    title="Sorot"
                >
                    <HighlighterIcon />
                </button>
                <div className="bubble-menu-separator" />
                <button type="button" onClick={setLink} className="bubble-menu-button" data-active={state.isLink || undefined} title="Tautan">
                    <LinkIcon />
                </button>
            </div>
        </TiptapBubbleMenu>
    );
}
