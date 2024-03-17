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

If you want to run the app in dev mode, run

npm run dev

## Technologies & concepts used

- NodeJS
- Express (API framework)
- MongoDB
- SQL
- Postman (endpoint testing)
- Passport (authorisastion framework)
- Mongo Atlas
- Render (hosting)

## Further notes

The database was built using NodeJS and was hosted on MongoDB (Mongo Atlas). Express was used as a framework as this provides a robust and accessible framework for writing the necessary back-end code.

The first part of the project involves creating a database locally by using MongoDB, in which an array of movies and users is created. Each movie is an object which contained a title, director, genre, and other properties. For this to work you have to install mongosh in the directory (or globally) by following the isntructions on the mongoDB website.

The database used is a relational database written in SQL. Once the database is created you can use the files in this repository to perform the various CRUD operations (see the documentation). For this project I was also exposed to Postman, an API endpoint testing software.

Server side authorisation & athentication was then implemented using a framework called Passport, giving the API more security. Tokens and user credentials were used to authenticate and authorise each API call. I then used a free hosting service from Mongo Atlas to have the database online and not only on my local machine, and then proceeded to link up the online database with a free domain provider, Render. This enabled me to have a completely self made app, which had an online database and a domain name to access the site online.

## Credits

Thank you to my mentor from CareerFoundry, Treasure Kabareebe & my tutor Jonathan Nshuti. Special thanks to my friend Stephen Duke.
