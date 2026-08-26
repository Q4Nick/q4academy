---
name: E-learning directory write constraint
description: How to edit files in the served E-learning/ directory of this static prototype
---

The `E-learning/` directory (served by `python3 -m http.server 5000`) is read-only for
**creating new files** (perms dr-xr-xr-x). Existing files can be overwritten.

**Rule:** Modify `E-learning/app.js` / `styles.css` with Python `open(path,'w')` or shell
redirection. The Edit/WriteFile tools fail there because they write a temp dotfile in the
same dir first (EACCES).

**Why:** Saves repeated failed Edit attempts.

**How to apply:**
- New assets (images/logos) can't be added as files — resize with ImageMagick (`magick`),
  base64-encode, and embed as `data:` URLs directly in `app.js`.
- The app is a single-file vanilla-JS SPA: in-memory `state`, full re-render via `render()`
  on every `navigate()`. User-entered values rendered into `innerHTML` MUST be escaped
  (`escapeAttr()` escapes `< > & "`) to avoid DOM-XSS.
- To screenshot an authed view (no hash routing), temporarily set `state.route` (and e.g.
  `state.activeCourse`/`state.activeFact`) via Python, screenshot, then revert.
- To transcribe Dutch content from uploaded UI screenshots accurately, install `tesseract`
  (Nix system dep; includes `nld` lang), crop the content column with `magick`, then
  `tesseract crop.png out -l nld`. Far cheaper/more accurate than reading many image chunks.
