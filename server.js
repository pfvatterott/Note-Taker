const express = require('express');
const path = require("path");
const fs = require("fs");
const  generateUUId = require('unique-identifier');
const app = express();
const PORT = process.env.PORT || 8080;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, "/db/db.json"));
})

app.post('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, "/db/db.json"), "utf8", function(err, data) {
        if (err) {
            console.log(err)
        };
        let notes = JSON.parse(data);
        let newNote = (req.body);
        // creates a unique ID using https://www.npmjs.com/package/unique-identifier
        const uniqueVal = generateUUId();
        newNote.id = uniqueVal;
        notes.push(newNote);
        fs.writeFile("./db/db.json", JSON.stringify(notes), function (err) {
            if (err) throw (err)
        });
        // This reloads the page when you click save
        res.redirect("/notes")
    })
})

app.delete('/api/notes/:note', (req, res) => {
    fs.readFile(path.join(__dirname, "/db/db.json"), "utf8", function(err, data) {
        if (err) {
            console.log(err)
        };
        let notes = JSON.parse(data);
        const index = notes.findIndex(r => r.id === req.params.id)
        notes.splice(index, 1);
        fs.writeFile("./db/db.json", JSON.stringify(notes), function (err) {
            if (err) throw (err)
        });
        res.sendFile(path.join(__dirname, "/public/notes.html"));
    })
});

app.post('/api/notes/:index', (req, res) => {
    fs.readFile(path.join(__dirname, "/db/db.json"), "utf8", function(err, data) {
        if (err) {
            console.log(err)
        };
        let notes = JSON.parse(data);
        let newNotes = (req.body)
        console.log(newNotes);
        const index = notes.findIndex(r => r.id === req.params.id)
        fs.writeFile("./db/db.json", JSON.stringify(newNotes), function (err) {
            if (err) throw (err)
        });
        res.redirect("/notes");
    })
});

// ===============================================
app.listen(PORT, () => {
    console.log(`App listening on PORT: ${PORT}`);
  });