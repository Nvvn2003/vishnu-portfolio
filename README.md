# vishnunakkella.me

The code for Vishnu Nakkella's portfolio website. Everything in this folder is
part of the live site. When changes are pushed to GitHub, the site updates
automatically within a minute or two.

## What's in this folder

```
index.html            the homepage
css/
  styles.css          how the whole site looks (colours, fonts, layout)
  about-spread.css    the About section with the overhead desk photo
js/
  main.js             menu, scrolling, animations, page transitions
  works-wall.js       the "Selected Work" wall and its full-size previews
  fun.js              hidden easter eggs
assets/
  about/              the About photo (a large and a small version)
  gallery/            the original, full-quality files of the work
  wall/               what the work wall shows: tile/ small tiles,
                      full/ the sharp versions, plus the cut-out of you
  quintet/            QUINTET images (shown in the wall) and the brand
                      film, which is kept here as a master copy
vercel.json           security settings for the live site
.vercelignore         keeps non-website files off the live site
.gitignore            keeps computer-generated clutter out of this folder
CNAME, .nojekyll      GitHub Pages settings
```

## Common changes

**Add a piece to the work wall**
1. Put the original in `assets/gallery/`. Use a simple name with no spaces, like `new-brand.png`.
2. Make two web versions of it: a small one 440 pixels tall in `assets/wall/tile/`, and a
   sharp one no bigger than 2000 pixels in `assets/wall/full/` — both keeping the original
   shape, and both named after the piece, like `new-brand.jpg`.
3. In `js/works-wall.js`, copy one line inside `WORKS` (the numbers are the pixel size of
   the sharp version), then add its name to a strip in `SHEET` so it appears in the collage.
   Tiles are sized from those numbers, so a piece is never cropped.

**Change the contact email**
The email appears in `index.html` (search for `@gmail.com`). The contact form sends
messages through FormSubmit to the address in the form's `action`. If you change it:
- the first message to the new address sends an "Activate Form" email that must be clicked
- also change `formsubmit.co` in `vercel.json` if you switch to a different form service,
  or browsers will block the form

**Replace the About photo**
The text in the About section is positioned to sit in the empty floor of the current
photo. A different photo needs those positions redone, or text will land on top of it.
