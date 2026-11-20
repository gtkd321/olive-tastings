# Olive Tasting

A phone-friendly web app for running blind olive oil tastings. It is the web companion to the Olive Oil Tastings Obsidian vault.

Live: https://gtkd321.github.io/olive-tastings/

- **Guest cards:** simple buttons for liking, aroma, green or ripe, bitterness, pepper and "would you buy it". An optional "Go deeper" section adds body, finish, flavors, defects and pairings.
- **Expert panel sheet:** follows the IOC sensory method (COI/T.20/Doc. No 15). Defects, fruity, bitter and pungent are scored 0 to 10, and the app gives a provisional category: extra virgin, virgin, ordinary or lampante.
- **Results:** crowd ranking, panel medians, a flavor map and a comments wall. A "Reveal oil names" switch shows the bottle names.
- **Invite phones:** guests scan a QR code, score on their own phone, then send their card back by QR code or link.
- **Exports:** a CSV spreadsheet, Obsidian guest notes (.zip) for the vault, plus backup and import.

It comes loaded with the November 2026 lineup of seven Greek oils, in glass order from mild to bold. Change the names, blind codes and details under Oils.

## Google Sheet (optional)

`sheet-script.gs` is a small Google Apps Script that stores each finished card in your own Google Sheet. The app's Oils tab has a step-by-step guide:

1. Make a sheet, open Extensions › Apps Script, paste the script and save.
2. Deploy it as a web app (Execute as: Me, Who has access: Anyone).
3. Paste the /exec URL into the app and press Test.

Invites made after that carry the URL, so guests' phones send their cards to the sheet automatically. The sheet gets three tabs: Cards (one row per guest per glass), Oils (your bottle list) and Raw (used to pull cards back into Results).

Without a sheet, all data stays in the browser's local storage on each device.
