---
name: EQ-i wheel embed pattern
description: How the EQ-i lesson wheel iframe is parameterized and sized
---
The EQ-i wheel is a full HTML doc stored as the JSON-string constant `eqiWheelHtml` in app.js and injected per render via `iframe.srcdoc = eqiWheelHtml.replace("__EQI_STEP__", step)`.

**Why:** srcdoc cannot take URL params and the E-learning dir is read-only for new files, so step behavior (1–5) is switched by a placeholder substitution; iframe height is driven by the wheel posting `{eqiHeight}` via postMessage (fixed heights clip the responsive single-column layout).

**How to apply:** any new wheel behavior goes into the appended "stap-ondersteuning" script inside the embedded HTML; regenerate the constant with json.dumps and escape `</script>` as `<\/script>`. New parent↔iframe communication should reuse the existing postMessage listener pattern.
