# How to capture the 16:9 cover image

The cover template is a self-contained HTML page sized exactly 1600×900. Three ways to capture it.

## Fastest: macOS Chrome / Brave / Edge

1. Open the file:
   ```
   open submission/cover.html
   ```
   (or drag it into a Chromium browser)

2. Open DevTools (⌘⌥I), then toolbar icon **Toggle device toolbar** (⌘⇧M).

3. In the device toolbar, set **Responsive** → enter dimensions **1600 × 900** → zoom **100%**.

4. Click the kebab menu (⋮) in the device toolbar → **Capture full size screenshot**.

5. The PNG saves to your Downloads. Rename to `cover.png`, copy into `submission/`:
   ```
   cp ~/Downloads/cover.png "submission/cover.png"
   ```

## Backup: headless Chromium (no UI)

If you have Chrome installed, this works from the terminal:

```bash
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --headless \
  --disable-gpu \
  --hide-scrollbars \
  --window-size=1600,900 \
  --screenshot=submission/cover.png \
  "file://$(pwd)/submission/cover.html"
```

Or with Chromium:
```bash
chromium --headless --disable-gpu --hide-scrollbars --window-size=1600,900 \
  --screenshot=submission/cover.png "file://$(pwd)/submission/cover.html"
```

## Backup: macOS Preview (no extra tools)

1. Open `cover.html` in Safari. Cmd+Plus / Cmd+Minus to size so the cover fills your screen at native 1600×900 (use **View → Actual Size**).
2. Cmd+Shift+4, then Space, then click the browser window.
3. Crop in Preview to the inner cover box (no browser chrome).
4. Resize in Preview → **Tools → Adjust Size** → 1600×900.

## Verify before submitting

```bash
file submission/cover.png
# should show: 1600 x 900, ratio 16:9
```

LabLab accepts PNG and JPG. 16:9 is required; 1600×900 is the recommended minimum. If yours is bigger (e.g., 3200×1800 from retina capture), even better — it'll downsize cleanly.

## Customizing the cover

Edit `submission/cover.html` to change:

- **Title accent word** — line containing `<span class="accent">confusion</span>`.
- **Demo card data** — the rows showing "Analyzing", "Granite 3.3 · live", readiness 94%.
- **Repo URL in footer** — already set to your repo.
- **Colors** — top of `<style>` (`--teal`, `--blue`, `--amber`).
