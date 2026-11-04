# Lutong Bahay Share

An app where restaurants, bakeries and groceries sell unsold but still good food as discounted pickup bags near closing time. Built as the STS 10 creative presentation demo.

## Screens

- **Poll**: "When did you last throw away food?" with live results.
- **Shop**: post a surplus bag with price, quantity and pickup window.
- **Buy**: grab a bag before it sells out.
- **Big screen**: QR code to join, live poll results and a counter of meals saved, pesos saved and food waste avoided.

## Run it

```bash
npm install
npm run dev
```

## How live sync works

There is no server of our own. Every device posts small messages to a few public [Nostr](https://nostr.com) relays over normal WebSockets (ephemeral events, which relays forward to live listeners and do not store) and listens for its room's messages. Tabs on one device also use BroadcastChannel. Every vote, bag and reservation is an event, and each device derives the same screen from the same events. Every ~12 seconds devices compare event ids and send each other whatever is missing, so a phone that slept or joined late catches up.

Notes for the presentation:

- Messages pass through public relays and can be read by anyone who knows the room code, so use made-up details only.
- The header shows how many devices are in the room. If a phone says "1 device", it is not reaching the relays.
- The food waste figure uses a placeholder of 0.4 kg per meal (`KG_PER_MEAL` in `src/store.jsx`). Replace it with a sourced number.
- Shops and prices in `src/seed.js` are made up.

## Deploy

Pushing to `main` builds and publishes the site to GitHub Pages through `.github/workflows/deploy.yml`.
