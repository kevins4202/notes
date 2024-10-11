require('dotenv').config()
const Note = require('./models/note')

const express = require('express');
const app = express();
app.use(express.json());

app.use(express.static('dist'))

const cors = require('cors');
app.use(cors());

app.get('/', (req, res) => {
    res.json('<h1>Hello World</h1>');
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

app.get('/api/notes/:id', (req, res) => {
    const id = req.params.id
    const note = notes.find(note => note.id === id)
    
    if (note) {
        res.json(note)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id
    notes = notes.filter(note => note.id !== id)
    
    res.status(204).end()
})

const generateId = () => {
    const maxId = notes.length > 0
        ? Math.max(...notes.map(n => Number(n.id)))
        : 0
    
    return maxId + 1
}

app.post('/api/notes', (req, res) => {
    const body = req.body
    if (!body.content) {
        return res.status(400).json({
            error: 'content missing'
        })
    }

    const note = {
        content: body.content,
        important: body.important || false,
        id: generateId()
    }

    note.save().then(result => {
        res.json(result)
    })

    // notes = notes.concat(note)
    // res.json(note)
})