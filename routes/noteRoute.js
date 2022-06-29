const express = require("express");
const Note = require("../noteMongo");
const routes = express.Router();

routes.get("/", (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes);
  });
});

routes.get("/:id", (request, response, next) => {
  const id = request.params.id;
  Note.findById(id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch((err) => {
      next(err);
    });
});

routes.post("/", (request, response) => {
  const body = request.body;

  if (!body.content) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  });

  note.save().then((savedNote) => response.json(savedNote));
});

routes.put("/:id", (request, response, next) => {
  const id = request.params.id;
  const changedNote = request.body;
  Note.findByIdAndUpdate(id, changedNote, { new: true })
    .then((res) => {
      response.json(res);
    })
    .catch((err) => {
      next(err);
    });
});

routes.delete("/:id", (request, response) => {
  const id = request.params.id;
  Note.findByIdAndRemove(id).then((res) => response.status(202));

  response.status(204).end();
});

module.exports = routes;
