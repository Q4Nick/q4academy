# Prompt voor Replit Agent: migratie Q4 Academy e-learning naar Replit-project

Plak de tekst hieronder (vanaf "## Opdracht") in de Replit Agent-chat van je e-learning project. Upload daarbij de map met screenshots ("screenshots E-learning Xtirion NL") naar het project, zodat de agent de exacte teksten, afbeeldingen en vraagstellingen kan overnemen.

---

## Opdracht

Ik heb een bestaand e-learning platform ("Q4 Academy", gebouwd op het Xtirion-LMS, te zien op q4academy.xtirion.com) en wil de volledige structuur, functionaliteit en content overzetten naar dit Replit-project. Ik heb een map met ~205 screenshots geüpload (`screenshots E-learning Xtirion NL/`) die elk scherm en elke stap van het platform tonen. Gebruik deze map als brondocumentatie. Bouw het platform na — niet de Xtirion-branding, maar wel de structuur, het gedrag en de inhoud.

### Werkwijze

1. Loop systematisch door de submappen (zie mapstructuur hieronder). Open per les de screenshots in bestandsvolgorde (sorteer op tijdstip in de bestandsnaam, bv. `Schermafbeelding 2026-06-10 123740.png` komt vóór `...123852.png`) — dat is de exacte volgorde van de stappen in de les.
2. Lees per stap-screenshot de kop, body-tekst, vraagstelling, antwoordopties en feedback letterlijk over. Gebruik deze teksten 1-op-1, vertaal of herschrijf niets.
3. Herken het type stap (zie "Stap-componenten" hieronder) aan de hand van de lay-out en bouw een herbruikbare component per type.
4. Gebruik de losse afbeeldingen (.jpg/.webp/.png die niet "Schermafbeelding..." heten) als beeldmateriaal in de bijbehorende stap — de bestandsnaam beschrijft meestal het onderwerp (bv. `disc-axes.png`, `comfort-zone.jpg`).
5. De `.txt`-bestanden in een lesmap bevatten Vimeo-embedlinks voor de introvideo van die cursus/les — bouw een video-embed met die URL.

### Mapstructuur van de bronmap

```
de basis van DISC bestanden/                              → Cursus 1
  Les-1 de basis van menselijk gedrag/                     → Les 1.1 (16 stappen)
  Les-2 van menselijk gedrag naar DISC/                    → Les 1.2
  Les-3 De basis van DISC/                                 → Les 1.3
  Trainer de basis van DISC/                               → Timed-quiz "Trainer"
  fact cards/                                               → Factcards van cursus 1
  disc-basis-hero.webp                                      → Hero-afbeelding cursuskaart
  httpsvimeo...l.txt                                        → Vimeo-link(s) cursusvideo

Van DISC naar het Persoonlijke Stijl (DISC) Profiel/        → Cursus 2
  Les-1 Vier fundamentele temperamenten/                    → Les 2.1
  Les-2 Van DISC naar het Persoonlijke Stijl (DISC) Profiel/→ Les 2.2
  Les-3 Opbouw van het Persoonlijke Stijl (DISC) Profiel/   → Les 2.3
  Trainer/                                                  → Timed-quiz "Trainer"
  Factcards/                                                → Factcards van cursus 2
  disc-profiel-hero.webp                                    → Hero-afbeelding cursuskaart
  httpsvimeo...l.txt                                        → Vimeo-link cursusvideo

Hoofdscherm onderdelen/                                     → Screenshots van login, dashboard,
                                                                voortgang, admin-overzicht,
                                                                gebruikersbeheer, uitnodigingen,
                                                                factcards-overzicht (geen losse les)
```

### Site-/datamodel

Entiteiten om te bouwen (pas namen aan op de stack die dit project al gebruikt):

- **User**: naam, e-mail, rol (`admin` / `student`), toegangsniveau (`trial` / `cursus1` / `volledig`), status (`actief`/`inactief`), laatste login.
- **Invitation**: e-mail, toegangsniveau, status (`openstaand`/`geaccepteerd`/`verlopen`/`gebruikt`), aangemaakt-op, verloopt-op.
- **Course**: titel, beschrijving, hero-afbeelding, intro-video (vimeo-url), aantal lessen, geschatte duur.
- **Lesson**: titel, hoort bij course, volgnummer, geschatte duur, status (afgerond/bezig/niet gestart).
- **Step**: hoort bij lesson, volgnummer, type (zie componenten), inhoud (tekst/afbeelding/vraag+antwoorden+feedback+hint).
- **Trainer** (timed quiz per course): titel, aantal vragen, slagingspercentage (bv. 80%), vragen (stelling + juist/onjuist of multiple choice + feedback).
- **Factcard**: hoort bij course, titel, kleur/categorie (D/I/S/C of overig), korte intro-tekst, afbeelding, detailpagina met volledige tekst en "lees ook"-suggesties.
- **Progress**: per user per lesson (% voltooid, tijd besteed) en per course (samengevat), plus totaal quizscore.

### Paginastructuur / routes

- `/login` — marketing-tekst links, login-met-e-mail formulier rechts.
- `/dashboard` — welkomstbanner met statistieken (cursussen, uren, lessen, voltooid), kaarten per beschikbare cursus.
- `/dashboard/courses/:courseId` — cursusdetail: hero met titel/beschrijving/duur, voortgangsbalk, lessenlijst (status, duur, knop "Bekijk opnieuw"/"Start"), ingesloten introvideo, sectie "Trainer" (kaart met badge "Timed quiz", beste score, knop), sectie "Factcards" (knop naar overzicht).
- `/dashboard/courses/:courseId/lessons/:lessonId?step=N` — lesspeler (zie hieronder).
- `/dashboard/courses/:courseId/trainer` — intro-scherm (badge, aantal vragen, vereist percentage, uitleg "Timer loopt / Vrij navigeren / Direct feedback", knop "Start de Trainer") + vraagschermen.
- `/factcards` — grid met alle factcards (gegroepeerd of gemengd), klikbaar naar detail.
- `/factcards/:id` — detailpagina met hero-afbeelding, titel, volledige body-tekst, "lees ook"-kaarten onderaan.
- `/progress` (Voortgang) — totale voortgang %, totaal bestede tijd, quizscore, voortgangsbalk per cursus met lessen/tijd/quizscore.
- `/admin` (alleen voor rol admin) — tabblad **Overzicht** (gebruikers-telling met statusbalk, uitnodigingen-telling, donut "cursus voltooiing", donut "quiz score"), tabblad **Gebruikers** (tabel: naam, e-mail, rol, toegangsniveau-dropdown, status, laatste login), tabblad **Uitnodigingen** (formulier: e-mail + keuze toegangsniveau trial/cursus1/volledig + knop "Uitnodigen"; tabel met verzonden uitnodigingen en status).

Globale navigatiebalk op elke ingelogde pagina: logo "Q4 Academy" links, menu Dashboard / Factcards / Voortgang / (Admin indien rol admin), taalwissel NL/EN rechtsboven, ronde avatar met initialen.

### Stap-componenten (in de lesspeler)

Bouw deze als losse, herbruikbare componenten — elke les is een reeks van deze stappen:

1. **Tekstkaart** — titel + één of meerdere alinea's, geen afbeelding.
2. **Tekst + afbeelding naast elkaar** — titel, alinea's links, afbeelding met onderschrift rechts.
3. **Afbeelding-only stap** — vraag/stelling als titel boven een afbeelding (reflectievraag zonder invoer, puur ter overdenking).
4. **Diagram/grafiek-stap** — bv. donut-chart of staafdiagram met interactieve "+"-punten die uitleg tonen, knop "Open alles".
5. **Multiple choice (checkbox)** — vraag, instructie "Selecteer alle juiste antwoorden", lijst aanvinkbare opties, link "Klik hier voor een tip" (toont hint), knop "Controleer antwoord", inline feedback per optie na controleren.
6. **Matching/drag-drop** — instructie "Gebruik de pijltjes om de rechterkolom te herschikken", twee kolommen die aan elkaar gekoppeld moeten worden, feedback "Alles correct!" met groene styling per gekoppeld paar.
7. **Waar/onjuist** — gebruikt vooral in de Trainer: stelling, twee knoppen "Juist"/"Onjuist", direct kleurfeedback (groen = correct) en korte feedbacktekst ("Correct!").

Navigatie-elementen onderaan de lesspeler: link "Afsluiten" (verlaat les), knop "Vorige" (uitgeschakeld op stap 1), voortgangsindicator als rij bolletjes (huidige stap blauw gevuld, opgemaakt op basis van totaal aantal stappen), tekst "Stap X van N", lopende "Quiz: A/B correct (C%)", knop "Volgende" (rechts, prominent, blauw).

Trainer-vraagscherm heeft een eigen header: timer linksboven (mm:ss aflopend), rij genummerde bolletjes rechtsboven (huidig = blauw/groen, overig grijs), en onderaan "Vorige"/"Volgende".

### Admin & gebruikersbeheer — gedrag

- Drie toegangsniveaus bepalen welke cursussen/lessen een student kan zien: `trial` (alleen les 1 van cursus 1), `cursus1` (volledige cursus 1), `volledig` (beide cursussen + trainers + factcards).
- Uitnodigen stuurt een e-mail met activatielink; status verloopt na 7 dagen als niet geaccepteerd.
- Admin-overzicht toont live-tellingen (geen statische cijfers): aantal gebruikers per status, aantal uitnodigingen per status, gemiddeld cursus-voltooiingspercentage, gemiddelde quizscore over alle gebruikers.

### Stijl/branding

- Logo: gekleurde cirkel (geel/oranje/rood/blauw/groen segmenten) + wordmark "Q4 Academy", subtekst "E-learning Platform".
- Hoofdkleur knoppen: oranje (primaire CTA's als "Inloggen met e-mail", "Volgende", "Start de Trainer").
- Accentkleur navigatie/actieve status: blauw.
- DISC-kleurcodering (consistent gebruiken in factcards/grafieken): **D = rood, I = geel, S = groen, C = blauw**.
- Lay-out: witte content-kaarten met afgeronde hoeken en lichte schaduw op een lichtgrijze achtergrond; ruime witruimte; geen drukke decoratie.
- Twee-talig: NL/EN-toggle rechtsboven op elke pagina (kan in eerste instantie alleen NL functioneel zijn, toggle wel tonen).

### Content om letterlijk over te nemen (voorbeelden al getranscribeerd — gebruik dit als format-referentie, vul de rest aan via de screenshots)

**Cursus 1, Les 1.1 "De basis van menselijk gedrag" — stap 1 (introtekst):**
> "In deze les maken we een start met de achtergrond en theorie van DISC. We bespreken welke basisbehoeftes mensen hebben en welke rol leeftijd speelt in onze denkwijze en gedrag. In ons brein gebeurt van alles, zowel bewust als onderbewust. Verschillende delen van het brein zijn daarom ook verantwoordelijk voor gedrag. Ook gewoontes spelen een belangrijke rol bij menselijk gedrag. Het samenspel van deze verschillende factoren maakt een mens uniek en zorgt ervoor dat we de wereld interpreteren vanuit ons eigen perspectief. Het beter begrijpen van deze theoretische achtergrond helpt je straks om de Q4 Profiles Persoonlijke Stijl (DISC) Profielen te kunnen interpreteren."

**Zelfde les, stap 3 "Geschiedenis DISC: Dr. Carl Gustav Jung":**
> "De behoefte om menselijk gedrag te begrijpen is al eeuwenoud. De grondlegger van de persoonlijkheidstypering is de psychoanalist dr. Carl Gustav Jung. Hij onderscheidde type mensen gebaseerd op vier psychologische functies: denken, voelen, waarnemen en intuïtie. Hij combineerde deze functies met de tweedeling introvert/extravert. Zo werd inzichtelijk gemaakt dat introverte mensen hun energie richten op hun innerlijke wereld, terwijl extraverte mensen hun energie richten op de buitenwereld: zij hebben een impuls nodig, zoals uitdagingen, doelen of andere mensen."

Dit toont het gewenste detailniveau en de toon (zakelijk, instructief, korte alinea's). Verwerk alle overige lesstappen, factcards en trainervragen op dezelfde manier rechtstreeks uit de screenshots — niet samenvatten of inkorten.

### Acceptatiecriteria

- Alle routes uit "Paginastructuur" bestaan en zijn bereikbaar via de navigatie.
- Beide cursussen met elk 3 lessen, 1 trainer en 1 factcards-set zijn volledig ingeladen met content uit de screenshots (geen placeholder-tekst).
- Elke stap in elke les gebruikt het juiste componenttype uit "Stap-componenten" en toont de exacte tekst/vraag/antwoorden uit de bijbehorende screenshot(s).
- Voortgang, quizscore en admin-tellingen zijn dynamisch (rekenen op basis van data, niet hardcoded).
- Toegangsniveaus beperken zichtbaarheid van cursusonderdelen zoals beschreven.
