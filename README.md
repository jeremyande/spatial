# Gaussian Splat Viewer (WordPress Plugin)

Standalone WordPress plugin to render Gaussian Splats from `.ply` files using:

- Shortcode: `[gaussian_splat]`
- Gutenberg block: `Gaussian Splat Viewer`

## Features

- Media Library friendly URL selection
- Default plugin settings page under **Settings → Gaussian Splat Viewer**
- Full-width viewer with solid black background
- Optional controls and camera autoplay
- Standard fallback message when WebGL/viewer load fails

## Install

1. Zip this plugin folder.
2. Upload in WordPress Admin → **Plugins → Add New → Upload Plugin**.
3. Activate plugin.
4. Configure default `.ply` URL in **Settings → Gaussian Splat Viewer**.

## Shortcode

```text
[gaussian_splat src="https://example.com/my-file.ply" height="70vh" background="#000000" controls="true" autoplay="false"]
```

If `src` is omitted, it falls back to the plugin default URL.
