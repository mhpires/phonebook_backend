const personsRouter = require('express').Router()

const Person = require('../models/person')


personsRouter.get('/info', (request, response) => {
  Person.find({})
    .then(persons => {
      const date = new Date()
      response.send(
        `<p>Phonebook has info for ${persons.length} people</p>
         <p>${date}</p>`
      )
    })
})

// all persons
personsRouter.get('/', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

// method used to generate a person entry ID
const generateId = () => {
  return String(Math.floor(Math.random() * 10000))
}

// adding a person
personsRouter.post('/', (request, response, next) => {
  const body = request.body

  const newPerson = new Person({
    name: body.name,
    number: body.number,
    id: generateId(),
  })

  newPerson.save().then(savedPerson => {
    response.json(savedPerson)
  }).catch((error) => next(error))
})

// finding a person
personsRouter.get('/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
      response.json(person)
    }).catch((error) => next(error))

})

// updating the number of a person
personsRouter.put('/:id', (request, response, next) => {

  Person.findByIdAndUpdate(
    request.params.id,
    request.body,
    { new: true }
  ).then(updatedPerson => {
    if (updatedPerson) {
      response.json(updatedPerson)
    } else {
      response.status(404).json({ error: 'person not found' })
    }
  })
    .catch(error => next(error))
})

// deleting a person
personsRouter.delete('/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})


module.exports = personsRouter