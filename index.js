const bodyParser = require('body-parser');
const express = require('express');
const morgan = require ('morgan');
const fs = require('fs');
const path = require('path');
const uuid = require('uuid');
const mongoose = require ('mongoose');
const Models = require ('./models')

const Movies = Models.Movie;
const Users = Models.User;

// allows mongoose to connect with database and perform CRUD
mongoose.connect('mongodb://127.0.0.1/cfDB', { useNewUrlParser: true, useUnifiedTopology: true})
 .then(() => { console.log('Connected to MongoDB'); }) .catch((err) => { console.error(err); });

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

// READ

app.get('/', (req, res) => {
    res.send('Welcome to Fletnix!');
});
app.get('/movies', (req, res) => {
    Movies.find()
        .then ( ( movies) => {
            res.status(201).json(movies)
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});


app.get('/movies/:title', (req, res) => {
    Movies.findOne( { Title : req.params.title})
        .then( (movie)=> {
            res.status(201).json(movie)
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

    
app.get('/movies/genre/:Genre', (req, res) => {
	Movies.find({ 'Genre.Title': req.params.Genre })
		.then((movies) => {
			if (movies.length == 0) {
				return res.status(404).send('Error: no movies found with the ' + req.params.Genre + ' genre type.');
			} else {
				res.status(200).json(movies);
			}
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send('Error: ' + err);
		});
});

// return info about a director
app.get('/movies/director/:directorName', (req, res) => {
	Movies.findOne({ 'Director.Name': req.params.directorName })
		.then((movie) => {
			if (!movie) {
				return res.status(404).send('Error: director ' + req.params.Genre + ' not found.');
			} else { 
                
				res.status(200).json(movie.Director); // to only send back info about the director
			}
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send('Error: ' + err);
		});
});

// return info about a genre

app.get('/genre/:genreName', (req, res) => {
	Movies.findOne({ 'Genre.Title': req.params.genreName })
		.then((movie) => {
			if (!movie) {
				return res.status(404).send('Error: genre ' + req.params.Genre + ' not found.');
			} else { 
                
				res.status(200).json(movie.Genre.Description); // to only send back info about the director
			}
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send('Error: ' + err);
		});
});

// return a list of ALL Users
app.get('/users', (req, res) => {
	Users.find()
		.then((users) => {
			res.status(200).json(users);
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


// CREATE

//alows new users to register
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

//add new movie to favorites

app.post('/users/:Username/movies/:MovieID', (req, res) => {
    Users.findOneAndUpdate( { Username: req.params.Username}, {
        $addToSet: { Favorites : req.params.MovieID} //addToSet: if item already exists, won´t be added
    }, { new: true})
    .then ((updatedUser) => {
        res.json(updatedUser)
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
        });
});

// UPDATE

//update user info 
app.put('/users/:Username', (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
      {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      }
    },
    { new: true }) // This line makes sure that the updated document is returned
    .then(( updatedUser) => {
        res.json(updatedUser);
    })
    .catch( (err)=> {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } );
});
      

// DELETE

//remove a user

app.delete('/users/:Username', (req, res) => {
    Users.findOneAndRemove( { 'username' : req.params.Username})
        .then((user) => {
            if (!user){
                res.status(400).send(req.params.Username + ' was not found')
            } else {
                res.status(200).send(req.params.Username + 'was deleted');
            }
        })
        .catch((err)=> {
            console.error(err);
            res.status(500).send('Error: ' + err)
        });
});


// remove movie from favorites

app.delete('/users/:Username/movies/:MovieID', (req, res) => {
    Users.findOneAndRemove( { Favorites : req.params.MovieID} )
        .then((Favorites)=>{
            if (!Favorites) {
                res.status(400).send(req.params.MovieId + ' was not a favorite')
            } else {
            res.status(200).send(req.params.MovieID + ' was removed from favorites')
        } })
        .catch((err)=> {
            console.error(err);
            res.status(500).send('Error: ' + err);
            })
    });

// error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Error!');
  });



app.listen(8080, () => {
    console.log('Listening on port 8080');

})
