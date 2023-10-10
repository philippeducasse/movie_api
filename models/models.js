const mongoose = require('mongoose');
const bcrypt = require('bcrypt')



let movieSchema = mongoose.Schema({
    Title: { type : String, required: true },
    Description: { type : String, required: true },
    ImageUrl: {type : String},
    Genre: {
        Name: String,
        Description: String
     },
     Director: {
        Name: String,
        About: String,
        BirthYear: Number,
        DeathYear: Number
     },
     
 })
// Same with users
 let userSchema = mongoose.Schema({
    Username: { type : String, required: true },
    Password: { type : String, required: true },
    Email: { type : String, required: true },
    Birthday: Date, //dd.mm.yyyy
    Favorites: [{type:mongoose.Schema.Types.ObjectId, ref: 'Movie'}]
 });

// password hashing code
 userSchema.statics.hashPassword = (password)=> {
   return bcrypt.hashSync(password, 10)
 };
//password validation ===> only if hashes match
userSchema.methods.validatePassword = function (password){
   return bcrypt.compareSync(password, this.Password)
};

// defines
 let Movie = mongoose.model('Movie', movieSchema);
 let User = mongoose.model('User', userSchema);

 module.exports.Movie = Movie;
 module.exports.User = User;
