# StudyCards

StudyCards ist eine einfache webbasierte Lernkarten-App. Benutzer koennen Lernkarten mit Frage, Antwort und Kategorie erstellen, anzeigen, filtern, loeschen und im Lernmodus ueben.

## Technologien

- HTML fuer die Struktur der Webseite
- CSS fuer Aussehen, Layout und responsive Darstellung
- JavaScript im Browser fuer Interaktion und dynamische Anzeige
- Node.js als serverseitige Laufzeitumgebung
- Express als Webframework fuer Server und API-Endpunkte
- JSON-Datei als einfache Datenhaltung

## Starten

```bash
npm install
npm start
```

Danach ist die App unter `http://localhost:3100` erreichbar.

Wichtig: Die Datei `public/index.html` sollte nicht per Doppelklick direkt im Browser geoeffnet werden. Dann laeuft nur das Frontend, aber das Backend fehlt. Speichern, Laden und Loeschen funktionieren nur, wenn der Server mit `npm start` laeuft und die Seite ueber `http://localhost:3100` geoeffnet wird.

## Funktionen

- Lernkarten anlegen
- Lernkarten anzeigen
- Lernkarten nach Kategorie filtern
- Lernkarten loeschen
- Lernmodus mit Frage, Antwort anzeigen und naechster Karte
- Speicherung in `data/cards.json`

## Fachliches Modell

Das zentrale Objekt ist eine Lernkarte.

```json
{
  "id": "1001",
  "question": "Was ist HTML?",
  "answer": "HTML beschreibt die Struktur einer Webseite.",
  "category": "Webentwicklung"
}
```

Eine Lernkarte besitzt eine eindeutige ID, eine Frage, eine Antwort und eine Kategorie.

## Rendering und Architektur

Die Anwendung nutzt eine Kombination aus serverseitigem und clientseitigem Rendering.

Der Express-Server liefert die statischen Dateien `index.html`, `style.css` und `script.js` aus. Zusaetzlich stellt der Server API-Endpunkte bereit, ueber die Lernkarten geladen, gespeichert und geloescht werden.

Die eigentliche Darstellung der Lernkarten passiert clientseitig im Browser. Das Frontend ruft die Daten mit `fetch()` vom Backend ab und erzeugt die sichtbaren Karten dynamisch mit JavaScript. Dadurch kann die Ansicht nach dem Erstellen oder Loeschen sofort aktualisiert werden, ohne die komplette Seite neu zu laden.

## API-Endpunkte

| Methode | Route | Bedeutung |
| --- | --- | --- |
| GET | `/api/cards` | Laedt alle Lernkarten |
| POST | `/api/cards` | Erstellt eine neue Lernkarte |
| DELETE | `/api/cards/:id` | Loescht eine Lernkarte anhand der ID |

## Praesentationssatz

Meine App besteht aus einem Frontend und einem Backend. Das Frontend ist die sichtbare Oberflaeche im Browser. Das Backend laeuft mit Node.js und Express und stellt API-Endpunkte bereit. Die Daten werden in einer JSON-Datei gespeichert. Das Frontend kommuniziert ueber `fetch()` mit dem Backend und rendert die Lernkarten dynamisch im Browser.
