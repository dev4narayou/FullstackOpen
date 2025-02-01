import { useState } from "react";
import { useEffect } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import People from "./components/People";
import personService from "./services/persons";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
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
  }, []);

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

    if (newName.length < 3) {
      console.log("Name is too short");
      setErrorColor("red");
      setErrorMessage(
        `Person validation failed: name: Path 'name' (${newName}) is shorter than the minimum allowed length (3).`
      );
      setTimeout(() => {
        setErrorMessage(null);
        setErrorColor(green); // Reset color after error
      }, 5000);
      setNewName(""); // Clear input
      event.target.reset(); // Reset form
      return;
    }

    const newPerson = {
      name: newName,
      number: newNumber,
      id: `${persons.length + 1}`,
    };
    const existing_names = persons.map((person) => person.name);


    // call the seperate update function if the name already exists
    if (existing_names.includes(newPerson.name)) {
      console.log("Name already exists");
      updateName(newPerson);
      return; // if the function doesn't return (it does)
    }

    setErrorMessage(`${newName} has been added to the phonebook`);
    setTimeout(() => {
      setErrorMessage(null);
    }, 5000);

    setPersons(persons.concat(newPerson));
    personService.add(newPerson).then()
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
    if (window.confirm(msg)) {
      personService
        .remove(person.id)
        .then(() => {
          // Re-fetch ONLY after successful deletion
          personService.getAll().then((updatedPersons) => {
            setPersons(updatedPersons);
            setErrorMessage(`${person.name} has been deleted from the phonebook`);
            setTimeout(() => setErrorMessage(null), 5000);
          });
        })
        .catch((error) => {
          setErrorColor("red");
          setTimeout(() => setErrorColor(green), 5000);

          if (error.response.status === 404) {
            // Check for "not found"
            // Already deleted on the server; update UI directly
            setPersons(persons.filter((p) => p.id !== person.id));
            setErrorMessage(
              `The person '${person.name}' was already deleted from the server`
            );
            setTimeout(() => setErrorMessage(null), 5000);
          } else {
            // Other errors
            // eslint-disable-next-line
            alert(`Error deleting ${person.name}: ${error.message}`); // display to user, give more context than before
            // You might still want a refetch here depending on the nature
            // of the error, but often it's not necessary.  If you do a
            // refetch, be mindful of potential infinite loops as explained before
          }
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
