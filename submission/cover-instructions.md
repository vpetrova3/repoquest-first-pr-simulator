# Cover image — what's already in this folder, and how to redo it

## TL;DR

`submission/cover.png` is the **ready-to-submit 1600×900** cover for LabLab. Use it as-is unless you want a sharper render.

Two files live here:

| File | Size | Use |
|---|---|---|
| `cover.png` | 1600×900 (16:9) ✅ | **Submit this.** Rendered via `qlmanage` then resampled to 16:9. |
| `cover-source-1600x1600.png` | 1600×1600 | Raw qlmanage thumbnail. Useful if you want to crop differently in Preview. |

The 1600×900 version is slightly compressed vertically because Quick Look thumbnails pad to square. The content is fully visible and reads cleanly. For a pitch-perfect, pixel-correct render see "Sharper render" below.

## How `cover.png` was generated

```bash
# from the repo root
qlmanage -t -s 1600 -o /tmp submission/cover.html
sips --resampleHeightWidth 900 1600 /tmp/cover.html.png --out submission/cover.png
```

To regenerate after editing `cover.html`, run those two commands again.

## Sharper render (optional, requires Chrome)

If you install Chrome, you can produce a pixel-perfect render with no resampling:

1. Open `submission/cover.html` in Chrome (`open -a "Google Chrome" submission/cover.html`).
2. DevTools (⌘⌥I) → Device toolbar (⌘⇧M) → set Responsive **1600 × 900** at 100% zoom.
3. Device toolbar kebab menu (⋮) → **Capture full size screenshot**.
4. Move the Downloads file to `submission/cover.png` (overwrites the resampled one).

Or headless from terminal, once Chrome is installed:

```bash
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --headless --disable-gpu --hide-scrollbars \
  --window-size=1600,900 \
  --screenshot="$(pwd)/submission/cover.png" \
  "file://$(pwd)/submission/cover.html"
```

## Sharper render (no extra install, manual)

1. Open `submission/cover.html` in Safari.
2. **View → Actual Size** to ensure 100% zoom.
3. Resize the Safari window so the dark cover fills the visible area edge-to-edge.
4. `Cmd+Shift+4`, then `Space`, then click the browser window — captures the visible area.
5. Open the screenshot in Preview → **Tools → Adjust Size** → 1600×900 with **Scale proportionally** turned OFF and resample.

## Customizing the cover

Edit `submission/cover.html`. Things worth tweaking:

- **Accent word** in the title — currently `<span class="accent">confusion</span>`.
- **Demo card rows** — Repo, AI status, Readiness values.
- **Footer text** — currently includes the GitHub repo URL.
- **Brand colors** — top of `<style>`, look for `--teal`, `--blue`, `--amber`.

Re-run the qlmanage + sips commands above after each edit to regenerate `cover.png`.

## Verify before submitting

```bash
file submission/cover.png
# expect: PNG image data, 1600 x 900
```

LabLab requires 16:9. 1600×900 is the standard recommended minimum.
