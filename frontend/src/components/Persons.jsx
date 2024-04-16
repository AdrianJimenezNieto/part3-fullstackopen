const Persons = ({ personsList, handler }) => 
  <div>
    {personsList.map((person, i) =>
      <p key={person.id}>
        {person.name} {person.number}
        <button key={person.id} onClick={() => handler(person.id)}>Delete</button>
      </p>
    )}
  </div>

export default Persons