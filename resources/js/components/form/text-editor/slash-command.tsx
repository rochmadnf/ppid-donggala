import { Extension } from '@tiptap/core';
import { ReactRenderer, type Editor } from '@tiptap/react';
import Suggestion, { type SuggestionKeyDownProps, type SuggestionProps } from '@tiptap/suggestion';
import {
    CodeIcon,
    Heading1Icon,
    Heading2Icon,
    Heading3Icon,
    ImageIcon,
    ListIcon,
    ListOrderedIcon,
    ListTodoIcon,
    MinusIcon,
    QuoteIcon,
    TextIcon,
} from 'lucide-react';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState, type ReactNode } from 'react';

export interface SlashCommandItem {
    title: string;
    description: string;
    icon: ReactNode;
    command: (editor: Editor) => void;
}

const getSuggestionItems = (): SlashCommandItem[] => [
    {
        title: 'Teks',
        description: 'Mulai menulis teks biasa.',
        icon: <TextIcon className="size-5" />,
        command: (editor) => {
            editor.chain().focus().setParagraph().run();
        },
    },
    {
        title: 'Heading 1',
        description: 'Judul bagian besar.',
        icon: <Heading1Icon className="size-5" />,
        command: (editor) => {
            editor.chain().focus().toggleHeading({ level: 1 }).run();
        },
    },
    {
        title: 'Heading 2',
        description: 'Judul bagian sedang.',
        icon: <Heading2Icon className="size-5" />,
        command: (editor) => {
            editor.chain().focus().toggleHeading({ level: 2 }).run();
        },
    },
    {
        title: 'Heading 3',
        description: 'Judul bagian kecil.',
        icon: <Heading3Icon className="size-5" />,
        command: (editor) => {
            editor.chain().focus().toggleHeading({ level: 3 }).run();
        },
    },
    {
        title: 'Daftar Bullet',
        description: 'Buat daftar bullet sederhana.',
        icon: <ListIcon className="size-5" />,
        command: (editor) => {
            editor.chain().focus().toggleBulletList().run();
        },
    },
    {
        title: 'Daftar Nomor',
        description: 'Buat daftar dengan nomor.',
        icon: <ListOrderedIcon className="size-5" />,
        command: (editor) => {
            editor.chain().focus().toggleOrderedList().run();
        },
    },
    {
        title: 'Daftar Tugas',
        description: 'Lacak tugas dengan daftar centang.',
        icon: <ListTodoIcon className="size-5" />,
        command: (editor) => {
            editor.chain().focus().toggleTaskList().run();
        },
    },
    {
        title: 'Kutipan',
        description: 'Tambahkan kutipan atau callout.',
        icon: <QuoteIcon className="size-5" />,
        command: (editor) => {
            editor.chain().focus().toggleBlockquote().run();
        },
    },
    {
        title: 'Blok Kode',
        description: 'Tulis potongan kode.',
        icon: <CodeIcon className="size-5" />,
        command: (editor) => {
            editor.chain().focus().toggleCodeBlock().run();
        },
    },
    {
        title: 'Gambar',
        description: 'Sisipkan gambar dari URL.',
        icon: <ImageIcon className="size-5" />,
        command: (editor) => {
            const url = window.prompt('Masukkan URL gambar:');
            if (url) {
                editor.chain().focus().setImage({ src: url }).run();
            }
        },
    },
    {
        title: 'Garis Pemisah',
        description: 'Pisahkan bagian secara visual.',
        icon: <MinusIcon className="size-5" />,
        command: (editor) => {
            editor.chain().focus().setHorizontalRule().run();
        },
    },
];

interface CommandListProps {
    items: SlashCommandItem[];
    command: (item: SlashCommandItem) => void;
}

interface CommandListRef {
    onKeyDown: (props: SuggestionKeyDownProps) => boolean;
}

const CommandList = forwardRef<CommandListRef, CommandListProps>(({ items, command }, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

    useEffect(() => {
        setSelectedIndex(0);
    }, [items]);

    // Scroll selected item into view
    useEffect(() => {
        const el = itemRefs.current[selectedIndex];
        if (el) {
            el.scrollIntoView({ block: 'nearest' });
        }
    }, [selectedIndex]);

    useImperativeHandle(ref, () => ({
        onKeyDown: ({ event }: SuggestionKeyDownProps) => {
            if (event.key === 'ArrowUp') {
                setSelectedIndex((prev) => (prev + items.length - 1) % items.length);
                return true;
            }

            if (event.key === 'ArrowDown') {
                setSelectedIndex((prev) => (prev + 1) % items.length);
                return true;
            }

            if (event.key === 'Enter') {
                const item = items[selectedIndex];
                if (item) {
                    command(item);
                }
                return true;
            }

            return false;
        },
    }));

    if (items.length === 0) {
        return (
            <div className="slash-command-menu">
                <div className="px-3 py-2 text-sm text-gray-400">Tidak ada hasil</div>
            </div>
        );
    }

    return (
        <div className="slash-command-menu" ref={containerRef}>
            {items.map((item, index) => (
                <button
                    key={item.title}
                    ref={(el) => {
                        itemRefs.current[index] = el;
                    }}
                    type="button"
                    className={`slash-command-item ${index === selectedIndex ? 'is-selected' : ''}`}
                    onClick={() => command(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                >
                    <div className="slash-command-item-icon">{item.icon}</div>
                    <div className="slash-command-item-content">
                        <span className="slash-command-item-title">{item.title}</span>
                        <span className="slash-command-item-description">{item.description}</span>
                    </div>
                </button>
            ))}
        </div>
    );
});

CommandList.displayName = 'CommandList';

const renderItems = () => {
    let component: ReactRenderer<CommandListRef> | null = null;
    let popup: HTMLDivElement | null = null;

    return {
        onStart: (props: SuggestionProps<SlashCommandItem>) => {
            component = new ReactRenderer(CommandList, {
                props,
                editor: props.editor,
            });

            popup = document.createElement('div');
            popup.classList.add('slash-command-popup');
            document.body.appendChild(popup);

            if (component.element) {
                popup.appendChild(component.element);
            }

            const { clientRect } = props;
            if (clientRect) {
                const rect = clientRect();
                if (rect && popup) {
                    popup.style.position = 'absolute';
                    popup.style.left = `${rect.left}px`;
                    popup.style.top = `${rect.bottom + 8}px`;
                    popup.style.zIndex = '50';
                }
            }
        },

        onUpdate: (props: SuggestionProps<SlashCommandItem>) => {
            component?.updateProps(props);

            const { clientRect } = props;
            if (clientRect && popup) {
                const rect = clientRect();
                if (rect) {
                    popup.style.left = `${rect.left}px`;
                    popup.style.top = `${rect.bottom + 8}px`;
                }
            }
        },

        onKeyDown: (props: SuggestionKeyDownProps) => {
            if (props.event.key === 'Escape') {
                popup?.remove();
                popup = null;
                component?.destroy();
                component = null;
                return true;
            }

            return component?.ref?.onKeyDown(props) ?? false;
        },

        onExit: () => {
            popup?.remove();
            popup = null;
            component?.destroy();
            component = null;
        },
    };
};

export const SlashCommand = Extension.create({
    name: 'slashCommand',

    addOptions() {
        return {
            suggestion: {
                char: '/',
                command: ({ editor, range, props }: { editor: Editor; range: { from: number; to: number }; props: SlashCommandItem }) => {
                    props.command(editor);
                    editor.chain().focus().deleteRange(range).run();
                },
                items: ({ query }: { query: string }) => {
                    return getSuggestionItems().filter((item) => item.title.toLowerCase().includes(query.toLowerCase()));
                },
                render: renderItems,
            },
        };
    },

    addProseMirrorPlugins() {
        return [
            Suggestion({
                editor: this.editor,
                ...this.options.suggestion,
            }),
        ];
    },
});
