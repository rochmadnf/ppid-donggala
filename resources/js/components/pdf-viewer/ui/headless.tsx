import { createPluginRegistration } from '@embedpdf/core';
import { EmbedPDF } from '@embedpdf/core/react';
import { usePdfiumEngine } from '@embedpdf/engines/react';

// Import the essential plugins
import { DocumentContent, DocumentManagerPluginPackage } from '@embedpdf/plugin-document-manager/react';
import { InteractionManagerPluginPackage, PagePointerProvider } from '@embedpdf/plugin-interaction-manager/react';
import { RenderLayer, RenderPluginPackage } from '@embedpdf/plugin-render/react';
import { Scroller, ScrollPluginPackage } from '@embedpdf/plugin-scroll/react';
import { SelectionLayer, SelectionPluginPackage } from '@embedpdf/plugin-selection/react';
import { Viewport, ViewportPluginPackage } from '@embedpdf/plugin-viewport/react';
import { ZoomMode, ZoomPluginPackage } from '@embedpdf/plugin-zoom/react';

// parts
import { ZoomToolbar } from '../parts/zoom-toolbar';

// 1. Register the plugins you need
const plugins = [
    createPluginRegistration(DocumentManagerPluginPackage, {
        initialDocuments: [{ url: '/assets/santri.pdf' }],
    }),
    createPluginRegistration(ViewportPluginPackage),
    createPluginRegistration(ScrollPluginPackage),
    createPluginRegistration(RenderPluginPackage),
    createPluginRegistration(ZoomPluginPackage, {
        defaultZoomLevel: ZoomMode.FitPage,
    }),
    createPluginRegistration(InteractionManagerPluginPackage),
    createPluginRegistration(SelectionPluginPackage),
];

export const PDFViewer = () => {
    // 2. Initialize the engine with the React hook
    const { engine, isLoading } = usePdfiumEngine();

    if (isLoading || !engine) {
        return <div>Loading PDF Engine...</div>;
    }

    // 3. Wrap your UI with the <EmbedPDF> provider
    return (
        <div style={{ height: '100vh', border: '1px solid black', display: 'flex', flexDirection: 'column' }}>
            <EmbedPDF engine={engine} plugins={plugins}>
                {({ activeDocumentId }) =>
                    activeDocumentId && (
                        <DocumentContent documentId={activeDocumentId}>
                            {({ isLoaded }) =>
                                isLoaded && (
                                    <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
                                        <ZoomToolbar documentId={activeDocumentId} />
                                        <div style={{ flex: 1, overflow: 'hidden' }}>
                                            <Viewport documentId={activeDocumentId}>
                                                <Scroller
                                                    documentId={activeDocumentId}
                                                    renderPage={({ width, height, pageIndex }) => (
                                                        <div style={{ width, height }}>
                                                            <PagePointerProvider documentId={activeDocumentId} pageIndex={pageIndex}>
                                                                <RenderLayer documentId={activeDocumentId} pageIndex={pageIndex} />
                                                                <SelectionLayer documentId={activeDocumentId} pageIndex={pageIndex} />
                                                            </PagePointerProvider>
                                                        </div>
                                                    )}
                                                />
                                            </Viewport>
                                        </div>
                                    </div>
                                )
                            }
                        </DocumentContent>
                    )
                }
            </EmbedPDF>
        </div>
    );
};
