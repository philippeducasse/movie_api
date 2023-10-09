const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const uuid = require('uuid');
const mongoose = require('mongoose');
const Models = require('./models/models')
const { check, validationResult } = require('express-validator');
const bson = require('bson');


const Movies = Models.Movie;
const Users = Models.User;

// now the app will use only express logic

const app = express();
const cors = require('cors');
app.use(cors({ origin: '*' }))

//code to restrict origin

// let allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];



//     origin: (origin, callback)=> {
//         if (!origin) return callback(null, true);
//         if(allowedOrigins.indexOf(origin)=== -1 ) {//if specific origins isnt found on list of permitted origins
//         let message = 'CORS policy for this application doesn`t allow request domain' + origin;
//         return callback(new Error(message), false);
//       }
//       return callback(null, true);
//     }
// }));


// allows mongoose to connect with database and perform CRUD

//this code is for connecting to local server, only for testing

// mongoose.connect('mongodb://127.0.0.1/cfDB', { useNewUrlParser: true, useUnifiedTopology: true})
//  .then(() => { console.log('Connected to MongoDB'); }) .catch((err) => { console.error(err); });

//this code is to connect to mongoAtlas
console.log('Connection_URI:', process.env.CONNECTION_URI);

mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log('Connected to MongoDB'); }).catch((err) => { console.error(err); });


//bodyparser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//passport authentication

let auth = require('./auth')(app); //'(app)' ensures that Express is available in auth.js
const passport = require('passport');
require('./passport');

//this invokes the morgan middleware
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' })

// setup the logger
// now morgan is embeded in 'app'
app.use(morgan('combined', { stream: accessLogStream }));

;

// allows access to all static files in public folder

app.use(express.static('public'));

/**
 * URL endpoints
 */



app.get('/', (req, res) => {
    res.send('Welcome to Fletnix!');
});

/**
* READ Returns list of all movies
* 
* @returns {string}
*/

app.get('/movies',
    passport.authenticate('jwt', { session: false }),
    (req, res) => { //authentication code goes between URL and callback
        Movies.find()                                                                   //now any request to /movies requires a JWT Token
            .then((movies) => {
                res.status(201).json(movies)
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Error: ' + err);
            });
    });

/**
 * READ Get a movie by title 
 */
app.get('/movies/:title',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Movies.findOne({ Title: req.params.title })
            .then((movie) => {
                res.status(201).json(movie)
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Error: ' + err);
            });
    });

/**
 * READ Get a list of movies of specific genre
 */

app.get('/movies/genre/:Genre', passport.authenticate('jwt', { session: false }), (req, res) => {
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

/**
 * READ Get information about a single director
 */
app.get('/movies/director/:directorName', passport.authenticate('jwt', { session: false }), (req, res) => {
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

/**
 * READ Get information about a single genre
 */

app.get('/genre/:genreName', passport.authenticate('jwt', { session: false }), (req, res) => {
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

/**
 * READ Get all users
 */
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

/**
 * READ Get a user by username 
 */

app.get('/users/:Username', (req, res) => {
    Users.findOne({ Username: req.params.Username })
        .then((user) => {
            res.status(201).json(user)
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});


/**
 * CREATE create a new user
 */
app.post('/users',
    //validation logic goes here
    [
        check('Username', 'Username is required').isLength({ min: 5 }), // minumum length of username is 5 char
        check('Username', 'Username contains non alphanumeric characters - not allowed').isAlphanumeric(),
        check('Password', 'Password is required').not().isEmpty(), // password input must not be empty
        check('Email', 'Email does not appear to be valid').isEmail(), //email must be valid / not empty
        check('Birthday', 'Please enter a valid date').not().isEmpty(), // birthday is required
    ], (req, res) => {

        //check validation object for errors
        let errors = validationResult(req);
        if (!errors.isEmpty()) { //if errors is not empty (if there are arreors--->)
            return res.status(422).json({ errors: errors.array() }) //if errors in validation occur then send back to client in an array
        }
        // if error occurs rest of the code will not be executed
        let hashedPassword = Users.hashPassword(req.body.Password);

        //check if username already exists
        Users.findOne({ 'Username': req.body.Username })

            .then((user) => {
                if (user) {
                    return res.status(400).send(req.body.Username + ' ' + ' already exists');
                } else {
                    //if user doesn´t already exist, use mongoose .create() fxn to create new user.
                    // each key refers to a specific key outline in models.js
                    // each value is set to the content of request body
                    Users
                        .create({
                            Username: req.body.Username,
                            Password: hashedPassword, // now when registering hashed password will be saved in the DB, not the actual pw w
                            Email: req.body.Email,
                            Birthday: req.body.Birthday
                        })
                        .then((user) => { res.status(201).json(user) })
                        .catch((error) => {
                            console.error(error);
                            res.status(500).send('Error: ' + error)
                        })
                    // Mongoose uses this information to populate a users document
                }
            })
            .catch((error) => {
                console.error(error);
                res.status(500).send('Error: ' + error);
            })
    });

/**
 * @param {string} 
 * CREATE add a new movie to favorites
 */
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
        $addToSet: { Favorites: req.params.MovieID } //addToSet: if item already exists, won´t be added
    }, { new: true })
        .then((updatedUser) => {
            res.json(updatedUser)
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

/**
 * UPDATE updates user info
 */
app.put('/users/:Username',
    [
        check('Username', 'Username is required').isLength({ min: 5 }), // minumum length of username is 5 char
        check('Username', 'Username contains non alphanumeric characters - not allowed').isAlphanumeric(),
        check('Password', 'Password is required').not().isEmpty(), // password input must not be empty
        check('Email', 'Email does not appear to be valid').isEmail(),
        check('Birthday', 'Please enter a valid date').isDate()
    ],
    passport.authenticate('jwt', { session: false }), (req, res) => {
        let errors = validationResult(req);
        if (!errors.isEmpty()) { //if errors is not empty (if there are errors--->)
            return res.status(422).json({ errors: errors.array() }) //if errors in validation occur then send back to client in an array
        }
        // if error occurs rest of the code will not be executed
        let hashedPassword = Users.hashPassword(req.body.Password);

        Users.findOneAndUpdate({ Username: req.params.Username }, {
            $set:
            {
                Username: req.body.Username,
                Password: hashedPassword,
                Email: req.body.Email,
                Birthday: req.body.Birthday
            }
        },
            { new: true }) // This line makes sure that the updated document is returned
            .then((updatedUser) => {
                res.json(updatedUser);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Error: ' + err);
            });
    });


/**
 * DELETE deletes user
 */

app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndRemove({ 'Username': req.params.Username })
        .then((user) => {
            if (!user) {
                res.status(400).send(req.params.Username + ' was not found')
            } else {
                res.status(200).send(req.params.Username + 'was deleted');
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err)
        });
});

/**
 * DELETE removes movie from list of favorites
 */

app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
        $pullAll: { Favorites: [req.params.MovieID] } //addToSet: if item already exists, won´t be added
    }, { new: true })

        .then((data) => {
            console.log(data);
            res.status(200).send(req.params.MovieID + ' was removed from favorites')
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        })
});

// error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Error!');
});


const port = process.env.PORT || 8080;

app.listen(port, '0.0.0.0', () => {
    console.log('Listening on port ' + port);
})


