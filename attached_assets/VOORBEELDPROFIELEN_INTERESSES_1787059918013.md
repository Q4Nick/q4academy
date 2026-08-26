# Voorbeeldprofielen Interesses

## Doel

Deze zes PDF's zijn opgenomen als voorbeeldcases voor de interessesdatabank. Elk
profiel heeft een andere primaire uitkomst en laat zien hoe dezelfde 12
interessegebieden anders kunnen worden gerangschikt in:

- hoogste werkinteresses;
- situationele werkinteresses;
- werkdesinteresses.

De machineleesbare versie staat in `VOORBEELDPROFIELEN_INTERESSES.json`.

## Profielen

| ID | Bestand | Uitkomst | Hoogste werkinteresses | Situationeel | Desinteresses |
| --- | --- | --- | --- | --- | --- |
| AR | `Interesses AR.pdf` | Autoriteit/Relationeel | Autoriteit, Relationeel, Helpend, Humanitair | Fysiek, Technisch, Intellectueel, Economisch | Routinematig, Artistiek, Status, Ondernemerschap |
| FT | `Interesses FT.pdf` | Fysiek/Technisch | Fysiek, Technisch, Intellectueel, Economisch | Routinematig, Artistiek, Status, Ondernemerschap | Autoriteit, Relationeel, Helpend, Humanitair |
| HH | `Interesses HH.pdf` | Helpend/Humanitair | Helpend, Humanitair, Fysiek, Technisch | Intellectueel, Economisch, Routinematig, Artistiek | Status, Ondernemerschap, Autoriteit, Relationeel |
| IE | `Interesses IE.pdf` | Intellectueel/Economisch | Intellectueel, Economisch, Routinematig, Artistiek | Status, Ondernemerschap, Autoriteit, Relationeel | Helpend, Humanitair, Fysiek, Technisch |
| RA | `Interesses RA.pdf` | Routinematig/Artistiek | Routinematig, Artistiek, Status, Ondernemerschap | Autoriteit, Relationeel, Helpend, Humanitair | Fysiek, Technisch, Intellectueel, Economisch |
| SO | `Interesses SO.pdf` | Status/Ondernemerschap | Status, Ondernemerschap, Autoriteit, Relationeel | Helpend, Humanitair, Fysiek, Technisch | Intellectueel, Economisch, Routinematig, Artistiek |

## Databankgebruik

Gebruik deze profielen als testcases voor de Interesses-laag:

- Profieluitkomst: rang 1 en 2 vormen de zichtbare combinatie.
- Positieve match: taak, rol of samenwerking raakt vooral rang 1-4.
- Situationele match: taak raakt rang 5-8; dit kan, maar vraagt context,
  variatie of tijdelijke inzet.
- Mismatch: taak raakt rang 9-12; verwacht weerstand, energieverlies of
  lagere duurzame motivatie.

## Adviesbot-regels

1. Bij een interessevraagstuk mag de bot de hoogste vier gebruiken als
   energiebron, maar rang 1 en 2 wegen het zwaarst.
2. Bij rol- of functiefit moet de bot apart vragen naar vaardigheid; interesse is
   geen bewijs dat iemand het werk goed kan.
3. Bij samenwerking of klik vergelijkt de bot gedeelde hoogste interesses,
   tegengestelde desinteresses en overlap in de situationele zone.
4. Bij lage motivatie in een rol controleert de bot of kerntaken vooral in rang
   9-12 vallen.
5. Bij tijdelijke opdrachten kan rang 5-8 acceptabel zijn, maar niet als
   langdurige energiebron worden behandeld.

## Relatie met bestaande bronnen

Deze voorbeeldprofielen operationaliseren de eerdere bronnen:

- De presentatie levert de 12 gebieden en groen/geel/rood interpretatie.
- Het handboek bevestigt dat geel situationeel en verdraagbaar is.
- Het construct-validity document onderbouwt waarom interesseprofielen relevant
  zijn voor loopbaan, functievoorkeur en motivatie.
