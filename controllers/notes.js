
const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')
// app.use(requestLogger);

notesRouter.get('/', async (request, response) => {
  const notes = await Note
    .find({}).populate('user', { username: 1, name: 1 })

  response.json(notes)
})

notesRouter.get('/:id', (req, res, next) => {
  Note.findById(req.params.id).then(note => {
    if (note) {
      res.json(note)
    } else {
      res.status(404).end()
    }
  })
    .catch(error => next(error))
})

notesRouter.post('/', async (req, res, next) => {
  const body = req.body

  const user = await User.findById(body.userId);

  const note = new Note({
    content: body.content,
    important: body.important || false,
    user: user.id
  })

  const savedNote = await note.save()

  user.notes = user.notes.concat(savedNote._id)
  
  await user.save()
})

notesRouter.delete('/:id', (req, res, next) => {
  Note.findByIdAndRemove(req.params.id).then(result => {
    res.status(204).end
  })
    .catch(error => next(error))

  // const id = req.params.id
  // notes = notes.filter(note => note.id !== id)

  // res.status(204).end()
})

notesRouter.put('/:id', (req, res, next) => {
  const body = req.body

  const note = {
    content: body.content,
    important: body.important
  }

  Note.findByIdAndUpdate(
    req.params.id,
    note, { new: true })
    .then(updatedNote => {
      res.json(updatedNote)
    })
    .catch(error => next(error))
})

module.exports = notesRouter