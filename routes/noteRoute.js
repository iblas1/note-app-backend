const express = require("express");
const Note = require("../noteMongo");
const routes = express.Router();

routes.get("/", (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes);
  });
});

routes.get("/:id", (request, response) => {
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
      console.log(err);
      response.status(400).send({ error: "malformated id" });
    });
});

// const generateId = () => {
//   const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
//   return maxId + 1;
// };

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
  // const note = {
  //   content: body.content,
  //   important: body.important || false,
  //   date: new Date(),
  //   id: generateId(),
  // };

  // notes = notes.concat(note);
  note.save().then((savedNote) => response.json(savedNote));
});

routes.delete("/:id", (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter((note) => note.id !== id);

  response.status(204).end();
});

module.exports = routes;
