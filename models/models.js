const mongoose = require('mongoose');



let movieSchema = mongoose.Schema({
    Title: { type : String, required: true },
    Description: { type : String, required: true },
    Genre: {
        Name: String,
        description: String
     },
     Director: {
        Name: String,
        Bio: String
     },
     Actors: [String],
     ImagePath: String,
     Featured: Boolean , 
 })
// Same with users
 let usersSchema = mongoose.Schema({
    Username: { type : String, required: true },
    Password: { type : String, required: true },
    Email: { type : String, required: true },
    Birthday: Date,
    Favorites: [{type:mongoose.Schema.Types.ObjectId, ref: 'movie'}]
 });

// defines
 let Movie = mongoose.model('Movie', movieSchema);
 let User = mongoose.model('User', usersSchema);

 module.exports.Movie = Movie;
 module.exports.User = User;
