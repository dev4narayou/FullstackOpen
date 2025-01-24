const express = require("express");
const app = express();

app.use(express.json());

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

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
app.use(morgan("tiny"));


app.get("/api/persons/:id", (request, response) => {
  const person = persons.find((person) => person.id == request.params.id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
})

app.delete("/api/persons/:id", (request, response) => {
  const personTarget = persons.find((person) => person.id == request.params.id);
  if (personTarget) {
    persons = persons.filter((person) => person != personTarget);
    response.status(204).end();
  } else {
    response.status(404).end()
  }
})

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.post("/api/persons", (request, response) => {
  const body = request.body;
  if (!body.name || !body.number) {
    // incorrect syntax in request
    return response.status(400).json({
      error: "content missing",
    });
  }

  if (persons.find((person) => person.name == body.name)) {
    return response.status(400).json({
      error: "name must be unique"
    })
  }

  const person = {
    id: `${Math.round(Math.random() * 1000000)}`,
    name: body.name,
    number: `${body.number}`,
  }

  persons = persons.concat(person);
  response.send(201);

})

app.get("/info", (request, response) => {
  const now = new Date();
  const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // dates
  let m = month[now.getMonth()];
  let day = weekday[now.getDay()];
  const currentDate = `${
    day + " " + m + " " + now.getDate() + " " + now.getFullYear() + " "
    }`;

  // time
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  response.send(
    `
    <div>
      <p>
        Phonebook has info for ${persons.length} persons
      </p>
      </div>
    <div>
      <p>
        ${currentDate} (${timeZone})
      </p>
    </div>
    `
  );
});


// placing this middleware after the routes will make it run after the routes
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};
// use the middleware
app.use(unknownEndpoint);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
