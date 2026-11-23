# Birthday Scrapbook

A little birthday scrapbook made with React and Vite, put together with photos, memories, music and a few interactive details.

The idea is simple: open an envelope, turn through a collection of scrapbook-style pages, revisit some memories and find a few personal notes along the way.

The design uses a burgundy background, paper-style pages, Polaroid frames, a film strip and a handwritten-style letter. Open **✎ Customize** on the page to change the site name, recipient, occasion wording, messages, photos, captions and music path. Choose **Save changes** to keep the changes in this browser on this device. Use **Reset template** to clear the saved customization. Each browser and device has its own saved version. To change the shared starting template, edit `src/data/birthdayContent.js`.

## Getting started

You'll need [Node.js](https://nodejs.org/) installed on your computer. npm comes with it.

Clone the repository or download the project, then open a terminal inside the project folder (the one containing `package.json`).

On Windows PowerShell, install the dependencies with:

```powershell
npm.cmd install
```

Start the development server:

```powershell
npm.cmd run dev
```

Vite will print a local URL in the terminal. Open that address in your browser. By default, it's:

```text
http://localhost:5173/
```

Keep the terminal open while working on the site. To stop the development server, press `Ctrl + C`.

On macOS/Linux terminals, use `npm install` and `npm run dev` instead.

The project also loads its fonts through Google Fonts. An internet connection is needed for those fonts; otherwise, the browser will use its default serif fallbacks.

## Adding the music

The birthday song is loaded from a local MP3 file.

Place your audio file here:

```text
public/assets/music/music.mp3
```

That's all you need to do. Keep the filename the same, or update the audio path in the relevant source code if you prefer a different name.

The music doesn't start automatically when the page loads. It is triggered by clicking **Open Me**, alongside the envelope-opening animation. The app leaves playback at full volume (100%); the device volume controls how loud it sounds.

There's also a small music control in the corner of the page for pausing and resuming playback.

If the audio file is missing or the browser cannot play it, the scrapbook will still open and work normally. Only the music will be unavailable.

## Adding photographs

All photographs belong in:

```text
public/assets/photos/
```

For example, you could organise them like this:

```text
public/assets/photos/
├── cover-photo.jpg
├── memory-01.jpg
├── memory-02.jpg
├── memory-03.jpg
├── film-01.jpg
├── film-02.jpg
├── film-03.jpg
├── film-04.jpg
└── film-05.jpg
```

Once the images are in place, open:

```text
src/data/birthdayContent.js
```

This file contains the image paths used throughout the scrapbook.

Here's an example:

```js
openingPhoto: "cover-photo.jpg",

memories: [
  {
    image: "memory-01.jpg",
    label: "01 - A day to keep",
    caption: "[ADD MEMORY CAPTION]",
    note: "[ADD YOUR PARAGRAPH HERE]"
  },
  {
    image: "memory-02.jpg",
    label: "02 - Little moments",
    caption: "[ADD MEMORY CAPTION]",
    note: "[ADD YOUR PARAGRAPH HERE]"
  },
  {
    image: "memory-03.jpg",
    label: "03 - Just us",
    caption: "[ADD MEMORY CAPTION]",
    note: "[ADD YOUR PARAGRAPH HERE]"
  },
],

filmPhotos: [
  "film-01.jpg",
  "film-02.jpg",
  "film-03.jpg",
  "film-04.jpg",
  "film-05.jpg",
],
```

A filename is enough; the application looks for it inside `public/assets/photos/`.

You can leave an image field empty (`""`) if you don't want to use a photograph in that particular frame.

Images are fitted into the existing scrapbook layouts, so some cropping is expected depending on their dimensions. Keep the original photos if you want to use them elsewhere.

Loaded photographs can be clicked to view them in a larger lightbox. Press `Escape`, click outside the image or use the close button to exit.

## Changing the content

All the personal content is managed from one place:

```text
src/data/birthdayContent.js
```

You don't need to edit the main React components just to change a caption, message or photograph.

Here's what each field controls:

| Field | Used for |
| --- | --- |
| `recipient` | Recipient's name throughout the scrapbook. |
| `birthdayGreeting` | Birthday greeting shown after opening. |
| `birthdayNumber` | Large heading on the left-hand page. |
| `coverNote` | Small handwritten line on the envelope. |
| `openingPrompt` | Text displayed on the envelope button. |
| `openingPhoto` | Photograph on the opening page. |
| `openingCaption` | Caption below the opening photograph. |
| `introduction` | Introductory paragraph on the first page. |
| `memories` | Three memory entries with photos, captions and notes. |
| `filmPhotos` | Five photographs in the horizontal film strip. |
| `letter` | Main birthday letter. |
| `signOff` | Closing line of the letter. |
| `signature` | Signature below the letter. |
| `hiddenNote` | Message revealed through the little note interaction. |
| `birthdayWish` | Message revealed through the birthday wish interaction. |

The starting content is a generic template. You can customize it in the site editor or change the data file to set your own shared defaults.

For longer messages, JavaScript strings support `\n` for line breaks:

```js
letter: "First paragraph.\n\nSecond paragraph.",
```

One small thing worth remembering: don't remove the quotation marks, commas or brackets when editing the file. They're part of the JavaScript syntax.

The scrapbook provides the layout and interactions; the actual personal messages and memories need to be added manually.

## Project structure

The main files are organised as follows:

```text
Birthday/
│
├── public/
│   └── assets/
│       ├── decorations/
│       ├── icons/
│       ├── music/
│       │   └── music.mp3
│       ├── photos/
│       └── textures/
│
├── src/
│   ├── data/
│   │   └── birthdayContent.js
│   │
│   ├── main.jsx
│   └── styles.css
│
├── index.html
├── package.json
├── package-lock.json
└── README.md
```

A quick note on the folders:

- `src/main.jsx` contains the React components and interactions.
- `src/styles.css` handles the scrapbook layout, styling, animations and responsive behaviour.
- `src/data/birthdayContent.js` holds the personal content and image references.
- `public/assets/` is where the photographs, music and optional assets live.
- `index.html` contains the page metadata and font loading.

The `decorations`, `icons` and `textures` folders are available for additional assets. The current scrapbook artwork is primarily CSS-based, so those folders don't need to contain anything for the site to work.

`node_modules/` and `dist/` are generated locally. There's no need to edit them.

## Building for production

When the site is ready, create a production build:

```bash
npm.cmd run build
```

Vite will generate the production files inside:

```text
dist/
```

To run a local preview of that build:

```bash
npm.cmd run preview
```

On Windows PowerShell, use:

```powershell
npm.cmd run build
npm.cmd run preview
```

## Deployment

The project is a standard Vite application, so it can be deployed using Vercel, Netlify or another static hosting provider.

For Vercel or Netlify:

1. Push the project to a Git repository.
2. Import the repository into your hosting provider.
3. Select the Vite framework preset.
4. Set the build command to `npm run build`.
5. Set the output directory to `dist`.
6. Deploy the project.

Before sharing the link, check that the photographs and MP3 file are included in the repository and that their paths are correct.

It's also worth opening the deployed site on a phone and checking the envelope animation, page layout, music controls, photo lightbox and interactive notes.

## GitHub Pages Deployment

The project deploys to GitHub Pages through GitHub Actions whenever you push to the `main` branch.

1. Commit and push your changes from the project folder:

   ```bash
   git add .
   git commit -m "Update birthday website"
   git push origin main
   ```

2. In the GitHub repository, open **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Check the **Actions** tab in the repository to see the build and deployment status.
4. After a successful deployment, the website will be available at <https://dominator1237479.github.io/Birtday-01-host/>.
5. Future pushes to `main` automatically build and publish the latest website.

GitHub Pages on a free account requires a public repository. The published website is visible to anyone with the link.

---

Made with a little time, a lot of memories, and the intention of making someone's birthday a bit more special.

12
