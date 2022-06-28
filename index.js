require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
let notes = require("./noteData");
const Note = require("./noteMongo");

// const noteRouter = require("./app/noteRoute");

app.use(express.json());
app.use(cors());
app.use(express.static("build"));

// app.get("/", (request, response) => {
//   response.send("<h1>Hello World!</h1>");
// });

// app.use("/api/notes", noteRouter);

app.get("/api/notes", (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes);
  });
});

app.get("/api/notes/:id", (request, response, next) => {
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

const errorHandler = (error, req, res, next) => {
  if (error.name == "CastError") {
    res.status(400).send({ error: "malformated id" });
  }
  next(error);
};

app.use(errorHandler);

app.post("/api/notes", (request, response) => {
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

app.put("/api/notes/:id", (request, response) => {
  const id = request.params.id;
  const changedNote = request.body;
  Note.findByIdAndUpdate(id, changedNote, { new: true }).then((res) => {
    response.json(res);
  });
});

app.delete("/api/notes/:id", (request, response) => {
  const id = request.params.id;
  Note.findByIdAndRemove(id).then((res) => response.status(202));

  response.status(204).end();
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
