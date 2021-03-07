const express = require('express');
const cors = require('cors');

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get('/repositories', (request, response) => {
  // const { id } = request.params;
  return response.json(repositories);
});

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs: [...techs],
    likes: 0,
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put('/repositories/:id', (request, response) => {
  const { id } = request.params;

  const matchRepoIndex = repositories.findIndex((repo) => repo.id === id);

  if (matchRepoIndex < 0) {
    response.status(400).json({ error: 'Repository not found' });
  }

  if (Object.keys(request.body).includes('likes')) {
    response.status(400).json({ likes: repositories[matchRepoIndex].likes });
  }

  const { title, url, techs } = request.body;

  const repository = { id, title, url, techs };

  repositories[matchRepoIndex] = repository;

  return response.json(repository);
});

app.delete('/repositories/:id', (request, response) => {
  const { id } = request.params;

  const { title, url, techs } = request.body;

  const matchRepoIndex = repositories.findIndex((repo) => repo.id === id);

  if (matchRepoIndex < 0) {
    response.status(400).json({ error: 'Repository not found' });
  }

  repositories.splice(matchRepoIndex, 1);

  response.status(204).send();
});

app.post('/repositories/:id/like', (request, response) => {
  const { id } = request.params;

  const matchRepoIndex = repositories.findIndex((repo) => repo.id === id);

  if (matchRepoIndex < 0) {
    response.status(400).json({ error: 'Repository not found' });
  }
  repositories[matchRepoIndex].likes = repositories[matchRepoIndex].likes + 1;

  response.status(201).json({ likes: repositories[matchRepoIndex].likes });
});

module.exports = app;
