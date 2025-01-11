import { useState } from "react";
import { useEffect } from "react";
import Header from "./components/Header";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import People from "./components/People";
import axios from "axios";
import personService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  // const [persons, setPersons] = useState([
  //   { name: "Arto Hellas", number: "040-123456", id: 1 },
  //   { name: "Ada Lovelace", number: "39-44-5323523", id: 2 },
  //   { name: "Dan Abramov", number: "12-43-234345", id: 3 },
  //   { name: "Mary Poppendieck", number: "39-23-6423122", id: 4 },
  // ]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  })

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const addName = (event) => {
    event.preventDefault();
    const nameObject = {
      name: newName,
      number: newNumber,
      id: persons.length + 1,
    };

    const existing_names = persons.map((person) => person.name);

    if (newName === "") {
      alert("Please enter a name");
      return;
    }

    // terminate if the name already exists, and the user doesn't want to replace/update the number
    if (existing_names.includes(newName)) {
      if (confirm(`${newName} is already added to the phonebook, replace the older number with a new one?`)) {
      const existingPerson = persons.find((person) => person.name === newName);
      const updatedPersonObject = { ...nameObject, id: `${existingPerson.id}` };

      personService.update(
        `${existingPerson.id}`,
        updatedPersonObject
      );
      setNewName("");
      event.target.reset();
      return;
      } else {
      return;
      }
    }

    setPersons(persons.concat(nameObject));
    personService.add(nameObject);
    setNewName("");
    event.target.reset();
  };

  const personExists = (name) => {
    return persons.some((person) => person.name === name);
  }

  const filterPersons = (event) => {
    setFilter(event.target.value);
  }

  const filteredPersons = filter ? persons.filter((person) => person.name.toLowerCase().includes(filter.toLowerCase())) : persons;

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filterPersons={filterPersons} />
      <h3>add a new</h3>
      <PersonForm
        handleClick={addName}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      ></PersonForm>
      <h3>Numbers</h3>
      <People persons={persons} filteredPersons={filteredPersons} />
    </div>
  );
};

export default App;
