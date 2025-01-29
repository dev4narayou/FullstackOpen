const express = require("express");
const app = express();
require("dotenv").config();
const path = require("path");
const cors = require("cors");

const Person = require("./models/person");

app.use(express.json());
app.use(cors());

app.use(express.static("dist")); // serves the frontend at the base url

// // middleware
// const requestLogger = (request, response, next) => {
//   console.log("Method:", request.method);
//   console.log("Path:  ", request.path);
//   console.log("Body:  ", request.body);
//   console.log("---");
//   next();
// };
// // middleware is used like this
// app.use(requestLogger);

// morgan middleware
const morgan = require("morgan");
// app.use(morgan("tiny"));
morgan.token("person", function (req, res) {
  return JSON.stringify(req.body);
});
app.use(
  morgan(`:method :url :status:res[content-length] - :response-time ms :person`)
);

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (!person) {
        return response.status(404).json({ error: "person not found" });
      }
      response.json(person);
    })
    .catch(next);
});

app.delete("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  Person.deleteOne({ _id: id })
    .then(() => {
      response.status(204).end();
    })
    .catch(next);
});

app.post("/api/persons", (request, response) => {
  const body = request.body;
  if (!body.name || !body.number) {
    // incorrect syntax in request
    return response.status(400).json({
      error: "content missing",
    });
  }

  Person.findOne({ name: body.name }).then((existingPerson) => {
    if (existingPerson) {
      return response.status(400).json({
        error: "name must be unique",
      });
    }

    const person = new Person({
      name: body.name,
      number: body.number,
    });

    person.save().then((savedPerson) => {
      response.status(201).json(savedPerson);
    });
  });
});

app.put("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const { name, number } = request.body;

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: "query" }
  )
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

app.get("/info", (request, response) => {
  const now = new Date();
  const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const month = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // dates
  let m = month[now.getMonth()];
  let day = weekday[now.getDay()];
  const currentDate = `${
    day + " " + m + " " + now.getDate() + " " + now.getFullYear() + " "
  }`;

  // time
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  Person.countDocuments({}).then((count) => {
    response.send(
      `<p>Phonebook has info for ${count} people</p><p>${currentDate}</p>`
    );
  });
});

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "dist", "index.html"));
});

// placing this middleware after the routes will make it run after the routes
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};
// use the middleware
app.use(unknownEndpoint);

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
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
