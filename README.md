# Ezequiel Alcaraz — Portfolio

My personal portfolio and a journal of what I'm learning. Hand-built HTML, no frameworks, no build step.

🌐 **Live:** [ezequielalcaraz.com](https://ezequielalcaraz.com) · [/journal](https://ezequielalcaraz.com/journal/)

## Stack

- Vanilla HTML/CSS/JS
- Archivo (variable font) + JetBrains Mono via Google Fonts
- No dependencies, no build, nothing to install

## Run locally

Open `index.html` in a browser. For the journal, serve the folder so the paths resolve:

```bash
python -m http.server 8000
```

## Structure

```
├── index.html              # the portfolio
├── resume.pdf
└── journal/
    ├── index.html          # entry list
    ├── assets/
    │   ├── reader.css      # reading layout, light + dark
    │   ├── app.js          # module routing, progress, quizzes, theme
    │   └── labs.js         # the interactive labs
    └── learn-rag/
        └── index.html      # 13 modules on retrieval augmented generation
```

The portfolio and the journal use two different designs on purpose. The portfolio is big
uppercase type on cream. The journal is a serif reading column built for long text.

## Journal

Entries are plain HTML. A short entry is one page. A long one is split into modules with a
sidebar, and `app.js` handles navigation, progress and the quizzes.

Progress and theme are stored in `localStorage` and never leave the browser.

### Learn RAG

Thirteen modules on retrieval augmented generation, with seven labs that compute real values
in the browser rather than showing screenshots:

| Lab | What it computes |
|---|---|
| Cosine similarity | TF-IDF vectors and cosine over a ten document corpus |
| Chunking | Chunk size and overlap, showing mid-sentence breaks and storage cost |
| BM25 | Full scoring with `k1` and `b`, plus a term by term breakdown |
| Rank fusion | Reciprocal rank fusion across three scenarios |
| Retrieval metrics | Recall, precision, MRR and nDCG with the arithmetic shown |
| Retrieval depth | Why sending more chunks can make answers worse |
| Cost model | Indexing and per query cost, and what prompt caching saves |

### Adding an entry

1. Copy `journal/learn-rag/index.html` as a starting point, or write a single page for a short note.
2. Link to `assets/reader.css` and `assets/app.js`.
3. Add a `<li>` to the list in `journal/index.html`.

The previous React/Vite version lives in git history and on the `wip-react-redesign` branch.

## Contact

- 📧 [ezequielleonalcaraz@gmail.com](mailto:ezequielleonalcaraz@gmail.com)
- 💼 [linkedin.com/in/ezequiel-a-2a401824a](https://www.linkedin.com/in/ezequiel-a-2a401824a/)
- 🧑‍💻 [github.com/ealeonraz](https://github.com/ealeonraz)
