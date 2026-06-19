const express = require('express');
const fs = require('fs/promises');
const path = require('path');

const app = express();
const port = 3100;
const dataFile = path.join(__dirname, 'data', 'cards.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

async function readCards() {
  const fileContent = await fs.readFile(dataFile, 'utf8');
  return JSON.parse(fileContent);
}

async function writeCards(cards) {
  await fs.mkdir(path.dirname(dataFile), { recursive: true });
  await fs.writeFile(dataFile, JSON.stringify(cards, null, 2), 'utf8');
}

app.get('/api/cards', async (req, res) => {
  try {
    const cards = await readCards();
    res.json(cards);
  } catch (error) {
    res.status(500).json({ message: 'Lernkarten konnten nicht geladen werden.' });
  }
});

app.post('/api/cards', async (req, res) => {
  const question = String(req.body.question || '').trim();
  const answer = String(req.body.answer || '').trim();
  const category = String(req.body.category || '').trim() || 'Allgemein';

  if (!question || !answer) {
    return res.status(400).json({ message: 'Frage und Antwort sind Pflichtfelder.' });
  }

  try {
    const cards = await readCards();
    const newCard = {
      id: Date.now().toString(),
      question,
      answer,
      category
    };

    cards.push(newCard);
    await writeCards(cards);

    res.status(201).json(newCard);
  } catch (error) {
    res.status(500).json({ message: 'Lernkarte konnte nicht gespeichert werden.' });
  }
});

app.delete('/api/cards/:id', async (req, res) => {
  try {
    const cards = await readCards();
    const filteredCards = cards.filter((card) => card.id !== req.params.id);

    if (filteredCards.length === cards.length) {
      return res.status(404).json({ message: 'Lernkarte wurde nicht gefunden.' });
    }

    await writeCards(filteredCards);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Lernkarte konnte nicht geloescht werden.' });
  }
});

app.listen(port, () => {
  console.log(`StudyCards laeuft auf http://localhost:${port}`);
});
