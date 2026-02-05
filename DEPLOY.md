# 🚀 Deployment Guide - Film Quiz Live stellen

Diese Anleitung zeigt dir, wie du die Film Quiz App kostenlos online hosten kannst.

## Option 1: Render.com (Empfohlen - Kostenlos)

### Schritt 1: Auf Render.com registrieren
1. Gehe zu [render.com](https://render.com)
2. Klicke "Get Started for Free"
3. Melde dich mit GitHub an (verbinde mit MauriceWalkenhorst)

### Schritt 2: Web Service erstellen
1. Dashboard → "New +" → "Web Service"
2. Wähle das Repository: `filmquiz-app`
3. Konfiguration:
   - **Name:** `filmquiz-app`
   - **Environment:** `Node`
   - **Region:** `Frankfurt (EU Central)`
   - **Branch:** `main`
   - **Build Command:** 
     ```
     cd backend && npm install && npm run init-db
     ```
   - **Start Command:**
     ```
     cd backend && npm start
     ```
   - **Plan:** `Free`

4. Klicke "Create Web Service"

### Schritt 3: Warten
- Der Build dauert ca. 2-3 Minuten
- Deine App ist dann live unter: `https://filmquiz-app.onrender.com`

---

## Option 2: Railway.app (Alternative)

### Schritt 1: Railway registrieren
1. Gehe zu [railway.app](https://railway.app)
2. Login mit GitHub

### Schritt 2: Projekt deployen
1. "New Project" → "Deploy from GitHub repo"
2. Wähle `MauriceWalkenhorst/filmquiz-app`
3. Railway erkennt automatisch die package.json

### Schritt 3: Konfigurieren
1. Klicke auf das Service → "Settings"
2. **Start Command:** `cd backend && npm start`
3. **Healthcheck Path:** `/api/health`
4. Domain: Eine Domain wird automatisch generiert

---

## Option 3: Vercel (Nur Frontend)

Falls du nur das Frontend hosten möchtest:

1. Gehe zu [vercel.com](https://vercel.com)
2. Importiere das GitHub Repository
3. **Root Directory:** `frontend`
4. Framework Preset: `Other`
5. Deploy

⚠️ **Achtung:** Das Backend (Highscores, Fragen aus Datenbank) funktioniert dann nicht!

---

## Option 4: Eigener Server/VPS

### Mit Docker:

```bash
# Auf deinem Server:
git clone https://github.com/MauriceWalkenhorst/filmquiz-app.git
cd filmquiz-app

# Mit Docker Compose starten
docker-compose -f docker/docker-compose.yml up -d

# App läuft auf Port 3000
# Richte einen Reverse Proxy (nginx/caddy) ein für HTTPS
```

### Direkt mit Node.js:

```bash
git clone https://github.com/MauriceWalkenhorst/filmquiz-app.git
cd filmquiz-app/backend
npm install
npm run init-db
npm start
```

---

## 🔗 Nach dem Deployment

### Umgebungsvariablen (Optional)

Falls du auf Render/Railway deployst, kannst du diese optional setzen:

| Variable | Wert | Beschreibung |
|----------|------|--------------|
| `NODE_ENV` | `production` | Produktionsmodus |
| `PORT` | `3000` | Port (wird automatisch gesetzt) |

### Domain einrichten (Optional)

**Render:**
1. Settings → Custom Domains
2. Füge deine Domain hinzu (z.B. `filmquiz.deine-domain.de`)
3. Füge den CNAME-Eintrag bei deinem Domain-Provider hinzu

**Railway:**
1. Settings → Domains
2. "Custom Domain" → deine Domain eingeben
3. DNS-Eintrag bei deinem Provider setzen

---

## ✅ Test nach Deployment

Überprüfe ob alles funktioniert:

```bash
# API Test
curl https://DEINE-URL.com/api/health

# Sollte zurückgeben:
# {"status":"OK","timestamp":"...","version":"1.0.0"}

# Fragen abrufen
curl https://DEINE-URL.com/api/quiz/questions?limit=1
```

---

## 🔄 Updates deployen

Nach jedem `git push` wird automatisch neu deployed:

```bash
# Lokale Änderungen
 git add .
 git commit -m "Neue Features"
 git push origin main

# Render/Railway deployen automatisch!
```

---

## 🆘 Troubleshooting

### "Build failed"
- Prüfe die Logs in Render/Railway Dashboard
- Stelle sicher, dass `npm install` im backend Ordner läuft

### "Cannot find module"
- Stelle sicher, dass `package.json` im backend Ordner liegt
- Build Command muss `cd backend && npm install` sein

### Datenbank Fehler
- SQLite ist file-basiert, sollte automatisch funktionieren
- Bei Render: Datenbank wird bei jedem Deploy zurückgesetzt (Free Tier)
  - Für persistente Daten: Upgrade auf Paid Plan oder nutze PostgreSQL

---

## 📱 Fertige URLs

Sobald deployed, füge diese hier ein:

| Umgebung | URL |
|----------|-----|
| Render | `https://filmquiz-app.onrender.com` |
| Railway | `https://filmquiz-app.up.railway.app` |
| Eigene Domain | `https://filmquiz.deine-domain.de` |

---

**🎬 Viel Erfolg mit deinem Film Quiz!**
