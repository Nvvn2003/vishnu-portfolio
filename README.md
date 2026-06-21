# Vishnu Vardhan Naidu Nakkella — Portfolio

A bold, dark, single-page portfolio positioning you as a **Creative & Marketing Consultant**.
Plain HTML / CSS / JS — no build step. Open `index.html` in a browser and it just works.

```
vishnu-portfolio/
├── index.html      ← home page — all content/copy lives here
├── case/           ← one full case study page per project
│   ├── lumen.html
│   ├── vyse.html
│   ├── nori.html
│   └── pulse.html
├── css/styles.css  ← all styling (colors, fonts, spacing)
├── js/main.js      ← cursor, animations, smooth scroll
├── assets/         ← put your images here
└── README.md
```

---

## 1. Add your images
Drop files into `assets/` with these exact names and they appear automatically:

| File              | Where it shows        | Suggested size      |
|-------------------|-----------------------|---------------------|
| `vishnu.jpg`      | About section photo   | 900 × 1200 (3:4)    |
| `work-1.jpg`      | Project 1             | 1200 × 900 (4:3)    |
| `work-2.jpg`      | Project 2             | 1200 × 900 (4:3)    |
| `work-3.jpg`      | Project 3             | 1200 × 900 (4:3)    |
| `work-4.jpg`      | Project 4             | 1200 × 900 (4:3)    |

If an image is missing, a styled placeholder shows instead — so the site never looks broken.

> ⚠️ **Important — the project images and case-study numbers are placeholders.**
> The 4 images in `assets/` are AI-generated stand-ins, and the case studies
> (Lumen, Vyse, Nori, Pulse) with their metrics (32% lift, sold out in 11 days,
> 4.6★, etc.) are **illustrative examples showing the structure** — they are NOT
> real results. Replace them with your actual work and real numbers before you
> publish. Don't present invented client results as your own.

## 2. Edit your copy
Open `index.html` and replace:
- The 4 **project** blocks (title, tags, Challenge/Approach/Outcome, year) — these are example case studies, swap in yours.
- The **stats** numbers (`data-count="5"` etc.).
- **Email / phone** — already set from your résumé (`vishnu_vardhan_naidu.nakkella@edu.escp.eu`, `+33 758 733 976`). Swap to a personal email later if you prefer.
- **LinkedIn** — the contact link currently points to linkedin.com generically; paste your real profile URL into the `href` (search `Connect on LinkedIn`). Add Instagram/Behance rows if you want them.
- **Work Experience / Education / Toolkit** — populated from your résumé (Pococare, Poster Boy Ads, JET-ESCP + ESCP/RWTH/LPU). Edit in the `#experience` and `#about` sections.
- **Field Notes** — fill in 2–3, or delete the whole `<section class="notes">` block.

## 2b. The case study pages (`case/` folder)
Each project's **"Case study →"** button opens a full page in `case/`. Each page has:
a hero + meta strip, the Challenge / Approach / Outcome story, a 3-image gallery
(great for showing your **process** — sketches, wireframes, iterations), a results
block, and **Previous / Next** navigators that loop through all four (← / → arrow
keys work too).

To edit one, open e.g. `case/lumen.html` and change the text in place. For the gallery,
drop these images into `assets/` (missing ones fall back to labelled placeholders):

| File (per project) | Shows as |
|--------------------|----------|
| `lumen-1.jpg` `lumen-2.jpg` `lumen-3.jpg` | Lumen gallery (same pattern: `vyse-*`, `nori-*`, `pulse-*`) |

To add or remove a project: copy a `case/*.html` file, update its content, and fix the
`Previous`/`Next` links (the `href`s near the bottom) so the chain still connects.

## 3. Make the contact form actually send
The form needs a backend (it's a static site). Easiest: **[Formspree](https://formspree.io)** (free tier).
1. Sign up, create a form, copy your form ID.
2. In `index.html` replace `https://formspree.io/f/your-form-id` with your real endpoint.
That's it — submissions land in your inbox. (Until then, the `mailto:` link below the form still works.)

## 4. Tweak the look (optional)
All in `css/styles.css` at the top under `:root`:
- `--accent` — the loud electric orange (`#ff5c00`). Try `#c8ff00` (acid lime), `#ff2d6d` (hot pink), `#3dd6ff` (electric blue).
- `--bg` / `--ink` — background and text.
- `--font-display` / `--font-body` — fonts (swap the Google Fonts `<link>` in `index.html` too).

## 5. Put it online (free)
Any of these — all free:
- **Netlify**: drag the `vishnu-portfolio` folder onto [app.netlify.com/drop](https://app.netlify.com/drop). Live in seconds. (Bonus: Netlify Forms works without Formspree.)
- **Vercel**: `vercel` CLI, or import from GitHub.
- **GitHub Pages**: push to a repo → Settings → Pages → deploy from branch.

When you buy a domain later, point it at whichever host you chose.

## 6. Hidden easter eggs 🥚 (just for fun)
There are some hidden, purely-visual gags for anyone who pokes around (clients see a clean,
professional site — these only fire on deliberate actions). All live in `js/fun.js`:

| Trigger | What happens |
|---------|--------------|
| Konami code: ↑ ↑ ↓ ↓ ← → ← → **B A** | Confetti burst + screen shake + "CHAOS MODE" |
| Type **`comicsans`** anywhere | The whole site turns to Comic Sans for 4s 😱 then reverts |
| Type **`makeitpop`** anywhere | Orange confetti + the classic client quote |
| Click the **VVN logo** a few times | The dot backflips + escalating sass |
| Rage-click (9+ fast clicks) | "easy on the clicks" |
| Scroll to the very bottom | "you scrolled all the way down. legend." |
| Open the browser **console** (F12) | A styled hire-me message + the secrets above |

**To remove them all:** delete `js/fun.js` and the `<script src=".../fun.js">` line from
each HTML file. Nothing else depends on it. (They also auto-respect "reduce motion" OS settings.)

---

### Notes on choices made for you
- **No full blog** — a stale blog hurts a consultant's credibility. The optional "Field Notes" section gives you authority signals without the upkeep.
- **4 case studies, not 12** — quality over quantity reads as senior. The Challenge → Approach → Outcome framing turns "graphic design" into "consulting results."
- **Animations degrade gracefully** — if the CDN libraries fail to load, the site still works, just less flashy.
