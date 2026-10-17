# Photography portfolio

## Overview

Static photography portfolio with category galleries, image comparison sliders and enquiry forms. Shoot enquiries are handed to WhatsApp from the browser.

## System architecture and modules

- `portfolio.html` and category pages such as `portraits.html`, `product-photography.html` and `architecture.html`: image collections.
- `retouch-work.html`: retouching presentation.
- `app.js`: lightbox navigation and zoom, before/after sliders, carousel, category filters and lead forms.
- `PAUL_CONFIG` in `app.js`: contact configuration.

## Tech stack

HTML5, CSS3 and JavaScript. The application is static; there is no server API, database or dependency-install step.

## Local setup

Requires Python 3 for the local static server and a modern browser. No Node.js build step is required.

```sh
git clone https://github.com/shreyasingh3005/huesbyparul.git
cd huesbyparul
python3 -m http.server 8000 --bind 127.0.0.1
```

Open <http://127.0.0.1:8000/>. External fonts, icons, embeds and remote images still need Internet access where referenced by the HTML.

## Implementation notes

There is no booking database, server-side form processor or payment integration. `SOCIAL_PROOF_EVENTS` is a scripted notification list, not a live customer activity feed. Check image usage rights, contact details and displayed claims before reuse.

## Manual checks

Check desktop and mobile navigation, page links, image loading and browser console errors. Use synthetic form values. Inspect the intended request or message before submitting; do not send test enquiries to the configured business contacts.
