
const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
// app.use(requestLogger);

notesRouter.get('/', async (request, response) => {
  const notes = await Note
    .find({}).populate('user', { username: 1, name: 1 })

  response.json(notes)
})

notesRouter.get('/:id', async (req, res, next) => {
  const note = await Note.findById(req.params.id)
  if (note) {
    res.json(note)
  } else {
    res.status(404).end()
  }
})

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

notesRouter.post('/', async (req, res, next) => {
  const body = req.body;

  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)

  // const user = await User.findById(body.userId);

  const note = new Note({
    content: body.content,
    important: body.important || false,
    user: user.id
  })

  console.log('note', note)

  const savedNote = await note.save()
  user.notes = user.notes.concat(savedNote._id)
  res.status(201).json(savedNote)
})

notesRouter.delete('/:id', async (req, res, next) => {
  const note = await Note.findByIdAndRemove(req.params.id)
  res.status(204).json(note)
})

notesRouter.put('/:id', async (req, res, next) => {
  const body = req.body

  const note = {
    content: body.content,
    important: body.important
  }

  const foundNote = Note.findByIdAndUpdate(
    req.params.id,
    note, { new: true })
  
  res.status(201).json(foundNote)
})

module.exports = notesRouter