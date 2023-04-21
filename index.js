const bodyParser = require('body-parser');
const express = require('express');
const morgan = require ('morgan');
const fs = require('fs');
const path = require('path');
const uuid = require('uuid');
const mongoose = require ('mongoose');
const Models = require ('./models/models');

const Movies = Models.Movie;
const Users = Models.User;

// allows mongoose to connect with database and perform CRUD
mongoose.connect('mongodb://localhost:8080/cfDB', { useNewUrlParser: true, useUnifiedTopology: true });


// now the app will use only express logic
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

//this invookes the morgan middleware
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})

// setup the logger
// now morgan is embeded in 'app'
app.use(morgan('combined', {stream: accessLogStream}));

;

// allows access to all static files in public folder

app.use(express.static('public'));

//endpoints 

// GET

app.get('/', (req, res) => {
    res.send('Welcome to Fletnix!');
});

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
// return a list of ALL Users
app.get('users', (req, res) => {
    Users.find()
        .then ( ( users) => {
            res.status(201).json(users)
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// return user by username (findOne)

app.get('users/:Username', (req, res) => {
    Users.findOne( { Username : req.params.Username})
        .then ( ( user) => {
            res.status(201).json(user)
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});
// POST

app.post('/users', (req, res) => {
    
    //check if username already exists
    Users.findOne( { 'UserName' : req.body.Username } )
    // why is this 'users'? confused if its mentioning the imported model or if its something new
    .then((user) => {
        if (user) {
            return res.status(400).send(red.body.Username + 'already exists');
        } else {
            //if user doesn´t already exist, use mongoose .create() fxn to create new user.
            // each key refers to a specific key outline in models.js
            // each value is set to the content of request body
            Users
                .create( {
                    Username : req.body.Username,
                    Password : req.body.Password,
                    Email : req.body.Email,
                    Birthday : req.body.Birthday
                })
                .then((user) => { res.status(201).json(user)})
            .catch((error) => {
                console.error(error);
                res.status(500).send('Error: ' + error)
            })
                // Mongoose uses this information to populate a users document
        }
    })
    .catch((error)=> {
        console.error(error);
        res.status(500).send('Error: ' + error);
    })
});

app.post('/users/:Username/movies/:MovieID', (req, res) => {
    Users.findOneAndUpdate( { Username: req.params.Username}, {
        $push: { Favorites : req.params.MovieID}
    }, { new: true},
    (err, updatedUser) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error: ' + err);
            } else {
                res.json(updatedUser);
            }
    });
});

// UPDATE


app.put('/users/:Username', (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
      {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      }
    },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if(err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
  });

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
// delete

app.delete('/users/:Username', (req, res) => {
    Users.findOneAndRemove( { 'Username' : req.params.Username})
        .then((user) => {
            if (!user){
                res.status(400).send(req.params.Username + 'was not found')
            } else {
                res.status(200).send(req.params.Username + 'was deleted');
            }
        })
        .catch((err)=> {
            console.error(err);
            res.status(500).send('Error: ' + err)
        });
});

app.delete('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle} = req.params;
    

    let user = users.find( user => user.id == id) 

    if (user) { 
        user.favorites = user.favorites.filter( title => title !== movieTitle)
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

// error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });



app.listen(8080, () => {
    console.log('Listening on port 8080');

})
