# Cover image

`submission/cover.png` is the ready-to-submit LabLab cover image.

| File | Size | Use |
|---|---:|---|
| `cover.png` | 1600x900 | Submit this PNG. |
| `cover.svg` | 1600x900 | Editable source for the cover. |

The cover is now generated from a native 16:9 SVG, so it is not stretched or squeezed.

## Regenerate the PNG

From the repo root:

```bash
sips -s format png submission/cover.svg --out submission/cover.png
```

Then verify:

```bash
sips -g pixelWidth -g pixelHeight submission/cover.png
# expect: pixelWidth 1600, pixelHeight 900
```

## Customizing

Edit `submission/cover.svg` directly. The safest text to change:

- Main headline: "From a fresh clone to your first PR."
- Badge labels: "IBM Bob evidence", "watsonx Granite live", "Vercel ready"
- Footer repository URL

Keep the output at 1600x900 for LabLab's 16:9 cover requirement.
