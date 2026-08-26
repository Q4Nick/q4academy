# Q4 Academy — e-learning prototype

## Overzicht
Nederlandstalig e-learning prototype voor Q4 Profiles ("Q4 Academy"). Statische vanilla-JS SPA in `E-learning/` (index.html, app.js, styles.css), geserveerd door `serve.py` (poort 5000, no-cache). Modules per Q4-instrument: DISC, EQ-i 2.0, Waarden, Interesses. Alle content en state zitten client-side in `E-learning/app.js`; embed-modellen (EQ-i-wiel, waarden- en interessesmodel) staan als single-line JSON-string constants in app.js.

Let op: de map `E-learning/` is read-only voor nieuwe bestanden — bewerk bestaande bestanden via Python, embed afbeeldingen als base64/data-URI.

## User preferences
- Altijd in het Nederlands communiceren.
- Waarden-grid altijd in de officiële Q4-volgorde: boven Type IV (groen) en Type III (blauw), onder Type I (oranje) en Type II (paars); assen: boven "Gezamenlijke doelen", onder "Persoonlijke doelen", links "Persoonlijke inzet", rechts "Gezamenlijke inzet".
