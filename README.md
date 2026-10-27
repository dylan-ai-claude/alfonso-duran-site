# alfonso-duran.com: new site

A fast, static portfolio built with [Astro](https://astro.build). There's no database and no CMS. Everything you'd want to change lives in plain text files.

## Run it

You need Node 22 or newer.

```bash
npm install
npm run dev        # opens http://localhost:4321, updates as you save
npm run build      # makes the finished site in dist/
npm run preview    # serves dist/ to check the build
```

## Where things live

| To change… | Edit |
| --- | --- |
| Name, email, phone, city, bio, hero text, services list, links | `src/data/site.json` |
| A project (text, pictures, captions) | `src/content/work/<project>.md` |
| Pictures | `public/work/<project>/` (and `public/img/` for the hero) |
| Colors, fonts, sizes | the top of `src/styles/global.css` (`:root`) |
| Page layout | `src/components/*.astro` (one file per homepage section) |

### Add a project

1. Make a folder `public/work/my-new-project/` and drop the images in.
2. Copy any file in `src/content/work/`, rename it `my-new-project.md`, and edit it:

```yaml
---
title: "My New Project"
place: "Miami Beach"
disciplines: ["Identity", "Print"]
order: 7                       # position in the project list (lower = earlier)
summary: "One sentence that sells it."
cover: "/work/my-new-project/cover.jpg"   # portrait thumbnail for the list
hero: "/work/my-new-project/photo.jpg"    # big picture at the top of its page
featured: true                 # optional: put it on the big homepage stage
stage:                         # only needed when featured: true
  left: "/work/my-new-project/whole.jpg"
  right: "/work/my-new-project/detail.jpg"
  ink: "#ffffff"               # color of the giant title on the stage
images:
  - src: "/work/my-new-project/logo.jpg"
    caption: "logo"
  - src: "/work/my-new-project/menu.jpg"
---

The write-up goes here, as normal paragraphs.
```

Its page (`/work/my-new-project/`) is created automatically. Keep the homepage stage to about 4–6 featured projects.

### The "Build your kit" services list

Edit `kit.items` in `src/data/site.json`. Each item has a name, a project to show as the example (`example`, `href`) and an `image`. When a visitor taps items, the **Email Alfonso** and **Send a text** buttons fill in a message listing what they picked.

## Before it goes live: please check

- **Hi-res images.** All pictures were pulled from the old site, so they're 880px wide web exports. They look soft at full screen, especially the hero room photo (`public/img/rokbar-room.jpg`). Swap in the originals (2000px+ wide, same filenames) and everything gets sharper.
- **Draft copy.** The project write-ups, the bio, the About captions and the services descriptions in `site.json` are drafts written from what the pictures show. Rewrite them in your voice and fix anything wrong (e.g. Drunken Dragon described as a "Korean barbecue and sake bar").
- **A photo of you.** There's no portrait yet. A good one in the About section would help.
- **WhatsApp.** Put your number in `"whatsapp"` in `site.json` (digits only, e.g. `13056087269`) and a WhatsApp link appears in the contact section.
- **Instagram.** Add it to `"links"` in `site.json`.
- **Credits.** Drunken Dragon's dragon illustration is by Darren Brass (credited in the caption). Add credits for any other collaborators.

## Putting it online

The `dist/` folder after `npm run build` is the whole site. Drag it onto Netlify, or connect the repo to Vercel or Netlify (build command `npm run build`, output `dist`). Point `alfonso-duran.com` (or `alfonsoduran.com`) at it from the registrar.

### Serving from a sub-folder

To host the site under a path (e.g. `example.com/website`), build with the base set:

```bash
SITE_BASE=/website npm run build
```

Image and link paths in `site.json` and the project files stay written from the root (`/work/...`); the site adds the base for you.
