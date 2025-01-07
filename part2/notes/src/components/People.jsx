import Person from './Person';

const People = ({ persons, filteredPersons }) => {
    return (
        filteredPersons.map((person) => (
            <Person key={person.id} person={person} />
        ))
    );
};

export default People;