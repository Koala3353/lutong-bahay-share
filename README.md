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

There is no server. Phones in the same room code connect to each other with WebRTC (via [Trystero](https://github.com/dmotz/trystero)), and tabs on one device use BroadcastChannel. Every vote, bag and grab is an event, and each device derives the same screen from the same events. If a phone cannot reach the others, the app keeps working on that device alone.

Notes for the presentation:

- Test the QR flow on the venue's Wi-Fi first. Some school networks block peer-to-peer traffic.
- The food waste figure uses a placeholder of 0.4 kg per meal (`KG_PER_MEAL` in `src/store.jsx`). Replace it with a sourced number.
- Shops and prices in `src/seed.js` are made up.

## Deploy

Pushing to `main` builds and publishes the site to GitHub Pages through `.github/workflows/deploy.yml`.
