const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

function getIndexRepository(request, response, next) {
  const { id } = request.params;
  repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }
  request.repositoryIndex = repositoryIndex;
  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };
  repositories.push(repository);
  return response.status(201).json(repository);
});

app.put("/repositories/:id", getIndexRepository, (request, response) => {
  const { repositoryIndex } = request;
  const updatedRepository = request.body;

  const { likes, id } = repositories[repositoryIndex];
  updatedRepository.id = id;
  updatedRepository.likes = likes;
  repositories[repositoryIndex] = updatedRepository;

  return response.json(updatedRepository);
});

app.delete("/repositories/:id", getIndexRepository, (request, response) => {
  const { repositoryIndex } = request;

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", getIndexRepository, (request, response) => {
  const { repositoryIndex } = request;

  repositories[repositoryIndex].likes += 1;

  return response.json({ likes: repositories[repositoryIndex].likes });
});

module.exports = app;
