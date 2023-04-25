const jwtSecret = 'your_jwt_secret'; // same key used in jwt strategy
const jwt = require('jsonwebtoken');
passport = require('passport');
require('./passport') // local passport file


// this is the code that generates the JWT based on username and password
let generateJWTToken = (user) => {
    return jwt.sign(user, jwtSecret, {
        subject: user.Username, //this is the username encoded in the JWT
        expiresIn: '7d', //token expires in 7 days
        algorthm: 'HS256' // this is the algorith used to sign or encode values of JWT
    });
}

// POST login

module.exports = (router) => {
    router.post('/login', (req, res)=> { // this defines the URL to login
        passport.authenticate('local', {session: false},
        (error, user, info)=> {
            if (error || !user) {
                return res.status(400).json({
                    message: 'something went wrong',
                    user: user
                });
            }
            req.login(user, {session: false}, (error)=> {
                if (error){
                    res.send(error);
                }
                let token = generateJWTToken(user.toJSON());
                return res.json({user, token}); // this is the code that returns the token (ES6 shorthand for {user:user, token: token})
            });
        })(req,res);
    });
}