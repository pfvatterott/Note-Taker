const express = require('express');
const path = require("path");
const fs = require("fs");
const  generateUUId = require('unique-identifier');
const app = express();
const PORT = process.env.PORT || 8080;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));


app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", function(req, res) {
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
        
        console.log(newNote)
        notes.push(newNote);
        console.log(notes)
        fs.writeFile("./db/db.json", JSON.stringify(notes), function (err) {
            if (err) throw (err)
        });
        // This reloads the page when you click save
        res.redirect("/notes")
    })
})








// ===============================================
app.listen(PORT, () => {
    console.log(`App listening on PORT: ${PORT}`);
  });