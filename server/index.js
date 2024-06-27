const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

let users = [
  { email: 'test@example.com', password: 'password123' }
];
let friends = [
  { id: 1, nume: 'Popescu', prenume: 'Ion', telefon: '0712345678', oras: 'Bucuresti', dataNasterii: '1990-01-01' },
  { id: 2, nume: 'Ionescu', prenume: 'Maria', telefon: '0712345679', oras: 'Cluj-Napoca', dataNasterii: '1992-02-02' }
];

// Endpoint pentru înregistrare
app.post('/api/register', (req, res) => {
  const { email, password } = req.body;
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    res.status(400).send({ message: 'User already exists' });
  } else {
    users.push({ email, password });
    console.log('Current users:', users); // Log pentru verificare
    res.status(201).send({ message: 'User registered successfully' });
  }
});

// Endpoint pentru autentificare
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    res.send({ token: 'my-secret-token' });
  } else {
    res.status(401).send({ message: 'Invalid email or password' });
  }
});

// Endpoint pentru obținerea prietenilor
app.get('/api/friends', (req, res) => {
  res.send(friends);
});

// Endpoint pentru adăugarea unui prieten
app.post('/api/friends', (req, res) => {
  const friend = req.body;
  friend.id = friends.length ? Math.max(...friends.map(f => f.id)) + 1 : 1;
  friends.push(friend);
  res.status(201).send(friend);
});

// Endpoint pentru actualizarea unui prieten
app.put('/api/friends/:id', (req, res) => {
  const { id } = req.params;
  const index = friends.findIndex(f => f.id == id);
  if (index !== -1) {
    friends[index] = { ...friends[index], ...req.body };
    res.send(friends[index]);
  } else {
    res.status(404).send({ message: 'Friend not found' });
  }
});

// Endpoint pentru ștergerea unui prieten
app.delete('/api/friends/:id', (req, res) => {
  const { id } = req.params;
  friends = friends.filter(f => f.id != id);
  res.status(204).send();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
