require('dotenv').config()
const Note = require('./models/note')

const express = require('express')
const app = express()
app.use(express.json())

app.use(express.static('dist'))

const cors = require('cors')
app.use(cors())

app.use(requestLogger);

app.get('/', (req, res) => {
    res.json('<h1>Hello World</h1>')
})

app.get('/api/notes', (req, res) => {
    Note.find({}).then(result => {
        res.json(result)
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})

app.get('/api/notes/:id', (req, res, next) => {
    Note.findById(req.params.id).then(note => {
        if (note) {
            res.json(note)
        } else {
            res.status(404).end()
        }
    })
        .catch(error => next(error))

    // const id = req.params.id
    // const note = notes.find(note => note.id === id)

    // if (note) {
    //     res.json(note)
    // } else {
    //     res.status(404).end()
    // }
})

app.delete('/api/notes/:id', (req, res, next) => {
    Note.findByIdAndRemove(req.params.id).then(result => {
        res.status(204).end
    })
        .catch(error => next(error))

    // const id = req.params.id
    // notes = notes.filter(note => note.id !== id)

    // res.status(204).end()
})

const generateId = () => {
    //random
    return Math.floor(Math.random() * 100000)

    // const maxId = notes.length > 0
    //     ? Math.max(...notes.map(n => Number(n.id)))
    //     : 0

}

app.post('/api/notes', (req, res, next) => {
    const body = req.body
    if (!body.content) {
        return res.status(400).json({
            error: 'content missing'
        })
    }

    const note = new Note({
        content: body.content,
        important: body.important || false,
        id: generateId()
    })

    note.save().then(result => {
        res.json(result)
    })
        .catch(error => next(error))

    // notes = notes.concat(note)
    // res.json(note)
})

app.put('/api/notes/:id', (req, res, next) => {
    const { content, important } = req.body

    Note.findByIdAndUpdate(
        req.params.id,
        { note: content, important: important },
        { new: true, runValidators: true, context: 'query' })
        .then(updatedNote => {
            res.json(updatedNote)
        })
        .catch(error => next(error))
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
    console.error(error.message)
    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message })
    }
    next(error)
}

app.use(errorHandler)