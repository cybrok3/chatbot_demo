const express = require('express');
const app = express();
const PORT = 5000;

app.use(express.json());

const keywords = [
  { keys: ['about', 'yourself', 'who'], response: "Hi, I'm Alex, a computer science student passionate about building web applications and AI" },
  { keys: ['project', 'projects', 'worked on'], response: "I've developed a weather app, a personal budgeting tool, and a RESTful API for a task manager." },
  { keys: ['skill', 'skills', 'expertise'], response: "I'm skilled in JavaScript, Python, React, and SQL" },
  { keys: [ 'where', 'study', 'education'], response: "I graduated from XYZ University with a degree in Computer Science." },
  { keys: ['hobby', 'hobbies', 'interest', 'interests'], response: "I enjoy hiking, reading science fiction, and working on open-source projects." },
];

app.post("/chat", (req, res) => {
  const prompt = req.body.prompt.toLowerCase();

  // Find the first response where any keyword is included
  const match = keywords.find(({ keys }) =>
    keys.some(key => prompt.includes(key))
  );

  const reply = match ? match.response : "Sorry, I don't understand that yet.";
  res.json({ reply });
});

app.listen(PORT, () => {console.log("Server started on port 5000")})