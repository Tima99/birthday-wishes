# 🎂 Sagar's Birthday Surprise

A funny, interactive, mobile-first birthday website built with plain HTML, CSS, and vanilla JavaScript. There is no framework, no backend, and no build step.

## Features

- **Breaking-news welcome screen** with a confetti-bursting "Open Your Birthday Surprise" button
- **Hero** with a CSS cake, animated candles, floating balloons, a letter-by-letter animated name, and an animated "Swipe up" arrow
- **Fake statistics dashboard** with progress bars that animate on scroll
- **Three-question quiz** that computes a personalised "official diagnosis"
- **Cake** with candles you can blow out (and relight) using the button alone, with smoke and confetti
- **Gift box** that opens with a video-game-style reward reveal
- **Heartfelt finale** with floating hearts, a replay button, and Web Share (clipboard fallback)
- **Optional sound**: off by default, with a mute/unmute toggle. Music and effects are generated with the Web Audio API, so there are no audio files. The site works fine without them.
- **Hindi and English:** pick the language with a query string, `index.html?lang=hi` or `?lang=en`. The default is `en`. A language button at the top-left switches between them.
- Respects `prefers-reduced-motion`, works at 320px and up, and has 48px+ tap targets

## Project structure

```
birthday-site/
├── index.html          # Markup for all sections
├── css/
│   └── style.css       # Design tokens, layout, animations
├── js/
│   ├── messages.js     # All editable text: roasts, quiz, cake message
│   └── script.js       # Confetti, sound, quiz logic, interactions
├── assets/
│   ├── favicon.svg
│   └── README.md
├── .gitignore
└── README.md
```

## Run locally

Open `index.html` directly in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# or
npx serve .
```

Then visit <http://localhost:8000>. Web Share and the Clipboard API need HTTPS or `localhost`. A fallback is used elsewhere.

## Customise

- **Text and translations:** all quiz questions, results, cake messages, UI strings, and the Hindi translation of the page text are in [js/messages.js](js/messages.js), under `en` and `hi`. The English page text is in `index.html`; each translatable element has a `data-i18n` key that maps to `hi.text`. To add a language, copy the `hi` block, translate it, and use `?lang=<code>`.
- **Quiz scoring:** Quiz options use `weights` for `food`, `sleep`, and `bluff`.
- **Name:** the name `Sagar` appears in `index.html`, `js/messages.js`, and the `<title>`. Search and replace it to reuse the site for someone else.
- **Static text** (stat cards, gift items, final message): edit `index.html`.
- **Colours:** change the CSS variables at the top of [css/style.css](css/style.css).

## Deploy

**GitHub Pages**

1. Push this folder to a GitHub repository.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, then select `main` and `/ (root)`.
4. Save. Your site will be live at `https://<username>.github.io/<repo>/`.

**Netlify, Vercel, or Cloudflare Pages:** drag and drop the folder, or connect the repo. Leave the build command empty and set the publish directory to `/`.
