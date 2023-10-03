# Fletnix Movie App Backend

## Project Description

In this project, I built the back-end server for a movies database using NodeJS. This database contains a list of movies, which are JS objects with specific properties; and also a list of users. The API was built using the REST API framework Express, and the data was stored on the SQL databasse MongoDB.

## Key Features
The aim of this project was to create an app which would allow users to register, log-in, access the list of movies, add movies a favorites list, remove movies from favorites, access & update user info, access movies by genre, unregister, and more.

## Setting up the Project

For this project, you need to install the latest version of Node Packet Manager. Open your terminal and run the command

npm install -g npm

Create a new directory for your project, navigate to it and run:

node index.js

### how to make  changes to the repository

## Technologies & concepts used

- NodeJS
- Express (API framework)
- MongoDB
- SQL
- Postman (endpoint testing)
- Passport (authorisastion framework)
- Mongo Atlas
- Render (hosting)
- Models (data structuring)

## Personal Notes

The database was built using NodeJS and was hosted on MongoDB (Mongo Atlas). NodeJS was the language used because this allowed me to draw from my previous experience of working with vanilla JS. As this was my first real exposure to server-side programming, it made sense to implement a language with which I already had some familiarity. Specifically, Express was used as a framework as this provided a robust and accessible framework for writing the necessary back-end code. This project was my first exposure to many core principles and techniques of a full-stack developper, such as working with the terminal console and learning how to write API endpoints in Node. 

The first part of the project involved creating a database locally by using MongoDB, in which an array of movies and users was created. Each movie was an object which contained a title, director, genre, and other properties. I learned how to use the Mongosh Shell to create, read, update, and delete data by creating and defining enpoints using Node. These actions (also called requests) are the basis in understanding how users can access and interact with data stored on a database. I also learned how to define the data strcuture for my project using models. I then learned about relational and non-relational databases and SQL; which was the language to perform CRUD operations in this project. To test if the API endpoints were working correctly, I used Postman to perform CRUD operations. 

I then implemented server side authorisation & athentication using a framework called Passport. I learned how to implement passwords, tokens, and other forms of authentication and authorisation (such as CORS), thus giving more security to my project. I then used a free hosting service from Mongo Atlas to have the database online and not only on my local machine, and then proceeded to link up the online database with a free domain provider, Render. This enabled me to have a completely self made app, which had an online database and a domain name to access the site online. 

## Challenges Faced

The biggest challenge of this project for me was getting the API endpoints defined correctly. I found it very difficult to understand all the intrications of the syntax, especially because many of the endpoints had a lot of middleware functions. Another challenge was in getting the authentication and authorisation to work correctly. 


## Credits

Thank you to my mentor from CareerFoundry, Treasure Kabareebe & my tutor Jonathan Nshuti. Special thanks to my friend Stephen Duke. 