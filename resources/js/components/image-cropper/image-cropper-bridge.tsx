import { lazy, Suspense } from 'react';

import type { ImageCropperDialogProps } from './image-cropper-single-preset';

const RealImageCropperDialog = lazy(() => import('./image-cropper-single-preset').then((mod) => ({ default: mod.ImageCropperDialog })));

export function ImageCropperDialog(props: ImageCropperDialogProps) {
    // Jangan render (dan jangan import) di server, dan baru load bundle
    // cropperjs ketika dialog benar-benar dibuka.
    if (typeof window === 'undefined' || !props.open) {
        return null;
    }

    return (
        <Suspense fallback={null}>
            <RealImageCropperDialog {...props} />
        </Suspense>
    );
}

export type { ImageCropperDialogProps };
