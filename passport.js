const passport = require('passport');
    LocalStrategy = require('passport-local').Strategy;
    Models = require('./models');
    passportJWT = require('passport-jwt');

let Users = Models.User;
    JWTStrategy = passportJWT.Strategy;
    ExtractJWT = passportJWT.ExtractJwt;

passport.use(new LocalStrategy( { //this is the strategy which defines the HTTP authentication for login requests
    usernameField: 'Username',
    passwordField: 'Password'
    }, (username, password, callback) => {
        console.log(username + '  ' + password);
        Users.findOne( {Username: username}, (error, user)=> { //here username is checked, but not the password
            if (error) {
                console.log(error);
                return callback(error);
                }
            if (!user) {
                console.log('incorrect username');
                return callback(null, false, {message: 'Incorrect username or password'}); // this is callback if authentication fails
            }

            console.log('finsihed'); // this is the callback function when authentication was successful
            return callback(null,user);
        });
    }));

    passport.use (new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(), //JWT is extracted from request header
        secretOrKey: 'your_jwt_secret' // this is the signature that sender of JWT is who it says it is
    }, (jwtPayload, callback)=> {
        return Users.findById(jwtPayload._id)
        .then((user)=> {
            return callback(null, user);
        })
        .catch((error)=> {
            return callback(error)
        });
    }));
