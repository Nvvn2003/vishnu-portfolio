# vishnunakkella.me

The code for Vishnu Nakkella's portfolio website. Everything in this folder is
part of the live site. When changes are pushed to GitHub, the site updates
automatically within a minute or two.

## What's in this folder

```
index.html            the homepage
case/
  quintet.html        the QUINTET case study page
css/
  styles.css          how the whole site looks (colours, fonts, layout)
  about-spread.css    the About section with the overhead desk photo
js/
  main.js             menu, scrolling, animations, page transitions
  gallery.js          the scrolling "Selected Work" gallery
  loops.js            the silent looping videos
  fun.js              hidden easter eggs
assets/
  about/              the About photo (a large and a small version)
  gallery/            the images shown in the work gallery
  quintet/            QUINTET images and film
vercel.json           security settings for the live site
.vercelignore         keeps non-website files off the live site
.gitignore            keeps computer-generated clutter out of this folder
CNAME, .nojekyll      GitHub Pages settings
```

## Common changes

**Add a piece to the work gallery**
1. Put the image in `assets/gallery/`. Use a simple name with no spaces, like `new-brand.png`.
2. In `js/gallery.js`, copy one line inside `ITEMS` and change the file name, title and category.

**Change the contact email**
The email appears in `index.html` (search for `@gmail.com`). The contact form sends
messages through FormSubmit to the address in the form's `action`. If you change it:
- the first message to the new address sends an "Activate Form" email that must be clicked
- also change `formsubmit.co` in `vercel.json` if you switch to a different form service,
  or browsers will block the form

**Replace the About photo**
The text in the About section is positioned to sit in the empty floor of the current
photo. A different photo needs those positions redone, or text will land on top of it.
