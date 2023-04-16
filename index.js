const bodyParser = require('body-parser');
const express = require('express');
morgan = require ('morgan');
fs = require('fs');
path = require('path');
uuid = require('uuid')

// now the app will use only express logic
const app = express();


app.get('/', (req, res) => {
    res.send('Welcome to Fletnix!');
});

//this invookes the morgan middleware
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})

// setup the logger
// now morgan is embeded in 'app'
app.use(morgan('combined', {stream: accessLogStream}));
app.use(bodyParser.json());

let users = [
    {
        id: 1,
        name: 'Philippe',
        favorites: [{'title': 'lalaland'}]
    },
    {
        id: 2,
        name: 'Elisa',
        favorites: [{'title': 'rust'}]
    }
]
let movies = [
    {
        "title": "Lord of the Rings",
        "genre":"Medieval Fantasy",
        "director": "peter jackson",
    },
    {
        "title": "Pulp Fiction",
        "genre": ["Action", "Drama"],
        "director": "quentin tarantino",
    },
    {
        "title": "Barton Fink",
        "genre": "Drama",
        "director": "cohen brothers",
    },
    {
        "title": "Un Prohpete",
        "genre": ["Action", "Drama"]
    },
    {
        "title": "Gone with the Wind",
        "genre": ["Historical Drama"]
    },
    {
        "title": "Das Boot",
        "genre": ["War"]
    },
    {
        "title": "All quiet on the Western Front",
        "genre": ["War"]
    },
    {
        "title": "The Sipmsons Movie",
        "genre": ["Comedy"]
    },
    {
       "title": "Life is Beautifull",
        "genre": ["historical Fiction", "Comedy"]
    },
    {
        "title": "Dr. Strangelove",
        "genre": ["Historical Fiction"]
    },
    {
        "title": "Mathilda",
        "genre": ["Kids"]
    }
]
// allows access to all static files in public folder

app.use(express.static('public'));

//endpoints 

app.get('/movies',(req, res) => {
    res.json(movies);
    res.status(200).send
});

app.get('/movies/:title', (req, res) => {
    const title = req.params.title

    //this is the code needed to find movies by title
    res.json(movies.find( (movie) => {
        return movie.title === req.params.title
    })); 
    res.send('Here is some information about this film:');
    res.status(200).send
});

app.get('/movies/genre/:genreName', (req, res) => {
    const { genreName } = req.params;

    const genre = movies.find ((movie) => {
        return movie.genre.includes(genreName) || movie.genre === genreName
    });
    
    if(genre){
        
    res.status(200).json(genre);
        
    } else {
        res.send('Genre not found')
        res.status(404);
    }
})

app.get('/movies/director/:directorName', (req, res) => {
    const { directorName } = req.params;
    const director = movies.find ((movie) => {
        return movie.director.includes(directorName) || movie.director === directorName
    });
    
    if(director){
        
        res.status(200).json(director)
    } else {
        res.send('Director not found')
        res.status(404);
    }
})

app.post('/register', (req, res) => {
    let newUser = req.body;

    if (!newUser.name) {
        res.status(400).send('Please enter a name');
    } else {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser)
    }
});

app.put('/users/:id', (req, res) => {
    const { id } = req.params; 
    const updatedUser = req.body;

    let user = users.find( user => user.id == id) 

    if (user) {
        user.name = updatedUser.name;
        res.status(200).json(user);
    } else {
        res.status(400).send('invalid');
    }
})

app.post('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle} = req.params;
    

    let user = users.find( user => user.id == id) 

    if (user) { 
        user.favorites.push(movieTitle)
        res.status(200).send(`${'Film'} ${movieTitle} ${'was added to favorites'}`);
    } else {
        res.status(400).send('invalid');
    }
})

app.delete('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle} = req.params;
    

    let user = users.find( user => user.id == id) 

    if (user) { 
        user.favorites.filter( title => title !== movieTitle)
        res.status(200).send(`${'Film'} ${movieTitle} ${'was removed from favorites'}`);
    } else {
        res.status(400).send('invalid');
    }
});

app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    

    let user = users.find( user => user.id == id) 

    if (user) { 
        users = users.filter( user => user.id !== id)
        res.status(200).send(`${'user'} ${id} ${'has been deleted'}`);
    } else {
        res.status(400).send('invalid');
    }
})

// app.delete('/unregister', (req, res) => {
//     let user = users.find((id) => { return user == req.params.id });
  
//     if (user) {
//       user = user.filter((obj) => { return obj.id != req.params.title });
//       res.status(201).send('User ' + req.params.id + ' was successfully unregistered.');
//     }
//   });

// error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });



app.listen(8080, () => {
    console.log('Listening on port 8080');

})
