# A Birthday Scrapbook ♡

A little birthday website made for **Pratyusha Ghosh**.

This project started with a simple idea: turn a few photographs, memories and personal words into something that feels like opening a handmade scrapbook.

It has an envelope-style opening, scrapbook pages, Polaroid photographs, a film strip and a birthday letter. The content is kept separate from the design, so personal details can be changed without digging through the main React components.

---

## Preview

The experience is built around:

- An envelope-inspired opening screen
- A scrapbook-style birthday book
- Personal introduction and birthday message
- Polaroid-style memory photographs
- A five-frame film strip gallery
- A final birthday letter and closing section

## Tech Stack

- **React** — UI components
- **JavaScript** — application logic
- **CSS** — layout, styling and animations
- **Vite** — development server and build tool

## Project Structure

```text
BirthdayRaw-main/
│
├── public/
│   └── assets/
│       ├── decorations/
│       ├── icons/
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
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
└── README.md
```

## Getting Started

Follow these steps to run the project on your computer.

### 1. Install Node.js

Download and install the LTS version of Node.js:

https://nodejs.org/

Node.js comes with npm, which is used to install the project's dependencies.

After installation, open a terminal and check:

```bash
node -v
npm -v
```

If both commands display version numbers, you're ready.

### 2. Download the Project

Download or clone this repository.

To clone it using Git:

```bash
git clone YOUR_REPOSITORY_URL
```

Alternatively, download the ZIP from GitHub and extract it.

### 3. Open the Correct Folder

Open the extracted project in VS Code.

Make sure you open the folder containing these files:

```text
package.json
package-lock.json
index.html
src/
public/
```

**Important:** Do not run npm commands from the parent folder. Open the actual `BirthdayRaw-main` project folder.

### 4. Open the VS Code Terminal

In VS Code:

1. Open the project folder.
2. Select **Terminal** from the top menu.
3. Click **New Terminal**.
4. Check that the terminal is inside the folder containing `package.json`.

You can check your current location with:

```powershell
pwd
```

You can check the files in that folder with:

```powershell
dir
```

### 5. Install Dependencies

Run:

```bash
npm install
```

This reads `package.json` and installs the required packages into `node_modules`.

Wait until the installation finishes.

### 6. Start the Development Server

Run:

```bash
npm run dev
```

Vite will start the local development server.

Open the URL shown in your terminal. It is usually:

```text
http://localhost:5173/
```

Keep the terminal running while you work on the website.

To stop the server, press:

```text
Ctrl + C
```

---

## Customizing the Website

You do not need to edit the main React components to change the birthday content.

Most of the personal information is stored in:

```text
src/data/birthdayContent.js
```

Open that file in VS Code.

### 1. Change the Text

The content file contains these fields:

| Field | What it changes |
|---|---|
| `recipient` | Recipient's name |
| `birthdayNumber` | Birthday heading |
| `coverNote` | Text on the opening screen |
| `openingPrompt` | Envelope button text |
| `openingPhoto` | Main opening photograph |
| `openingCaption` | Caption below that photograph |
| `introduction` | Introductory paragraph |
| `memories` | Three memory sections |
| `filmPhotos` | Five film strip photographs |
| `letter` | Main birthday letter |
| `signOff` | Letter sign-off |
| `signature` | Sender's name |

Write your own messages inside the quotation marks.

### 2. Add Your Photographs

Put your photographs inside:

```text
public/assets/photos/
```

For example:

```text
public/assets/photos/
├── cover.jpg
├── memory-01.jpg
├── memory-02.jpg
├── memory-03.jpg
├── film-01.jpg
├── film-02.jpg
├── film-03.jpg
├── film-04.jpg
└── film-05.jpg
```

You can use JPG, PNG or WebP images.

### 3. Connect the Photographs

Open:

```text
src/data/birthdayContent.js
```

Add the image filenames to the relevant fields.

For example:

```js
openingPhoto: "cover.jpg",

memories: [
  {
    image: "memory-01.jpg",
    label: "01 · A day to keep",
    caption: "Your caption",
    note: "Your memory"
  },
  {
    image: "memory-02.jpg",
    label: "02 · Little moments",
    caption: "Your caption",
    note: "Your memory"
  },
  {
    image: "memory-03.jpg",
    label: "03 · Just us",
    caption: "Your caption",
    note: "Your memory"
  },
],

filmPhotos: [
  "film-01.jpg",
  "film-02.jpg",
  "film-03.jpg",
  "film-04.jpg",
  "film-05.jpg"
],
```

The project automatically looks for these filenames inside `public/assets/photos/`.

**A small detail:** If you leave an image field empty, the website displays its handmade photo placeholder instead.

### 4. Change the Design

The main stylesheet is:

```text
src/styles.css
```

This is where you can adjust colours, typography, spacing, layout and visual effects.

The main React components are inside:

```text
src/main.jsx
```

Edit this file only when you want to change how the website behaves or how its sections are structured.

---

## Building the Website

When everything is ready, run:

```bash
npm run build
```

Vite creates an optimized production version inside:

```text
dist/
```

To preview the production build locally:

```bash
npm run preview
```

---

## Deploying with Vercel

You can host the website for free using Vercel.

1. Push your latest project files to GitHub.
2. Visit https://vercel.com/
3. Sign in using your GitHub account.
4. Click **Add New → Project**.
5. Import your birthday website repository.
6. Keep the framework preset as **Vite**.
7. Set the build command to:

```bash
npm run build
```

8. Set the output directory to:

```text
dist
```

9. Click **Deploy**.

After deployment, Vercel will provide a public website link that you can share.

Whenever you push new changes to the connected GitHub repository, Vercel can automatically deploy the updated version.

---

## Before You Deploy

- [ ] Replace all placeholder text.
- [ ] Add your photographs.
- [ ] Check every image path.
- [ ] Run `npm install`.
- [ ] Test using `npm run dev`.
- [ ] Check the website on mobile and desktop.
- [ ] Run `npm run build`.
- [ ] Push the final version to GitHub.
- [ ] Deploy through Vercel.

---

A small collection of photographs, words and memories, made into a little corner of the internet.

**Made with care. ♡**