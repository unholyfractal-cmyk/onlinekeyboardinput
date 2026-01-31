# Keyboard Input Viewer

A simple, in-browser keyboard input visualizer designed for streaming and recording. The background behind the keyboard is a solid color (default **chroma green**) so you can easily key it out in your video software.

Features
- In-browser — runs from `index.html` (no external dependencies)
- Solid background color set via controls or CSS variable `--bg-color`
- Background color picker + preset swatches for custom colors
- Custom Row: toggle 'Add clicked key to Custom Row' to append keys you click; click a custom key to remove it or clear all with 'Clear Custom Keys'
- Multiple presets (Streamer, Full, Compact)
- Easy to customize: edit `presets.json` to add or change layouts, and `css/styles.css` for visuals

How to use
1. Open `keyboard-viewer/index.html` in your browser
2. Choose a preset and use the controls to set background color, scale, and label visibility
3. Press keys to highlight them — click keys to toggle state for recording

Customization tips
- Change `:root { --bg-color: ... }` in `css/styles.css` to set a default chroma color
- Add new presets by following the structure in `presets.json` (rows -> keys with `code` and `label`)

Enjoy — and let me know if you want OBS integration, an overlay mode, or exportable CSS themes.