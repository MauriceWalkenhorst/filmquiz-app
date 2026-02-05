# 🚂 Railway.app Deployment - Fehlerbehebung & Anleitung

> Railway ist etwas komplexer als Render, aber schneller! Hier sind die häufigsten Probleme und Lösungen.

---

## ❌ Häufige Railway-Probleme & Lösungen

### Problem 1: "No start command could be found"

**Ursache:** Railway erkennt nicht automatisch, wie die App gestartet werden soll.

**Lösung:**
1. Railway Dashboard → Dein Service
2. Klicke auf **"Settings"**
3. Scrolle zu **"Deploy"**
4. Bei **"Start Command"** eintragen:
   ```
   cd backend && npm start
   ```
5. **"Deploy"** klicken

---

### Problem 2: "Cannot find module 'express'" oder ähnlich

**Ursache:** Dependencies werden nicht im richtigen Ordner installiert.

**Lösung:**
1. Railway Dashboard → Service → **"Settings"**
2. Scrolle zu **"Build"**
3. Bei **"Build Command"** eintragen:
   ```
   cd backend && npm install
   ```
4. Redeploy

---

### Problem 3: "Error: Cannot find module '../database/filmquiz.db'"

**Ursache:** SQLite Datenbank-Pfad ist falsch oder nicht beschreibbar.

**Lösung:**
1. Railway nutzt ein temporäres Dateisystem
2. Die Datenbank muss im `/tmp` Ordner liegen

**Fix:** Bearbeite `backend/src/database/db.js`:

```javascript
// Alt:
const DB_PATH = path.join(__dirname, 'filmquiz.db');

// Neu (für Railway):
const DB_PATH = process.env.RAILWAY_ENVIRONMENT 
  ? '/tmp/filmquiz.db'  // Railway temporärer Speicher
  : path.join(__dirname, 'filmquiz.db');
```

Oder als Umgebungsvariable in Railway setzen:
- Dashboard → Variables
- `DB_PATH` = `/tmp/filmquiz.db`

---

### Problem 4: App stürzt nach wenigen Minuten ab

**Ursache:** Railway Healthcheck schlägt fehl oder RAM-Limit erreicht.

**Lösung:**
1. **Healthcheck deaktivieren** (vorerst):
   - Settings → Healthcheck
   - Pfad: `/api/health`
   - Timeout: `300`
   
2. **Oder** railway.toml erstellen (habe ich erstellt):
   ```toml
   [deploy]
   healthcheckPath = "/api/health"
   healthcheckTimeout = 300
   ```

---

### Problem 5: "Module not found: 'sqlite3'"

**Ursache:** Native Module (sqlite3) müssen kompiliert werden.

**Lösung:**
1. Stelle sicher, dass `package.json` sqlite3 enthält:
   ```json
   "dependencies": {
     "sqlite3": "^5.1.6"
   }
   ```

2. Füge zu `package.json` hinzu:
   ```json
   "engines": {
     "node": ">=18.0.0"
   }
   ```

3. Erstelle `.nvmrc` Datei:
   ```
   20
   ```

---

### Problem 6: Frontend wird nicht angezeigt (404 Fehler)

**Ursache:** Railway findet die statischen Dateien nicht.

**Lösung:**
1. Prüfe `backend/src/server.js`:
   - Der Pfad zu den Frontend-Dateien muss stimmen
   
2. In Railway das Root Directory setzen:
   - Settings → Build
   - **"Root Directory"**: (leer lassen)
   - **"Build Command"**: `cd backend && npm install`

---

## ✅ Schritt-für-Schritt: Railway richtig deployen

### Methode 1: Mit railway.toml (Empfohlen)

1. Repository pushen (habe ich aktualisiert mit `railway.toml`)

2. Railway Dashboard:
   - [railway.app](https://railway.app)
   - Login mit GitHub

3. "New Project" → "Deploy from GitHub repo"
   - Wähle `filmquiz-app`

4. Railway sollte `railway.toml` automatisch erkennen

5. **Wichtig:** Umgebungsvariablen setzen:
   - Dashboard → Dein Service → **"Variables"**
   - Füge hinzu:
     - `NODE_ENV` = `production`
     - `PORT` = `3000` (oder lasse leer für auto)

6. Deploy starten

---

### Methode 2: Manuelle Konfiguration

Falls `railway.toml` nicht funktioniert:

#### Step 1: Service erstellen
1. [railway.app/dashboard](https://railway.app/dashboard)
2. "New" → "GitHub Repo"
3. Wähle `MauriceWalkenhorst/filmquiz-app`

#### Step 2: Build Command setzen
- Service → Settings → Build
- **Build Command:**
  ```
  cd backend && npm install
  ```

#### Step 3: Start Command setzen
- Settings → Deploy
- **Start Command:**
  ```
  cd backend && npm run init-db && npm start
  ```

#### Step 4: Healthcheck (optional)
- Settings → Deploy
- **Healthcheck Path:** `/api/health`
- **Timeout:** `300`

#### Step 5: Variables
- Tab "Variables"
- `NODE_ENV` = `production`

#### Step 6: Deploy
- Oben rechts auf "Deploy" klicken

---

## 🔧 Railway-Spezifische Fixes

### Fix 1: Datenbank-Pfad

Erstelle `backend/src/database/railway-db.js`:

```javascript
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Railway nutzt /tmp für schreibbare Dateien
const DB_PATH = process.env.RAILWAY_ENVIRONMENT 
  ? '/tmp/filmquiz.db'
  : path.join(__dirname, 'filmquiz.db');

console.log('📁 Database path:', DB_PATH);

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ Database error:', err.message);
  } else {
    console.log('✅ Connected to SQLite');
  }
});

// ... rest of db.js code
```

### Fix 2: Package.json anpassen

```json
{
  "name": "filmquiz-backend",
  "version": "1.0.0",
  "engines": {
    "node": ">=18.0.0"
  },
  "scripts": {
    "start": "node src/server.js",
    "init-db": "node src/database/init.js"
  }
}
```

### Fix 3: Procfile (falls alles andere fehlschlägt)

Erstelle `Procfile` (ohne Endung) im Root:

```
web: cd backend && npm install && npm run init-db && npm start
```

---

## 🆘 Debugging auf Railway

### Logs ansehen
1. Railway Dashboard → Dein Service
2. Tab **"Deploys"**
3. Klicke auf den letzten Deploy
4. Du siehst Build-Logs (roter Fehlertext = Problem)

### Redeploy mit frischem Cache
1. Settings → Deploy
2. "Latest" auswählen
3. **"Clear Build Cache"** → "Redeploy"

### SSH/Console Zugriff
1. Service → Tab **"Console"**
2. Du kannst direkt Befehle ausführen:
   ```bash
   cd backend
   ls -la
   node src/server.js
   ```

---

## 🎯 Railway vs Render - Was ist besser?

| Feature | Railway | Render |
|---------|---------|--------|
| **Einfachheit** | ⭐⭐⭐ Komplexer | ⭐⭐⭐⭐⭐ Einfacher |
| **Speed** | ⭐⭐⭐⭐⭐ Schneller | ⭐⭐⭐⭐ Gut |
| **Free Tier** | $5/Monat Credit | Kostenlos |
| **Sleep Mode** | Nein (immer an) | Ja (15min) |
| **Datenbank** | Reset bei Deploy | Reset bei Deploy |
| **Logs** | Gut | Sehr gut |

**Empfehlung:**
- **Anfänger:** Render.com verwenden!
- **Speed wichtig:** Railway (aber $5/Monat)
- **Produktion:** Railway Starter Plan ($5/Monat)

---

## ✅ Railway Checkliste

- [ ] `railway.toml` im Repository
- [ ] `package.json` mit Node 18+ engines
- [ ] Build Command: `cd backend && npm install`
- [ ] Start Command: `cd backend && npm start`
- [ ] Umgebungsvariable `NODE_ENV=production` gesetzt
- [ ] Healthcheck auf `/api/health`
- [ ] Deploy geklickt
- [ ] Logs auf Fehler geprüft
- [ ] URL getestet

---

## 🆘 Schnellhilfe

**Schicke mir den Fehler-Text aus den Railway Logs**, dann kann ich dir sagen, was genau das Problem ist!

Oder wechsle zu **Render.com** - das ist viel einfacher! 🎬
