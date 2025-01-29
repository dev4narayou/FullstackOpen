const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");

const Note = require("./models/note");

let notes = [];

app.use(express.static("dist"));

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next(); // passes control to the subsequent middleware function in the stack
};

// order of middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// custom error handler (defined after everything)
const errorHandler = (err, req, res, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(err);
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/notes", (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes);
  });
});

app.post("/api/notes", (request, response, next) => {
  const body = request.body;

  if (body.content === undefined) {
    return response.status(400).json({ error: "content missing" });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  note
    .save()
    .then((savedNote) => {
      response.json(savedNote);
    })
    .catch(next);
});

app.get("/api/notes/:id", (request, response, next) => {
  Note.findById(request.params.id)
    .then((note) => {
      if (!note) {
        return response.status(400).json({ error: "note not found" });
      }
      response.json(note);
    })
    .catch(next);
});

app.delete("/api/notes/:id", (request, response, next) => {
  const id = request.params.id;
  Note.deleteOne({ _id: id })
    .then(() => {
      response.status(204).end();
    })
    .catch(next);
});

app.put("/api/notes/:id", async (request, response, next) => {
  const id = request.params.id;
  const { content, important } = request.body;

  Note.findByIdAndUpdate(
    request.params.id,
    { content, important },
    { new: true, runValidators: true, context: "query" }
  )
    .then((updatedNote) => {
      response.json(updatedNote);
    })
    .catch((error) => next(error));
});

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
