const express = require('express');
morgan = require ('morgan');
fs = require('fs');
path = require('path');

const app = express();




app.get('/', (req, res) => {
    res.send('Welcome! Hope this is working!');
});

//this invookes the morgan middleware
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})

// setup the logger
app.use(morgan('combined', {stream: accessLogStream}));

let movies = [
    {
        "name": "Lord of the Rings",
        "Genre": "Medieval Fantasy"
    },
    {
        "name": "Pulp Fiction",
        "Genre": ["Action", "Drama"]
    },
    {
        "name": "Barton Fink",
        "Genre": "Drama"
    },
    {
        "name": "Un Prohpete",
        "Genre": ["Action", "Drama"]
    },
    {
        "name": "Gone with the Wind",
        "Genre": "Historical Drama"
    },
    {
        "name": "Das Boot",
        "Genre": "War"
    },
    {
        "name": "All quiet on the Western Front",
        "Genre": "War"
    },
    {
        "name": "The Sipmsons Movie",
        "Genre": "Comedy"
    },
    {
        "name": "Life is Beautifull",
        "Genre": ["historical Fiction", "Comedy"]
    },
    {
        "name": "Dr. Strangelove",
        "Genre": "Historical Fiction"
    }
]
app.get('/movies',(req, res) => {
    res.json(movies);
});

app.get('/secreturl', (req, res) => {
    res.send('This is a secret URL!!');
});

app.use(express.static('public'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

app.listen(8080, () => {
    console.log('Listening on port 8080');

})
