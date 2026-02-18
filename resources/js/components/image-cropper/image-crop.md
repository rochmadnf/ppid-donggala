# Image Cropper

A composable, preset-driven image cropping system built with **React**, **TypeScript**, **shadcn/ui**, **Tailwind CSS v4**, and **CropperJS v2**.

---

## Architecture

```
image-cropper/
├── presets.ts              # Preset type & built-in presets
├── use-cropper.ts          # Core hook (CropperJS lifecycle + API)
├── cropper-canvas.tsx      # <img> surface (no logic)
├── cropper-controls.tsx    # Toolbar (zoom, rotate, flip, preset, reset)
├── cropper-preview.tsx     # Live crop preview (canvas-based)
├── image-dropzone.tsx      # Drag & drop / click upload
├── image-cropper-dialog.tsx# Full dialog wrapper (composes all above)
└── index.ts                # Barrel exports
```

---

## Quick Start

### Simplest usage — Dialog mode

```tsx
import { useState } from 'react';
import { ImageCropperDialog } from '@/components/image-cropper';

function AvatarUpload() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button onClick={() => setOpen(true)}>Upload Avatar</button>

            <ImageCropperDialog
                open={open}
                onOpenChange={setOpen}
                defaultPreset="avatar"
                onConfirm={(blob, preset) => {
                    // blob  → the cropped File/Blob (PNG by default)
                    // preset → the CropPreset used (e.g. avatar)
                    const url = URL.createObjectURL(blob);
                    console.log('Cropped image URL:', url);
                }}
            />
        </>
    );
}
```

### Composable usage — build your own UI

```tsx
import { useCropper, CropperCanvas, CropperControls, CropperPreview, ImageDropzone } from '@/components/image-cropper';

function CustomCropper() {
    const [imageSrc, setImageSrc] = useState<string | null>(null);

    const cropper = useCropper({
        imageSrc,
        defaultPreset: 'og-image',
    });

    return (
        <div>
            {!imageSrc ? (
                <ImageDropzone onImageSelect={(file) => setImageSrc(URL.createObjectURL(file))} />
            ) : (
                <>
                    <CropperCanvas src={imageSrc} imageRef={cropper.imageRef} shape={cropper.preset?.shape} />
                    <CropperControls
                        isReady={cropper.isReady}
                        preset={cropper.preset}
                        presets={cropper.presets}
                        setPreset={cropper.setPreset}
                        setAspectRatio={cropper.setAspectRatio}
                        zoomIn={cropper.zoomIn}
                        zoomOut={cropper.zoomOut}
                        rotateLeft={cropper.rotateLeft}
                        rotateRight={cropper.rotateRight}
                        flipX={cropper.flipX}
                        flipY={cropper.flipY}
                        reset={cropper.reset}
                    />
                    <CropperPreview
                        cropper={cropper.cropper}
                        isReady={cropper.isReady}
                        shape={cropper.preset?.shape}
                        changeVersion={cropper.changeVersion}
                    />
                </>
            )}
        </div>
    );
}
```

---

## Modules

### 1. Presets (`presets.ts`)

#### `CropPreset` type

| Field          | Type                 | Description                       |
| -------------- | -------------------- | --------------------------------- |
| `key`          | `string`             | Unique ID for selection/merging   |
| `label`        | `string`             | Display label                     |
| `aspectRatio`  | `number \| null`     | Aspect ratio (`null` = free crop) |
| `shape`        | `'circle' \| 'rect'` | Visual crop shape                 |
| `outputWidth`  | `number`             | Output canvas width (px)          |
| `outputHeight` | `number`             | Output canvas height (px)         |
| `minWidth?`    | `number`             | Minimum width constraint (px)     |
| `minHeight?`   | `number`             | Minimum height constraint (px)    |

#### Built-in presets

| Key        | Label    | Ratio    | Shape  | Output     |
| ---------- | -------- | -------- | ------ | ---------- |
| `avatar`   | Avatar   | 1:1      | circle | 512 × 512  |
| `og-image` | OG Image | 1200:630 | rect   | 1200 × 630 |

#### Utilities

```ts
mergePresets(builtIn, custom?)  // Merge custom presets (same key = override)
getPreset(presets, key)         // Find a preset by key
```

---

### 2. `useCropper` Hook (`use-cropper.ts`)

The core hook — UI-agnostic, manages the entire CropperJS v2 lifecycle.

#### Options

```ts
useCropper({
    imageSrc: string | null,         // Blob URL, data URL, or remote URL
    defaultPreset?: string,          // Preset key to apply on init
    customPresets?: CropPreset[],    // Extra presets (merged with built-ins)
})
```

#### Return value

| Property / Method    | Type                                         | Description                        |
| -------------------- | -------------------------------------------- | ---------------------------------- |
| `imageRef`           | `RefObject<HTMLImageElement>`                | Attach to the `<img>` element      |
| `cropper`            | `Cropper \| null`                            | Raw CropperJS instance             |
| `isReady`            | `boolean`                                    | `true` after init                  |
| `preset`             | `CropPreset \| null`                         | Active preset                      |
| `presets`            | `CropPreset[]`                               | All available presets              |
| `changeVersion`      | `number`                                     | Bumps on every programmatic change |
| `setPreset(key)`     | `(key: string) => void`                      | Switch preset                      |
| `zoomIn()`           | `() => void`                                 | Zoom in (+0.1)                     |
| `zoomOut()`          | `() => void`                                 | Zoom out (−0.1)                    |
| `rotateLeft()`       | `() => void`                                 | Rotate −90°                        |
| `rotateRight()`      | `() => void`                                 | Rotate +90°                        |
| `rotateTo(degrees)`  | `(degrees: number) => void`                  | Rotate to exact angle              |
| `flipX()`            | `() => void`                                 | Flip horizontal                    |
| `flipY()`            | `() => void`                                 | Flip vertical                      |
| `setAspectRatio(r)`  | `(ratio: number \| null) => void`            | Override aspect ratio              |
| `reset()`            | `() => void`                                 | Reset all transforms               |
| `getCroppedCanvas()` | `() => Promise<HTMLCanvasElement \| null>`   | Get cropped canvas element         |
| `getCroppedBlob()`   | `(type?, quality?) => Promise<Blob \| null>` | Get cropped image as Blob          |

---

### 3. `CropperCanvas` (`cropper-canvas.tsx`)

Renders the `<img>` element that CropperJS wraps. No logic — purely presentational.

| Prop         | Type                                  | Description                  |
| ------------ | ------------------------------------- | ---------------------------- |
| `src`        | `string`                              | Image URL                    |
| `imageRef`   | `RefObject<HTMLImageElement \| null>` | From `useCropper().imageRef` |
| `shape?`     | `'circle' \| 'rect'`                  | Visual mask shape            |
| `className?` | `string`                              | Additional Tailwind classes  |

---

### 4. `CropperControls` (`cropper-controls.tsx`)

Toolbar with preset selector, zoom, rotate, flip, and reset buttons. Uses shadcn `Button` + `lucide-react` icons. All controls auto-disable when `isReady` is `false`.

| Prop             | Type                              | Description                 |
| ---------------- | --------------------------------- | --------------------------- |
| `isReady`        | `boolean`                         | Disable all when `false`    |
| `preset`         | `CropPreset \| null`              | Currently active preset     |
| `presets`        | `CropPreset[]`                    | Preset list for selector    |
| `setPreset`      | `(key: string) => void`           | Preset switcher             |
| `setAspectRatio` | `(ratio: number \| null) => void` | Aspect ratio override       |
| `zoomIn`         | `() => void`                      | —                           |
| `zoomOut`        | `() => void`                      | —                           |
| `rotateLeft`     | `() => void`                      | —                           |
| `rotateRight`    | `() => void`                      | —                           |
| `flipX`          | `() => void`                      | —                           |
| `flipY`          | `() => void`                      | —                           |
| `reset`          | `() => void`                      | —                           |
| `className?`     | `string`                          | Additional Tailwind classes |

---

### 5. `CropperPreview` (`cropper-preview.tsx`)

Live canvas-based preview of the crop result. Syncs via DOM events (`action`, `actionend`) for user gestures and `changeVersion` for programmatic changes.

| Prop             | Type                 | Description                     |
| ---------------- | -------------------- | ------------------------------- |
| `cropper`        | `Cropper \| null`    | CropperJS instance              |
| `isReady`        | `boolean`            | Whether cropper is initialised  |
| `shape?`         | `'circle' \| 'rect'` | Preview clip shape              |
| `width?`         | `number`             | Preview width (default: 120px)  |
| `height?`        | `number`             | Preview height (default: 120px) |
| `changeVersion?` | `number`             | Triggers re-render on change    |
| `className?`     | `string`             | Additional Tailwind classes     |

---

### 6. `ImageDropzone` (`image-dropzone.tsx`)

Drag & drop + click-to-upload component. Validates file type (JPEG, PNG, WebP) and size. Keyboard and screen-reader accessible.

| Prop            | Type                   | Description                   |
| --------------- | ---------------------- | ----------------------------- |
| `onImageSelect` | `(file: File) => void` | Called with the selected file |
| `maxSizeMB?`    | `number`               | Max file size (default: 5)    |
| `disabled?`     | `boolean`              | Disable the dropzone          |
| `className?`    | `string`               | Additional Tailwind classes   |

---

### 7. `ImageCropperDialog` (`image-cropper-dialog.tsx`)

Full-featured dialog composing all modules. Flow: **Upload → Select preset → Crop → Preview → Confirm**.

| Prop             | Type                                       | Description                           |
| ---------------- | ------------------------------------------ | ------------------------------------- |
| `open`           | `boolean`                                  | Controlled open state                 |
| `onOpenChange`   | `(open: boolean) => void`                  | Open state callback                   |
| `defaultPreset?` | `string`                                   | Initial preset key                    |
| `presets?`       | `CropPreset[]`                             | Custom presets (merged with built-in) |
| `onConfirm`      | `(blob: Blob, preset: CropPreset) => void` | Called on crop confirmation           |
| `maxSizeMB?`     | `number`                                   | Max upload size (default: 5)          |

---

## Custom Presets

Pass custom presets via the `presets` prop. Same `key` as a built-in overrides it; new keys are appended.

```tsx
<ImageCropperDialog
    open={open}
    onOpenChange={setOpen}
    defaultPreset="banner"
    presets={[
        {
            key: 'banner',
            label: 'Banner',
            aspectRatio: 16 / 9,
            shape: 'rect',
            outputWidth: 1920,
            outputHeight: 1080,
        },
        {
            key: 'thumbnail',
            label: 'YouTube Thumbnail',
            aspectRatio: 1280 / 720,
            shape: 'rect',
            outputWidth: 1280,
            outputHeight: 720,
        },
        {
            key: 'document',
            label: 'Document (A4)',
            aspectRatio: 210 / 297,
            shape: 'rect',
            outputWidth: 2100,
            outputHeight: 2970,
        },
    ]}
    onConfirm={(blob, preset) => {
        /* ... */
    }}
/>
```

---

## Gesture Support

CropperJS v2 handles all gestures natively via the `<cropper-canvas>` web component:

- **Pointer events** — mouse and touch drag to move/resize selection
- **Wheel zoom** — scroll to zoom the image
- **Pinch zoom** — two-finger pinch on mobile
- **Keyboard** — arrow keys to move selection when focused

---

## Accessibility

- All buttons have `aria-label` attributes
- Preset buttons use `aria-pressed` for toggle state
- `ImageDropzone` is keyboard-operable (`Enter` / `Space` to trigger)
- Dialog uses Radix UI Dialog (auto focus trap + `Escape` to close)
- `CropperPreview` canvas has `aria-label`
- `focus-visible` ring on all interactive elements

---

## Output

`getCroppedBlob(type?, quality?)` returns a `Promise<Blob>`:

```ts
// PNG (default)
const blob = await getCroppedBlob();

// JPEG at 80% quality
const blob = await getCroppedBlob('image/jpeg', 0.8);

// WebP at 90% quality
const blob = await getCroppedBlob('image/webp', 0.9);
```

Circle-shaped presets automatically clip the output to a circular mask (transparent corners in PNG/WebP).

---

## Dependencies

| Package                  | Version | Purpose               |
| ------------------------ | ------- | --------------------- |
| `cropperjs`              | ^2.1.0  | Image cropping engine |
| `lucide-react`           | —       | Icons for controls    |
| `@radix-ui/react-dialog` | —       | Dialog primitive      |
