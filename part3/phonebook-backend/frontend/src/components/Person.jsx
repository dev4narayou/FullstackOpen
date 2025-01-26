import personService from '../services/persons';

const deletePerson = (person) => () => {
    if (window.confirm(`Delete ${person.name}?`)) {
        personService.remove(person.id).then(() => {
            setPersons(persons.filter((p) => p.id !== person.id));
        });
    }
}

const Person = ({ person }) => {
    return (
      <div>
        {person.name} {person.number}
        <button onClick={deletePerson(person)}>delete</button>
      </div>
    );
}

export default Person;