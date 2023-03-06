import { useEffect, useState } from 'react'
import rest from './rest'

import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'

const App = () => {
  /* const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])  */

  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setNewFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)

  const getPersons = () => {
    rest.getAll().then(response => {
      setPersons(response)
    })
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(getPersons, [])

  const showNotification = (text) => {
    setErrorMessage({
      text,
      color: 'green'
    })
    setTimeout(() => setErrorMessage(null), 5000)
  }

  const showError = (text) => {
    setErrorMessage({
      text,
      color: 'red'
    })
    setTimeout(() => setErrorMessage(null), 5000)
  }

  const existsPersonByName = (nameToFind) => {
    return persons.map(person => person.name).includes(nameToFind)
  }

  const getPersonIdByName = (nameToFind) => {
    return persons.find(person => person.name === nameToFind).id
  }

  const addEntry = (event) => {
    event.preventDefault()

    if(newName === '') {
      alert('Name is empty')
      return
    }
    if(newNumber === '') {
      alert('Name is empty')
      return
    }

    if(existsPersonByName(newName)) {
      const prompt = `${newName} is already added to phonebook, replace the old number with a new one?`
      if(window.confirm(prompt)) {
        updateEntry(newName, newNumber)
      }
    } else {
      const newObject = {name: newName, number: newNumber}

      rest.add(newObject)
        .then(response => {
          showNotification(`Added ${newName}`)
          setPersons( persons.concat(newObject) )
        })
        .catch(error => {
          showError(error.response.data.error)
        })
    }

    setNewName('')
    setNewNumber('')
  }

  const updateEntry = (name, number) => {
    const id = getPersonIdByName(name)
    const newObject = {name, number, id}

    rest.update(id, newObject).then(response => {
      setPersons( persons.map(person => person.id !== id ? person : newObject) )
    }).catch(error => {
      showError(`Information of ${name} has already been removed!`)
    })
  }

  const removeEntry = (personToRemove) => {
    if (window.confirm(`Delete ${personToRemove.name}?`)) {
      rest.remove(personToRemove.id).then(response => {
        setPersons( persons.filter(person => person.id !== personToRemove.id) )
      })
    }
  }

  const handleNewFilter = (event) => {
    setNewFilter(event.target.value.toLowerCase())
  }

  const personsToShow = persons.filter(person => 
    person.name.toLowerCase().includes(filter)
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage}/>
      <Filter filter={filter} setNewFilter={handleNewFilter} />
      <PersonForm 
        addEntry={addEntry}
        newName={newName} setNewName={setNewName}
        newNumber={newNumber} setNewNumber={setNewNumber}
      />
      <Persons persons={personsToShow} removeEntry={removeEntry}/>
    </div>
  )
}

export default App