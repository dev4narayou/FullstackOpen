import { useState } from "react";
import { useEffect } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import People from "./components/People";
import personService from "./services/persons";
import Notification from "./components/Notification";

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
  const [errorMessage, setErrorMessage] = useState(null);
  const green = "rgb(8, 152, 0)";
  const [errorColor, setErrorColor] = useState(green);

  // fetch data from the server
  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, );

  // for handling when name changes in the person form
  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  // for handling when number changes in the person form
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  // for adding a new name to the phonebook
  const addName = (event) => {
    event.preventDefault();

    if (newName === "") {
      alert("Please enter a name");
      return;
    }

  const newPerson = {
      name: newName,
      number: newNumber,
      id: `${persons.length + 1}`,
    };
    const existing_names = persons.map((person) => person.name);

    // call the seperate update function if the name already exists
    if (existing_names.includes(newPerson)) {
      updateName(newPerson);
      return; // if the function doesn't return (it does)
    }

    setErrorMessage(`${newName} has been added to the phonebook`);
    setTimeout(() => {
      setErrorMessage(null);
    }, 5000);

    setPersons(persons.concat(newPerson));
    personService.add(newPerson);
    setNewName("");
    event.target.reset();
  };

  // for updating an existing name in the phonebook
  const updateName = (newPerson) => {
    if (
      confirm(
        `${newName} is already added to the phonebook, replace the older number with a new one?`
      )
    ) {
      const existingPerson = persons.find((person) => person.name === newName);
      const updatedPersonObject = { ...newPerson, id: `${existingPerson.id}` };

      //update backend
      personService.update(`${existingPerson.id}`, updatedPersonObject);

      setNewName("");
      // reset the form
      event.target.reset();

      // for displaying the notification
      setErrorMessage(`${newName} has been updated in the phonebook`);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);

      return;
    } else {
      return;
    }
  };

  // for deleting a name from the phonebook
  const deleteName = (person) => {
    const msg = `Delete ${person.name}?`;
    const confirm = window.confirm(msg);

    if (confirm) {
      personService
        .remove(person.id)
        .then(() => {
          // re-fetch the data from the server
          personService.getAll().then((updatedPersons) => {
            setPersons(updatedPersons);
          });
          setErrorMessage(`${person.name} has been deleted from the phonebook`);
          setTimeout(() => setErrorMessage(null), 5000);
        })
        .catch((error) => {
          setErrorColor("red");
          setTimeout(() => {setErrorColor(green)}, 5000);
          alert(
            `The person '${person.name}' was already deleted from the server`
          );
          personService.getAll().then((updatedPersons) => {
            setPersons(updatedPersons);
          });
        });
    }
  };

  /* FILTER LOGIC */
  const filterPersons = (event) => {
    setFilter(event.target.value);
  };

  const filteredPersons = filter
    ? persons.filter((person) =>
        person.name.toLowerCase().includes(filter.toLowerCase())
      )
    : persons;
  /* FILTER LOGIC END*/

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} color={errorColor} />
      <Filter filterPersons={filterPersons} />
      <h2>add a new</h2>
      <PersonForm
        handleClick={addName}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      ></PersonForm>
      <h2>Numbers</h2>
      <People persons={persons} deleteFn={deleteName} />
    </div>
  );
};

export default App;
