# 🎬 Film Quiz Webanwendung

Eine moderne, mobile-optimierte Film-Quiz Webanwendung mit Backend-API, Datenbank und PWA-Unterstützung.

![Film Quiz Screenshot](screenshot.png)

## ✨ Features

- 🎮 **3 Quiz-Kategorien**: Emoji-Quiz, Filmzitate, Film-Fakten
- 📱 **Progressive Web App**: Installierbar auf Android & iOS
- 🏆 **Bestenliste**: Speichert Highscores mit Spieler-Rang
- ⏱️ **Timer-System**: Zeitbonus für schnelle Antworten
- 💾 **Offline-Support**: Dank Service Worker
- 🎨 **Modernes Design**: Netflix-inspiriertes UI
- 📊 **Statistiken**: Persönliche Spielstatistiken

## 🚀 Schnellstart

### Option 1: Mit Docker (Empfohlen)

```bash
# Repository klonen
git clone <repository-url>
cd filmquiz-app

# Mit Docker Compose starten
docker-compose -f docker/docker-compose.yml up -d

# App ist verfügbar unter http://localhost:3000
```

### Option 2: Manuelle Installation

**Voraussetzungen:**
- Node.js 18+ 
- npm oder yarn

```bash
# 1. Backend einrichten
cd backend
npm install

# 2. Datenbank initialisieren
npm run init-db

# 3. Server starten
npm start

# Oder mit automatischem Neustart (Development)
npm run dev
```

Die Anwendung ist dann unter `http://localhost:3000` verfügbar.

## 📁 Projektstruktur

```
filmquiz-app/
├── backend/
│   ├── src/
│   │   ├── server.js          # Express Server
│   │   ├── database/
│   │   │   ├── db.js          # Datenbank-Verbindung
│   │   │   └── init.js        # Initialisierung & Seeds
│   │   └── routes/
│   │       ├── quiz.js        # Quiz API
│   │       └── scores.js      # Highscores API
│   └── package.json
├── frontend/
│   ├── index.html
│   ├── manifest.json          # PWA Manifest
│   ├── sw.js                  # Service Worker
│   └── src/
│       ├── css/style.css
│       └── js/
│           ├── api.js         # API Client
│           ├── game.js        # Spiel-Logik
│           ├── ui.js          # UI Controller
│           └── app.js         # Main App
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
└── README.md
```

## 🌐 API Endpunkte

| Methode | Endpunkt | Beschreibung |
|---------|----------|--------------|
| GET | `/api/health` | Health Check |
| GET | `/api/quiz/questions` | Zufällige Fragen |
| GET | `/api/quiz/categories` | Verfügbare Kategorien |
| GET | `/api/quiz/stats` | Quiz-Statistiken |
| GET | `/api/scores` | Highscores |
| POST | `/api/scores` | Score speichern |
| GET | `/api/scores/player/:name` | Spieler-Statistiken |

### Beispiele

**Fragen abrufen:**
```bash
curl http://localhost:3000/api/quiz/questions?category=emoji&limit=5
```

**Score speichern:**
```bash
curl -X POST http://localhost:3000/api/scores \
  -H "Content-Type: application/json" \
  -d '{
    "playerName": "Max",
    "score": 150,
    "correctAnswers": 8,
    "totalQuestions": 10,
    "category": "emoji"
  }'
```

## 📱 Als App installieren

### Android (Chrome)
1. Öffne die Webseite in Chrome
2. Tippe auf das Menü (⋮)
3. Wähle "Zum Startbildschirm hinzufügen"

### iOS (Safari)
1. Öffne die Webseite in Safari
2. Tippe auf "Teilen" (□↑)
3. Wähle "Zum Home-Bildschirm"

### Desktop (Chrome/Edge)
1. Klicke auf das Install-Icon in der Adressleiste
2. Oder: Menü → Apps → Diese Seite installieren

## 🛠️ Entwicklung

### Umgebungsvariablen

| Variable | Standard | Beschreibung |
|----------|----------|--------------|
| `PORT` | `3000` | Server-Port |
| `NODE_ENV` | `development` | Umgebung |

### Fragen hinzufügen

Bearbeite `backend/src/database/init.js` und füge neue Fragen zum `sampleQuestions` Array hinzu:

```javascript
{
  category: 'emoji',
  type: 'emoji', 
  question: '🎬🍿',
  hint: 'Dein Lieblingsbeschäftigung',
  answers: JSON.stringify(["Film schauen", "Kino", "Streaming", "Serien"]),
  correct_index: 1,
  difficulty: 'easy'
}
```

Dann Datenbank neu initialisieren:
```bash
npm run init-db
```

## 🐳 Deployment

### Docker Hub

```bash
# Image bauen
docker build -f docker/Dockerfile -t filmquiz .

# Image taggen
docker tag filmquiz username/filmquiz:latest

# Push zu Docker Hub
docker push username/filmquiz:latest
```

### VPS / Cloud

```bash
# Auf Server:
docker run -d \
  --name filmquiz \
  -p 3000:3000 \
  -v filmquiz-data:/app/src/database \
  --restart unless-stopped \
  username/filmquiz:latest
```

## 🧪 Testing

```bash
# Backend Tests
cd backend
npm test

# Manuelles Testing
curl http://localhost:3000/api/health
```

## 📄 Lizenz

MIT License - siehe [LICENSE](LICENSE) Datei

## 🤝 Mitwirken

Beiträge sind willkommen! Bitte:
1. Fork erstellen
2. Feature-Branch: `git checkout -b feature/xyz`
3. Commit: `git commit -am 'Add feature'`
4. Push: `git push origin feature/xyz`
5. Pull Request erstellen

---

Made with 🎬 and ☕
