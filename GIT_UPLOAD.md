# 🚀 Film Quiz auf GitHub hochladen

## Schritt 1: GitHub Repository erstellen

1. Gehe zu [github.com](https://github.com) und melde dich an
2. Klicke auf das "+" Symbol oben rechts → "New repository"
3. Gib dem Repository einen Namen: `filmquiz-app` (oder deinen Wunschnamen)
4. Wähle "Public" oder "Private"
5. **WICHTIG:** Lasse "Initialize this repository with a README" **UNANGECHECKT**
6. Klicke auf "Create repository"

## Schritt 2: Repository verbinden & pushen

GitHub zeigt dir dann Befehle an. Führe diese im Terminal aus:

```bash
cd /root/Walter_Projekte/filmquiz-app

# Branch zu main umbenennen (optional aber empfohlen)
git branch -M main

# Remote Repository hinzufügen (ersetze USERNAME mit deinem GitHub-Namen)
git remote add origin https://github.com/USERNAME/filmquiz-app.git

# Code pushen
git push -u origin main
```

## Schritt 3: GitHub Pages aktivieren (Optional - für Live-Demo)

Wenn du die App als Website hosten möchtest:

1. Gehe zu deinem Repository auf GitHub
2. Klicke auf "Settings" → "Pages" (im linken Menü)
3. Unter "Build and deployment":
   - Source: "Deploy from a branch"
   - Branch: "main" → "/ (root)"
4. Klicke auf "Save"

Nach wenigen Minuten ist die App unter `https://USERNAME.github.io/filmquiz-app` erreichbar.

**Hinweis:** Für das Backend (Node.js) brauchst du einen Server. GitHub Pages hostet nur das Frontend (statische Dateien).

## Alternative: Vercel/Netlify für Full-Stack Deployment

Für das komplette Projekt mit Backend:

### Vercel
1. Gehe zu [vercel.com](https://vercel.com)
2. Importiere dein GitHub Repository
3. Konfiguriere:
   - Framework Preset: "Other"
   - Build Command: `cd backend && npm install`
   - Output Directory: `frontend`
   - Install Command: `cd backend && npm install`
4. Environment Variables: `NODE_ENV=production`

### Render.com (empfohlen für Backend)
1. Gehe zu [render.com](https://render.com)
2. "New Web Service"
3. Verbinde mit GitHub Repository
4. Konfiguriere:
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
   - Plan: Free

## Repository-Struktur nach Upload

```
filmquiz-app/
├── .dockerignore
├── .gitignore
├── GIT_UPLOAD.md
├── README.md
├── backend/
│   ├── package.json
│   └── src/
│       ├── database/
│       │   ├── db.js
│       │   └── init.js
│       ├── routes/
│       │   ├── quiz.js
│       │   └── scores.js
│       └── server.js
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
└── frontend/
    ├── icons/
    ├── index.html
    ├── manifest.json
    ├── src/
    │   ├── css/
    │   │   └── style.css
    │   └── js/
    │       ├── api.js
    │       ├── app.js
    │       ├── game.js
    │       └── ui.js
    └── sw.js
```

## Schnell-Check nach Upload

```bash
# Überprüfe ob Remote korrekt gesetzt ist
git remote -v

# Sollte anzeigen:
# origin  https://github.com/USERNAME/filmquiz-app.git (fetch)
# origin  https://github.com/USERNAME/filmquiz-app.git (push)

# Letzte Commits anzeigen
git log --oneline
```

## Nächste Schritte

1. ✅ Repository auf GitHub erstellen
2. ✅ Code pushen
3. ✅ README anpassen (Repository-URL einfügen)
4. ✅ Optional: Live-Demo einrichten
5. Optional: Weitere Features entwickeln und pushen:
   ```bash
   git add .
   git commit -m "Neue Feature beschreibung"
   git push
   ```

---

**Repository ist bereit zum Upload!** 🎉
