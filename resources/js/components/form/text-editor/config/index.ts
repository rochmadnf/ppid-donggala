import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import Typography from '@tiptap/extension-typography';
import UniqueID from '@tiptap/extension-unique-id';
import { Placeholder } from '@tiptap/extensions';
import StarterKit from '@tiptap/starter-kit';
import { CustomImage } from '../custom-image';

export const extenstions = [
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
];
