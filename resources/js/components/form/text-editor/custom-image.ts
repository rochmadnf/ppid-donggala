import { ResizableNodeView } from '@tiptap/core';
import Image from '@tiptap/extension-image';

const alignmentMap: Record<string, string> = {
    left: 'flex-start',
    center: 'center',
    right: 'flex-end',
    justify: 'flex-start',
};

/**
 * Custom Image extension that supports alignment (left/center/right)
 * and editable captions when used with TextAlign and ResizableNodeView.
 */
export const CustomImage = Image.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            caption: {
                default: null,
                parseHTML: (element: HTMLElement) => {
                    const fig = element.closest('figure');
                    return fig?.querySelector('figcaption')?.textContent || null;
                },
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'figure[data-image-figure]',
                getAttrs: (el: HTMLElement) => {
                    const img = el.querySelector('img');
                    if (!img) return false;
                    return {
                        src: img.getAttribute('src'),
                        alt: img.getAttribute('alt'),
                        title: img.getAttribute('title'),
                        width: img.getAttribute('width') ? Number(img.getAttribute('width')) : null,
                        height: img.getAttribute('height') ? Number(img.getAttribute('height')) : null,
                        caption: el.querySelector('figcaption')?.textContent || null,
                    };
                },
            },
            {
                tag: this.options.allowBase64 ? 'img[src]' : 'img[src]:not([src^="data:"])',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        const { caption, ...imgAttrs } = HTMLAttributes;

        if (caption) {
            return ['figure', { 'data-image-figure': '' }, ['img', imgAttrs], ['figcaption', {}, caption]];
        }

        return ['img', imgAttrs];
    },

    addNodeView() {
        if (!this.options.resize || !this.options.resize.enabled || typeof document === 'undefined') {
            return null;
        }

        const { directions, minWidth, minHeight, alwaysPreserveAspectRatio } = this.options.resize;

        return ({ node, getPos, HTMLAttributes, editor }) => {
            const el = document.createElement('img');

            Object.entries(HTMLAttributes).forEach(([key, value]) => {
                if (value != null) {
                    switch (key) {
                        case 'width':
                        case 'height':
                        case 'style':
                        case 'caption':
                            break;
                        default:
                            el.setAttribute(key, value);
                            break;
                    }
                }
            });

            el.src = HTMLAttributes.src;

            const applyAlignment = (container: HTMLElement, align: string) => {
                container.style.justifyContent = alignmentMap[align] || 'flex-start';
            };

            const nodeView = new ResizableNodeView({
                element: el,
                editor,
                node,
                getPos,
                onResize: (width, height) => {
                    el.style.width = `${width}px`;
                    el.style.height = `${height}px`;
                },
                onCommit: (width, height) => {
                    const pos = getPos();
                    if (pos === undefined) return;
                    this.editor.chain().setNodeSelection(pos).updateAttributes(this.name, { width, height }).run();
                },
                onUpdate: (updatedNode, _decorations, _innerDecorations) => {
                    if (updatedNode.type !== node.type) return false;
                    applyAlignment(nodeView.dom, updatedNode.attrs.textAlign || 'left');

                    // Sync caption text only if user is NOT currently editing it
                    if (!isCaptionFocused) {
                        const newCaption = updatedNode.attrs.caption || '';
                        if (captionEl.textContent !== newCaption) {
                            captionEl.textContent = newCaption;
                        }
                        captionEl.dataset.empty = newCaption ? '' : 'true';
                    }

                    return true;
                },
                options: {
                    directions,
                    min: { width: minWidth, height: minHeight },
                    preserveAspectRatio: alwaysPreserveAspectRatio === true,
                },
            });

            const dom = nodeView.dom;

            // ── Caption element ──────────────────────────────
            const captionEl = document.createElement('figcaption');
            captionEl.className = 'image-caption';
            captionEl.contentEditable = 'true';
            captionEl.dataset.placeholder = 'Tulis keterangan...';
            captionEl.textContent = node.attrs.caption || '';
            captionEl.dataset.empty = node.attrs.caption ? '' : 'true';
            let isCaptionFocused = false;

            // Prevent ProseMirror from stealing focus when clicking caption
            captionEl.addEventListener('mousedown', (e) => {
                e.stopPropagation();
            });

            captionEl.addEventListener('click', (e) => {
                e.stopPropagation();
                captionEl.focus();
            });

            // Prevent editor from handling keys inside caption
            captionEl.addEventListener('keydown', (e) => {
                e.stopPropagation();
                if (e.key === 'Enter') {
                    e.preventDefault();
                }
                if (e.key === 'Escape') {
                    captionEl.blur();
                    editor.commands.focus();
                }
            });

            captionEl.addEventListener('input', () => {
                const text = captionEl.textContent?.trim() || '';
                captionEl.dataset.empty = text ? '' : 'true';
                const pos = getPos();
                if (pos === undefined) return;

                // Use a transaction directly to avoid triggering onUpdate loop
                const tr = editor.state.tr.setNodeAttribute(pos, 'caption', text || null);
                editor.view.dispatch(tr);
            });

            captionEl.addEventListener('focus', () => {
                isCaptionFocused = true;
                captionEl.dataset.empty = '';
            });

            captionEl.addEventListener('blur', () => {
                isCaptionFocused = false;
                const text = captionEl.textContent?.trim() || '';
                captionEl.dataset.empty = text ? '' : 'true';
            });

            // Append caption after the resize wrapper inside the container
            dom.appendChild(captionEl);

            // Tell ProseMirror to ignore DOM mutations inside caption
            // so it doesn't try to re-parse the node and delete the image
            (nodeView as any).ignoreMutation = (mutation: MutationRecord) => {
                if (captionEl === mutation.target || captionEl.contains(mutation.target)) {
                    return true;
                }
                return false;
            };

            // Prevent ProseMirror from handling events inside caption
            (nodeView as any).stopEvent = (event: Event) => {
                if (captionEl.contains(event.target as Node)) {
                    return true;
                }
                return false;
            };

            // Apply initial alignment
            applyAlignment(dom, node.attrs.textAlign || 'left');

            dom.style.visibility = 'hidden';
            dom.style.pointerEvents = 'none';
            el.onload = () => {
                dom.style.visibility = '';
                dom.style.pointerEvents = '';
            };

            return nodeView;
        };
    },
});
