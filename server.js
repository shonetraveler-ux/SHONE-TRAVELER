const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const pl = require('tau-prolog');
const sqlite3 = require('sqlite3').verbose();
const app = express();

app.use(bodyParser.json());

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, 'build')));

// Initialize SQLite database
const db = new sqlite3.Database('./chat.db');
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS chats (id INTEGER PRIMARY KEY, user_message TEXT, bot_reply TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)");
});

app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message || '';
  const lastIntent = req.body.lastIntent || 'none';
  try {
    const program = KB_TEXT || '';
    const query = `response("${userMessage}", "${lastIntent}", Reply, Explanation)`;
    const answers = await runProlog(program, query);
    let reply = 'Sorry, I could not understand that.';
    let explanation = '';
    if (answers.length > 0) {
      const parts = answers[0].split(', Explanation = ');
      if (parts.length === 2) {
        const replyPart = parts[0].split('Reply = ')[1];
        const explanationPart = parts[1];
        reply = replyPart.replace(/"/g, '');
        explanation = explanationPart.replace(/"/g, '');
      }
    }
    // Save to database
    db.run("INSERT INTO chats (user_message, bot_reply) VALUES (?, ?)", [userMessage, reply]);
    res.json({ reply, explanation });
  } catch (err) {
    console.error('prolog chat error', err);
    res.status(500).json({ error: 'කරුණාකර පසුව උත්සාහ කරන්න.' });
  }
});

app.get('/api/chat/history', (req, res) => {
  db.all("SELECT * FROM chats ORDER BY timestamp DESC LIMIT 50", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json({ history: rows });
    }
  });
});

// Helper to run a Prolog program and collect answers
function runProlog(program, query) {
  return new Promise((resolve, reject) => {
    const session = pl.create(1000);
    session.consult(program, {
      success: () => {
        session.query(query, {
          success: () => {
            const answers = [];
            function getAnswer() {
              session.answer(ans => {
                if (ans === false || ans === null) return resolve(answers);
                if (pl.type.is_error(ans)) return reject(ans);
                answers.push(session.format_answer(ans));
                getAnswer();
              });
            }
            getAnswer();
          },
          error: err => reject(err)
        });
      },
      error: err => reject(err)
    });
  });
}

// Load KB from file once
const KB_PATH = path.join(__dirname, 'kb.pl');
let KB_TEXT = '';
try {
  KB_TEXT = fs.readFileSync(KB_PATH, 'utf8');
} catch (e) {
  console.warn('Could not read kb.pl, Prolog endpoint will accept program text from body.');
}

// Prolog query endpoint
app.post('/api/prolog', async (req, res) => {
  try {
    const program = req.body.program || KB_TEXT || '';
    const query = req.body.query;
    if (!query) return res.status(400).json({ error: 'Missing prolog query in body' });
    const answers = await runProlog(program, query);
    res.json({ answers });
  } catch (err) {
    console.error('prolog error', err);
    res.status(500).json({ error: String(err) });
  }
});

// Catch all handler: send back React's index.html file for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Chat proxy listening on http://localhost:${port}`));
