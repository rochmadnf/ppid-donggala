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
 * when used with TextAlign and ResizableNodeView.
 */
export const CustomImage = Image.extend({
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
                    return true;
                },
                options: {
                    directions,
                    min: { width: minWidth, height: minHeight },
                    preserveAspectRatio: alwaysPreserveAspectRatio === true,
                },
            });

            const dom = nodeView.dom;

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
