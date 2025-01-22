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

app.get("/api/persons", (request, response) => {
  response.json(persons);
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

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
