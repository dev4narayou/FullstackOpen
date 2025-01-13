import React from 'react';

const People = ({ persons, deleteFn }) => {
  return (
    <ul>
      {persons.map((person) => (
        <li key={person.id} className="note">
          {person.name} {person.number}
          <button onClick={() => deleteFn(person)}>delete</button>
        </li>
      ))}
    </ul>
  );
};

export default People;