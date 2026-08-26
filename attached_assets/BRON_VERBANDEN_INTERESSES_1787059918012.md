# Bronverbanden Interesses

## Doel

Dit bestand legt vast hoe de drie gebruikte interessesbronnen elkaar aanvullen
en hoe ze vertaald zijn naar kennisregels voor de Q4 Adviesbot.

## Bronnen

1. `4_Interesses presentatie 2023.pptx`
   - Didactische basis voor certificering.
   - Introduceert herkenning van interesses, de 12 interessegebieden, werk- en
     prive-interesses, match/neutraal/mismatch en het Motivatieprofiel.

2. `5_Construct Validity Interesses 2023.docx`
   - Onderbouwt het construct achter persoonlijke interesses.
   - Verbindt het model met eerder onderzoek, waaronder Spranger, Allport,
     Holland en Schein.
   - Positioneert interesses als verwant aan behoeften en waarden, maar als
     eigenstandig construct.

3. `Q4 Certificatie Interesses handboek_NL - Hst2 Maak de zinnen compleet.pdf`
   - Bevestigt de ingevulde concepten I-IV uit het trainingsmateriaal.
   - Maakt de interpretatiewoorden expliciet: energie, intensiteit,
     situationeel, vaardigheden, mensen/dingen en praktisch/abstract.

## Kernverbanden

### 1. Herkennen -> verklaren -> onderbouwen

De presentatie start praktisch: interesses herken je aan waar iemand tijd,
energie, middelen of geld aan besteedt. Het handboek vult dit in met de taal van
positieve en negatieve energie. Het construct-validity document onderbouwt
waarom deze observaties meer zijn dan losse voorkeuren: ze passen in een breder
onderzoeksveld rond beroepskeuze, loopbaanankers en psychografische motivatie.

Adviesbot-regel:
Gebruik vrije tekst over energie, klik, plezier, weerstand of verveling als
signaal voor de interesseslaag, maar geef pas een definitieve duiding wanneer
het Interessesprofiel beschikbaar is.

### 2. Interesses naast DISC en Waarden

De presentatie benoemt het Motivatieprofiel als combinatie van DISC, Waarden en
Interesses. De construct-validity bron scherpt dit aan: interesses zijn wel
verwant aan behoeften en waarden, maar niet hetzelfde. Het handboek bevestigt
dat interesses beschrijven wat motiveert of demotiveert, niet wat iemand kan.

Adviesbot-regel:
- DISC = HOE iemand werkt.
- Waarden = WAAROM iets belangrijk of juist onacceptabel voelt.
- Interesses = WAT iemand aantrekt, energie geeft of juist weerstand oproept.
- Vaardigheid = apart toetsen; niet afleiden uit interesse alleen.

### 3. Hoog, neutraal en laag

De presentatie geeft de kleurinterpretatie: groen voor hoogste interesses, geel
voor situationele interesses, rood voor laagste interesses of desinteresses. Het
handboek geeft hier de conceptuele woorden bij: hoogste/sterkste, neutrale zone
en laagste/minste. Samen leveren ze een bruikbare schaal op.

Adviesbot-regel:
- Hoog: natuurlijke energie en voldoening.
- Neutraal: situationeel, verdraagbaar, niet vanzelf motiverend.
- Laag: desinteresse, weerstand of energieverlies.

### 4. Werk-prive als stabiliteitsindicator

De presentatie introduceert match, neutraal en mismatch tussen werk en prive. Het
handboek vult aan dat vergelijkbare werk- en prive-interesses vaak wijzen op
dezelfde motieven en meer tevredenheid. Verschillen kunnen betekenen dat iemand
in verschillende contexten door andere motieven wordt gestuurd.

Adviesbot-regel:
Gebruik werk-prive match niet als oordeel, maar als hypothese over stabiliteit:
bij match is de energielaag waarschijnlijk consistenter; bij mismatch moet de
bot vragen welke context het probleem vooral veroorzaakt.

### 5. De 12 gebieden als inhoudelijke kaart

De presentatie levert de 12 gebieden en hun beschrijvingen. Het handboek
bevestigt dat het model bestaat uit 12 persoonlijke interesses: 6 gericht op
mensen en 6 op dingen; daarnaast 4 praktisch, 4 abstract en 4 gemengd. De
construct-validity bron plaatst dit als verbreding van oudere werk-only modellen.

Adviesbot-regel:
Gebruik de 12 gebieden als detecteerbare thema's in tekst, maar koppel ze altijd
aan de assen:
- Mensen versus Dingen.
- Praktisch versus Abstract.

### 6. Talent is niet hetzelfde als motivatie

De presentatie en het handboek herhalen dat interesses niet per definitie
vaardigheden zijn. Het handboek maakt dit concreet: twee mensen kunnen even
getalenteerd zijn voor een functie, maar sterk verschillen in motivatie, passie
en lange-termijn continuiteit.

Adviesbot-regel:
Bij plek-, rol- of loopbaanvragen moet de bot onderscheid maken tussen:
- kan iemand het werk?
- wil iemand dit soort werk?
- houdt iemand dit vol?

## Relatiematrix

| Thema | Presentatie | Construct Validity | Handboek | App-vertaling |
| --- | --- | --- | --- | --- |
| Herkennen van interesses | Tijd, energie, middelen, geld | Past in motivatieonderzoek | Positieve en negatieve energie | Detectie op energie/klik/weerstand |
| 12 gebieden | Volledige typologie | Verbreding van oudere modellen | Concept IV bevestigd | `interestAreas` in `app.js` |
| Assen | Mensen/dingen, praktisch/abstract | Ordeningsparadigma | Concept II en IV bevestigd | Axis per interessegebied |
| Hoog/neutraal/laag | Groen/geel/rood | Intensiteit als matchprincipe | Hoogste, situationeel, laagste | Interpretatieregels in dossier |
| Werk-prive | Match, neutraal, mismatch | Werk- en niet-werkinteresses | Stabiliteit en tevredenheid | Doorvraag bij contextverschil |
| DISC/Waarden/Interesses | Motivatieprofiel | Eigenstandig construct naast behoeften/waarden | Motivatie versus vaardigheden | HOE/WAAROM/WAT-regel |

## Implementatiebesluit

De exportmap bewaart de bronbestanden en dit verbandenbestand. De app gebruikt
deze relaties voorlopig als statische kennis in `app.js`. In een volgende fase
kan dit worden verplaatst naar een aparte regelcatalogus, zodat de AI-classifier
alleen signalen herkent en de regelengine de interpretatie kiest.
