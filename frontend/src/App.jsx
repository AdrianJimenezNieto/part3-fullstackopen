import { useState, useEffect } from 'react'
import personService from './services/Persons'

import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import Persons from './components/Persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [success, setSuccess] = useState(true)

  useEffect(() =>{
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const nameChange = (event) => {
    setNewName(event.target.value)
  }

  const numberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const filterChange = (event) => {
    setFilter(event.target.value)
    if (filter != '') {
      setShowAll(false)
    }
  }

  const editNumber = (id) => {
    const person = persons.find(person => person.id === id)
    if (confirm(`${person.name} is already added to phonebook, replace the old number with a new one?`)) {
      const updatePerson = {
        ...person,
        number: newNumber
      }

      personService
        .update(person.id, updatePerson)
        .then(returnedPerson => {
          setNotificationMessage(`Number of ${returnedPerson.name} changed succesfuly.`)
          console.log(notificationMessage);
          setTimeout(() => {
            setNotificationMessage(null)
          }, 3000);
          setPersons(persons.map(person => person.id !== id ? person : returnedPerson))
        })
        .catch(error => {
          setSuccess(false)
          setNotificationMessage(`Information ${person.name} has already been removed from server`)
          setTimeout(() => {
            setNotificationMessage(null)
            setSuccess(true)
          }, 3000);
          setPersons(persons.map(person => person.id !== id))
        })
    }
  } 

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.map(person => person.name).includes(newName)) {
      const id = persons.find(person => person.name === newName).id
      editNumber(id)
    }
    else if (newName === '' || newNumber === '') {
      alert('Please fill al the fields.')
    }
    else {
      const personObject = {
        name: newName,
        number: newNumber,
      }
      personService
        .create(personObject)
        .then(returnedPerson => {
          setNotificationMessage(`Added ${returnedPerson.name} succesfuly.`)
          setTimeout(() => {
            setNotificationMessage(null)
          }, 3000);
          setPersons(persons.concat(returnedPerson))
        })
    }
    setNewName('')
    setNewNumber('')
  }

  const deletePerson = (id) => {
    const deleteItem = persons.find(person => person.id === id)
    if (window.confirm(`Are you sure you want to delete ${deleteItem.name}`)) {
      personService
        .deletePerson(id)
        .then(returned => {
          setPersons(persons.filter(person => person.id !== id))
        })
    }
  }

  const namesToShow = showAll
    ? persons
    : persons.filter(person => person.name.toLocaleLowerCase().includes(filter))
  
  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={notificationMessage} type={success} />

      <Filter filter={filter} handler={filterChange} />

      <h3>Add a new</h3>

      <PersonForm 
        handleSubmit={addPerson}
        name={newName}
        handleName={nameChange}
        number={newNumber}
        handleNumber={numberChange}
      />

      <h3>Numbers</h3>

      <Persons personsList={namesToShow} handler={deletePerson} />

    </div>
  )
}

export default App